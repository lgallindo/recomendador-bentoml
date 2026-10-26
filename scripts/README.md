# Scripts (`scripts/`)

A aula conta uma história no *arco* didático (cena → métricas → cesta →
pipelines…). O README da raiz documenta o sistema por seções técnicas; os slides
seguem o fio narrativo. Este script congela esse arco num HTML reproduzível.

| Arquivo | Papel |
| --- | --- |
| [`gerar_dados_credito.py`](gerar_dados_credito.py) | Reproduz 12 cartões e 400 contratos inteiramente sintéticos, independentes do marketplace |
| [`arvore_credito.py`](arvore_credito.py) | Aprende duas árvores; seleciona no desenvolvimento; `--avaliar-teste` revela a avaliação final |
| [`gerar_figuras_credito.py`](gerar_figuras_credito.py) | Reproduz oito figuras com contagens e PDF imprimível de cartões |
| [`test_credito.py`](test_credito.py) | Verifica contagens manuais, integridade dos dados e isolamento do teste |
| [`minerar_logs_autenticacao.py`](minerar_logs_autenticacao.py) | Reconstrói sessões e exporta regras e avaliação fixa; `--cenario validacao` seleciona a base separada |
| [`gerar_logs_autenticacao.py`](gerar_logs_autenticacao.py) | Reproduz os logs fictícios independentes do marketplace |
| [`test_logs_autenticacao.py`](test_logs_autenticacao.py) | Confere fixtures, métricas, duplicatas e diagnósticos do parser |
| [`gerar_bi_associacao.py`](gerar_bi_associacao.py) | Reproduz dados do [explorador BI](../material/bi/README.md) e três figuras: dispersão, matriz e rede |
| [`gerar_bi_demanda.py`](gerar_bi_demanda.py) | Reproduz `dados.js` do [explorador de demanda](../material/bi-demanda/README.md) e figuras `bi-demanda-*.png` |
| [`gerar_planilha_media_movel.py`](gerar_planilha_media_movel.py) | Gera a planilha de sala com uma aba por produto |
| [`gerar_site_tutorial.py`](gerar_site_tutorial.py) | Gera Pages: associação (`index.html`) e demanda (`demanda/index.html`) com exploradores |
| [`gerar_figuras_associacao.py`](gerar_figuras_associacao.py) | Reproduz o diagrama de inclusão IA/ML, a matriz de cestas e a comparação de descoberta com avaliação separada |
| [`minerar_regras_associacao.py`](minerar_regras_associacao.py) | Minera as cestas e gera o CSV da [aula de regras de associação](../material/tutorial-regras-associacao-20261017.md), sem dependências externas |
| [`gerar_slides.py`](gerar_slides.py) | Gera [`../slides/recomendador-bentoml.html`](../slides/recomendador-bentoml.html) |
| [`validar_vendas_semanais.py`](validar_vendas_semanais.py) | Confere a série sintética semanal contra os totais do catálogo |
| [`demo_treino_mlp_demanda.py`](demo_treino_mlp_demanda.py) | MLP rasa + knobs; JSON em `material/redes/` |
| [`demo_deep_vs_rasa.py`](demo_deep_vs_rasa.py) | Compara MLP rasa vs mais funda na série p01 |
| [`demo_fine_tuning_mlp.py`](demo_fine_tuning_mlp.py) | Pré-treino multi-produto + fine-tune da cabeça em p01 |
| [`demo_langchain_loja.py`](demo_langchain_loja.py) | Chain mínima no catálogo (puro ou `--with langchain-core`) |
| [`demo_rag_fts.py`](demo_rag_fts.py) | Índice FTS5 da mini-wiki |
| [`demo_rag_ancorar.py`](demo_rag_ancorar.py) | Resposta ancorada (template sobre hits FTS) |
| [`gerar_figuras_rag.py`](gerar_figuras_rag.py) | Figuras do loop RAG e da ladder |
| [`demo_mem0_preferencias.py`](demo_mem0_preferencias.py) | add/search/update de preferências (store JSON) |

```bash
just slides
xdg-open slides/recomendador-bentoml.html
```

Depois de editar títulos, prosa ou a sequência em `gerar_slides.py`, rode o
comando acima e recarregue a página no navegador.

**Como rodar os scripts:** na raiz do repo, prefira
`uv run python scripts/<nome>.py` (mesmo interpretador do projeto). Testes que
importam irmãos (`from minerar_…`) também funcionam com
`uv run python -m unittest discover -s scripts`. Playwright dos testes web:
`uv run --with playwright …` (opcional; não está no manifesto base).

Para validar a base de demanda, rode `uv run python scripts/validar_vendas_semanais.py`
na raiz do projeto.

Arco e índice: [`../slides/README.md`](../slides/README.md).

Para gerar o relatório de associação, rode na raiz:

```bash
python3 scripts/minerar_regras_associacao.py
```

Padrões: suporte ≥ 0,20, confiança ≥ 0,60 e lift > 1. Opções em `--help`.
O script enumera conjuntos observados; use apenas com cestas pequenas.
