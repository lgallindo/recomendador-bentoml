# Scripts (`scripts/`)

Dados sintéticos, exploradores BI, demos das aulas e checagens — tudo o que a
turma roda com `uv run python scripts/…`.

| Arquivo | Papel |
| --- | --- |
| [`gerar_dados_credito.py`](gerar_dados_credito.py) | Reproduz 12 cartões e 400 contratos inteiramente sintéticos, independentes do marketplace |
| [`arvore_credito.py`](arvore_credito.py) | Aprende duas árvores; seleciona no desenvolvimento; `--avaliar-teste` revela a avaliação final |
| [`gerar_figuras_credito.py`](gerar_figuras_credito.py) | Reproduz oito figuras com contagens e PDF imprimível de cartões |
| [`test_credito.py`](test_credito.py) | Verifica contagens manuais, integridade dos dados e isolamento do teste |
| [`gerar_bi_credito.py`](gerar_bi_credito.py) | Reproduz `dados.js` do explorador de crédito e as figuras `bi-credito-*.png`; confere contra `relatorio.json` |
| [`minerar_logs_autenticacao.py`](minerar_logs_autenticacao.py) | Reconstrói sessões e exporta regras e avaliação fixa; `--cenario validacao` seleciona a base separada |
| [`gerar_logs_autenticacao.py`](gerar_logs_autenticacao.py) | Reproduz os logs fictícios independentes do marketplace |
| [`test_logs_autenticacao.py`](test_logs_autenticacao.py) | Confere fixtures, métricas, duplicatas e diagnósticos do parser |
| [`gerar_bi_logs.py`](gerar_bi_logs.py) | Reproduz `dados.js` do explorador de logs; confere as regras contra os CSVs |
| [`gerar_figuras_logs.py`](gerar_figuras_logs.py) | Figuras do tutorial de logs: pipeline, matriz de sessões, dispersão e descoberta vs validação |
| [`gerar_figuras_poisson.py`](gerar_figuras_poisson.py) | Figuras do tutorial de Poisson: formas da PMF, ligação log, cauda de estoque, log-perda e PIT |
| [`gerar_bi_associacao.py`](gerar_bi_associacao.py) | Reproduz dados do [explorador BI](../material/bi/README.md) e três figuras: dispersão, matriz e rede |
| [`gerar_bi_demanda.py`](gerar_bi_demanda.py) | Reproduz `dados.js` do [explorador de demanda](../material/bi-demanda/README.md) e figuras `bi-demanda-*.png` |
| [`gerar_figuras_associacao.py`](gerar_figuras_associacao.py) | Reproduz o diagrama de inclusão IA/ML, a matriz de cestas e a comparação de descoberta com avaliação separada |
| [`minerar_regras_associacao.py`](minerar_regras_associacao.py) | Minera as cestas e gera o CSV da [aula de regras de associação](../material/tutorial-regras-associacao-20261017.md), sem dependências externas |
| [`validar_vendas_semanais.py`](validar_vendas_semanais.py) | Confere a série sintética semanal contra os totais do catálogo |
| [`demo_treino_mlp_demanda.py`](demo_treino_mlp_demanda.py) | MLP rasa e corridas variando um fator; JSON e curvas em `material/redes/` |
| [`demo_deep_vs_rasa.py`](demo_deep_vs_rasa.py) | Compara profundidades (1–4 camadas, 5 sementes) na série p01 |
| [`demo_fine_tuning_mlp.py`](demo_fine_tuning_mlp.py) | Pré-treino multi-produto, fine-tune da cabeça em p01 e checagem de esquecimento |
| [`demo_langchain_loja.py`](demo_langchain_loja.py) | Chain mínima no catálogo (puro ou `--with langchain-core`); `--lote` grava os rastros |
| [`demo_rag_fts.py`](demo_rag_fts.py) | Índice FTS5 da mini-wiki |
| [`demo_rag_ancorar.py`](demo_rag_ancorar.py) | Resposta ancorada com escolha de recuperador, k e subperguntas |
| [`gerar_figuras_rag.py`](gerar_figuras_rag.py) | Figuras do RAG e do llmwiki (loop, escada, índice invertido, recall) |
| [`demo_mem0_preferencias.py`](demo_mem0_preferencias.py) | add/search/update/delete de preferências (store JSON); `--roteiro` grava a linha do tempo |
| [`avaliar_rag.py`](avaliar_rag.py) | Recall@k e precisão@k de FTS5 e BM25 no conjunto-ouro da mini-wiki |
| [`demo_litellm_sdk.py`](demo_litellm_sdk.py) | Uma completion via SDK LiteLLM (`uv run --with litellm`) |
| [`demo_litellm_proxy.py`](demo_litellm_proxy.py) | Cliente stdlib do proxy LiteLLM; `--offline` mostra a requisição |
| [`gerar_bi_redes.py`](gerar_bi_redes.py) · [`gerar_bi_chain.py`](gerar_bi_chain.py) · [`gerar_bi_rag.py`](gerar_bi_rag.py) · [`gerar_bi_memoria.py`](gerar_bi_memoria.py) · [`gerar_bi_llm_local.py`](gerar_bi_llm_local.py) | Reproduzem `dados.js` dos exploradores correspondentes em `material/bi-*/` |

Geradores de **figuras/diagramas** das aulas novas de redes, LangChain, memória,
Open WebUI e LiteLLM ficam no `.local/scripts/` do instrutor (git exclude), não
neste diretório versionado. As PNGs já publicadas estão em `material/imagens/`.

**Como rodar os scripts:** na raiz do repo, prefira
`uv run python scripts/<nome>.py` (mesmo interpretador do projeto). Testes que
importam irmãos (`from minerar_…`) também funcionam com
`uv run python -m unittest discover -s scripts`. Playwright dos testes web:
`uv run --with playwright …` (opcional; não está no manifesto base).

Para validar a base de demanda, rode `uv run python scripts/validar_vendas_semanais.py`
na raiz do projeto.

Deck HTML da aula: [`../slides/README.md`](../slides/README.md).

Para gerar o relatório de associação, rode na raiz:

```bash
python3 scripts/minerar_regras_associacao.py
```

Padrões: suporte ≥ 0,20, confiança ≥ 0,60 e lift > 1. Opções em `--help`.
O script enumera conjuntos observados; use apenas com cestas pequenas.
