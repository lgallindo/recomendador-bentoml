# Versões web dos tutoriais

Você pode ler os tutoriais com explorador incorporado em:

- [Associação](https://lgallindo.github.io/recomendador-bentoml/) — regras de
  associação ([Markdown](../material/tutorial-regras-associacao-20261017.md))
- [Média móvel](https://lgallindo.github.io/recomendador-bentoml/demanda/) —
  ([Markdown](../material/tutorial-media-movel-demanda-20261017.md))
- [Mínimos quadrados](https://lgallindo.github.io/recomendador-bentoml/demanda-mq/) —
  ([Markdown](../material/tutorial-regressao-quadrados-minimos-demanda-20261017.md))
- [LMS / perceptron](https://lgallindo.github.io/recomendador-bentoml/demanda-perc/) —
  ([Markdown](../material/tutorial-perceptron-demanda-20261026.md))

As fórmulas são convertidas para MathML; o navegador não precisa baixar uma
biblioteca externa para renderizá-las.

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
