"""Gera dados.js do explorador de árvores de crédito e figuras bi-credito-*.png.

Reutiliza as funções de `arvore_credito.py` (mesma leitura, mesmo `random_state`),
aprende uma grade de configurações no treino e grava a estrutura de cada árvore.
O navegador percorre as árvores com as entradas; o teste só aparece no painel
depois que o estudante fixa uma configuração.

Uso (raiz do repo):

    uv run python scripts/gerar_bi_credito.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
from arvore_credito import (  # noqa: E402
    ALVO,
    FEATURES,
    aprender,
    contar,
    entradas,
    ler,
    respostas,
)

PAINEL = RAIZ / "material" / "bi-credito"
IMAGENS = RAIZ / "material" / "imagens"
RELATORIO = RAIZ / "material" / "credito" / "relatorio.json"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
PROFUNDIDADES: tuple[int | None, ...] = (1, 2, 3, 4, 6, 8, None)
MINIMOS = (1, 5, 12, 20, 40)


def chave(profundidade: int | None, minimo: int) -> str:
    return f"{'livre' if profundidade is None else profundidade}-{minimo}"


def estrutura(modelo, treino: list[dict[str, str]]) -> list[dict]:
    """Nós com pergunta, filhos e contagens de treino (contadas, não lidas de tree_.value)."""
    caminhos = modelo.decision_path(entradas(treino))
    y = respostas(treino)
    arvore = modelo.tree_
    nos = []
    for no in range(arvore.node_count):
        ids = caminhos[:, no].nonzero()[0]
        com = int(sum(y[i] for i in ids))
        sem = int(len(ids) - com)
        folha = arvore.children_left[no] == -1
        nos.append({
            "f": None if folha else int(arvore.feature[no]),
            "t": None if folha else round(float(arvore.threshold[no]), 4),
            "e": None if folha else int(arvore.children_left[no]),
            "d": None if folha else int(arvore.children_right[no]),
            "sem": sem,
            "com": com,
            # Mesma regra de arvore_credito.regras(): empate prevê sem atraso.
            "p": None if not folha else int(com > sem),
        })
    return nos


def contratos(linhas: list[dict[str, str]]) -> list[dict]:
    return [{
        "id": r["id"],
        "renda": int(r["renda_mensal"]),
        "dividas": int(r["dividas_mensais"]),
        "parcela": int(r["parcela_proposta"]),
        "x": [float(r[c]) for c in FEATURES],
        "y": int(r[ALVO]),
    } for r in linhas]


def figuras(grade: dict) -> None:
    linhas = [p for p in PROFUNDIDADES]
    fig, ax = plt.subplots(figsize=(8.6, 4.8))
    matriz = [[grade[chave(p, m)]["dev"]["acertos"] for m in MINIMOS] for p in linhas]
    im = ax.imshow(matriz, cmap="BuGn", vmin=50, vmax=62, aspect="auto")
    for i, linha in enumerate(matriz):
        for j, valor in enumerate(linha):
            ax.text(j, i, f"{valor}/80", ha="center", va="center", color=AZUL,
                    fontsize=10, weight="bold")
    ax.set_xticks(range(len(MINIMOS)), [str(m) for m in MINIMOS])
    ax.set_yticks(range(len(linhas)), ["sem limite" if p is None else str(p) for p in linhas])
    ax.set_xlabel("Mínimo de contratos de treino por folha")
    ax.set_ylabel("Profundidade máxima")
    ax.set_title("Acertos no desenvolvimento por configuração (referência: 55/80)",
                 color=AZUL, weight="bold")
    fig.colorbar(im, ax=ax, label="acertos em 80")
    fig.tight_layout()
    fig.savefig(IMAGENS / "bi-credito-grade.png", dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)

    fig, ax = plt.subplots(figsize=(8.6, 4.4))
    rotulos = ["sem limite" if p is None else str(p) for p in linhas]
    tr = [grade[chave(p, 1)]["treino"]["acertos"] / 240 for p in linhas]
    dv = [grade[chave(p, 1)]["dev"]["acertos"] / 80 for p in linhas]
    ax.plot(rotulos, tr, marker="o", color=AZUL, linewidth=2, label="treino (240)")
    ax.plot(rotulos, dv, marker="o", color=VERDE, linewidth=2, label="desenvolvimento (80)")
    ax.axhline(55 / 80, color=BARRO, linestyle="--", linewidth=1.5,
               label="referência no desenvolvimento (55/80)")
    ax.set_ylim(0.6, 0.95)
    ax.set_xlabel("Profundidade máxima (mínimo de 1 contrato por folha)")
    ax.set_ylabel("Proporção de acertos")
    ax.set_title("Mais perguntas sobem o treino mais que o desenvolvimento",
                 color=AZUL, weight="bold")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.25)
    ax.legend(frameon=False, loc="lower right")
    fig.tight_layout()
    fig.savefig(IMAGENS / "bi-credito-profundidade.png", dpi=160, bbox_inches="tight",
                facecolor="white")
    plt.close(fig)


def main() -> None:
    treino, dev, teste = ler("treino"), ler("desenvolvimento"), ler("teste")
    maioria = int(sum(respostas(treino)) > len(treino) / 2)
    grade = {}
    for p in PROFUNDIDADES:
        for m in MINIMOS:
            modelo = aprender(treino, p, m)
            grade[chave(p, m)] = {
                "profundidade_max": p,
                "minimo_folha": m,
                "profundidade": int(modelo.get_depth()),
                "folhas": int(modelo.get_n_leaves()),
                "treino": contar(respostas(treino), modelo.predict(entradas(treino)).tolist()),
                "dev": contar(respostas(dev), modelo.predict(entradas(dev)).tolist()),
                # Usado só para conferir o painel; o painel recalcula a partir das entradas.
                "_teste": contar(respostas(teste), modelo.predict(entradas(teste)).tolist()),
                "nos": estrutura(modelo, treino),
            }

    # Coerência com o relatório publicado (execução padrão: curta 2/12, profunda livre/1).
    rel = json.loads(RELATORIO.read_text(encoding="utf-8"))
    for nome, k in {"curta": chave(2, 12), "profunda": chave(None, 1)}.items():
        for grupo, g in {"treino": "treino", "desenvolvimento": "dev"}.items():
            assert grade[k][g] == rel["modelos"][nome]["medidas"][grupo], (nome, grupo)
    assert grade[chave(None, 1)]["_teste"] == rel["modelos"]["profunda"]["medidas"]["teste"]
    base = {g: contar(respostas(rs), [maioria] * len(rs))
            for g, rs in {"treino": treino, "dev": dev, "teste": teste}.items()}
    assert base["teste"] == rel["baseline"]["teste"]

    esperado = {k: {"dev": v["dev"]["acertos"], "teste": v.pop("_teste")} for k, v in grade.items()}
    dados = {
        "origem": "dados/credito/{treino,desenvolvimento,teste}.csv",
        "features": ["Comprometimento (%)", "Atrasos anteriores"],
        "profundidades": [p for p in PROFUNDIDADES],
        "minimos": list(MINIMOS),
        "classe_baseline": maioria,
        "baseline": base,
        "padrao": {"curta": chave(2, 12), "profunda": chave(None, 1)},
        "grade": grade,
        "dev": contratos(dev),
        "teste": contratos(teste),
        "politica_minimo": 5,
    }
    PAINEL.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.CREDITO = " + json.dumps(dados, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    figuras(grade)
    melhor = max(grade.values(), key=lambda v: (v["dev"]["acertos"], -v["profundidade"], -v["folhas"]))
    print(f"{len(grade)} configurações · melhor no desenvolvimento: "
          f"prof {melhor['profundidade_max']} / mín {melhor['minimo_folha']} "
          f"→ {melhor['dev']['acertos']}/80")
    for k in (chave(2, 12), chave(None, 1)):
        print(k, "dev", esperado[k]["dev"], "teste", esperado[k]["teste"]["acertos"])
    print(json.dumps({k: [v["dev"]["acertos"] for v in [grade[k]]] for k in grade}))


if __name__ == "__main__":
    main()
