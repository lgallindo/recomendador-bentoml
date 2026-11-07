"""Compara MLP rasa (1 hidden) vs um pouco mais funda (3 hidden) na demanda p01."""

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
SEMENTES = (0, 1, 2, 3, 4)


def carregar_serie(pid: str) -> list[int]:
    vals: list[int] = []
    with CSV_PATH.open(encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh):
            if row["product_id"] == pid:
                vals.append(int(row["order_line_count"]))
    return vals


def montar_xy(valores: list[int]) -> tuple[np.ndarray, np.ndarray]:
    n = len(valores)
    x, y = [], []
    for t in range(n):
        atraso = valores[t - 1] if t > 0 else valores[0]
        x.append([t / max(n - 1, 1), float(atraso)])
        y.append(float(valores[t]))
    return np.asarray(x), np.asarray(y)


def contar_params(modelo: MLPRegressor) -> int:
    return int(sum(c.size for c in modelo.coefs_) + sum(b.size for b in modelo.intercepts_))


def treinar(
    x_tr, y_tr, *, hidden: tuple[int, ...], epocas: int = 80, lr: float = 0.05, semente: int = 0
):
    modelo = MLPRegressor(
        hidden_layer_sizes=hidden,
        activation="relu",
        solver="adam",
        learning_rate_init=lr,
        max_iter=epocas,
        random_state=semente,
        tol=0.0,
        n_iter_no_change=epocas,
        alpha=1e-4,
    )
    modelo.fit(x_tr, y_tr)
    perdas = [float(v) for v in (modelo.loss_curve_ or [])]
    return modelo, perdas


def mae(y, pred) -> float:
    return float(np.mean(np.abs(y - pred)))


def figura_curvas(rasa: list[float], funda: list[float]) -> None:
    fig, ax = plt.subplots(figsize=(8.5, 4.8))
    ax.plot(range(1, len(rasa) + 1), rasa, color=VERDE, lw=2, label="Rasa (1×8)")
    ax.plot(range(1, len(funda) + 1), funda, color=BARRO, lw=2, label="Mais funda (8-8-8)")
    ax.set_title("Perda de treino — profundidade na mesma série p01", color=AZUL, weight="bold")
    ax.set_xlabel("Época")
    ax.set_ylabel("perda de treino (½·MSE + L2)")
    ax.legend(frameon=False)
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.25)
    fig.tight_layout()
    fig.savefig(IMAGENS / "deep-learning-curvas-p01.png", dpi=160, bbox_inches="tight",
                facecolor="white")
    plt.close(fig)


def figura_profundidade() -> None:
    fig, ax = plt.subplots(figsize=(9, 3.5))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 4)
    ax.axis("off")
    # shallow
    for i, label in enumerate(["x", "h₁", "ŷ"]):
        ax.add_patch(plt.Circle((1.2 + i * 1.1, 2.8), 0.35, color="#c0dedc", ec=AZUL, lw=2))
        ax.text(1.2 + i * 1.1, 2.8, label, ha="center", va="center", color=AZUL, weight="bold")
    ax.text(2.3, 3.6, "Rasa", ha="center", color=AZUL, weight="bold")
    # deeper
    for i, label in enumerate(["x", "h₁", "h₂", "h₃", "ŷ"]):
        ax.add_patch(plt.Circle((1.0 + i * 1.0, 1.1), 0.32, color="#fff2dc", ec=BARRO, lw=2))
        ax.text(1.0 + i * 1.0, 1.1, label, ha="center", va="center", color=AZUL, fontsize=10,
                weight="bold")
    ax.text(3.0, 1.9, "Mais funda = mais transformações empilhadas", ha="center", color=BARRO)
    ax.set_title("O que “deep” sugere na prática", color=AZUL, weight="bold", fontsize=14)
    fig.tight_layout()
    fig.savefig(IMAGENS / "deep-learning-profundidade.png", dpi=160, bbox_inches="tight",
                facecolor="white")
    plt.close(fig)


def varredura_profundidade(x_tr, y_tr, x_te, y_te, *, largura: int = 8) -> list[dict]:
    """1 a 4 camadas escondidas de mesma largura: parâmetros, MAE de treino e de teste."""
    linhas = []
    for camadas in range(1, 5):
        hidden = (largura,) * camadas
        modelo, perdas = treinar(x_tr, y_tr, hidden=hidden)
        linhas.append({
            "camadas": camadas,
            "hidden": list(hidden),
            "n_params": contar_params(modelo),
            "mae_treino": round(mae(y_tr, np.maximum(0.0, modelo.predict(x_tr))), 4),
            "mae_teste": round(mae(y_te, np.maximum(0.0, modelo.predict(x_te))), 4),
            "perda_final": round(perdas[-1], 4),
            "perda_epocas": [round(v, 5) for v in perdas],
            "pred_teste": [round(float(v), 4) for v in np.maximum(0.0, modelo.predict(x_te))],
            "mae_teste_sementes": [
                round(mae(y_te, np.maximum(0.0, treinar(
                    x_tr, y_tr, hidden=hidden, semente=s)[0].predict(x_te))), 4)
                for s in SEMENTES
            ],
        })
    return linhas


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    IMAGENS.mkdir(parents=True, exist_ok=True)
    valores = carregar_serie(PRODUTO)
    x, y = montar_xy(valores)
    x_tr, y_tr = x[:INICIO_TESTE], y[:INICIO_TESTE]
    x_te, y_te = x[INICIO_TESTE:], y[INICIO_TESTE:]

    rasa, perda_r = treinar(x_tr, y_tr, hidden=(8,))
    funda, perda_f = treinar(x_tr, y_tr, hidden=(8, 8, 8))
    pred_r = np.maximum(0.0, rasa.predict(x_te))
    pred_f = np.maximum(0.0, funda.predict(x_te))
    media = float(np.mean(y_tr))
    mae_base = mae(y_te, np.full_like(y_te, media))

    figura_curvas(perda_r, perda_f)
    figura_profundidade()

    resumo = {
        "produto": PRODUTO,
        "mae_baseline_media": round(mae_base, 4),
        "rasa": {
            "hidden": [8],
            "n_params": contar_params(rasa),
            "mae_teste": round(mae(y_te, pred_r), 4),
            "mse_final_treino": round(perda_r[-1], 4) if perda_r else None,
        },
        "mais_funda": {
            "hidden": [8, 8, 8],
            "n_params": contar_params(funda),
            "mae_teste": round(mae(y_te, pred_f), 4),
            "mse_final_treino": round(perda_f[-1], 4) if perda_f else None,
        },
        "nota": (
            "Com n_treino=12, mais parâmetros não garantem melhor teste. "
            "Compare com média móvel, mínimos quadrados e LMS no mesmo teste."
        ),
    }
    (SAIDA / "resultado_deep_vs_rasa_p01.json").write_text(
        json.dumps(resumo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    varredura = {
        "produto": PRODUTO,
        "largura": 8,
        "epocas": 80,
        "lr": 0.05,
        "perda": "loss_curve_ do scikit-learn: ½·MSE + penalidade L2 (alpha=1e-4)",
        "y_teste": y_te.tolist(),
        "mae_baseline_media": round(mae_base, 4),
        "sementes": list(SEMENTES),
        "profundidades": varredura_profundidade(x_tr, y_tr, x_te, y_te),
    }
    (SAIDA / "profundidade_p01.json").write_text(
        json.dumps(varredura, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(resumo, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
