"""Fine-tuning didático sem GPU: pré-treino em vários produtos → adaptar em p01.

Não baixa pesos de hub. Mostra o *padrão* pré-treino / congelar tronco / adaptar
cabeça usando MLPRegressor do scikit-learn e cópia de coeficientes.
"""

from __future__ import annotations

import csv
import json
import time
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from sklearn.neural_network import MLPRegressor

RAIZ = Path(__file__).resolve().parent.parent
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO = RAIZ / "dados" / "catalogo.json"
SAIDA = RAIZ / "material" / "redes"
IMAGENS = RAIZ / "material" / "imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
INICIO_TESTE = 12
HIDDEN = (16, 8)
ALVO = "p01"


def carregar_series() -> dict[str, list[int]]:
    nomes = {
        p["id"] for p in json.loads(CATALOGO.read_text(encoding="utf-8"))["produtos"]
    }
    series: dict[str, list[int]] = {pid: [] for pid in nomes}
    with CSV_PATH.open(encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh):
            series[row["product_id"]].append(int(row["order_line_count"]))
    return series


def montar_xy(valores: list[int]) -> tuple[np.ndarray, np.ndarray]:
    n = len(valores)
    x, y = [], []
    for t in range(n):
        atraso = valores[t - 1] if t > 0 else valores[0]
        x.append([t / max(n - 1, 1), float(atraso)])
        y.append(float(valores[t]))
    return np.asarray(x), np.asarray(y)


def empilhar_treino(series: dict[str, list[int]]) -> tuple[np.ndarray, np.ndarray]:
    xs, ys = [], []
    for vals in series.values():
        x, y = montar_xy(vals)
        xs.append(x[:INICIO_TESTE])
        ys.append(y[:INICIO_TESTE])
    return np.vstack(xs), np.concatenate(ys)


def novo_mlp(*, max_iter: int, lr: float = 0.05) -> MLPRegressor:
    return MLPRegressor(
        hidden_layer_sizes=HIDDEN,
        activation="relu",
        solver="adam",
        learning_rate_init=lr,
        max_iter=max_iter,
        random_state=0,
        tol=0.0,
        n_iter_no_change=max_iter,
        alpha=1e-4,
        warm_start=False,
    )


def copiar_pesos(destino: MLPRegressor, origem: MLPRegressor) -> None:
    destino.coefs_ = [c.copy() for c in origem.coefs_]
    destino.intercepts_ = [b.copy() for b in origem.intercepts_]
    destino.n_features_in_ = origem.n_features_in_
    destino.n_outputs_ = origem.n_outputs_
    destino.n_layers_ = origem.n_layers_
    destino.out_activation_ = origem.out_activation_
    destino.t_ = getattr(origem, "t_", 0)
    destino.loss_curve_ = list(getattr(origem, "loss_curve_", []) or [])


def congelar_tronco_treinar_cabeca(
    base: MLPRegressor,
    x_tr: np.ndarray,
    y_tr: np.ndarray,
    *,
    epocas: int,
) -> tuple[MLPRegressor, list[float]]:
    """Congela camadas escondidas: só atualiza a última (saída) via gradiente manual leve."""
    modelo = novo_mlp(max_iter=1)
    # força init compatível
    modelo.partial_fit(x_tr[:2], y_tr[:2])
    copiar_pesos(modelo, base)
    perdas: list[float] = []
    lr = 0.02
    for _ in range(epocas):
        pred = modelo.predict(x_tr)
        err = y_tr - pred
        # última camada: W_out shape (hidden, 1) ou (hidden,)
        h = _ativar_tronco(modelo, x_tr)
        # gradiente MSE p/ saída linear
        grad_w = -(h.T @ err) / len(y_tr)
        grad_b = -float(np.mean(err))
        modelo.coefs_[-1] = modelo.coefs_[-1] - lr * grad_w.reshape(modelo.coefs_[-1].shape)
        modelo.intercepts_[-1] = modelo.intercepts_[-1] - lr * grad_b
        pred2 = modelo.predict(x_tr)
        perdas.append(float(np.mean((y_tr - pred2) ** 2)))
    return modelo, perdas


