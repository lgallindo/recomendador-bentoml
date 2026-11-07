"""Figuras do tutorial de previsão probabilística (regressão de Poisson).

Reproduz o mesmo ajuste do tutorial — indicadores de produto + índice semanal / 10,
``PoissonRegressor(alpha=0.1)`` — sem pandas, e grava ``material/imagens/poisson-*.png``.

Uso (raiz do repo):

    uv run python scripts/gerar_figuras_poisson.py
"""

from __future__ import annotations

import csv
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import matplotlib.ticker
import numpy as np
from scipy.stats import poisson
from sklearn.linear_model import PoissonRegressor

RAIZ = Path(__file__).resolve().parent.parent
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
IMAGENS = RAIZ / "material" / "imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
FUNDO, CREME = "#e5edf7", "#fff1dc"
INICIO_TESTE = 12
ESTOQUE = 2


def carregar() -> tuple[list[str], list[str], dict[str, list[int]]]:
    semanas: list[str] = []
    series: dict[str, list[int]] = {}
    with CSV_PATH.open(encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh):
            if row["week_start"] not in semanas:
                semanas.append(row["week_start"])
            series.setdefault(row["product_id"], []).append(int(row["order_line_count"]))
    semanas.sort()
    return semanas, sorted(series), series


def matriz(produtos: list[str], pid: str, semana: int) -> list[float]:
    return [1.0 if p == pid else 0.0 for p in produtos] + [semana / 10]


def ajustar(produtos: list[str], series: dict[str, list[int]], ate: int) -> PoissonRegressor:
    x = [matriz(produtos, pid, s) for s in range(ate) for pid in produtos]
    y = [series[pid][s] for s in range(ate) for pid in produtos]
    return PoissonRegressor(alpha=0.1, max_iter=1000).fit(np.asarray(x), np.asarray(y))


def taxa(modelo: PoissonRegressor, produtos: list[str], pid: str, semana: int) -> float:
    return float(modelo.predict(np.asarray([matriz(produtos, pid, semana)]))[0])


def salvar(fig: plt.Figure, nome: str) -> None:
    fig.tight_layout()
    fig.savefig(IMAGENS / nome, dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"  · material/imagens/{nome}")


def estilo(ax: plt.Axes) -> None:
    ax.yaxis.set_major_formatter(matplotlib.ticker.FuncFormatter(lambda v, _: f"{v:g}".replace(".", ",")))
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.25)
    ax.tick_params(colors=AZUL)


def formas_lambda() -> None:
    fig, eixos = plt.subplots(1, 4, figsize=(13, 3.6), sharey=True)
    k = np.arange(0, 11)
    for ax, lam in zip(eixos, (0.5, 1.0, 2.0, 4.0)):
        ax.bar(k, poisson.pmf(k, lam), color=VERDE, width=0.75)
        ax.axvline(lam, color=BARRO, linewidth=2, linestyle="--")
        ax.set_title(f"λ = {lam:.1f}".replace(".", ","), color=AZUL, weight="bold")
        ax.set_xticks(k[::2])
        ax.set_xlabel("contagem k")
        estilo(ax)
        ax.text(0.97, 0.92, f"P(0) = {poisson.pmf(0, lam):.0%}".replace(".", ","),
                transform=ax.transAxes, ha="right", color=AZUL, fontsize=10)
    eixos[0].set_ylabel("P(Y = k)")
    fig.suptitle("A mesma fórmula, quatro taxas: média e variância crescem juntas (= λ)",
                 color=AZUL, weight="bold")
    salvar(fig, "poisson-formas-lambda.png")


