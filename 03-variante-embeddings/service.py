"""Serve recomendações por similaridade semântica (encoder neural no pipeline)."""

from __future__ import annotations

import pickle
from pathlib import Path

import bentoml
import numpy as np
from sentence_transformers import SentenceTransformer

from textos import texto_produto

MODELO = "recomendador-embed:latest"
ARTEFATO = "model.pkl"


@bentoml.service(resources={"cpu": "1"})
class RecomendadorEmbed:
    # Artefato local do `just treino` (pickle só do model store da aula).
    bento_model = bentoml.models.BentoModel(MODELO)

    def __init__(self) -> None:
        caminho = Path(self.bento_model.path_of(ARTEFATO))
        self.artefato = pickle.loads(caminho.read_bytes())
        self.modelo_hf = self.artefato["modelo_hf"]
        # Beat didático: o encoder roda de novo na inferência (não só no treino).
        self.encoder = SentenceTransformer(self.modelo_hf)
        produtos = self.artefato["produtos"]
        self.ids_ordem = list(self.artefato["ids_ordem"])
        textos_cat = [self.artefato["textos"][pid] for pid in self.ids_ordem]
        self.emb_catalogo = self.encoder.encode(
            textos_cat,
            normalize_embeddings=True,
            convert_to_numpy=True,
        )
        self.emb_catalogo = np.asarray(self.emb_catalogo, dtype=np.float32)
        self.produtos = produtos

    @bentoml.api
    def recomendar(
        self,
        produto_na_pagina: str,
        limite: int = 4,
        excluir: list[str] | None = None,
    ) -> dict:
        """Top-k por cosseno entre o texto da página e o catálogo.

        Entrada igual ao baseline: produto_na_pagina, limite, excluir.
        """
        pagina = produto_na_pagina
        if pagina not in self.produtos:
            return {
                "erro": "produto_inexistente",
                "produto_na_pagina": pagina,
                "items": [],
            }

        excluir_set = set(excluir or [])
        excluir_set.add(pagina)
        atual = self.produtos[pagina]
        texto_pagina = texto_produto(atual)

        emb_pagina = self.encoder.encode(
            [texto_pagina],
            normalize_embeddings=True,
            convert_to_numpy=True,
        )
        emb_pagina = np.asarray(emb_pagina, dtype=np.float32).reshape(-1)

        scores = self.emb_catalogo @ emb_pagina

        candidatos = [
            (self.ids_ordem[i], float(scores[i]))
            for i in range(len(self.ids_ordem))
            if self.ids_ordem[i] not in excluir_set
        ]
        candidatos.sort(key=lambda t: (-t[1], t[0]))
        escolhidos = candidatos[: max(limite, 0)]

        items = []
        for rank, (pid, score) in enumerate(escolhidos, start=1):
            p = self.produtos[pid]
            items.append(
                {
                    "product_id": pid,
                    "nome": p["nome"],
                    "tecnica": p["tecnica"],
                    "regiao": p["regiao"],
                    "score": round(score, 4),
                    "reason": "similaridade_semantica",
                    "rank": rank,
                }
            )

        return {
            "items": items,
            "strategy": self.artefato["estrategia"],
            "produto_na_pagina": {
                "product_id": pagina,
                "nome": atual["nome"],
                "tecnica": atual["tecnica"],
                "regiao": atual["regiao"],
                "texto": texto_pagina,
            },
            "modelo": str(self.bento_model.tag),
            "modelo_hf": self.modelo_hf,
        }
