"""Serve recomendações: mesma técnica + popularidade, com complemento por pedidos."""

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
        produto_na_pagina: str,
        limite: int = 4,
        excluir: list[str] | None = None,
    ) -> dict:
        """Devolve outros produtos a partir do produto que o cliente está vendo.

        Entrada:
          - produto_na_pagina: id do produto aberto na tela (ex.: \"p01\")
          - limite: quantos produtos sugerir (padrão 4)
          - excluir: ids que não devem voltar (já vistos / já comprados)
        """
        produtos = self.artefato["produtos"]
        if produto_na_pagina not in produtos:
            return {
                "erro": "produto_inexistente",
                "produto_na_pagina": produto_na_pagina,
                "items": [],
            }

        excluidos = set(excluir or [])
        excluidos.add(produto_na_pagina)
        atual = produtos[produto_na_pagina]
        tecnica = atual["tecnica"]
        pop = self.artefato["popularidade"]
        pop_n = self.artefato["popularidade_norm"]
        sim = self.artefato["similaridade"].get(produto_na_pagina, {})

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
        usou_complemento = False

        if len(escolhidos) < limite:
            usou_complemento = True
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
                    "reason": "mesma_tecnica" if mesma_tec else "complemento_popularidade",
                    "rank": rank,
                }
            )

        return {
            "items": items,
            "strategy": self.artefato["estrategia"],
            "complemento_usado": usou_complemento,
            "produto_na_pagina": {
                "product_id": produto_na_pagina,
                "nome": atual["nome"],
                "tecnica": tecnica,
                "regiao": atual["regiao"],
            },
            "modelo": str(modelo.tag),
        }
