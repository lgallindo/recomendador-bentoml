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
        pagina = produto_na_pagina
        if pagina not in produtos:
            return {
                "erro": "produto_inexistente",
                "produto_na_pagina": pagina,
                "items": [],
            }

        excluir_set = set(excluir or [])
        excluir_set.add(pagina)
        atual = produtos[pagina]
        tecnica = atual["tecnica"]
        pedidos_brutos = self.artefato["pedidos_brutos"]
        pop = self.artefato["pop"]
        cooc_pagina = self.artefato["cooc"].get(pagina, {})

        candidatos = [
            pid
            for pid, p in produtos.items()
            if p["tecnica"] == tecnica and pid not in excluir_set
        ]
        candidatos.sort(
            key=lambda pid: (pedidos_brutos[pid], cooc_pagina.get(pid, 0.0)),
            reverse=True,
        )

        escolhidos: list[str] = candidatos[: max(limite, 0)]
        complemento_usado = False

        if len(escolhidos) < limite:
            complemento_usado = True
            resto = [
                pid
                for pid in sorted(produtos, key=lambda x: pedidos_brutos[x], reverse=True)
                if pid not in excluir_set and pid not in escolhidos
            ]
            escolhidos.extend(resto[: limite - len(escolhidos)])

        items = []
        for rank, pid in enumerate(escolhidos, start=1):
            p = produtos[pid]
            mesma_tec = p["tecnica"] == tecnica
            score = (
                (0.7 * pop[pid] + 0.3 * cooc_pagina.get(pid, 0.0))
                if mesma_tec
                else 0.5 * pop[pid]
            )
            items.append(
                {
                    "product_id": pid,
                    "nome": p["nome"],
                    "tecnica": p["tecnica"],
                    "regiao": p["regiao"],
                    "score": round(score, 4),
                    "reason": "mesma_tecnica" if mesma_tec else "complemento_popularidade",
                    "rank": rank,
                }
            )

        return {
            "items": items,
            "strategy": self.artefato["estrategia"],
            "complemento_usado": complemento_usado,
            "produto_na_pagina": {
                "product_id": pagina,
                "nome": atual["nome"],
                "tecnica": tecnica,
                "regiao": atual["regiao"],
            },
            "modelo": str(modelo.tag),
        }
