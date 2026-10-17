"""Reproduza os diagramas e gráficos do tutorial de associação com Matplotlib."""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from matplotlib.colors import ListedColormap
from matplotlib.patches import Circle

RAIZ = Path(__file__).resolve().parent.parent
DESTINO = RAIZ / "material/imagens"
AZUL = "#18374b"
VERDE = "#157c80"
BARRO = "#b65432"


def salvar(fig: plt.Figure, nome: str) -> None:
    fig.savefig(DESTINO / nome, dpi=180, facecolor="white", bbox_inches="tight")
    plt.close(fig)


def hierarquia() -> None:
    fig, ax = plt.subplots(figsize=(12, 8.7))
    ax.set_aspect("equal")
    ax.set_xlim(-5.8, 9.7)
    ax.set_ylim(-5.7, 5.8)
    ax.axis("off")
    for centro, raio, cor in [
        ((0, 0), 5.2, "#e5edf7"),
        ((1, -.5), 3.8, "#c0dedc"),
        ((1.6, -1.1), 2.6, "#80c1bb"),
        ((1.9, -1.8), 1.45, "#f2c4a6"),
    ]:
        ax.add_patch(Circle(centro, raio, facecolor=cor, edgecolor=AZUL, linewidth=1.8))
    for x, y, texto, tamanho in [
        (0, 4.1, "Inteligência artificial", 19),
        (1, 2.25, "Aprendizado\nde máquina", 18),
        (1.6, .55, "Aprendizado\nnão supervisionado", 14),
        (1.9, -1.8, "Mineração de\nregras de\nassociação", 14),
        (-3.5, .9, "IA simbólica\n\nSistemas\nespecialistas\nclássicos", 9.5),
    ]:
        ax.text(x, y, texto, ha="center", va="center", fontsize=tamanho,
                color=AZUL, weight="bold")
    ax.text(5.9, 1.7, "Validação", color=VERDE, fontsize=18, weight="bold")
    ax.text(5.9, .8, "Prática transversal:\navaliar regras e modelos\nem dados separados.",
            fontsize=13, color=AZUL, va="top", linespacing=1.6)
    ax.text(5.9, -1.4, "Sistemas híbridos podem\ncombinar aprendizado\ne regras de especialistas.",
            fontsize=12, color=AZUL, va="top", linespacing=1.6)
    ax.set_title("Onde se situam as regras de associação?", fontsize=22,
                 color=AZUL, pad=16, weight="bold")
    ax.text(1.5, -5.6, "Conjuntos encaixados: inclusão, não tamanho relativo dos campos.",
            ha="center", fontsize=11, color=AZUL)
    salvar(fig, "venn-ia-aprendizado-regras.png")


def matriz(catalogo: dict) -> None:
    ids = [p["id"] for p in catalogo["produtos"]]
    cestas = [set(b) for b in catalogo["cestas"]]
    valores = np.array([[int(pid in b) for pid in ids] for b in cestas])
    fig, ax = plt.subplots(figsize=(12, 7))
    ax.imshow(valores, cmap=ListedColormap(["#f2f4f6", "#157c80"]), vmin=0, vmax=1)
    for i, b in enumerate(cestas):
        for j, pid in enumerate(ids):
            ax.text(j, i, str(int(pid in b)), ha="center", va="center",
                    color="white" if pid in b else "#74828b", fontsize=12)
        if {"p01", "p02"} <= b:
            ax.add_patch(plt.Rectangle((-.5, i-.5), 2, 1, fill=False,
                                      edgecolor=BARRO, linewidth=3))
    ax.set_xticks(range(len(ids)), ["p01\nJarro", "p02\nPrato"] + ids[2:])
    ax.set_yticks(range(len(cestas)), [f"Cesta {i+1}" for i in range(len(cestas))])
    ax.set_title("Presença de produtos nas dez cestas de descoberta", fontsize=19,
                 color=AZUL, pad=20, weight="bold")
    ax.set_xlabel("1 = presente; 0 = ausente. Contornos: Jarro e Prato juntos.", labelpad=12)
    fig.text(.5, .015, "Jarro: 4 cestas  |  Prato: 3 cestas  |  Ambos: 3 cestas  |  Total: 10",
             ha="center", color=AZUL, fontsize=13)
    fig.tight_layout(rect=(0, .05, 1, 1))
    salvar(fig, "matriz-cestas.png")


def metricas(cestas: list[list[str]]) -> tuple[float, float, float]:
    conjuntos = [set(b) for b in cestas]
    total = len(conjuntos)
    na = sum("p01" in b for b in conjuntos)
    nb = sum("p02" in b for b in conjuntos)
    juntos = sum({"p01", "p02"} <= b for b in conjuntos)
    return juntos / total, juntos / na, juntos * total / (na * nb)


def validacao(catalogo: dict, novas: dict) -> None:
    descoberta = metricas(catalogo["cestas"])
    avaliacao = metricas(novas["cestas"])
    fig, eixos = plt.subplots(1, 3, figsize=(12, 5))
    for i, (ax, titulo) in enumerate(zip(eixos, ["Suporte", "Confiança", "Lift"])):
        valores = [descoberta[i], avaliacao[i]]
        ax.bar([0, 1], valores, color=[VERDE, BARRO], width=.6)
        ax.set_xticks([0, 1], ["Descoberta", "Avaliação\nseparada"])
        ax.set_title(titulo, fontsize=17, color=AZUL)
        ax.set_ylim(0, 1 if i < 2 else 3)
        if i < 2:
            ax.yaxis.set_major_formatter(matplotlib.ticker.PercentFormatter(1))
        else:
            ax.axhline(1, color=AZUL, linestyle="--", linewidth=1)
            ax.text(.5, 1.05, "Referência: 1", ha="center", fontsize=10)
        for j, v in enumerate(valores):
            label = f"{v:.0%}" if i < 2 else f"{v:.2f}".replace(".", ",")
            ax.text(j, v+.04, label, ha="center", color=AZUL, fontsize=14, weight="bold")
        ax.spines[["top", "right"]].set_visible(False)
    fig.suptitle("A mesma regra: Jarro → Prato", fontsize=21, color=AZUL, weight="bold")
    fig.text(.5, .015, "Dois conjuntos sintéticos de 10 cestas; sem evidência de desempenho real.",
             ha="center", fontsize=12, color=AZUL)
    fig.tight_layout(rect=(0, .07, 1, .93))
    salvar(fig, "descoberta-validacao.png")


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    catalogo = json.loads((RAIZ / "dados/catalogo.json").read_text(encoding="utf-8"))
    novas = json.loads((RAIZ / "material/cestas-validacao-20261017.json").read_text(encoding="utf-8"))
    hierarquia()
    matriz(catalogo)
    validacao(catalogo, novas)
    print(f"Três figuras reproduzidas em {DESTINO}")


if __name__ == "__main__":
    main()
