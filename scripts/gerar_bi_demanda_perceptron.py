"""Gera dados.js do explorador perceptron/LMS e figuras bi-demanda-perc-*.png."""

from __future__ import annotations

import csv
import json
import sys
from datetime import date, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
from lms_demanda import (  # noqa: E402
    INICIO_TESTE,
    previsao_nao_negativa,
    treinar_lms,
    walk_forward_lms,
)

CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO = RAIZ / "dados" / "catalogo.json"
PAINEL = RAIZ / "material" / "bi-demanda-perceptron"
IMAGENS = RAIZ / "material" / "imagens"
PESOS = RAIZ / "material" / "bi-demanda-perceptron" / "pesos_p01.json"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
EPOCAS, LR = 200, 0.05
METODOS = ("ingenua", "ma4", "mq_batch", "lms")
NOMES = {
    "ingenua": "Ingênua",
    "ma4": "MA(4)",
    "mq_batch": "MQ (lote)",
    "lms": "LMS / ADALINE",
}


def carregar() -> tuple[list[str], dict[str, str], dict[str, list[int]]]:
    catalogo = json.loads(CATALOGO.read_text(encoding="utf-8"))
    nomes = {p["id"]: p["nome"] for p in catalogo["produtos"]}
    semanas: list[str] = []
    series: dict[str, list[int]] = {pid: [] for pid in nomes}
    with CSV_PATH.open(encoding="utf-8", newline="") as fh:
        for row in csv.DictReader(fh):
            semana = row["week_start"]
            if semana not in semanas:
                semanas.append(semana)
            series[row["product_id"]].append(int(row["order_line_count"]))
    semanas.sort()
    return semanas, nomes, series


def previsao_ma(valores: list[int], posicao: int, janela: int) -> float | None:
    if posicao < janela:
        return None
    return sum(valores[posicao - janela : posicao]) / janela


def previsao_mq_lote(valores: list[int], posicao: int) -> float | None:
    if posicao < 2:
        return None
    from sklearn.linear_model import LinearRegression

    x = np.arange(posicao).reshape(-1, 1)
    y = np.asarray(valores[:posicao], dtype=float)
    modelo = LinearRegression().fit(x, y)
    return max(0.0, float(modelo.predict([[posicao]])[0]))


def walk_forward(valores: list[int], metodo: str) -> list[dict]:
    if metodo == "lms":
        return walk_forward_lms(valores, epocas=EPOCAS, lr=LR)
    linhas = []
    for posicao in range(INICIO_TESTE, len(valores)):
        if metodo == "ingenua":
            prev = previsao_ma(valores, posicao, 1)
        elif metodo == "ma4":
            prev = previsao_ma(valores, posicao, 4)
        elif metodo == "mq_batch":
            prev = previsao_mq_lote(valores, posicao)
        else:
            raise ValueError(metodo)
        obs = float(valores[posicao])
        linhas.append({
            "posicao": posicao,
            "observado": obs,
            "previsao": prev,
            "erro_abs": abs(obs - prev) if prev is not None else None,
        })
    return linhas


def mae(linhas: list[dict]) -> float | None:
    erros = [r["erro_abs"] for r in linhas if r["erro_abs"] is not None]
    return sum(erros) / len(erros) if erros else None


def preparar(semanas: list[str], nomes: dict[str, str], series: dict[str, list[int]]) -> dict:
    produtos = []
    mae_global: dict[str, list[float]] = {m: [] for m in METODOS}
    for pid in sorted(nomes):
        valores = series[pid]
        w_full, hist_mse, escala = treinar_lms(
            valores, epocas=EPOCAS, lr=LR, ate=INICIO_TESTE
        )
        ajustado = [
            previsao_nao_negativa(w_full, float(t), escala) for t in range(len(valores))
        ]
        prox = previsao_nao_negativa(w_full, float(len(valores)), escala)
        metodos = {}
        for metodo in METODOS:
            linhas = walk_forward(valores, metodo)
            if metodo == "lms":
                prox_m = prox
            elif metodo == "ingenua":
                prox_m = previsao_ma(valores, len(valores), 1)
            elif metodo == "ma4":
                prox_m = previsao_ma(valores, len(valores), 4)
            else:
                prox_m = previsao_mq_lote(valores, len(valores))
            metodos[metodo] = {
                "nome": NOMES[metodo],
                "teste": [
                    {
                        "week_start": semanas[r["posicao"]],
                        "observado": r["observado"],
                        "previsao": r["previsao"],
                        "erro_abs": r["erro_abs"],
                    }
                    for r in linhas
                ],
                "mae": mae(linhas),
                "proxima": prox_m,
            }
            for r in linhas:
                if r["erro_abs"] is not None:
                    mae_global[metodo].append(r["erro_abs"])
        serie_rows = [
            {
                "week_start": semanas[i],
                "observado": valores[i],
                "ajustado_lms": ajustado[i],
                "em_teste": i >= INICIO_TESTE,
            }
            for i in range(len(semanas))
        ]
        produtos.append({
            "id": pid,
            "nome": nomes[pid],
            "bias": float(w_full[0]),
            "inclinacao": float(w_full[1]),
            "mse_epocas": hist_mse,
            "serie": serie_rows,
            "metodos": metodos,
        })
    return {
        "origem": "dados/vendas_semanais.csv",
        "semanas": semanas,
        "inicio_teste": semanas[INICIO_TESTE],
        "n_semanas": len(semanas),
        "n_teste": len(semanas) - INICIO_TESTE,
        "epocas": EPOCAS,
        "lr": LR,
        "produtos": produtos,
        "mae_agregado": {
            m: sum(erros) / len(erros) if erros else None
            for m, erros in mae_global.items()
        },
        "nomes_metodo": NOMES,
    }


