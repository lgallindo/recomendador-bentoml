"""Gera planilha de sala para médias móveis a partir de vendas_semanais.csv.

Semanas 1–16: cópia literal do CSV. Semanas 17–104: bootstrap reproduzível
por produto (seed fixa), contagens não negativas compatíveis com a série.
"""

from __future__ import annotations

import csv
import json
import random
from datetime import date, timedelta
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.worksheet import Worksheet

RAIZ = Path(__file__).resolve().parents[1]
CSV_PATH = RAIZ / "dados" / "vendas_semanais.csv"
CATALOGO_PATH = RAIZ / "dados" / "catalogo.json"
OUT_PATH = RAIZ / "material" / "planilha-media-movel-demanda.xlsx"

N_WEEKS = 104  # >= 100; 16 do CSV + 88 de extensão
CSV_WEEKS = 16
WINDOW = 4

FONT = Font(name="Arial", size=11)
FONT_BOLD = Font(name="Arial", size=11, bold=True)
FONT_TITLE = Font(name="Arial", size=14, bold=True)
FONT_SMALL = Font(name="Arial", size=10, italic=True)
FILL_HEADER = PatternFill("solid", fgColor="1F4E79")
FONT_HEADER = Font(name="Arial", size=11, bold=True, color="FFFFFF")
FILL_CSV = PatternFill("solid", fgColor="E2EFDA")
FILL_EXT = PatternFill("solid", fgColor="FFF2CC")
FILL_TRABALHO = PatternFill("solid", fgColor="DDEBF7")
FILL_GABARITO = PatternFill("solid", fgColor="F2F2F2")
THIN = Border(
    left=Side(style="thin", color="B0B0B0"),
    right=Side(style="thin", color="B0B0B0"),
    top=Side(style="thin", color="B0B0B0"),
    bottom=Side(style="thin", color="B0B0B0"),
)


def load_series() -> tuple[dict[str, str], dict[str, list[tuple[date, int]]]]:
    catalogo = json.loads(CATALOGO_PATH.read_text(encoding="utf-8"))
    nomes = {p["id"]: p["nome"] for p in catalogo["produtos"]}
    by: dict[str, list[tuple[date, int]]] = {pid: [] for pid in nomes}
    with CSV_PATH.open(encoding="utf-8") as fh:
        for row in csv.DictReader(fh):
            pid = row["product_id"]
            week = date.fromisoformat(row["week_start"])
            count = int(row["order_line_count"])
            by[pid].append((week, count))
    for pid, series in by.items():
        series.sort(key=lambda item: item[0])
        if len(series) != CSV_WEEKS:
            raise SystemExit(f"{pid}: esperado {CSV_WEEKS} semanas, veio {len(series)}")
    return nomes, by


def extend_series(
    pid: str, series: list[tuple[date, int]], n_weeks: int
) -> list[tuple[date, int, str]]:
    out: list[tuple[date, int, str]] = [
        (week, count, "csv") for week, count in series
    ]
    rng = random.Random(f"planilha-media-movel-v1:{pid}")
    pool = [count for _, count in series]
    last_week = series[-1][0]
    while len(out) < n_weeks:
        last_week = last_week + timedelta(days=7)
        out.append((last_week, rng.choice(pool), "extensao_sintetica"))
    return out


def style_range(ws: Worksheet, cell_range: str, **kwargs) -> None:
    for row in ws[cell_range]:
        for cell in row:
            for key, value in kwargs.items():
                setattr(cell, key, value)


def write_legenda(ws: Worksheet) -> None:
    ws["A1"] = "Planilha de sala — média móvel de demanda"
    ws["A1"].font = FONT_TITLE
    lines = [
        "",
        "Fonte das semanas 1–16: dados/vendas_semanais.csv (cópia literal).",
        "Semanas 17–104: extensão sintética por bootstrap das 16 semanas de cada produto,",
        "  com seed fixa planilha-media-movel-v1:<product_id>. Não fazem parte do CSV.",
        "Uma aba por produto (p01–p12). Nomes vêm de dados/catalogo.json.",
        "",
        "Colunas verdes (C): observado y_t — preencher a lousa a partir daqui.",
        "Colunas cinza (E–J): gabarito com fórmulas (ingênua, MA2–MA5, erros).",
        "Colunas azuis (L–P): espaço em branco para contas à mão na frente da turma.",
        "",
        "Definições (iguais ao tutorial de média móvel):",
        "  previsao_ingenua para a semana t = y_(t-1)",
        "  previsao_MA4 para a semana t = média de y_(t-4), y_(t-3), y_(t-2), y_(t-1)",
        "  erro absoluto = |observado − previsão|",
        "A previsão da semana t usa só semanas anteriores (walk-forward).",
        "",
        "Como usar em sala:",
        "  1. Abra a aba do produto (comece por p01 — Jarro).",
        "  2. Escolha uma linha com origem=csv (linhas 5–20) ou qualquer linha ≥ 9.",
        "  3. Na lousa, some as 4 semanas anteriores e divida por 4; compare com a ingênua.",
        "  4. Confira no gabarito (colunas E–J) sem projetar o gabarito se quiser só a lousa.",
        "",
        f"Arquivo gerado por scripts/gerar_planilha_media_movel.py · N_WEEKS={N_WEEKS}.",
    ]
    for i, line in enumerate(lines, start=2):
        ws[f"A{i}"] = line
        ws[f"A{i}"].font = FONT if line and not line.startswith(" ") else FONT_SMALL
    ws.column_dimensions["A"].width = 110


