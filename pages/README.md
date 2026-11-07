# Versões web dos tutoriais

O presente diretório contém o molde e os estilos das versões HTML dos
tutoriais. A leitura com explorador incorporado dá-se nas URLs abaixo; o
texto-fonte permanece em Markdown sob `material/`.

- [Associação](https://lgallindo.github.io/recomendador-bentoml/) — regras de
  associação ([Markdown](../material/tutorial-regras-associacao-20261017.md))
- [Associação (logs)](https://lgallindo.github.io/recomendador-bentoml/logs-auth/) —
  ([Markdown](../material/tutorial-regras-associacao-logs-autenticacao-20261017.md))
- [Média móvel](https://lgallindo.github.io/recomendador-bentoml/demanda/) —
  ([Markdown](../material/tutorial-media-movel-demanda-20261017.md))
- [Mínimos quadrados](https://lgallindo.github.io/recomendador-bentoml/demanda-mq/) —
  ([Markdown](../material/tutorial-regressao-quadrados-minimos-demanda-20261017.md))
- [LMS / perceptron](https://lgallindo.github.io/recomendador-bentoml/demanda-perc/) —
  ([Markdown](../material/tutorial-perceptron-demanda-20261026.md))
- [Poisson](https://lgallindo.github.io/recomendador-bentoml/demanda-poisson/) —
  ([Markdown](../material/tutorial-previsao-probabilistica-demanda-20261017.md))
- [Treino de redes](https://lgallindo.github.io/recomendador-bentoml/treino-redes/) —
  ([Markdown](../material/tutorial-treino-redes-neurais-20261026.md))
- [Deep learning](https://lgallindo.github.io/recomendador-bentoml/deep-learning/) —
  ([Markdown](../material/tutorial-deep-learning-visao-geral-20261026.md))
- [Fine-tuning](https://lgallindo.github.io/recomendador-bentoml/fine-tuning/) —
  ([Markdown](../material/tutorial-fine-tuning-20261026.md))
- [LangChain](https://lgallindo.github.io/recomendador-bentoml/langchain/) —
  ([Markdown](../material/tutorial-langchain-20261026.md))
- [llmwiki](https://lgallindo.github.io/recomendador-bentoml/llmwiki/) —
  ([Markdown](../material/tutorial-llmwiki-20261026.md))
- [RAG](https://lgallindo.github.io/recomendador-bentoml/rag/) —
  ([Markdown](../material/tutorial-rag-20261026.md))
- [Memória de agentes](https://lgallindo.github.io/recomendador-bentoml/memoria/) —
  ([Markdown](../material/tutorial-memoria-agentes-mem0-20261026.md))
- [Open WebUI](https://lgallindo.github.io/recomendador-bentoml/open-webui/) —
  ([Markdown](../material/tutorial-open-webui-20261026.md))
- [LiteLLM](https://lgallindo.github.io/recomendador-bentoml/litellm/) —
  ([Markdown](../material/tutorial-litellm-20261026.md))

As fórmulas convertem-se para MathML; o navegador dispensa biblioteca externa
para as renderizar. Os gráficos e os exploradores operam na própria página;
cumpre ampliar o painel pelo controle de tela cheia ou abri-lo em nova aba.
Os vínculos para código e documentação complementar apontam aos respectivos
arquivos deste repositório.

## Reproduzir o site

Com Python 3 e Pandoc instalados, execute na raiz:

```bash
python3 scripts/gerar_site_tutorial.py
```

Abra `.local/pages-build/index.html`, `demanda/` e `demanda-mq/` no navegador,
ou sirva essa pasta localmente. Os exploradores também ficam em
`material/bi/`, `material/bi-demanda/` e `material/bi-demanda-mq/`. A saída de
publicação contém somente os arquivos necessários aos tutoriais; backups em
`.local/pages-backups/` não integram essa saída.

Antes de gerar, atualize os painéis se necessário:

```bash
uv run python scripts/gerar_bi_demanda.py
uv run --with scikit-learn python scripts/gerar_bi_demanda_mq.py
```

## Publicação

O site publica os arquivos pré-construídos do branch `gh-pages`, pela opção
**Deploy from a branch → gh-pages → / (root)** de Pages deste repositório.
O repositório do site pessoal `lgallindo.github.io` tem publicação independente.

Depois de revisar e registrar as mudanças de conteúdo em `main`, com Git, GitHub
CLI e Pandoc disponíveis, você pode atualizar a publicação pela raiz:

```bash
python3 scripts/publicar_site_tutorial.py
```

O comando gera o site, clona `gh-pages` em uma pasta local, acrescenta uma
revisão no histórico do branch e solicita a publicação no Pages. Você precisa
de permissão no `origin` e autenticação no GitHub CLI. Confira o estado final
com:

```bash
gh api repos/lgallindo/recomendador-bentoml/pages/builds/latest --jq .status
```

A **rota de publicação** desta aula é `scripts/publicar_site_tutorial.py` →
branch `gh-pages`. O [workflow opcional](../.github/workflows/pages.yml) só
gera artefato HTML na aba Actions quando houver runners; a publicação pelo
branch funciona sem ele.

Os links para código e documentação complementar levam aos respectivos arquivos
do repositório. Os gráficos e os exploradores funcionam na própria página. Você
pode ampliar o painel com o botão de tela cheia ou abri-lo em uma nova aba.
