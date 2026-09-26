"""Serve recomendações: mesma técnica + popularidade, com fallback."""

from __future__ import annotations

import pickle
from pathlib import Path

import bentoml

modelo = bentoml.models.get("recomendador:latest")
ARTEFATO = "model.pkl"


@bentoml.service(resources={"cpu": "1"})
class Recomendador:

    def __init__(self) -> None:
        caminho = Path(modelo.path_of(ARTEFATO))
        self.artefato = pickle.loads(caminho.read_bytes())

    @bentoml.api
    def recomendar(
        self,
        produto_ancora: str,
        limite: int = 4,
        excluir: list[str] | None = None,
    ) -> dict:
        """Baseline de recomendação (mesma técnica + popularidade).

        Entrada:
          - produto_ancora: id do produto na ficha
          - limite: quantos itens devolver (padrão 4)
          - excluir: ids já vistos / já comprados na sessão
        """
        produtos = self.artefato["produtos"]
        if produto_ancora not in produtos:
            return {
                "erro": "produto_ancora_inexistente",
                "produto_ancora": produto_ancora,
                "items": [],
            }

        excluidos = set(excluir or [])
        excluidos.add(produto_ancora)
        ancora = produtos[produto_ancora]
        tecnica = ancora["tecnica"]
        pop = self.artefato["popularidade"]
        pop_n = self.artefato["popularidade_norm"]
        sim = self.artefato["similaridade"].get(produto_ancora, {})

        mesma = [
            pid
            for pid, p in produtos.items()
            if p["tecnica"] == tecnica and pid not in excluidos
        ]
        mesma.sort(
            key=lambda pid: (pop[pid], sim.get(pid, 0.0)),
            reverse=True,
        )

        escolhidos: list[str] = mesma[: max(limite, 0)]
        fallback = False

        if len(escolhidos) < limite:
            fallback = True
            resto = [
                pid
                for pid in sorted(produtos, key=lambda x: pop[x], reverse=True)
                if pid not in excluidos and pid not in escolhidos
            ]
            escolhidos.extend(resto[: limite - len(escolhidos)])

        items = []
        for rank, pid in enumerate(escolhidos, start=1):
            p = produtos[pid]
            mesma_tec = p["tecnica"] == tecnica
            items.append(
                {
                    "product_id": pid,
                    "nome": p["nome"],
                    "tecnica": p["tecnica"],
                    "regiao": p["regiao"],
                    "score": round(
                        (0.7 * pop_n[pid] + 0.3 * sim.get(pid, 0.0))
                        if mesma_tec
                        else 0.5 * pop_n[pid],
                        4,
                    ),
                    "reason": "mesma_tecnica" if mesma_tec else "fallback_popularidade",
                    "rank": rank,
                }
            )

        return {
            "items": items,
            "strategy": self.artefato["estrategia"],
            "fallback_used": fallback,
            "anchor": {
                "product_id": produto_ancora,
                "tecnica": tecnica,
                "regiao": ancora["regiao"],
            },
            "modelo": str(modelo.tag),
        }