def write_product_sheet(
    ws: Worksheet,
    pid: str,
    nome: str,
    series: list[tuple[date, int, str]],
) -> None:
    ws["A1"] = f"{pid} — {nome}"
    ws["A1"].font = FONT_TITLE
    ws["A2"] = (
        "Observado = linhas de pedido na semana. Gabarito à direita usa fórmulas. "
        "Colunas azuis são para contas à mão."
    )
    ws["A2"].font = FONT_SMALL

    headers = [
        "n",
        "week_start",
        "observado",
        "origem",
        "previsao_ingenua",
        "previsao_MA2",
        "previsao_MA3",
        "previsao_MA4",
        "previsao_MA5",
        "erro_abs_ingenua",
        "erro_abs_MA4",
        "trabalho_y_t-3",
        "trabalho_y_t-2",
        "trabalho_y_t-1",
        "trabalho_soma_MA4",
        "trabalho_MA4_÷4",
    ]
    header_row = 4
    for col, title in enumerate(headers, start=1):
        cell = ws.cell(header_row, col, title)
        cell.font = FONT_HEADER
        cell.fill = FILL_HEADER
        cell.alignment = Alignment(wrap_text=True, horizontal="center", vertical="center")
        cell.border = THIN

    first = header_row + 1  # 5
    for i, (week, count, origem) in enumerate(series):
        row = first + i
        ws.cell(row, 1, i + 1).font = FONT
        ws.cell(row, 2, week.isoformat()).font = FONT
        obs = ws.cell(row, 3, count)
        obs.font = FONT_BOLD
        obs.fill = FILL_CSV if origem == "csv" else FILL_EXT
        ws.cell(row, 4, origem).font = FONT_SMALL

        # Gabarito — walk-forward formulas
        if i == 0:
            for col in range(5, 12):
                ws.cell(row, col, "").font = FONT
        else:
            # previsao_ingenua = y_{t-1}
            ws.cell(row, 5, f"=C{row - 1}").font = FONT
            # MA2..MA5 need enough history
            for k, col in ((2, 6), (3, 7), (4, 8), (5, 9)):
                if i >= k:
                    start = row - k
                    end = row - 1
                    ws.cell(row, col, f"=AVERAGE(C{start}:C{end})").font = FONT
                else:
                    ws.cell(row, col, "").font = FONT
            ws.cell(row, 10, f"=IF(E{row}=\"\",\"\",ABS(C{row}-E{row}))").font = FONT
            ws.cell(row, 11, f"=IF(H{row}=\"\",\"\",ABS(C{row}-H{row}))").font = FONT

        for col in range(5, 12):
            ws.cell(row, col).fill = FILL_GABARITO
            ws.cell(row, col).border = THIN
            if col >= 6:
                ws.cell(row, col).number_format = "0.00"

        # Trabalho em sala — blank
        for col in range(12, 17):
            cell = ws.cell(row, col, "")
            cell.fill = FILL_TRABALHO
            cell.border = THIN

        for col in range(1, 5):
            ws.cell(row, col).border = THIN

    last = first + len(series) - 1
    summary = last + 2
    ws.cell(summary, 1, "Resumo walk-forward (só linhas com previsão)").font = FONT_BOLD
    # Ingênua existe a partir da 2ª semana; MA4 a partir da 5ª.
    ws.cell(summary + 1, 1, "MAE_ingenua").font = FONT
    ws.cell(summary + 1, 2, f"=AVERAGE(J{first + 1}:J{last})").font = FONT
    ws.cell(summary + 1, 2).number_format = "0.000"
    ws.cell(summary + 2, 1, "MAE_MA4").font = FONT
    ws.cell(summary + 2, 2, f"=AVERAGE(K{first + WINDOW}:K{last})").font = FONT
    ws.cell(summary + 2, 2).number_format = "0.000"
    ws.cell(summary + 3, 1, "n_csv / n_total").font = FONT
    ws.cell(summary + 3, 2, f"{CSV_WEEKS} / {len(series)}").font = FONT
    ws.cell(summary + 5, 1, "Assunção da extensão: bootstrap com reposição das 16 contagens do CSV; seed fixa.").font = FONT_SMALL

    widths = {
        "A": 6,
        "B": 12,
        "C": 11,
        "D": 18,
        "E": 16,
        "F": 12,
        "G": 12,
        "H": 12,
        "I": 12,
        "J": 15,
        "K": 13,
        "L": 14,
        "M": 14,
        "N": 14,
        "O": 16,
        "P": 14,
    }
    for letter, width in widths.items():
        ws.column_dimensions[letter].width = width
    ws.row_dimensions[header_row].height = 36
    ws.freeze_panes = "C5"
    ws.auto_filter.ref = f"A{header_row}:P{last}"


def main() -> None:
    nomes, by = load_series()
    wb = Workbook()
    legenda = wb.active
    legenda.title = "00_Legenda"
    write_legenda(legenda)

    for pid in sorted(nomes):
        series = extend_series(pid, by[pid], N_WEEKS)
        ws = wb.create_sheet(pid)
        write_product_sheet(ws, pid, nomes[pid], series)

    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    wb.save(OUT_PATH)
    print(f"Wrote {OUT_PATH} ({N_WEEKS} weeks × {len(nomes)} products)")


if __name__ == "__main__":
    main()
