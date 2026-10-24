"""Valida as vendas semanais sintéticas contra os totais do catálogo."""

from __future__ import annotations

import csv
import json
from collections import defaultdict
from datetime import date, timedelta
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
CATALOGO = RAIZ / "dados" / "catalogo.json"
VENDAS = RAIZ / "dados" / "vendas_semanais.csv"
PRIMEIRA_SEMANA = date(2026, 6, 22)
NUM_SEMANAS = 16
CAMPOS = ("week_start", "product_id", "order_line_count")


def validar() -> None:
    catalogo = json.loads(CATALOGO.read_text(encoding="utf-8"))
    produtos = {produto["id"]: produto["pedidos"] for produto in catalogo["produtos"]}
    semanas = [PRIMEIRA_SEMANA + timedelta(weeks=offset) for offset in range(NUM_SEMANAS)]
    somas: dict[str, int] = defaultdict(int)
    encontrados: set[tuple[date, str]] = set()

    with VENDAS.open(newline="", encoding="utf-8") as arquivo:
        leitor = csv.DictReader(arquivo)
        if leitor.fieldnames != list(CAMPOS):
            raise ValueError(f"Cabeçalho inválido: esperado {', '.join(CAMPOS)}")

        for numero_linha, linha in enumerate(leitor, start=2):
            try:
                semana = date.fromisoformat(linha["week_start"])
                quantidade = int(linha["order_line_count"])
            except (TypeError, ValueError) as exc:
                raise ValueError(f"Dados inválidos na linha {numero_linha}: {exc}") from exc

            produto = linha["product_id"]
            if semana not in semanas or semana.weekday() != 0:
                raise ValueError(f"Semana inválida na linha {numero_linha}: {semana}")
            if produto not in produtos:
                raise ValueError(f"Produto inexistente na linha {numero_linha}: {produto}")
            if quantidade < 0:
                raise ValueError(f"Contagem negativa na linha {numero_linha}")
            chave = (semana, produto)
            if chave in encontrados:
                raise ValueError(f"Linha duplicada na linha {numero_linha}: {semana}, {produto}")
            encontrados.add(chave)
            somas[produto] += quantidade

    esperado = {(semana, produto) for semana in semanas for produto in produtos}
    faltantes = esperado - encontrados
    extras = encontrados - esperado
    if faltantes or extras:
        raise ValueError(
            f"Grade semanal incompleta: {len(faltantes)} linhas ausentes, "
            f"{len(extras)} linhas extras"
        )

    divergencias = {
        produto: (total, somas[produto])
        for produto, total in produtos.items()
        if somas[produto] != total
    }
    if divergencias:
        detalhes = ", ".join(
            f"{produto}: catálogo={catalogo_total}, semanas={semanal_total}"
            for produto, (catalogo_total, semanal_total) in divergencias.items()
        )
        raise ValueError(f"Totais divergentes: {detalhes}")

    print(
        f"OK: {len(encontrados)} linhas, {len(produtos)} produtos, "
        f"{len(semanas)} semanas; totais reconciliados com {CATALOGO.name}."
    )


if __name__ == "__main__":
    try:
        validar()
    except ValueError as erro:
        raise SystemExit(f"Erro ao validar vendas semanais: {erro}") from erro
