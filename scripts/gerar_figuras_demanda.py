"""Gera as figuras conceituais e temporais do tutorial de demanda."""

from __future__ import annotations

import csv
from datetime import date
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

RAIZ = Path(__file__).resolve().parent.parent
FONTE = RAIZ / "dados" / "vendas_semanais.csv"
DESTINO = RAIZ / "material" / "imagens"
AZUL = "#18374b"
VERDE = "#157c80"
BARRO = "#b65432"
CLARO = "#f2f4f6"


def salvar(fig: plt.Figure, nome: str) -> None:
    fig.savefig(DESTINO / nome, dpi=180, facecolor="white", bbox_inches="tight")
    plt.close(fig)


def mapa_conceitual() -> None:
    fig, ax = plt.subplots(figsize=(12, 6.5))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 6.5)
    ax.axis("off")

    areas = [
        ((0.35, 1.4), (4.3, 4.55), "#e5edf7", AZUL),
        ((0.8, 2.0), (3.4, 2.75), "#c0dedc", VERDE),
        ((5.35, 1.4), (3.0, 4.55), "#fff2dc", BARRO),
        ((9.0, 2.15), (2.65, 2.95), CLARO, AZUL),
    ]
    for (x, y), (width, height), fill, edge in areas:
        ax.add_patch(FancyBboxPatch(
            (x, y), width, height,
            boxstyle="round,pad=.16,rounding_size=.18",
            facecolor=fill, edgecolor=edge, linewidth=2,
        ))

    ax.text(2.5, 5.55, "Inteligência artificial (IA)", ha="center",
            fontsize=17, weight="bold", color=AZUL)
    ax.text(2.5, 4.35, "Aprendizado de máquina\n(ML)", ha="center",
            fontsize=13, weight="bold", color=AZUL)
    ax.text(2.5, 3.35, "Modelos aprendem padrões\ncom exemplos e dados",
            ha="center", va="center", fontsize=12, color=AZUL)
    ax.text(6.85, 5.25, "Estatística e previsão\nde séries temporais",
            ha="center", va="center", fontsize=13, weight="bold", color=AZUL)
    ax.text(6.85, 4.15, "Média móvel", ha="center", va="center",
            fontsize=15, weight="bold", color="white",
            bbox={"boxstyle": "round,pad=.45", "facecolor": BARRO, "edgecolor": BARRO})
    ax.text(6.85, 3.0, "Regra explícita: média das\núltimas semanas",
            ha="center", va="center", fontsize=12, color=AZUL)
    ax.text(10.32, 3.65, "Prever a\ndemanda\nsemanal",
            ha="center", va="center", fontsize=15, weight="bold", color=AZUL)
    ax.add_patch(FancyArrowPatch(
        (8.45, 3.5), (8.95, 3.5), arrowstyle="-|>", mutation_scale=18,
        linewidth=2, color=BARRO,
    ))
    ax.plot([2.5, 2.5, 10.32], [2.0, 1.0, 1.0],
            linestyle="--", linewidth=1.8, color=VERDE)
    ax.add_patch(FancyArrowPatch(
        (10.32, 1.0), (10.32, 2.1), arrowstyle="-|>",
        mutation_scale=18, linewidth=1.8, linestyle="--", color=VERDE,
    ))
    ax.text(6.35, 1.22, "ML também pode abordar o problema",
            ha="center", fontsize=10.5, color=VERDE,
            bbox={"facecolor": "white", "edgecolor": "white", "pad": 2})
    ax.text(6, 0.45, "Métodos relacionados, mas não sinônimos",
            ha="center", fontsize=13, color=AZUL)
    ax.set_title("Onde a média móvel se situa?", fontsize=21,
                 color=AZUL, pad=12, weight="bold")
    salvar(fig, "mapa-ia-previsao-demanda.png")


def carregar_serie() -> tuple[list[date], list[int]]:
    datas: list[date] = []
    valores: list[int] = []
    with FONTE.open(newline="", encoding="utf-8") as arquivo:
        for linha in csv.DictReader(arquivo):
            if linha["product_id"] == "p01":
                datas.append(date.fromisoformat(linha["week_start"]))
                valores.append(int(linha["order_line_count"]))
    if len(datas) != 16:
        raise ValueError(f"Esperadas 16 semanas para p01; encontradas {len(datas)}")
    return datas, valores