def salvar_fig(fig: plt.Figure, nome: str) -> None:
    fig.savefig(IMAGENS / nome, dpi=170, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def figura_serie(dados: dict) -> None:
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    datas = [date.fromisoformat(r["week_start"]) for r in p01["serie"]]
    obs = [r["observado"] for r in p01["serie"]]
    aj = [r["ajustado_lms"] for r in p01["serie"]]
    fig, ax = plt.subplots(figsize=(11, 5.5))
    ax.plot(datas, obs, marker="o", color=AZUL, linewidth=2.4, label="Observado")
    ax.plot(datas, aj, marker="s", color=VERDE, linewidth=2, linestyle="--",
            label="LMS (treino nas 12 primeiras)")
    prox = p01["metodos"]["lms"]["proxima"]
    proxima = date.fromisoformat(dados["semanas"][-1]) + timedelta(days=7)
    ax.scatter([proxima], [prox], s=120, color=BARRO, zorder=5,
               label=f"Próxima LMS = {prox:.2f}".replace(".", ","))
    ax.axvspan(date.fromisoformat(dados["inicio_teste"]), datas[-1],
               alpha=0.12, color=BARRO, label="Janela de teste")
    ax.set_title("Série e LMS/ADALINE — Jarro (p01)", fontsize=18, color=AZUL, weight="bold")
    ax.set_ylabel("Linhas de pedido")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m"))
    ax.grid(axis="y", alpha=0.25)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper left")
    fig.tight_layout()
    salvar_fig(fig, "bi-demanda-perc-serie-p01.png")


def figura_mse(dados: dict) -> None:
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    mse = p01["mse_epocas"]
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.plot(range(1, len(mse) + 1), mse, color=VERDE, linewidth=2)
    ax.set_title("MSE por época (LMS, 12 semanas de treino) — p01",
                 fontsize=16, color=AZUL, weight="bold")
    ax.set_xlabel("Época")
    ax.set_ylabel("MSE")
    ax.spines[["top", "right"]].set_visible(False)
    ax.grid(axis="y", alpha=0.25)
    fig.tight_layout()
    salvar_fig(fig, "bi-demanda-perc-mse-p01.png")


def figura_mae(dados: dict) -> None:
    chaves = list(METODOS)
    nomes = [NOMES[k] for k in chaves]
    maes = [dados["mae_agregado"][k] for k in chaves]
    fig, ax = plt.subplots(figsize=(9, 5.2))
    cores = [BARRO if k == "ingenua" else (AZUL if k == "lms" else VERDE) for k in chaves]
    ax.bar(nomes, maes, color=cores, edgecolor="white")
    for i, mae_val in enumerate(maes):
        ax.text(i, mae_val + 0.015, f"{mae_val:.3f}".replace(".", ","),
                ha="center", color=AZUL, fontsize=11, weight="bold")
    ax.set_title("MAE agregado: baselines e LMS", fontsize=17, color=AZUL, weight="bold")
    ax.set_ylabel("MAE (48 previsões)")
    ax.set_ylim(0, max(maes) * 1.3)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    salvar_fig(fig, "bi-demanda-perc-mae.png")


def main() -> None:
    semanas, nomes, series = carregar()
    dados = preparar(semanas, nomes, series)
    PAINEL.mkdir(parents=True, exist_ok=True)
    IMAGENS.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.DEMANDA_PERC = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    PESOS.write_text(
        json.dumps(
            {
                "product_id": "p01",
                "bias": p01["bias"],
                "inclinacao": p01["inclinacao"],
                "escala": float(max(INICIO_TESTE - 1, 1)),
                "epocas": EPOCAS,
                "lr": LR,
                "treino_semanas": INICIO_TESTE,
                "n_semanas": len(semanas),
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    figura_serie(dados)
    figura_mse(dados)
    figura_mae(dados)
    print(f"dados.js → {PAINEL / 'dados.js'}")
    print(f"pesos → {PESOS}")
    print("MAE agregado:", {k: round(v, 3) for k, v in dados["mae_agregado"].items()})


if __name__ == "__main__":
    main()
