"""Gera `material/bi-redes/dados.js` e os espelhos estáticos `bi-redes-*.png`.

Lê os resultados já gravados pelos três demos de redes:

    uv run python scripts/demo_treino_mlp_demanda.py
    uv run python scripts/demo_deep_vs_rasa.py
    uv run python scripts/demo_fine_tuning_mlp.py
    uv run python scripts/gerar_bi_redes.py
"""

from __future__ import annotations

import csv
import json
import statistics
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt

RAIZ = Path(__file__).resolve().parent.parent
REDES = RAIZ / "material" / "redes"
PAINEL = RAIZ / "material" / "bi-redes"
IMAGENS = RAIZ / "material" / "imagens"
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO = RAIZ / "dados" / "catalogo.json"
AZUL, VERDE, BARRO, CINZA = "#18374b", "#157c80", "#b65432", "#8a9aa5"
CORES_KNOB = {"base": AZUL, "mais_epocas": VERDE, "lr_maior": BARRO, "mais_larga": "#7a5aa6"}
NOMES_KNOB = {
    "base": "base (40 ép., η 0,01, 8)",
    "mais_epocas": "80 épocas",
    "lr_maior": "η = 0,05",
    "mais_larga": "largura 16",
}
NOMES_BASE = {"media_treino": "Média do treino", "ingenua": "Ingênua", "ma4": "MA(4)", "lms": "LMS"}


def ler(nome: str) -> dict:
    return json.loads((REDES / nome).read_text(encoding="utf-8"))


def semanas() -> list[str]:
    vistas: list[str] = []
    with CSV_PATH.open(encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh):
            if row["week_start"] not in vistas:
                vistas.append(row["week_start"])
    return sorted(vistas)


def salvar(fig, nome: str) -> None:
    fig.savefig(IMAGENS / nome, dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def eixos(ax) -> None:
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.25)


