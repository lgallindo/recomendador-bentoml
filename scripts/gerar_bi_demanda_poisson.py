"""Gera dados.js do explorador Poisson e figura bi-demanda-poisson-p01.png."""

from __future__ import annotations

import csv
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
import numpy as np
from scipy.stats import poisson
from sklearn.linear_model import PoissonRegressor
from sklearn.preprocessing import OneHotEncoder

RAIZ = Path(__file__).resolve().parent.parent
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO = RAIZ / "dados" / "catalogo.json"
PAINEL = RAIZ / "material" / "bi-demanda-poisson"
IMAGENS = RAIZ / "material" / "imagens"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
INICIO_TESTE = 12
K_MAX = 8


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


def ajustar(
    series: dict[str, list[int]], n_semanas: int
) -> tuple[OneHotEncoder, PoissonRegressor, list[str]]:
    produtos = sorted(series)
    codificador = OneHotEncoder(
        categories=[produtos],
        sparse_output=False,
        handle_unknown="ignore",
    )
    matriz = codificador.fit_transform(
        np.asarray(produtos, dtype=object).reshape(-1, 1)
    )
    X = np.vstack(
        [
            np.column_stack((matriz, np.full(len(produtos), semana / 10)))
            for semana in range(n_semanas)
        ]
    )
    y = np.asarray(
        [
            series[produto][semana]
            for semana in range(n_semanas)
            for produto in produtos
        ],
        dtype=int,
    )
    modelo = PoissonRegressor(alpha=0.1, max_iter=1000).fit(X, y)
    return codificador, modelo, produtos


def taxa_produto(
    codificador: OneHotEncoder,
    modelo: PoissonRegressor,
    produtos: list[str],
    pid: str,
    semana_norm: float,
) -> float:
    matriz = codificador.transform(np.asarray([pid], dtype=object).reshape(-1, 1))
    X = np.column_stack((matriz, [[semana_norm]]))
    return float(modelo.predict(X)[0])


def preparar(semanas: list[str], nomes: dict[str, str], series: dict[str, list[int]]) -> dict:
    n = len(semanas)
    codificador, modelo, produtos = ajustar(series, n)
    semana_futura = n / 10  # alinhado a gerar_figuras_demanda (1.6 com n=16)
    produtos_out = []
    log_perdas: list[float] = []
    coberturas: list[bool] = []

    for pid in produtos:
        valores = series[pid]
        # walk-forward: refit só no passado de cada ponto de teste
        teste = []
        for pos in range(INICIO_TESTE, n):
            cod_t, mod_t, prods_t = ajustar(
                {k: v[:pos] for k, v in series.items()}, pos
            )
            lam = taxa_produto(cod_t, mod_t, prods_t, pid, pos / 10)
            obs = valores[pos]
            lo = int(poisson.ppf(0.025, lam))
            hi = int(poisson.ppf(0.975, lam))
            teste.append({
                "week_start": semanas[pos],
                "observado": obs,
                "lambda": round(lam, 4),
                "intervalo": [lo, hi],
                "coberto": lo <= obs <= hi,
                "log_perda": round(float(-poisson.logpmf(obs, lam)), 4),
            })
            log_perdas.append(float(-poisson.logpmf(obs, lam)))
            coberturas.append(lo <= obs <= hi)

        lam = taxa_produto(codificador, modelo, produtos, pid, semana_futura)
        lo = int(poisson.ppf(0.025, lam))
        hi = int(poisson.ppf(0.975, lam))
        ks = list(range(0, max(K_MAX, hi + 2)))
        pmf = [round(float(poisson.pmf(k, lam)), 6) for k in ks]
        produtos_out.append({
            "id": pid,
            "nome": nomes[pid],
            "lambda": round(lam, 4),
            "intervalo_95": [lo, hi],
            "p_gt_2": round(float(poisson.sf(2, lam)), 4),
            "p_le_2": round(float(poisson.cdf(2, lam)), 4),
            "contagens": ks,
            "pmf": pmf,
            "teste": teste,
            "log_perda_media": round(
                sum(r["log_perda"] for r in teste) / len(teste), 4
            ),
            "cobertura_teste": round(
                sum(1 for r in teste if r["coberto"]) / len(teste), 4
            ),
        })

    return {
        "origem": "dados/vendas_semanais.csv",
        "modelo": "PoissonRegressor(alpha=0.1) + OneHot produto + t/10",
        "semanas": semanas,
        "inicio_teste": semanas[INICIO_TESTE],
        "n_semanas": n,
        "n_teste": n - INICIO_TESTE,
        "produtos": produtos_out,
        "log_perda_agregada": round(sum(log_perdas) / len(log_perdas), 4),
        "cobertura_agregada": round(sum(coberturas) / len(coberturas), 4),
    }


def figura_p01(dados: dict) -> None:
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    ks = p01["contagens"]
    pmf = p01["pmf"]
    lo, hi = p01["intervalo_95"]
    cores = [VERDE if lo <= k <= hi else "#cbd3d9" for k in ks]
    fig, ax = plt.subplots(figsize=(10, 5.5))
    ax.bar(ks, pmf, color=cores, edgecolor="white", width=0.76)
    ax.axvline(
        p01["lambda"],
        color=BARRO,
        linestyle="--",
        linewidth=2,
        label=f"λ = {p01['lambda']:.3f}".replace(".", ","),
    )
    ax.set_title(
        "PMF Poisson — Jarro (p01)",
        fontsize=18,
        color=AZUL,
        weight="bold",
        pad=12,
    )
    ax.set_xlabel("Linhas de pedido na próxima semana")
    ax.set_ylabel("Probabilidade")
    ax.set_xticks(ks)
    ax.spines[["top", "right"]].set_visible(False)
    ax.legend(frameon=False)
    ax.text(
        0.98,
        0.92,
        f"Intervalo 95%: [{lo}, {hi}]\nP(Y > 2) = {p01['p_gt_2']:.1%}",
        transform=ax.transAxes,
        ha="right",
        va="top",
        color=AZUL,
        fontsize=11,
        bbox={
            "boxstyle": "round,pad=.4",
            "facecolor": "white",
            "edgecolor": "#cbd3d9",
        },
    )
    fig.text(
        0.5,
        0.015,
        "Base sintética; explorador bi-demanda-poisson.",
        ha="center",
        color=AZUL,
        fontsize=10.5,
    )
    fig.tight_layout(rect=(0, 0.05, 1, 1))
    fig.savefig(
        IMAGENS / "bi-demanda-poisson-p01.png",
        dpi=170,
        bbox_inches="tight",
        facecolor="white",
    )
    plt.close(fig)


def main() -> None:
    PAINEL.mkdir(parents=True, exist_ok=True)
    semanas, nomes, series = carregar()
    dados = preparar(semanas, nomes, series)
    js = "window.DEMANDA_POISSON = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n"
    (PAINEL / "dados.js").write_text(js, encoding="utf-8")
    figura_p01(dados)
    p01 = next(p for p in dados["produtos"] if p["id"] == "p01")
    print(
        f"dados.js · λ(p01)={p01['lambda']} · "
        f"log-perda agregada={dados['log_perda_agregada']} · "
        f"cobertura={dados['cobertura_agregada']}"
    )


if __name__ == "__main__":
    main()