def _ativar_tronco(modelo: MLPRegressor, x: np.ndarray) -> np.ndarray:
    a = x
    for i, (w, b) in enumerate(zip(modelo.coefs_[:-1], modelo.intercepts_[:-1])):
        a = np.maximum(0.0, a @ w + b)  # relu
    return a


def mae(y, pred) -> float:
    return float(np.mean(np.abs(y - pred)))


def figura_caixas() -> None:
    fig, ax = plt.subplots(figsize=(10, 3.2))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 3)
    ax.axis("off")
    items = [
        (0.4, "Do zero\npesos aleatórios\nmuitos dados"),
        (3.5, "Pré-treino\ntarefa ampla\npesos úteis"),
        (6.6, "Fine-tune\npoucos rótulos\nadapta cabeça"),
    ]
    for x, texto in items:
        ax.add_patch(plt.Rectangle((x, 0.7), 2.6, 1.6, facecolor="#e5edf7",
                                   edgecolor=AZUL, lw=2))
        ax.text(x + 1.3, 1.5, texto, ha="center", va="center", color=AZUL, fontsize=11)
    ax.set_title("Três modos de chegar a um modelo útil", color=AZUL, weight="bold")
    fig.tight_layout()
    fig.savefig(IMAGENS / "fine-tuning-tres-caixas.png", dpi=160, bbox_inches="tight",
                facecolor="white")
    plt.close(fig)


def figura_ft(perdas: list[float]) -> None:
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.plot(range(1, len(perdas) + 1), perdas, color=VERDE, lw=2)
    ax.set_title("MSE no adaptação (cabeça) — p01", color=AZUL, weight="bold")
    ax.set_xlabel("Época de fine-tune")
    ax.set_ylabel("MSE")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.25)
    fig.tight_layout()
    fig.savefig(IMAGENS / "fine-tuning-curva-p01.png", dpi=160, bbox_inches="tight",
                facecolor="white")
    plt.close(fig)


def main() -> None:
    SAIDA.mkdir(parents=True, exist_ok=True)
    IMAGENS.mkdir(parents=True, exist_ok=True)
    series = carregar_series()
    x_all, y_all = empilhar_treino(series)
    x_p, y_p = montar_xy(series[ALVO])
    x_tr, y_tr = x_p[:INICIO_TESTE], y_p[:INICIO_TESTE]
    x_te, y_te = x_p[INICIO_TESTE:], y_p[INICIO_TESTE:]

    t0 = time.perf_counter()
    pre = novo_mlp(max_iter=60)
    pre.fit(x_all, y_all)
    t_pre = time.perf_counter() - t0

    mae_antes = mae(y_te, np.maximum(0.0, pre.predict(x_te)))

    t1 = time.perf_counter()
    ft, perdas = congelar_tronco_treinar_cabeca(pre, x_tr, y_tr, epocas=40)
    t_ft = time.perf_counter() - t1
    mae_depois = mae(y_te, np.maximum(0.0, ft.predict(x_te)))

    scratch = novo_mlp(max_iter=60)
    scratch.fit(x_tr, y_tr)
    mae_scratch = mae(y_te, np.maximum(0.0, scratch.predict(x_te)))

    figura_caixas()
    figura_ft(perdas)

    resumo = {
        "alvo": ALVO,
        "pretreino": {
            "n_exemplos": int(len(y_all)),
            "wall_clock_s": round(t_pre, 3),
            "mae_teste_p01_antes_ft": round(mae_antes, 4),
        },
        "fine_tune": {
            "congela": "camadas escondidas (tronco)",
            "atualiza": "camada de saída (cabeça)",
            "epocas": 40,
            "wall_clock_s": round(t_ft, 3),
            "mae_teste_depois": round(mae_depois, 4),
        },
        "do_zero_so_p01": {"mae_teste": round(mae_scratch, 4)},
        "riscos": [
            "overfit no conjunto minúsculo de p01",
            "split temporal frágil (só 4 semanas de teste)",
        ],
        "mitigacao_usada": "congelar tronco; poucas épocas na cabeça; piso em zero na previsão",
    }
    (SAIDA / "resultado_fine_tuning_p01.json").write_text(
        json.dumps(resumo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(json.dumps(resumo, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
