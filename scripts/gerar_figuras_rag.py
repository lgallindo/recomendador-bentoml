"""Figuras conceituais do tutorial RAG: loop e ladder house."""

from __future__ import annotations

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

RAIZ = Path(__file__).resolve().parent.parent
IMAGENS = RAIZ / "material" / "imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"


def caixa(ax, x, y, w, h, texto, cor):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05",
                                facecolor=cor, edgecolor=AZUL, lw=2))
    ax.text(x + w / 2, y + h / 2, texto, ha="center", va="center", color=AZUL,
            fontsize=11, weight="bold")


def figura_loop() -> None:
    fig, ax = plt.subplots(figsize=(9, 3.2))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 3)
    ax.axis("off")
    caixa(ax, 0.4, 1.0, 2.4, 1.2, "Retrieve\nhits + paths", "#e5edf7")
    caixa(ax, 3.6, 1.0, 2.4, 1.2, "Augment\nprompt + trechos", "#c0dedc")
    caixa(ax, 6.8, 1.0, 2.4, 1.2, "Generate\nresposta citada", "#fff2dc")
    ax.annotate("", xy=(3.5, 1.6), xytext=(2.9, 1.6),
                arrowprops=dict(arrowstyle="->", color=BARRO, lw=2))
    ax.annotate("", xy=(6.7, 1.6), xytext=(6.1, 1.6),
                arrowprops=dict(arrowstyle="->", color=BARRO, lw=2))
    ax.set_title("Loop RAG — o que viaja em cada seta", color=AZUL, weight="bold")
    fig.tight_layout()
    fig.savefig(IMAGENS / "rag-loop.png", dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def figura_ladder() -> None:
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 6)
    ax.axis("off")
    degraus = [
        (0.5, "INDEX — Markdown versionado"),
        (1.7, "FTS — SQLite / grep"),
        (2.9, "llmwiki — BM25 + híbrido local"),
        (4.1, "Vetores / grafo — quando FTS não basta"),
    ]
    for y, texto in degraus:
        caixa(ax, 1.2, y, 5.5, 0.9, texto, "#e5edf7")
    ax.set_title("Ladder house (local, autocontida)", color=AZUL, weight="bold")
    ax.text(4, 5.3, "Suba um degrau só quando o de baixo falhar na tarefa",
            ha="center", color=VERDE, fontsize=10)
    fig.tight_layout()
    fig.savefig(IMAGENS / "rag-ladder.png", dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def main() -> None:
    IMAGENS.mkdir(parents=True, exist_ok=True)
    figura_loop()
    figura_ladder()
    print("ok → rag-loop.png, rag-ladder.png")


if __name__ == "__main__":
    main()
