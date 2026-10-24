"""Lê catálogo + demografia, calcula pop/cooc/afinidade por faixa, guarda no BentoML."""

from __future__ import annotations

import json
import pickle
from collections import defaultdict
from pathlib import Path

import bentoml

DADOS = Path(__file__).resolve().parent / "dados" / "catalogo.json"
ARTEFATO = "model.pkl"
MODELO = "recomendador-demo"


def _cooc(cestas: list[list[str]]) -> dict[str, dict[str, float]]:
    conta: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for cesta in cestas:
        ids = list(dict.fromkeys(cesta))
        for i, a in enumerate(ids):
            for b in ids[i + 1 :]:
                conta[a][b] += 1.0
                conta[b][a] += 1.0
    cooc: dict[str, dict[str, float]] = {}
    for a, vizinhos in conta.items():
        m = max(vizinhos.values()) if vizinhos else 1.0
        cooc[a] = {b: v / m for b, v in vizinhos.items()}
    return cooc


def _pop_por_faixa(
    clientes: dict[str, dict],
    compras: list[dict],
    produto_ids: list[str],
) -> dict[str, dict[str, float]]:
    """Popularidade do produto dentro de cada faixa_etaria (0…1 por faixa)."""
    bruto: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for compra in compras:
        cliente = clientes.get(compra["cliente_id"])
        if not cliente:
            continue
        faixa = cliente["faixa_etaria"]
        for pid in compra["itens"]:
            bruto[faixa][pid] += 1.0

    pop_faixa: dict[str, dict[str, float]] = {}
    for faixa, contagens in bruto.items():
        m = max(contagens.values()) if contagens else 1.0
        pop_faixa[faixa] = {
            pid: contagens.get(pid, 0.0) / m for pid in produto_ids
        }
    return pop_faixa


def main() -> None:
    catalogo = json.loads(DADOS.read_text(encoding="utf-8"))
    produtos = {p["id"]: p for p in catalogo["produtos"]}
    clientes = {c["id"]: c for c in catalogo["clientes"]}
    pedidos_brutos = {pid: float(p["pedidos"]) for pid, p in produtos.items()}
    max_pedidos = max(pedidos_brutos.values()) or 1.0
    pop = {pid: n / max_pedidos for pid, n in pedidos_brutos.items()}
    cooc = _cooc(catalogo["cestas"])
    pop_faixa = _pop_por_faixa(clientes, catalogo["compras"], list(produtos))

    artefato = {
        "produtos": produtos,
        "clientes": clientes,
        "pedidos_brutos": pedidos_brutos,
        "pop": pop,
        "cooc": cooc,
        "pop_faixa": pop_faixa,
        "estrategia": "tecnica_pop_cooc_demografia",
        "pesos": {"pop": 0.45, "cooc": 0.25, "demo": 0.30},
    }

    with bentoml.models.create(
        MODELO,
        labels={
            "aula": "recomendador-bentoml",
            "variante": "demografica",
            "regra": "tecnica+pop+cooc+demo",
        },
        metadata={
            "n_produtos": len(produtos),
            "n_clientes": len(clientes),
            "n_compras": len(catalogo["compras"]),
            "estrategia": artefato["estrategia"],
        },
    ) as model:
        Path(model.path_of(ARTEFATO)).write_bytes(pickle.dumps(artefato))
        tag = model.tag

    print(f"produtos   {len(produtos)}")
    print(f"clientes   {len(clientes)}")
    print(f"tag store  {tag}")


if __name__ == "__main__":
    main()
