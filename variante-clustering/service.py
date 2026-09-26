"""Serve recomendações intercalando cesta (co-ocorrência) e cluster hierárquico."""

from __future__ import annotations

import pickle
from pathlib import Path

import bentoml

MODELO = "recomendador-cluster:latest"
modelo = bentoml.models.get(MODELO)
ARTEFATO = "model.pkl"


def _proximo(fila: list[str], usados: set[str]) -> str | None:
    for pid in fila:
        if pid not in usados:
            return pid
    return None


@bentoml.service(resources={"cpu": "1"})
class RecomendadorCluster:

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
        """Lista intercalada: ranks ímpares via cesta, pares via cluster.

        Se a fila da vez estiver vazia, pega da outra e mantém o reason verdadeiro.
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
        usados = set(excluir_set)
        usados.add(pagina)

        pop = self.artefato["pop"]
        cooc_pagina = self.artefato["cooc"].get(pagina, {})
        cluster_de = self.artefato["cluster_de"]
        cluster_pagina = cluster_de[pagina]
        membros = self.artefato["membros_do_cluster"][cluster_pagina]

        fila_cesta = sorted(
            (pid for pid in produtos if pid not in usados),
            key=lambda pid: (-cooc_pagina.get(pid, 0.0), pid),
        )
        fila_cluster = sorted(
            (pid for pid in membros if pid not in usados),
            key=lambda pid: (-pop[pid], pid),
        )

        escolhidos: list[dict] = []
        preferidos_ok = 0
        rank = 1
        while len(escolhidos) < max(limite, 0):
            quer_cesta = rank % 2 == 1
            if quer_cesta:
                pid = _proximo(fila_cesta, usados)
                reason = "cesta"
                if pid is None:
                    pid = _proximo(fila_cluster, usados)
                    reason = "cluster"
            else:
                pid = _proximo(fila_cluster, usados)
                reason = "cluster"
                if pid is None:
                    pid = _proximo(fila_cesta, usados)
                    reason = "cesta"
            if pid is None:
                break
            if (quer_cesta and reason == "cesta") or (
                (not quer_cesta) and reason == "cluster"
            ):
                preferidos_ok += 1
            usados.add(pid)
            p = produtos[pid]
            item = {
                "product_id": pid,
                "nome": p["nome"],
                "tecnica": p["tecnica"],
                "regiao": p["regiao"],
                "reason": reason,
                "cluster_id": cluster_de[pid],
                "rank": rank,
                "cooc": round(cooc_pagina.get(pid, 0.0), 4),
                "pop": round(pop[pid], 4),
                "score": round(
                    cooc_pagina.get(pid, 0.0) if reason == "cesta" else pop[pid],
                    4,
                ),
            }
            escolhidos.append(item)
            rank += 1

        atual = produtos[pagina]
        return {
            "items": escolhidos,
            "strategy": self.artefato["estrategia"],
            "intercalacao_completa": preferidos_ok == len(escolhidos)
            and len(escolhidos) == limite,
            "produto_na_pagina": {
                "product_id": pagina,
                "nome": atual["nome"],
                "tecnica": atual["tecnica"],
                "regiao": atual["regiao"],
                "cluster_id": cluster_pagina,
            },
            "modelo": str(modelo.tag),
            "n_clusters": self.artefato["n_clusters"],
        }
