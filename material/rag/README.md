# RAG — FTS e resposta ancorada

```bash
uv run python scripts/demo_rag_fts.py --indexar
uv run python scripts/demo_rag_fts.py "devolução frete"
uv run python scripts/demo_rag_ancorar.py
uv run python scripts/gerar_figuras_rag.py
```

`fts.sqlite` é local (gitignored). Tutorial:
[`../tutorial-rag-20261026.md`](../tutorial-rag-20261026.md).

## Avaliação e variantes

| Arquivo | Origem |
| --- | --- |
| `perguntas-ouro.json` | Conjunto-ouro: seis perguntas, páginas relevantes e subperguntas |
| `avaliacao_rag.json` | `uv run python scripts/avaliar_rag.py` — rankings e recall@k de FTS5, BM25 e llmwiki |
| `resultado_rag_ancorado.json` | `demo_rag_ancorar.py` sem opções (FTS5, k = 3) |
| `resultado_rag_bm25.json` | `demo_rag_ancorar.py --recuperador bm25 --saida material/rag/resultado_rag_bm25.json` |
| `resultado_rag_subperguntas.json` | `demo_rag_ancorar.py --subpergunta "prazo de devolução" --subpergunta "frete para Tracunhaém" --saida material/rag/resultado_rag_subperguntas.json` |

O explorador [`../bi-rag/`](../bi-rag/README.md) usa esses dados
(`uv run python scripts/gerar_bi_rag.py`).