def ligacao_log(semanas: list[str], produtos: list[str], series: dict[str, list[int]]) -> None:
    modelo = ajustar(produtos, series, len(semanas))
    b0 = float(modelo.intercept_)
    a_p01 = float(modelo.coef_[produtos.index("p01")])
    b1 = float(modelo.coef_[-1])
    t = np.linspace(0, 16, 200)
    eta = b0 + a_p01 + b1 * t / 10
    lam16 = taxa(modelo, produtos, "p01", 16)
    fig, (e1, e2) = plt.subplots(1, 2, figsize=(12, 4.2))
    e1.plot(t, eta, color=AZUL, linewidth=2.4)
    e1.set_title("Escala do preditor: η é uma reta", color=AZUL, weight="bold")
    e1.set_xlabel("semana t")
    e1.set_ylabel("η = log λ")
    e1.text(0.5, 0.88,
            f"η = {b0:.3f} + {a_p01:.3f} − {abs(b1):.3f}·(t/10)".replace(".", ","),
            transform=e1.transAxes, ha="center", color=AZUL, fontsize=11,
            bbox={"facecolor": FUNDO, "edgecolor": AZUL, "boxstyle": "round"})
    estilo(e1)
    e2.scatter(range(16), series["p01"], color=BARRO, zorder=3, label="observado (p01)")
    e2.plot(t, np.exp(eta), color=VERDE, linewidth=2.4, label="λ = e^η")
    e2.scatter([16], [lam16], color=VERDE, s=90, marker="D", zorder=4,
               label=f"próxima semana: λ = {lam16:.3f}".replace(".", ","))
    e2.set_title("Escala das contagens: λ = e^η, sempre positivo", color=AZUL, weight="bold")
    e2.set_xlabel("semana t")
    e2.set_ylabel("linhas de pedido")
    e2.set_ylim(0, 5)
    e2.legend(frameon=False, fontsize=9, loc="upper right")
    estilo(e2)
    salvar(fig, "poisson-ligacao-log.png")


def cauda_estoque(produtos: list[str], series: dict[str, list[int]], n: int) -> None:
    lam = taxa(ajustar(produtos, series, n), produtos, "p01", 16)
    k = np.arange(0, 9)
    p = poisson.pmf(k, lam)
    cores = [VERDE if v <= ESTOQUE else BARRO for v in k]
    fig, ax = plt.subplots(figsize=(9, 4.4))
    ax.bar(k, p, color=cores, width=0.75)
    for v, prob in zip(k, p):
        ax.text(v, prob + 0.006, f"{prob:.1%}".replace(".", ","), ha="center",
                color=AZUL, fontsize=9)
    ax.axvline(ESTOQUE + 0.5, color=AZUL, linewidth=1.5, linestyle=":")
    dentro, fora = poisson.cdf(ESTOQUE, lam), poisson.sf(ESTOQUE, lam)
    ax.text(0.9, 0.34, f"P(Y ≤ 2) = {dentro:.1%}\ncapacidade basta".replace(".", ","),
            color=VERDE, weight="bold", fontsize=11)
    ax.text(4.6, 0.20, f"P(Y > 2) = {fora:.1%}\ndemanda passa de duas".replace(".", ","),
            color=BARRO, weight="bold", fontsize=11)
    ax.set_xticks(k)
    ax.set_xlabel("linhas de pedido na próxima semana (p01)")
    ax.set_ylabel("probabilidade")
    ax.set_title(f"Risco de passar da capacidade de 2 linhas: área da cauda (λ = {lam:.3f})"
                 .replace(".", ","), color=AZUL, weight="bold")
    ax.set_ylim(0, 0.4)
    estilo(ax)
    salvar(fig, "poisson-cauda-estoque.png")


def walk_forward(semanas: list[str], produtos: list[str],
                 series: dict[str, list[int]]) -> tuple[list[dict], list[float]]:
    semanais, pits = [], []
    for pos in range(INICIO_TESTE, len(semanas)):
        modelo = ajustar(produtos, series, pos)
        perdas_m, perdas_b = [], []
        for pid in produtos:
            obs = series[pid][pos]
            lam = taxa(modelo, produtos, pid, pos)
            base = max(float(np.mean(series[pid][:pos])), 1e-6)
            perdas_m.append(-poisson.logpmf(obs, lam))
            perdas_b.append(-poisson.logpmf(obs, base))
            pits.append(poisson.cdf(obs - 1, lam) + 0.5 * poisson.pmf(obs, lam))
        semanais.append({"semana": semanas[pos], "modelo": float(np.mean(perdas_m)),
                         "base": float(np.mean(perdas_b))})
    return semanais, pits


