"""Gera dados.js do explorador de demanda e as figuras estáticas bi-demanda-*.png."""

from __future__ import annotations

import csv
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
from datetime import date

RAIZ = Path(__file__).resolve().parent.parent
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO = RAIZ / "dados" / "catalogo.json"
PAINEL = RAIZ / "material" / "bi-demanda"
IMAGENS = RAIZ / "material" / "imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
INICIO_TESTE = 12  # últimas 4 das 16 semanas
JANELAS = {"ingenua": 1, "ma2": 2, "ma3": 3, "ma4": 4, "ma5": 5}
NOMES_JANELA = {
    "ingenua": "Ingênua",
    "ma2": "MA(2)",
    "ma3": "MA(3)",
    "ma4": "MA(4)",
    "ma5": "MA(5)",
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


def previsao(valores: list[int], posicao: int, janela: int) -> float | None:
    if posicao < janela:
        return None
    return sum(valores[posicao - janela : posicao]) / janela


def walk_forward(valores: list[int], janela: int) -> list[dict]:
    linhas = []
    for posicao in range(INICIO_TESTE, len(valores)):
        prev = previsao(valores, posicao, janela)
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


def preparar(semanas: list[str], nomes: dict[str, str], series: dict[str, list[int]]) -> dict:
    produtos = []
    mae_global = {chave: [] for chave in JANELAS}
    for pid in sorted(nomes):
        valores = series[pid]
        metodos = {}
        for chave, janela in JANELAS.items():
            linhas = walk_forward(valores, janela)
            metodos[chave] = {
                "janela": janela,
                "nome": NOMES_JANELA[chave],
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
                "proxima": previsao(valores, len(valores), janela),
            }
            for r in linhas:
                if r["erro_abs"] is not None:
                    mae_global[chave].append(r["erro_abs"])
        # série completa com previsões MA4 retrospectivas (para o gráfico)
        serie_rows = []
        for i, semana in enumerate(semanas):
            serie_rows.append({
                "week_start": semana,
                "observado": valores[i],
                "previsao_ma4": previsao(valores, i, 4),
                "em_teste": i >= INICIO_TESTE,
            })
        produtos.append({
            "id": pid,
            "nome": nomes[pid],
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
            chave: sum(erros) / len(erros) if erros else None
            for chave, erros in mae_global.items()
        },
        "nomes_janela": NOMES_JANELA,
    }


def salvar_fig(fig: plt.Figure, nome: str) -> None:
    fig.savefig(IMAGENS / nome, dpi=170, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def figura_serie(dados: dict) -> None:
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    datas = [date.fromisoformat(r["week_start"]) for r in p01["serie"]]
    obs = [r["observado"] for r in p01["serie"]]
    prev = [r["previsao_ma4"] for r in p01["serie"]]
    fig, ax = plt.subplots(figsize=(11, 5.5))
    ax.plot(datas, obs, marker="o", color=AZUL, linewidth=2.4, label="Observado")
    ax.plot(datas, prev, marker="s", color=VERDE, linewidth=2,
            linestyle="--", label="Previsão MA(4) walk-forward")
    prox = p01["metodos"]["ma4"]["proxima"]
    proxima_data = date.fromisoformat(dados["semanas"][-1])
    from datetime import timedelta
    ax.scatter([proxima_data + timedelta(days=7)], [prox], s=120, color=BARRO,
               zorder=5, label=f"Próxima semana MA(4) = {prox:.2f}".replace(".", ","))
    ax.axvspan(date.fromisoformat(dados["inicio_teste"]), datas[-1],
               alpha=0.12, color=BARRO, label="Janela de teste")
    ax.set_title("Série e MA(4) — Jarro (p01)", fontsize=18, color=AZUL, weight="bold")
    ax.set_ylabel("Linhas de pedido")
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%d/%m"))
    ax.grid(axis="y", alpha=0.25)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False, loc="upper left")
    fig.text(0.5, 0.01, "16 semanas sintéticas de dados/vendas_semanais.csv",
             ha="center", color=AZUL, fontsize=10)
    fig.tight_layout(rect=(0, 0.04, 1, 1))
    salvar_fig(fig, "bi-demanda-serie-p01.png")


def figura_erros(dados: dict) -> None:
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    teste = p01["metodos"]["ma4"]["teste"]
    semanas = [r["week_start"][5:] for r in teste]
    erros = [r["erro_abs"] for r in teste]
    fig, ax = plt.subplots(figsize=(9, 5))
    bars = ax.bar(semanas, erros, color=VERDE, edgecolor="white")
    mae_val = p01["metodos"]["ma4"]["mae"]
    ax.axhline(mae_val, color=BARRO, linestyle="--", linewidth=2,
               label=f"MAE MA(4) = {mae_val:.2f}".replace(".", ","))
    for bar, err in zip(bars, erros):
        ax.text(bar.get_x() + bar.get_width() / 2, err + 0.03,
                f"{err:.2f}".replace(".", ","), ha="center", color=AZUL, fontsize=11)
    ax.set_title("Erros absolutos MA(4) no teste — p01", fontsize=18, color=AZUL, weight="bold")
    ax.set_ylabel("|observado − previsão|")
    ax.set_xlabel("Semana prevista (mês-dia)")
    ax.set_ylim(0, max(erros) * 1.35)
    ax.legend(frameon=False)
    ax.spines[["top", "right"]].set_visible(False)
    fig.tight_layout()
    salvar_fig(fig, "bi-demanda-erros-p01.png")


def figura_mae(dados: dict) -> None:
    chaves = list(JANELAS)
    nomes = [NOMES_JANELA[k] for k in chaves]
    maes = [dados["mae_agregado"][k] for k in chaves]
    fig, ax = plt.subplots(figsize=(9, 5.2))
    ax.bar(nomes, maes, color=[BARRO if k == "ingenua" else VERDE for k in chaves],
           edgecolor="white")
    for i, mae_val in enumerate(maes):
        ax.text(i, mae_val + 0.015, f"{mae_val:.3f}".replace(".", ","),
                ha="center", color=AZUL, fontsize=11, weight="bold")
    ax.set_title("MAE agregado: ingênua e MA(2)–MA(5)", fontsize=18, color=AZUL, weight="bold")
    ax.set_ylabel("MAE (48 previsões)")
    ax.set_ylim(0, max(maes) * 1.3)
    ax.spines[["top", "right"]].set_visible(False)
    fig.text(0.5, 0.01, "Mesmas 4 semanas de teste × 12 produtos; dados sintéticos.",
             ha="center", color=AZUL, fontsize=10)
    fig.tight_layout(rect=(0, 0.04, 1, 1))
    salvar_fig(fig, "bi-demanda-mae-janelas.png")


def main() -> None:
    semanas, nomes, series = carregar()
    dados = preparar(semanas, nomes, series)
    PAINEL.mkdir(parents=True, exist_ok=True)
    IMAGENS.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.DEMANDA = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    figura_serie(dados)
    figura_erros(dados)
    figura_mae(dados)
    print(f"dados.js → {PAINEL / 'dados.js'}")
    print("Figuras: bi-demanda-serie-p01.png, bi-demanda-erros-p01.png, bi-demanda-mae-janelas.png")
    print("MAE agregado:", {k: round(v, 3) for k, v in dados["mae_agregado"].items()})


if __name__ == "__main__":
    main()