def figuras(curvas: dict, prof: dict, ft: dict) -> None:
    fig, ax = plt.subplots(figsize=(9, 4.8))
    for k, v in curvas["knobs"].items():
        ax.plot(range(1, len(v["perda_epocas"]) + 1), v["perda_epocas"], color=CORES_KNOB[k],
                lw=2, label=f"{NOMES_KNOB[k]} — final {v['perda_epocas'][-1]:.2f}".replace(".", ","))
    ax.set_title("Perda de treino por época nas quatro corridas (p01)", color=AZUL, weight="bold")
    ax.set_xlabel("Época")
    ax.set_ylabel("perda de treino (½·MSE + L2)")
    ax.legend(frameon=False)
    eixos(ax)
    salvar(fig, "bi-redes-perdas.png")

    fig, ax = plt.subplots(figsize=(9.5, 4.8))
    rotulos, valores, cores = [], [], []
    for k, v in curvas["knobs"].items():
        rotulos.append(NOMES_KNOB[k].split(" (")[0])
        valores.append(v["mae_teste"])
        cores.append(CORES_KNOB[k])
    for k, v in curvas["baselines"].items():
        rotulos.append(NOMES_BASE[k])
        valores.append(v["mae_teste"])
        cores.append(CINZA)
    barras = ax.bar(rotulos, valores, color=cores)
    for b, v in zip(barras, valores):
        ax.text(b.get_x() + b.get_width() / 2, v + 0.02, f"{v:.2f}".replace(".", ","), ha="center",
                color=AZUL, fontsize=10, weight="bold")
    ax.axhline(curvas["baselines"]["ma4"]["mae_teste"], color=AZUL, ls="--", lw=1.2)
    ax.set_title("MAE nas 4 semanas de teste de p01: MLP (cores) vs referências (cinza)",
                 color=AZUL, weight="bold")
    ax.set_ylabel("MAE (linhas de pedido)")
    ax.tick_params(axis="x", labelrotation=20)
    eixos(ax)
    salvar(fig, "bi-redes-mae.png")

    fig, ax = plt.subplots(figsize=(9, 4.8))
    for linha in prof["profundidades"]:
        xs = [linha["n_params"]] * len(linha["mae_teste_sementes"])
        ax.scatter(xs, linha["mae_teste_sementes"], color=BARRO, alpha=0.55, s=40)
        media = statistics.mean(linha["mae_teste_sementes"])
        ax.scatter([linha["n_params"]], [media], color=AZUL, marker="D", s=70, zorder=3)
        ax.text(linha["n_params"] + 6, media, f"{linha['camadas']} camada(s)\nmédia {media:.2f}".replace(".", ","),
                color=AZUL, fontsize=9, va="center")
    ax.axhline(prof["mae_baseline_media"], color=CINZA, ls="--", lw=1.4)
    ax.text(258, prof["mae_baseline_media"] + 0.015, "média do treino 0,83", color=CINZA, fontsize=9)
    ax.axhline(curvas["baselines"]["ma4"]["mae_teste"], color=VERDE, ls="--", lw=1.4)
    ax.text(258, curvas["baselines"]["ma4"]["mae_teste"] - 0.04, "MA(4) 0,75", color=VERDE, fontsize=9)
    ax.set_title("Profundidade × MAE de teste: 5 sementes por arquitetura (p01)", color=AZUL,
                 weight="bold")
    ax.set_xlabel("Número de parâmetros")
    ax.set_ylabel("MAE no teste")
    ax.set_xlim(0, 310)
    eixos(ax)
    salvar(fig, "bi-redes-profundidade.png")

    fig, (a, b) = plt.subplots(1, 2, figsize=(13, 4.8), gridspec_kw={"width_ratios": [1, 2.2]})
    nomes = ["Pré-treino", "Fine-tune", "Do zero"]
    vals = [ft["pretreino"]["mae_teste_p01_antes_ft"], ft["fine_tune"]["mae_teste_depois"],
            ft["do_zero_so_p01"]["mae_teste"]]
    barras = a.bar(nomes, vals, color=[CINZA, BARRO, VERDE])
    for br, v in zip(barras, vals):
        a.text(br.get_x() + br.get_width() / 2, v + 0.02, f"{v:.2f}".replace(".", ","), ha="center",
               color=AZUL, weight="bold")
    a.set_title("MAE no teste de p01", color=AZUL, weight="bold")
    eixos(a)
    esq = ft["esquecimento"]
    pids = list(esq["mae_teste_outros_antes_ft"])
    xs = range(len(pids))
    b.bar([x - 0.2 for x in xs], [esq["mae_teste_outros_antes_ft"][p] for p in pids], width=0.4,
          color=CINZA, label=f"antes do fine-tune (média {esq['media_antes']:.2f})".replace(".", ","))
    b.bar([x + 0.2 for x in xs], [esq["mae_teste_outros_depois_ft"][p] for p in pids], width=0.4,
          color=BARRO, label=f"depois (média {esq['media_depois']:.2f})".replace(".", ","))
    b.set_xticks(list(xs), pids)
    b.legend(frameon=False)
    b.set_title("Esquecimento: MAE de teste dos outros 11 produtos", color=AZUL, weight="bold")
    eixos(b)
    fig.tight_layout()
    salvar(fig, "bi-redes-fine-tune.png")


def main() -> None:
    curvas = ler("curvas_mlp_p01.json")
    prof = ler("profundidade_p01.json")
    ft = ler("resultado_fine_tuning_p01.json")
    nomes = {p["id"]: p["nome"] for p in json.loads(CATALOGO.read_text(encoding="utf-8"))["produtos"]}
    for linha in prof["profundidades"]:
        m = linha["mae_teste_sementes"]
        linha["mae_teste_media"] = round(statistics.mean(m), 4)
        linha["mae_teste_min"] = min(m)
        linha["mae_teste_max"] = max(m)
    dados = {
        "origem": "dados/vendas_semanais.csv · material/redes/*.json",
        "produto": curvas["produto"],
        "nome_produto": nomes[curvas["produto"]],
        "semanas": semanas(),
        "observado": curvas["semanas_observadas"],
        "inicio_teste": curvas["inicio_teste"],
        "nota_perda": curvas["perda"],
        "knobs": curvas["knobs"],
        "nomes_knob": NOMES_KNOB,
        "baselines": curvas["baselines"],
        "nomes_baseline": NOMES_BASE,
        "profundidade": prof,
        "fine_tune": ft,
        "nomes_produtos": nomes,
    }
    PAINEL.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.REDES = " + json.dumps(dados, ensure_ascii=False, indent=1) + ";\n", encoding="utf-8"
    )
    figuras(curvas, prof, ft)
    print("material/bi-redes/dados.js + 4 figuras bi-redes-*.png")


if __name__ == "__main__":
    main()
