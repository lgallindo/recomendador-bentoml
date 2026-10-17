"""Reproduza os dados do explorador de BI e suas três figuras estáticas."""

from __future__ import annotations

import json
from collections import defaultdict
from fractions import Fraction
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

from minerar_regras_associacao import minerar

RAIZ = Path(__file__).resolve().parent.parent
PAINEL = RAIZ / "material/bi"
IMAGENS = RAIZ / "material/imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"


def avaliar(cestas: list[list[str]], a: list[str], b: list[str]) -> dict:
    conjuntos = [set(cesta) for cesta in cestas]
    total = len(conjuntos)
    na = sum(set(a) <= cesta for cesta in conjuntos)
    nb = sum(set(b) <= cesta for cesta in conjuntos)
    juntos = sum(set(a + b) <= cesta for cesta in conjuntos)
    return {
        "total": total, "na": na, "nb": nb, "juntos": juntos,
        "suporte": juntos / total if total else None,
        "confianca": juntos / na if na else None,
        "lift": juntos * total / (na * nb) if na and nb else None,
    }


def preparar(catalogo: dict, novas: dict) -> dict:
    regras = minerar(catalogo, Fraction(1, 5), Fraction(3, 5), Fraction(1))
    resultado = []
    for r in regras:
        a = r["antecedente_ids"].split(" + ")
        b = r["consequente_ids"].split(" + ")
        resultado.append({
            "id": "+".join(a) + "->" + "+".join(b),
            "a": a, "b": b,
            "antecedente": r["antecedente"], "consequente": r["consequente"],
            "descoberta": avaliar(catalogo["cestas"], a, b),
            "avaliacao": avaliar(novas["cestas"], a, b),
        })
    return {"produtos": catalogo["produtos"], "regras": resultado,
            "limites": {"suporte": .2, "confianca": .6, "lift": 1},
            "origem": "dados/catalogo.json → cestas",
            "avaliacao": "material/cestas-validacao-20261017.json → cestas"}