def log_perda(semanais: list[dict]) -> None:
    fig, ax = plt.subplots(figsize=(9.5, 4.4))
    x = np.arange(len(semanais))
    m = [s["modelo"] for s in semanais]
    b = [s["base"] for s in semanais]
    ax.bar(x - 0.19, m, width=0.38, color=VERDE, label="regressão de Poisson (tendência comum)")
    ax.bar(x + 0.19, b, width=0.38, color=BARRO, label="Poisson com média do passado por produto")
    for xi, (vm, vb) in enumerate(zip(m, b)):
        ax.text(xi - 0.19, vm + 0.015, f"{vm:.3f}".replace(".", ","), ha="center", fontsize=9, color=AZUL)
        ax.text(xi + 0.19, vb + 0.015, f"{vb:.3f}".replace(".", ","), ha="center", fontsize=9, color=AZUL)
    ax.set_xticks(x, [s["semana"] for s in semanais])
    ax.set_ylabel("log-perda média (12 produtos)")
    ax.set_ylim(0, 1.6)
    media_m, media_b = np.mean(m), np.mean(b)
    ax.set_title(f"Menor é melhor: média {media_m:.3f} (regressão) vs {media_b:.3f} (média do passado)"
                 .replace(".", ","), color=AZUL, weight="bold")
    ax.legend(frameon=False, loc="upper center", fontsize=9, ncol=2)
    estilo(ax)
    salvar(fig, "poisson-log-perda-semanas.png")


def pit(pits: list[float], series: dict[str, list[int]]) -> None:
    contagens, _ = np.histogram(pits, bins=5, range=(0, 1))
    razoes = [float(np.var(v, ddof=1) / np.mean(v)) for v in series.values()]
    fig, ax = plt.subplots(figsize=(9, 4.4))
    ax.bar(np.arange(5), contagens, color=VERDE, width=0.8)
    esperado = len(pits) / 5
    ax.axhline(esperado, color=BARRO, linewidth=2, linestyle="--")
    ax.text(-0.4, esperado + 0.5, f"calibrado ≈ {esperado:.1f} por faixa".replace(".", ","),
            color=BARRO, ha="left", fontsize=10)
    for i, c in enumerate(contagens):
        ax.text(i, c + 0.3, str(c), ha="center", color=AZUL, weight="bold")
    ax.set_xticks(np.arange(5), ["0–0,2", "0,2–0,4", "0,4–0,6", "0,6–0,8", "0,8–1"])
    ax.set_xlabel("PIT médio: posição do valor observado na distribuição prevista")
    ax.set_ylabel(f"previsões (de {len(pits)})")
    ax.set_title(f"Corcova no meio: a série varia menos que Poisson supõe "
                 f"(variância/média ≈ {np.mean(razoes):.2f})".replace(".", ","),
                 color=AZUL, weight="bold")
    estilo(ax)
    salvar(fig, "poisson-pit.png")
    print(f"    PIT por faixa: {contagens.tolist()}; variância/média média: {np.mean(razoes):.3f}")


def main() -> None:
    IMAGENS.mkdir(parents=True, exist_ok=True)
    semanas, produtos, series = carregar()
    n = len(semanas)
    lam = taxa(ajustar(produtos, series, n), produtos, "p01", n)
    print(f"Ajuste completo: λ(p01, t=16) = {lam:.3f}; P(Y>2) = {poisson.sf(ESTOQUE, lam):.3f}")
    formas_lambda()
    ligacao_log(semanas, produtos, series)
    cauda_estoque(produtos, series, n)
    semanais, pits = walk_forward(semanas, produtos, series)
    for s in semanais:
        print(f"    {s['semana']}: log-perda modelo {s['modelo']:.3f} · média do passado {s['base']:.3f}")
    log_perda(semanais)
    pit(pits, series)


if __name__ == "__main__":
    main()
