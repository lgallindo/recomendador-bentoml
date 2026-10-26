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
import numpy as np
from scipy.stats import poisson
from sklearn.linear_model import LinearRegression, PoissonRegressor
from sklearn.preprocessing import OneHotEncoder

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


def mapa_regressao() -> None:
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
    ax.text(6.85, 5.25, "Aprendizado\nsupervisionado",
            ha="center", va="center", fontsize=13, weight="bold", color=AZUL)
    ax.text(6.85, 4.15, "Regressão linear\nmínimos quadrados", ha="center",
            va="center", fontsize=14, weight="bold", color="white",
            bbox={"boxstyle": "round,pad=.45", "facecolor": BARRO, "edgecolor": BARRO})
    ax.text(6.85, 2.95, "Reta β₀ + β₁t ajustada\nao histórico",
            ha="center", va="center", fontsize=12, color=AZUL)
    ax.text(10.32, 3.65, "Prever a\ndemanda\nsemanal",
            ha="center", va="center", fontsize=15, weight="bold", color=AZUL)
    ax.add_patch(FancyArrowPatch(
        (8.45, 3.5), (8.95, 3.5), arrowstyle="-|>", mutation_scale=18,
        linewidth=2, color=BARRO,
    ))
    ax.set_title("Onde a regressão por mínimos quadrados se situa?",
                 fontsize=20, color=AZUL, pad=12, weight="bold")
    salvar(fig, "mapa-ia-regressao-demanda.png")


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


def carregar_matriz() -> tuple[list[date], dict[str, list[int]]]:
    datas: list[date] = []
    series: dict[str, list[int]] = {}
    with FONTE.open(newline="", encoding="utf-8") as arquivo:
        for linha in csv.DictReader(arquivo):
            semana = date.fromisoformat(linha["week_start"])
            produto = linha["product_id"]
            if semana not in datas:
                datas.append(semana)
            if produto not in series:
                series[produto] = []
            series[produto].append(int(linha["order_line_count"]))
    datas.sort()
    if len(datas) != 16 or any(len(valores) != len(datas) for valores in series.values()):
        raise ValueError("Esperadas 16 observações semanais completas por produto")
    return datas, series


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


def regressao_minimos_quadrados() -> None:
    datas, series = carregar_matriz()
    valores = np.asarray(series["p01"], dtype=float)
    x = np.arange(len(valores)).reshape(-1, 1)
    modelo = LinearRegression().fit(x, valores)
    x_reta = np.arange(len(valores) + 1).reshape(-1, 1)
    ajustados = modelo.predict(x_reta)
    futura = date.fromordinal(datas[-1].toordinal() + 7)
    datas_reta = datas + [futura]

    fig, ax = plt.subplots(figsize=(11, 5.8))
    ax.scatter(datas, valores, s=52, color=AZUL, zorder=3,
               label="Observado (sintético)")
    ax.plot(datas_reta[:-1], ajustados[:-1], color=VERDE, linewidth=2.5,
            label="Reta ajustada")
    ax.plot(datas_reta[-2:], ajustados[-2:], color=BARRO, linewidth=2.5,
            linestyle="--", label="Extrapolação")
    ax.scatter([futura], [ajustados[-1]], marker="*", s=220, color=BARRO,
               edgecolor="white", linewidth=.8, zorder=4,
               label=f"Previsão: {ajustados[-1]:.3f}")
    ax.axvline(datas[-1], color=BARRO, linewidth=1, alpha=.45, linestyle=":")
    ax.set_title("Regressão linear por mínimos quadrados: p01",
                 fontsize=18, color=AZUL, weight="bold", pad=14)
    ax.set_ylabel("Linhas de pedido por semana")
    ax.set_xlabel("Semana iniciada em")
    ax.set_ylim(-.35, max(valores) + 1)
    ax.xaxis.set_major_locator(mdates.WeekdayLocator(byweekday=mdates.MO, interval=2))
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m"))
    ax.grid(axis="y", alpha=.22)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False)
    fig.text(.5, .015, "Histórico sintético; extrapolação para a próxima semana.",
             ha="center", color=AZUL, fontsize=10.5)
    fig.tight_layout(rect=(0, .05, 1, 1))
    salvar(fig, "regressao-minimos-quadrados-p01.png")


def ajustar_poisson(
    series: dict[str, list[int]],
    quantidade_semanas: int,
) -> tuple[OneHotEncoder, PoissonRegressor]:
    produtos = sorted(series)
    codificador = OneHotEncoder(
        categories=[produtos],
        sparse_output=False,
        handle_unknown="ignore",
    )
    matriz_produtos = codificador.fit_transform(
        np.asarray(produtos, dtype=object).reshape(-1, 1)
    )
    X = np.vstack(
        [
            np.column_stack(
                (matriz_produtos, np.full(len(produtos), semana / 10))
            )
            for semana in range(quantidade_semanas)
        ]
    )
    y = np.asarray(
        [
            series[produto][semana]
            for semana in range(quantidade_semanas)
            for produto in produtos
        ],
        dtype=int,
    )
    modelo = PoissonRegressor(alpha=0.1, max_iter=1000).fit(X, y)
    return codificador, modelo