def salvar(fig: plt.Figure, nome: str) -> None:
    fig.savefig(IMAGENS / nome, dpi=170, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def dispersao(dados: dict) -> None:
    grupos: dict[tuple[float, float], list[dict]] = defaultdict(list)
    for r in dados["regras"]:
        m = r["descoberta"]
        grupos[m["suporte"], m["confianca"]].append(r)
    fig, ax = plt.subplots(figsize=(10, 6))
    for (suporte, confianca), regras in grupos.items():
        maior = max(r["descoberta"]["lift"] for r in regras)
        ax.scatter(suporte, confianca, s=800, c=[maior], cmap="YlGnBu",
                   vmin=1, vmax=4, edgecolor=AZUL, linewidth=2)
        ax.text(suporte, confianca, str(len(regras)), ha="center", va="center",
                color="white", fontsize=17, weight="bold")
    ax.set(xlim=(0, .4), ylim=(0, 1.12), xlabel="Suporte", ylabel="Confiança")
    ax.xaxis.set_major_formatter(matplotlib.ticker.PercentFormatter(1))
    ax.yaxis.set_major_formatter(matplotlib.ticker.PercentFormatter(1))
    ax.set_title("14 regras, quatro posições: selecione para distinguir", color=AZUL,
                 fontsize=18, pad=18)
    fig.colorbar(matplotlib.cm.ScalarMappable(norm=matplotlib.colors.Normalize(1, 4),
                                             cmap="YlGnBu"), ax=ax, label="Maior lift do grupo")
    fig.text(.5, .015, "Número = regras coincidentes. As cores não representam médias. Base: descoberta sintética.",
             ha="center", fontsize=10, color=AZUL)
    fig.tight_layout(rect=(0, .05, 1, 1))
    salvar(fig, "bi-dispersao.png")


def matriz(dados: dict) -> None:
    linhas = sorted({" + ".join(r["a"]) for r in dados["regras"]})
    colunas = sorted({" + ".join(r["b"]) for r in dados["regras"]})
    valores = np.full((len(linhas), len(colunas)), np.nan)
    for r in dados["regras"]:
        i = linhas.index(" + ".join(r["a"]))
        j = colunas.index(" + ".join(r["b"]))
        valores[i, j] = r["descoberta"]["lift"]
    fig, ax = plt.subplots(figsize=(11, 8))
    mapa = plt.get_cmap("YlGnBu").copy()
    mapa.set_bad("#f0f2f4")
    im = ax.imshow(valores, cmap=mapa, vmin=1, vmax=4, aspect="auto")
    for i in range(len(linhas)):
        for j in range(len(colunas)):
            v = valores[i, j]
            ax.text(j, i, "—" if np.isnan(v) else f"{v:.2f}".replace(".", ","),
                    ha="center", va="center", color=AZUL if np.isnan(v) else "white")
    ax.set_xticks(range(len(colunas)), colunas, rotation=45, ha="right")
    ax.set_yticks(range(len(linhas)), linhas)
    ax.set(xlabel="Consequente (conjunto completo)", ylabel="Antecedente (conjunto completo)")
    ax.set_title("Matriz direcional: cor e número representam lift", color=AZUL, fontsize=18, pad=18)
    fig.colorbar(im, ax=ax, label="Lift")
    fig.text(.5, .015, "— = regra ausente do relatório; não significa suporte zero. Base: descoberta sintética.",
             ha="center", fontsize=10, color=AZUL)
    fig.tight_layout(rect=(0, .05, 1, 1))
    salvar(fig, "bi-matriz.png")


def rede(dados: dict) -> None:
    linhas = sorted({" + ".join(r["a"]) for r in dados["regras"]})
    colunas = sorted({" + ".join(r["b"]) for r in dados["regras"]})
    esquerda = {s: (0, 1-i/max(len(linhas)-1, 1)) for i, s in enumerate(linhas)}
    direita = {s: (1, 1-i/max(len(colunas)-1, 1)) for i, s in enumerate(colunas)}
    fig, ax = plt.subplots(figsize=(11, 8))
    for r in dados["regras"]:
        a, b = " + ".join(r["a"]), " + ".join(r["b"])
        ax.add_patch(FancyArrowPatch((.14, esquerda[a][1]), (.86, direita[b][1]), arrowstyle="-|>",
                                    mutation_scale=14, color=VERDE, alpha=.55,
                                    shrinkA=0, shrinkB=0,
                                    linewidth=1.5*r["descoberta"]["confianca"]))
    for posicoes in [esquerda, direita]:
        for s, (x, y) in posicoes.items():
            ax.add_patch(FancyBboxPatch((x-.13, y-.025), .26, .05,
                                       boxstyle="round,pad=.005", facecolor="#e2efed",
                                       edgecolor=VERDE, zorder=3))
            ax.text(x, y, s, ha="center", va="center", fontsize=11, color=AZUL, zorder=4)
    ax.text(0, 1.12, "Antecedentes", ha="center", weight="bold", fontsize=16, color=AZUL)
    ax.text(1, 1.12, "Consequentes", ha="center", weight="bold", fontsize=16, color=AZUL)
    ax.set(xlim=(-.3, 1.3), ylim=(-.15, 1.22))
    ax.axis("off")
    ax.set_title("Rede de regras: cada nó representa um conjunto inteiro", fontsize=18, color=AZUL)
    fig.text(.5, .015, "Setas representam associações, não causalidade. Espessura = confiança na descoberta sintética.",
             ha="center", fontsize=10, color=AZUL)
    salvar(fig, "bi-rede.png")


def main() -> None:
    catalogo = json.loads((RAIZ / "dados/catalogo.json").read_text(encoding="utf-8"))
    novas = json.loads((RAIZ / "material/cestas-validacao-20261017.json").read_text(encoding="utf-8"))
    dados = preparar(catalogo, novas)
    PAINEL.mkdir(parents=True, exist_ok=True)
    IMAGENS.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text("window.ASSOCIACAO = " + json.dumps(dados, ensure_ascii=False, indent=2)
                                   + ";\n", encoding="utf-8")
    dispersao(dados)
    matriz(dados)
    rede(dados)
    print(f"{len(dados['regras'])} regras; dados do explorador e três PNGs reproduzidos.")


if __name__ == "__main__":
    main()