def serie_tempo() -> None:
    datas, valores = carregar_serie()
    previsoes = [
        sum(valores[posicao - 4 : posicao]) / 4
        for posicao in range(4, len(valores))
    ]
    datas_previsao = datas[4:]
    proxima_data = date.fromordinal(datas[-1].toordinal() + 7)
    previsao_final = sum(valores[-4:]) / 4

    fig, ax = plt.subplots(figsize=(12, 6))
    ax.plot(datas, valores, marker="o", linewidth=2.4, color=AZUL,
            label="Observado (sintético)")
    ax.plot(datas_previsao, previsoes, marker="s", linewidth=2,
            linestyle="--", color=VERDE,
            label="Previsão MA(4) antes de cada semana")
    ax.scatter([proxima_data], [previsao_final], marker="*", s=220,
               color=BARRO, edgecolor="white", linewidth=0.8, zorder=5,
               label=f"Próxima semana: {previsao_final:.1f}")
    ax.axvline(datas[-1], color=BARRO, linewidth=1, alpha=.45, linestyle=":")
    ax.set_title("Jarro barro Tracunhaém (p01): observado e MA(4)",
                 fontsize=19, color=AZUL, weight="bold", pad=15)
    ax.set_ylabel("Linhas de pedido por semana")
    ax.set_xlabel("Semana iniciada em")
    ax.set_ylim(-.35, max(valores) + 1)
    ax.set_yticks(range(0, max(valores) + 1))
    ax.xaxis.set_major_locator(mdates.WeekdayLocator(byweekday=mdates.MO, interval=2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m"))
    ax.grid(axis="y", alpha=.22)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper right")
    fig.text(.5, .015, "Série sintética para fins didáticos; não representa vendas observadas.",
             ha="center", color=AZUL, fontsize=11)
    fig.tight_layout(rect=(0, .05, 1, 1))
    salvar(fig, "serie-media-movel-p01.png")


def fluxo_walk_forward() -> None:
    fig, ax = plt.subplots(figsize=(12, 4.8))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 4.8)
    ax.axis("off")
    caixas = [
        (0.35, 2.15, 2.25, 1.45, "Histórico\nsemanal", "#e5edf7"),
        (3.15, 2.15, 2.55, 1.45, "Janela das\n4 semanas", "#c0dedc"),
        (6.25, 2.15, 2.2, 1.45, "Previsão\nMA(4)", "#fff2dc"),
        (9.05, 2.15, 2.55, 1.45, "Observar valor\ne calcular erro", CLARO),
    ]
    for x, y, width, height, texto, cor in caixas:
        ax.add_patch(FancyBboxPatch(
            (x, y), width, height,
            boxstyle="round,pad=.15,rounding_size=.12",
            facecolor=cor, edgecolor=AZUL, linewidth=1.7,
        ))
        ax.text(x + width / 2, y + height / 2, texto, ha="center", va="center",
                fontsize=13, weight="bold", color=AZUL)
    for inicio, fim in [(2.65, 3.1), (5.75, 6.2), (8.5, 9.0)]:
        ax.add_patch(FancyArrowPatch(
            (inicio, 2.88), (fim, 2.88), arrowstyle="-|>",
            mutation_scale=17, linewidth=1.8, color=VERDE,
        ))
    ax.plot([10.325, 10.325, 1.475], [2.1, .85, .85],
            linewidth=1.8, color=BARRO)
    ax.add_patch(FancyArrowPatch(
        (1.475, .85), (1.475, 2.05), arrowstyle="-|>",
        mutation_scale=17, linewidth=1.8, color=BARRO,
    ))
    ax.text(5.9, 1.1, "Incorporar o observado e avançar uma semana",
            ha="center", color=BARRO, fontsize=11.5)
    ax.text(7.35, 3.95, "Cada previsão é feita antes de conhecer a semana prevista",
            ha="center", color=AZUL, fontsize=14, weight="bold")
    salvar(fig, "fluxo-walk-forward-demanda.png")


def main() -> None:
    DESTINO.mkdir(parents=True, exist_ok=True)
    mapa_conceitual()
    serie_tempo()
    fluxo_walk_forward()
    print(f"Três figuras de demanda geradas em {DESTINO}")


if __name__ == "__main__":
    main()
