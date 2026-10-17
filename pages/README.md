# Versão web do tutorial

Você pode ler o tutorial com o explorador incorporado em
[lgallindo.github.io/recomendador-bentoml](https://lgallindo.github.io/recomendador-bentoml/).
O conteúdo vem do [Markdown](../material/tutorial-regras-associacao-20261017.md).
As fórmulas são convertidas para MathML; o navegador não precisa baixar uma
biblioteca externa para renderizá-las.

## Reproduzir o site

Com Python 3 e Pandoc instalados, execute na raiz:

```bash
python3 scripts/gerar_site_tutorial.py
```

Abra `.local/pages-build/index.html` no navegador ou sirva essa pasta localmente.
O explorador continua disponível separadamente em `material/bi/index.html`.
A saída de publicação contém somente os arquivos necessários ao tutorial,
incluindo imagens e dados dos exercícios; backups em `.local/pages-backups/`
não integram essa saída.

## Publicação

O site publica os arquivos pré-construídos do branch `gh-pages`, pela opção
**Deploy from a branch → gh-pages → / (root)** de Pages deste repositório.
O repositório do site pessoal `lgallindo.github.io` tem publicação independente.

Depois de revisar e registrar as mudanças de conteúdo em `main`, com Git, GitHub
CLI e Pandoc disponíveis, você pode atualizar a publicação pela raiz:

```bash
python3 scripts/publicar_site_tutorial.py
```

O comando gera o site, clona `gh-pages` em uma pasta local, adiciona uma nova
revisão e solicita a publicação. Ele preserva o histórico, não faz push forçado
e não altera o site pessoal. Você precisa de permissão para publicar no `origin`
e de autenticação no GitHub CLI. Confira o estado final com:

```bash
gh api repos/lgallindo/recomendador-bentoml/pages/builds/latest --jq .status
```

O [workflow opcional](../.github/workflows/pages.yml) permite gerar um artefato
HTML pela aba Actions quando runners estiverem disponíveis; ele não é a rota
de publicação do site. A publicação pelo branch não depende desse workflow.

Os links para código e documentação complementar levam aos respectivos arquivos
do repositório. Os gráficos e o explorador funcionam na própria página. Você pode
ampliar o painel com seu botão de tela cheia ou abri-lo em uma nova aba.
