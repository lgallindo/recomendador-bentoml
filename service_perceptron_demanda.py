"""Endpoint mínimo: previsão LMS a partir dos pesos salvos do painel (p01)."""

from __future__ import annotations

import json
from pathlib import Path

import bentoml

PESOS = Path(__file__).resolve().parent / "material" / "bi-demanda-perceptron" / "pesos_p01.json"


@bentoml.service(resources={"cpu": "1"})
class PrevisaoLmsDemanda:
    """Lê bias e inclinação gravados por scripts/gerar_bi_demanda_perceptron.py."""

    def __init__(self) -> None:
        if not PESOS.is_file():
            raise FileNotFoundError(
                f"Gere os pesos antes: uv run python scripts/gerar_bi_demanda_perceptron.py ({PESOS})"
            )
        self.pesos = json.loads(PESOS.read_text(encoding="utf-8"))

    @bentoml.api
    def prever(self, indice_semana: int) -> dict:
        """Previsão contínua ŷ = bias + inclinação × t, com piso em zero.

        indice_semana: t=0 é a primeira semana do CSV; t=16 é a próxima após o histórico.
        """
        bias = float(self.pesos["bias"])
        inclinacao = float(self.pesos["inclinacao"])
        escala = float(self.pesos.get("escala") or 1.0)
        bruto = bias + inclinacao * (float(indice_semana) / escala)
        return {
            "product_id": self.pesos["product_id"],
            "indice_semana": indice_semana,
            "previsao_bruta": bruto,
            "previsao": max(0.0, bruto),
            "bias": bias,
            "inclinacao": inclinacao,
            "escala": escala,
        }
