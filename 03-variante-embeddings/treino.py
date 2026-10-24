"""Baixa encoder pretrained, monta textos do catálogo, guarda artefato no BentoML."""

from __future__ import annotations

import json
import pickle
from pathlib import Path

import bentoml
import numpy as np
from sentence_transformers import SentenceTransformer

from textos import texto_produto

DADOS = Path(__file__).resolve().parent / "dados" / "catalogo.json"
ARTEFATO = "model.pkl"
MODELO = "recomendador-embed"
MODELO_HF = "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"


def main() -> None:
    catalogo = json.loads(DADOS.read_text(encoding="utf-8"))
    produtos = {p["id"]: p for p in catalogo["produtos"]}
    ids = sorted(produtos)
    textos = {pid: texto_produto(produtos[pid]) for pid in ids}

    # Baixa (ou usa cache HF) e aquece o encoder — o serve carrega o mesmo id.
    encoder = SentenceTransformer(MODELO_HF)
    lista_textos = [textos[pid] for pid in ids]
    embeddings = encoder.encode(
        lista_textos,
        normalize_embeddings=True,
        convert_to_numpy=True,
    )
    embeddings = np.asarray(embeddings, dtype=np.float32)

    artefato = {
        "produtos": produtos,
        "textos": textos,
        "ids_ordem": ids,
        # Matriz gravada para auditoria/repro; o serviço re-encoda de propósito
        # (beat didático: neural também na inferência — ver service.py).
        "embeddings": embeddings,
        "modelo_hf": MODELO_HF,
        "estrategia": "similaridade_semantica",
    }

    with bentoml.models.create(
        MODELO,
        labels={
            "aula": "recomendador-bentoml",
            "variante": "embeddings",
            "modelo_hf": MODELO_HF,
        },
        metadata={
            "n_produtos": len(produtos),
            "estrategia": artefato["estrategia"],
            "modelo_hf": MODELO_HF,
            "dim_embedding": int(embeddings.shape[1]),
        },
    ) as model:
        Path(model.path_of(ARTEFATO)).write_bytes(pickle.dumps(artefato))
        tag = model.tag

    print(f"produtos     {len(produtos)}")
    print(f"modelo_hf    {MODELO_HF}")
    print(f"dim          {embeddings.shape[1]}")
    print(f"tag store    {tag}")


if __name__ == "__main__":
    main()
