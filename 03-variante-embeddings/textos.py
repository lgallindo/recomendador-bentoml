"""Fórmula única de texto do produto — treino e serviço devem coincidir."""

from __future__ import annotations


def texto_produto(p: dict) -> str:
    """Frase enviada ao encoder: nome + técnica + polo."""
    return f"{p['nome']}. Técnica: {p['tecnica']}. Polo: {p['regiao']}."
