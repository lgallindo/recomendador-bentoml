"""Lê o catálogo, calcula popularidade e co-ocorrência, guarda no BentoML."""

from __future__ import annotations

import json
import pickle
from collections import defaultdict
from pathlib import Path

import bentoml

DADOS = Path(__file__).resolve().parent / "dados" / "catalogo.json"
ARTEFATO = "model.pkl"


def _coocorrencia(cestas: list[list[str]]) -> dict[str, dict[str, float]]:
    """Quantas vezes dois produtos aparecem juntos nas cestas de exemplo."""
    pares: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for cesta in cestas:
        unicos = list(dict.fromkeys(cesta))
        for i, a in enumerate(unicos):
            for b in unicos[i + 1 :]:
                pares[a][b] += 1.0
                pares[b][a] += 1.0
    out: dict[str, dict[str, float]] = {}
    for a, vizinhos in pares.items():
        m = max(vizinhos.values()) if vizinhos else 1.0
        out[a] = {b: v / m for b, v in vizinhos.items()}
    return out


def main() -> None:
    bruto = json.loads(DADOS.read_text(encoding="utf-8"))
    produtos = {p["id"]: p for p in bruto["produtos"]}
    popularidade = {pid: float(p["pedidos"]) for pid, p in produtos.items()}
    max_ped = max(popularidade.values()) or 1.0
    popularidade_norm = {pid: n / max_ped for pid, n in popularidade.items()}
    similaridade = _coocorrencia(bruto["cestas"])

    artefato = {
        "produtos": produtos,
        "popularidade": popularidade,
        "popularidade_norm": popularidade_norm,
        "similaridade": similaridade,
        "estrategia": "mesma_tecnica_mais_pedidos",
    }

    with bentoml.models.create(
        "recomendador",
        labels={"aula": "recomendador-bentoml", "regra": "tecnica+pedidos"},
        metadata={
            "n_produtos": len(produtos),
            "n_cestas": len(bruto["cestas"]),
            "estrategia": artefato["estrategia"],
        },
    ) as model:
        Path(model.path_of(ARTEFATO)).write_bytes(pickle.dumps(artefato))
        tag = model.tag

    print(f"produtos no catálogo  {len(produtos)}")
    print(f"tag no store          {tag}")


if __name__ == "__main__":
    main()
