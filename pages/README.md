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

O [workflow de Pages](../.github/workflows/pages.yml) reproduz e publica o site
quando os arquivos relevantes mudam em `main`. Você também pode executá-lo
manualmente na aba Actions. Ele usa Pages deste repositório; o repositório do
site pessoal `lgallindo.github.io` tem publicação independente.

Os links para código e documentação complementar levam aos respectivos arquivos
do repositório. Os gráficos e o explorador funcionam na própria página. Você pode
ampliar o painel com seu botão de tela cheia ou abri-lo em uma nova aba.
