# RAG — FTS e resposta ancorada

```bash
uv run python scripts/demo_rag_fts.py --indexar
uv run python scripts/demo_rag_fts.py "devolução frete"
uv run python scripts/demo_rag_ancorar.py
uv run python scripts/gerar_figuras_rag.py
```

`fts.sqlite` é local (gitignored). Tutorial:
[`../tutorial-rag-20261026.md`](../tutorial-rag-20261026.md).
