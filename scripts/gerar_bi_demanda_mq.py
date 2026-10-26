"""Gera dados.js do explorador MQ e figuras bi-demanda-mq-*.png."""

from __future__ import annotations

import csv
import json
from datetime import date, timedelta
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np
from sklearn.linear_model import LinearRegression

RAIZ = Path(__file__).resolve().parent.parent
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO = RAIZ / "dados" / "catalogo.json"
PAINEL = RAIZ / "material" / "bi-demanda-mq"
IMAGENS = RAIZ / "material" / "imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
INICIO_TESTE = 12
METODOS = ("ingenua", "ma4", "ma5", "mq")
NOMES = {
    "ingenua": "Ingênua",
    "ma4": "MA(4)",
    "ma5": "MA(5)",
    "mq": "Mín. quadrados",
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
    for pid, vals in series.items():
        if len(vals) != 16:
            raise SystemExit(f"{pid}: esperado 16, veio {len(vals)}")
    return semanas, nomes, series


def previsao_ma(valores: list[int], posicao: int, janela: int) -> float | None:
    if posicao < janela:
        return None
    return sum(valores[posicao - janela : posicao]) / janela


def previsao_mq(valores: list[int], posicao: int) -> float | None:
    if posicao < 2:
        return None
    x = np.arange(posicao).reshape(-1, 1)
    y = np.asarray(valores[:posicao], dtype=float)
    modelo = LinearRegression().fit(x, y)
    bruto = float(modelo.predict([[posicao]])[0])
    return max(0.0, bruto)


def previsao(valores: list[int], posicao: int, metodo: str) -> float | None:
    if metodo == "ingenua":
        return previsao_ma(valores, posicao, 1)
    if metodo == "ma4":
        return previsao_ma(valores, posicao, 4)
    if metodo == "ma5":
        return previsao_ma(valores, posicao, 5)
    if metodo == "mq":
        return previsao_mq(valores, posicao)
    raise ValueError(metodo)


def walk_forward(valores: list[int], metodo: str) -> list[dict]:
    linhas = []
    for posicao in range(INICIO_TESTE, len(valores)):
        prev = previsao(valores, posicao, metodo)
        obs = valores[posicao]
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


def ajuste_completo(valores: list[int]) -> tuple[float, float, list[float], float]:
    x = np.arange(len(valores)).reshape(-1, 1)
    y = np.asarray(valores, dtype=float)
    modelo = LinearRegression().fit(x, y)
    ajustado = [max(0.0, float(v)) for v in modelo.predict(x)]
    prox_bruto = float(modelo.predict([[len(valores)]])[0])
    return float(modelo.intercept_), float(modelo.coef_[0]), ajustado, max(0.0, prox_bruto)


def preparar(semanas: list[str], nomes: dict[str, str], series: dict[str, list[int]]) -> dict:
    produtos = []
    mae_global: dict[str, list[float]] = {m: [] for m in METODOS}
    for pid in sorted(nomes):
        valores = series[pid]
        intercepto, inclinacao, ajustado, prox_mq = ajuste_completo(valores)
        metodos = {}
        for metodo in METODOS:
            linhas = walk_forward(valores, metodo)
            prox = (
                prox_mq if metodo == "mq"
                else previsao(valores, len(valores), metodo)
            )
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
                "proxima": prox,
            }
            for r in linhas:
                if r["erro_abs"] is not None:
                    mae_global[metodo].append(r["erro_abs"])
        serie_rows = []
        for i, semana in enumerate(semanas):
            serie_rows.append({
                "week_start": semana,
                "observado": valores[i],
                "ajustado_mq": ajustado[i],
                "previsao_wf_mq": previsao_mq(valores, i),
                "em_teste": i >= INICIO_TESTE,
            })
        produtos.append({
            "id": pid,
            "nome": nomes[pid],
            "intercepto": intercepto,
            "inclinacao": inclinacao,
            "serie": serie_rows,
            "metodos": metodos,
        })
    return {
        "origem": "dados/vendas_semanais.csv",
        "semanas": semanas,
        "inicio_teste": semanas[INICIO_TESTE],
        "n_semanas": len(semanas),
        "n_teste": len(semanas) - INICIO_TESTE,
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
    aj = [r["ajustado_mq"] for r in p01["serie"]]
    fig, ax = plt.subplots(figsize=(11, 5.5))
    ax.plot(datas, obs, marker="o", color=AZUL, linewidth=2.4, label="Observado")
    ax.plot(datas, aj, marker="s", color=VERDE, linewidth=2,
            linestyle="--", label="Reta MQ (ajuste completo)")
    prox = p01["metodos"]["mq"]["proxima"]
    proxima_data = date.fromisoformat(dados["semanas"][-1]) + timedelta(days=7)
    ax.scatter([proxima_data], [prox], s=120, color=BARRO, zorder=5,
               label=f"Próxima semana MQ = {prox:.2f}".replace(".", ","))
    ax.axvspan(date.fromisoformat(dados["inicio_teste"]), datas[-1],
               alpha=0.12, color=BARRO, label="Janela de teste")
    ax.set_title("Série e mínimos quadrados — Jarro (p01)",
                 fontsize=18, color=AZUL, weight="bold")
    ax.set_ylabel("Linhas de pedido")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m"))
    ax.grid(axis="y", alpha=0.25)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper left")
    fig.tight_layout()
    salvar_fig(fig, "bi-demanda-mq-serie-p01.png")


def figura_erros(dados: dict) -> None:
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    teste = p01["metodos"]["mq"]["teste"]
    semanas = [r["week_start"][5:] for r in teste]
    erros = [r["erro_abs"] for r in teste]
    fig, ax = plt.subplots(figsize=(9, 5))
    bars = ax.bar(semanas, erros, color=VERDE, edgecolor="white")
    mae_val = p01["metodos"]["mq"]["mae"]
    ax.axhline(mae_val, color=BARRO, linestyle="--", linewidth=2,
               label=f"MAE MQ = {mae_val:.2f}".replace(".", ","))
    for bar, err in zip(bars, erros):
        ax.text(bar.get_x() + bar.get_width() / 2, err + 0.03,
                f"{err:.2f}".replace(".", ","), ha="center", color=AZUL, fontsize=11)
    ax.set_title("Erros absolutos MQ no teste — p01", fontsize=18, color=AZUL, weight="bold")
    ax.set_ylabel("|observado − previsão|")
    ax.set_ylim(0, max(erros) * 1.35)
    ax.legend(frameon=False)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    salvar_fig(fig, "bi-demanda-mq-erros-p01.png")


def figura_mae(dados: dict) -> None:
    chaves = list(METODOS)
    nomes = [NOMES[k] for k in chaves]
    maes = [dados["mae_agregado"][k] for k in chaves]
    fig, ax = plt.subplots(figsize=(9, 5.2))
    cores = [BARRO if k == "ingenua" else (AZUL if k == "mq" else VERDE) for k in chaves]
    ax.bar(nomes, maes, color=cores, edgecolor="white")
    for i, mae_val in enumerate(maes):
        ax.text(i, mae_val + 0.015, f"{mae_val:.3f}".replace(".", ","),
                ha="center", color=AZUL, fontsize=11, weight="bold")
    ax.set_title("MAE agregado: ingênua, MA e mínimos quadrados",
                 fontsize=17, color=AZUL, weight="bold")
    ax.set_ylabel("MAE (48 previsões)")
    ax.set_ylim(0, max(maes) * 1.3)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    salvar_fig(fig, "bi-demanda-mq-mae.png")


def main() -> None:
    semanas, nomes, series = carregar()
    dados = preparar(semanas, nomes, series)
    PAINEL.mkdir(parents=True, exist_ok=True)
    IMAGENS.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.DEMANDA_MQ = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    figura_serie(dados)
    figura_erros(dados)
    figura_mae(dados)
    print(f"dados.js → {PAINEL / 'dados.js'}")
    print("MAE agregado:", {k: round(v, 3) for k, v in dados["mae_agregado"].items()})


if __name__ == "__main__":
    main()