def distribuicao_poisson() -> None:
    _, series = carregar_matriz()
    produtos = sorted(series)
    codificador, modelo = ajustar_poisson(series, len(next(iter(series.values()))))
    matriz_produtos = codificador.transform(
        np.asarray(produtos, dtype=object).reshape(-1, 1)
    )
    X_futuro = np.column_stack(
        (matriz_produtos, np.full(len(produtos), 1.6))
    )
    taxa = float(modelo.predict(X_futuro)[produtos.index("p01")])
    inferior = int(poisson.ppf(0.025, taxa))
    superior = int(poisson.ppf(0.975, taxa))
    contagens = np.arange(max(8, superior + 2))
    probabilidades = poisson.pmf(contagens, taxa)
    cores = [
        VERDE if inferior <= k <= superior else "#cbd3d9"
        for k in contagens
    ]

    fig, ax = plt.subplots(figsize=(10, 5.8))
    ax.bar(contagens, probabilidades, color=cores, edgecolor="white", width=.76)
    ax.axvline(taxa, color=BARRO, linestyle="--", linewidth=2,
               label=f"Média prevista λ = {taxa:.3f}")
    ax.set_title("Distribuição de Poisson prevista para p01",
                 fontsize=18, color=AZUL, weight="bold", pad=14)
    ax.set_xlabel("Linhas de pedido possíveis na próxima semana")
    ax.set_ylabel("Probabilidade")
    ax.set_xticks(contagens)
    ax.set_ylim(0, max(probabilidades) * 1.22)
    ax.grid(axis="y", alpha=.22)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False)
    ax.text(
        .98, .92,
        f"Intervalo central de 95%: [{inferior}, {superior}]\n"
        f"P(demanda > 2) = {poisson.sf(2, taxa):.1%}",
        transform=ax.transAxes, ha="right", va="top",
        color=AZUL, fontsize=11,
        bbox={"boxstyle": "round,pad=.4", "facecolor": "white", "edgecolor": "#cbd3d9"},
    )
    fig.text(.5, .015, "Distribuição condicional a PoissonRegressor; dados sintéticos.",
             ha="center", color=AZUL, fontsize=10.5)
    fig.tight_layout(rect=(0, .05, 1, 1))
    salvar(fig, "distribuicao-poisson-p01.png")


def comparar_metodos() -> None:
    _, series = carregar_matriz()
    periodos = [1, 2, 3, 4, 5]
    nomes = ["Ingênua", "MA(2)", "MA(3)", "MA(4)", "MA(5)"]
    inicio_teste = 12
    maes: list[float] = []

    for periodo in periodos:
        erros = []
        for valores in series.values():
            for posicao in range(inicio_teste, len(valores)):
                previsao = sum(valores[posicao - periodo : posicao]) / periodo
                erros.append(abs(valores[posicao] - previsao))
        maes.append(sum(erros) / len(erros))

    fig, ax = plt.subplots(figsize=(10, 5.5))
    ax.plot(nomes, maes, marker="o", linewidth=2.8, markersize=8, color=VERDE)
    for posicao, mae in enumerate(maes):
        ax.annotate(f"{mae:.3f}".replace(".", ","), (posicao, mae),
                    textcoords="offset points", xytext=(0, 10),
                    ha="center", color=AZUL, fontsize=11, weight="bold")
    ax.set_title("Comparação walk-forward: erro absoluto médio",
                 fontsize=18, color=AZUL, weight="bold", pad=14)
    ax.set_ylabel("MAE (linhas de pedido por produto/semana)")
    ax.set_xlabel("Método")
    ax.set_ylim(0, max(maes) * 1.25)
    ax.grid(axis="y", alpha=.22)
    ax.spines[["top", "right"]].set_visible(False)
    fig.text(.5, .015, "48 previsões nos mesmos 4 períodos de teste; demanda sintética.",
             ha="center", color=AZUL, fontsize=10.5)
    fig.tight_layout(rect=(0, .05, 1, 1))
    salvar(fig, "comparacao-media-movel-mae.png")


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
    mapa_regressao()
    serie_tempo()
    regressao_minimos_quadrados()
    distribuicao_poisson()
    comparar_metodos()
    fluxo_walk_forward()
    print(f"Sete figuras de demanda geradas em {DESTINO}")


if __name__ == "__main__":
    main()
