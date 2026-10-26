"""Demo mínimo: MLP rasa (sklearn) na série sintética de demanda.

Treina uma rede com uma camada escondida para prever linhas de pedido a partir
do índice da semana (e opcionalmente a contagem atrasada). Gera curva de loss
aproximada (MSE em holdout interno por época via warm_start) e um JSON de
resultados para o tutorial.

Uso (raiz do repo):

    uv run python scripts/demo_treino_mlp_demanda.py
"""

from __future__ import annotations

import csv
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from sklearn.neural_network import MLPRegressor

RAIZ = Path(__file__).resolve().parent.parent
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
SAIDA = RAIZ / "material" / "redes"
IMAGENS = RAIZ / "material" / "imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
INICIO_TESTE = 12
PRODUTO = "p01"
EPOCAS_BASE = 40
LR_BASE = 0.01
LARGURA_BASE = 8


def carregar_serie(pid: str) -> list[int]:
    vals: list[int] = []
    with CSV_PATH.open(encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh):
            if row["product_id"] == pid:
                vals.append(int(row["order_line_count"]))
    if len(vals) != 16:
        raise SystemExit(f"{pid}: esperado 16, veio {len(vals)}")
    return vals


def montar_xy(valores: list[int]) -> tuple[np.ndarray, np.ndarray]:
    """Feature: [t_norm, y_{t-1}]; alvo y_t. Primeira semana usa y_0 como atraso."""
    n = len(valores)
    x, y = [], []
    for t in range(n):
        atraso = valores[t - 1] if t > 0 else valores[0]
        x.append([t / max(n - 1, 1), float(atraso)])
        y.append(float(valores[t]))
    return np.asarray(x), np.asarray(y)


def treinar_com_curva(
    x_tr: np.ndarray,
    y_tr: np.ndarray,
    *,
    epocas: int,
    lr: float,
    largura: int,
) -> tuple[MLPRegressor, list[float]]:
    modelo = MLPRegressor(
        hidden_layer_sizes=(largura,),
        activation="relu",
        solver="adam",
        learning_rate_init=lr,
        max_iter=epocas,
        warm_start=False,
        random_state=0,
        alpha=1e-4,
        tol=0.0,
        n_iter_no_change=epocas,
    )
    modelo.fit(x_tr, y_tr)
    perdas = [float(v) for v in (modelo.loss_curve_ or [])]
    if not perdas:
        pred = modelo.predict(x_tr)
        perdas = [float(np.mean((y_tr - pred) ** 2))]
    return modelo, perdas


def mae(y: np.ndarray, pred: np.ndarray) -> float:
    return float(np.mean(np.abs(y - pred)))


def baseline_media(y_tr: np.ndarray, y_te: np.ndarray) -> float:
    media = float(np.mean(y_tr))
    return mae(y_te, np.full_like(y_te, media))


def rodar_knob(
    x_tr: np.ndarray,
    y_tr: np.ndarray,
    x_te: np.ndarray,
    y_te: np.ndarray,
    *,
    epocas: int,
    lr: float,
    largura: int,
) -> dict:
    modelo, perdas = treinar_com_curva(
        x_tr, y_tr, epocas=epocas, lr=lr, largura=largura
    )
    pred_te = np.maximum(0.0, modelo.predict(x_te))
    return {
        "epocas": epocas,
        "lr": lr,
        "largura": largura,
        "mae_teste": mae(y_te, pred_te),
        "mse_final_treino": perdas[-1],
        "perda_epocas": perdas,
    }


def figura_perda(perdas: list[float], nome: str) -> None:
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.plot(range(1, len(perdas) + 1), perdas, color=VERDE, linewidth=2)
    ax.set_title("MSE no treino por época — MLP rasa (p01)", color=AZUL, weight="bold")
    ax.set_xlabel("Época")
    ax.set_ylabel("MSE")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.25)
    fig.tight_layout()
    fig.savefig(IMAGENS / nome, dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def figura_fluxo() -> None:
    fig, ax = plt.subplots(figsize=(10, 3.2))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 3)
    ax.axis("off")
    caixas = [
        (0.3, 1.0, "Dados\n(batch)"),
        (2.5, 1.0, "Modelo\n(MLP)"),
        (4.7, 1.0, "Loss"),
        (6.9, 1.0, "Otimizador\natualiza pesos"),
    ]
    for x, y, texto in caixas:
        ax.add_patch(plt.Rectangle((x, y), 1.8, 1.2, fill=True, facecolor="#e5edf7",
                                   edgecolor=AZUL, linewidth=2, zorder=1))
        ax.text(x + 0.9, y + 0.6, texto, ha="center", va="center", color=AZUL,
                fontsize=11, weight="bold", zorder=2)
    for x0, x1 in [(2.1, 2.5), (4.3, 4.7), (6.5, 6.9)]:
        ax.annotate("", xy=(x1, 1.6), xytext=(x0, 1.6),
                    arrowprops={"arrowstyle": "-|>", "color": BARRO, "lw": 2})
    ax.text(5, 0.35, "Uma época = passar (quase) todos os exemplos uma vez",
            ha="center", color=AZUL, fontsize=11)
    ax.set_title("Loop de treino (visão de aula)", color=AZUL, weight="bold", fontsize=14)
    fig.tight_layout()
    fig.savefig(IMAGENS / "treino-redes-fluxo.png", dpi=160, bbox_inches="tight",
                facecolor="white")
    plt.close(fig)


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    IMAGENS.mkdir(parents=True, exist_ok=True)
    valores = carregar_serie(PRODUTO)
    x, y = montar_xy(valores)
    x_tr, y_tr = x[:INICIO_TESTE], y[:INICIO_TESTE]
    x_te, y_te = x[INICIO_TESTE:], y[INICIO_TESTE:]

    base = rodar_knob(
        x_tr, y_tr, x_te, y_te,
        epocas=EPOCAS_BASE, lr=LR_BASE, largura=LARGURA_BASE,
    )
    knobs = {
        "base": base,
        "mais_epocas": rodar_knob(
            x_tr, y_tr, x_te, y_te,
            epocas=EPOCAS_BASE * 2, lr=LR_BASE, largura=LARGURA_BASE,
        ),
        "lr_maior": rodar_knob(
            x_tr, y_tr, x_te, y_te,
            epocas=EPOCAS_BASE, lr=LR_BASE * 5, largura=LARGURA_BASE,
        ),
        "mais_larga": rodar_knob(
            x_tr, y_tr, x_te, y_te,
            epocas=EPOCAS_BASE, lr=LR_BASE, largura=LARGURA_BASE * 2,
        ),
    }
    base_mae = baseline_media(y_tr, y_te)

    figura_perda(base["perda_epocas"], "treino-redes-mse-p01.png")
    figura_fluxo()

    resumo = {
        "produto": PRODUTO,
        "n_treino": int(len(y_tr)),
        "n_teste": int(len(y_te)),
        "shape_x_treino": list(x_tr.shape),
        "dtype_y": "float64 (linhas de pedido)",
        "mae_baseline_media": base_mae,
        "mae_mlp_base": base["mae_teste"],
        "knobs": {
            k: {
                "epocas": v["epocas"],
                "lr": v["lr"],
                "largura": v["largura"],
                "mae_teste": round(v["mae_teste"], 4),
                "mse_final_treino": round(v["mse_final_treino"], 4),
            }
            for k, v in knobs.items()
        },
    }
    (SAIDA / "resultado_mlp_p01.json").write_text(
        json.dumps(resumo, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(json.dumps(resumo, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
