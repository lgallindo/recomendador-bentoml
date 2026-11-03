"""Gera material/planilha-minimos-quadrados-demanda.xlsx (contas de sala)."""

from __future__ import annotations

import csv
import json
from pathlib import Path

import numpy as np
from openpyxl import Workbook
from openpyxl.styles import Font
from sklearn.linear_model import LinearRegression

RAIZ = Path(__file__).resolve().parent.parent
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO = RAIZ / "dados" / "catalogo.json"
SAIDA = RAIZ / "material" / "planilha-minimos-quadrados-demanda.xlsx"
INICIO_TESTE = 12


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


def ajuste(valores: list[int], n: int) -> tuple[float, float]:
    x = np.arange(n).reshape(-1, 1)
    y = np.asarray(valores[:n], dtype=float)
    modelo = LinearRegression().fit(x, y)
    return float(modelo.intercept_), float(modelo.coef_[0])


def main() -> None:
    semanas, nomes, series = carregar()
    wb = Workbook()
    resumo = wb.active
    resumo.title = "resumo"
    resumo.append(
        [
            "product_id",
            "nome",
            "intercepto_completo",
            "inclinacao_completa",
            "mae_teste_mq",
            "proxima_semana_mq",
        ]
    )
    for cell in resumo[1]:
        cell.font = Font(bold=True)

    for pid in sorted(nomes):
        valores = series[pid]
        ws = wb.create_sheet(pid)
        ws.append(
            [
                "week_start",
                "x",
                "y",
                "y_hat_completo",
                "residuo_completo",
                "em_teste",
                "y_hat_walkforward",
                "abs_erro_teste",
            ]
        )
        for cell in ws[1]:
            cell.font = Font(bold=True)

        b_full, a_full = ajuste(valores, len(valores))
        erros = []
        for i, semana in enumerate(semanas):
            y = valores[i]
            y_hat_full = max(0.0, b_full + a_full * i)
            em_teste = i >= INICIO_TESTE
            y_hat_wf = None
            abs_err = None
            if em_teste and i >= 2:
                b, a = ajuste(valores, i)
                y_hat_wf = max(0.0, b + a * i)
                abs_err = abs(y - y_hat_wf)
                erros.append(abs_err)
            ws.append(
                [
                    semana,
                    i,
                    y,
                    round(y_hat_full, 4),
                    round(y - y_hat_full, 4),
                    em_teste,
                    None if y_hat_wf is None else round(y_hat_wf, 4),
                    None if abs_err is None else round(abs_err, 4),
                ]
            )
        prox = max(0.0, b_full + a_full * len(valores))
        mae = sum(erros) / len(erros) if erros else None
        resumo.append(
            [
                pid,
                nomes[pid],
                round(b_full, 4),
                round(a_full, 4),
                None if mae is None else round(mae, 4),
                round(prox, 4),
            ]
        )

    nota = wb.create_sheet("README")
    nota["A1"] = (
        "Planilha de sala — mínimos quadrados na série vendas_semanais.csv. "
        "y_hat_completo usa o ajuste em todas as 16 semanas; "
        "y_hat_walkforward no teste refaz o ajuste só com o passado. "
        "Dados sintéticos. Regenerar: uv run python scripts/gerar_planilha_mq_demanda.py"
    )
    wb.save(SAIDA)
    print(f"Escreveu {SAIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
