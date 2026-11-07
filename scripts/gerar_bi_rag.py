"""Gere `material/bi-rag/dados.js` para o explorador de recuperação e RAG.

O explorador recalcula BM25 no navegador sobre o corpus embutido; FTS5 e
llmwiki entram como rankings já calculados para as perguntas prontas.
Rode antes `uv run python scripts/avaliar_rag.py`.

Uso (raiz do repositório):

    uv run python scripts/gerar_bi_rag.py
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from avaliar_rag import B, K1, SAIDA, Bm25, avaliar, carregar_corpus, tokenizar  # noqa: E402
from demo_rag_ancorar import INSTRUCAO, trecho_bm25  # noqa: E402
from demo_rag_fts import _STOP  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
PAINEL = RAIZ / "material" / "bi-rag"
EXTRA = "devolução frete Tracunhaém"


def com_trechos(ranking: list[dict], consulta: str) -> list[dict]:
    termos = tokenizar(consulta)
    return [
        {
            "path": h["path"],
            "score": h.get("score"),
            "snippet": (h.get("snippet") or trecho_bm25(h["path"], termos))
            .replace("\n", " ")
            .strip(),
        }
        for h in ranking
    ]


def main() -> None:
    avaliacao = avaliar()
    SAIDA.write_text(json.dumps(avaliacao, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    corpus = carregar_corpus()
    bm25 = Bm25(corpus)
    perguntas = []
    for q in avaliacao["perguntas"]:
        item = {k: q[k] for k in ("id", "pergunta", "relevantes", "subperguntas")}
        item["precalculado"] = {
            nome: {
                estrategia: com_trechos(v[estrategia]["ranking"], q["pergunta"])
                for estrategia in ("inteira", "subperguntas")
            }
            for nome, v in q["recuperadores"].items()
            if nome != "bm25"
        }
        item["bm25_python"] = [
            {"path": h["path"], "score": h["score"]} for h in bm25.ranquear(q["pergunta"])
        ]
        perguntas.append(item)
    # Consulta curta usada no tutorial llmwiki (sem conjunto-ouro próprio)
    extra_rec = {
        "id": "x1",
        "pergunta": EXTRA,
        "relevantes": ["devolucao.md", "frete.md"],
        "subperguntas": ["devolução", "frete Tracunhaém"],
        "precalculado": {},
        "bm25_python": [
            {"path": h["path"], "score": h["score"]} for h in bm25.ranquear(EXTRA)
        ],
    }
    perguntas.append(extra_rec)

    dados = {
        "origem": "material/mini-wiki-rag/",
        "llmwiki_versao": avaliacao["llmwiki_versao"],
        "k1": K1,
        "b": B,
        "stopwords": sorted(_STOP),
        "instrucao": INSTRUCAO,
        "paginas": [
            {"path": p, **{k: d[k] for k in ("title", "description", "tags", "corpo",
                                               "pesquisavel")}}
            for p, d in corpus.items()
        ],
        "perguntas": perguntas,
        "resumo_python": avaliacao["resumo"],
    }
    PAINEL.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.BI_RAG = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"→ {(PAINEL / 'dados.js').relative_to(RAIZ)} ({len(corpus)} páginas, "
          f"{len(perguntas)} perguntas prontas)")


if __name__ == "__main__":
    main()
