# Explore regras de associação com BI

**Business Intelligence (BI)** reúne práticas e ferramentas para organizar,
analisar e apresentar dados que apoiam decisões. Neste explorador, você pode
passar de um resumo visual a uma regra e às contagens que sustentam suas métricas.
O painel apresenta associações; ele não executa campanhas nem demonstra seus efeitos.

## Abrir o explorador

Você pode usar o painel diretamente na
[versão web do tutorial](https://lgallindo.github.io/recomendador-bentoml/#explorador-interativo),
incorporado às explicações, sem baixar arquivos.

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
JavaScript deve estar habilitado. Todos os recursos estão no repositório; você
não precisa instalar um serviço nem acessar a internet. A página de um arquivo
HTML no GitHub mostra seu código, não executa o explorador: baixe ou clone o
repositório e abra o arquivo local.

O ponto de partida são as 14 regras selecionadas no
[relatório original](../regras-associacao-20261017.csv). Os critérios originais
são suporte ≥ 20%, confiança ≥ 60% e lift > 1, calculados na descoberta.

## Roteiro de exploração

1. Confira a regra inicial **Jarro → Prato**: suporte 30%, confiança 75%, lift
   2,50 na descoberta. Use **Ver regra inversa** e compare os denominadores.
2. No gráfico de dispersão, selecione o ponto de suporte 20% e confiança 100%.
   Ele reúne **sete regras**. A lista permite examinar todas; a cor mostra o
   maior lift desse grupo, não uma média nem o valor de cada uma de suas regras.
3. Na matriz, selecione uma célula e compare a regra com sua inversa. As linhas
   representam antecedentes; as colunas, consequentes. Consulte os nomes por ID
   na tabela ou na relação de produtos ao final da página.
4. Na rede, observe que `{p01 + p03}` é um único conjunto que exige os dois
   produtos. Selecione uma seta para inspecionar uma regra ou um conjunto para
   listar suas regras relacionadas. Os controles também aceitam Tab e Enter.
5. Selecione Jarro → Prato e altere a base para **Avaliação separada**. Os filtros
   originais podem removê-la dos gráficos, mas a comparação permanece disponível:
   suporte 10%, confiança 25%, lift aproximadamente 0,83.
6. Use **Ver toda a seleção original** para desativar os filtros métricos e
   visualizar também regras com métricas zero ou indefinidas na avaliação.
   A busca por produto permanece ativa. Uma métrica indefinida aparece como “—”;
   isso ocorre quando seu denominador é zero.
7. Exporte a seleção em CSV ou baixe cada gráfico em PNG. As exportações levam
   as métricas da base escolhida; a figura de comparação sempre mostra as duas.

## Filtrar não é minerar novamente

Os filtros atuam sobre as 14 regras originais, não sobre a população de
transações. Diminuir um limite não recupera regras que foram excluídas na
mineração original. Para uma nova mineração, use
[`minerar_regras_associacao.py`](../../scripts/minerar_regras_associacao.py)
com outros limites e outro arquivo de saída. O explorador continuará mostrando
a seleção original até você alterar sua preparação de dados.

Alterar a base exibida recalcula a leitura das regras fixas: as métricas das
duas bases foram obtidas de suas respectivas contagens, sem tirar médias das
métricas. Não há filtro de período real, receita ou margem, pois os conjuntos
sintéticos não fornecem esses dados.

## Reproduzir os dados e as figuras

Na raiz do repositório, com o ambiente do projeto instalado:

```bash
uv run python scripts/gerar_bi_associacao.py
```

O comando produz `dados.js` e três PNGs em `material/imagens/`. Os dados vêm de
`dados/catalogo.json` e `material/cestas-validacao-20261017.json`; o primeiro
define a seleção de regras e o segundo permite avaliar essas regras fixas.
Ambas as bases são sintéticas.

O CSV exportado pelo explorador usa UTF-8, vírgula entre campos, ponto decimal
e proporções entre 0 e 1 para suporte e confiança. Valores indefinidos ficam
vazios. O arquivo inclui o nome da base, o universo de 14 regras, os filtros
métricos e a busca. Filtros desativados ficam vazios. O CSV original permanece
inalterado.

Os [gráficos estáticos](../imagens/README.md) permitem ler o tutorial no GitHub
ou exportá-lo sem executar o painel. Eles mostram a seleção original na base
de descoberta. Retorne ao [tutorial](../tutorial-regras-associacao-20261017.md)
para os exercícios e as referências.

## Verificar as interações

Com Playwright e seu Chromium instalados, você pode executar os
[testes do explorador](../../scripts/test_bi_associacao.py):

```bash
uv run --with playwright python -m unittest discover -s scripts -p 'test_bi_associacao.py' -v
```

Os testes abrem o arquivo local sem conexão de rede e verificam contagens,
inversão, filtros, regras coincidentes, conjuntos compostos, exportações e
layout em uma tela de celular. Playwright é necessário apenas para esses testes,
não para abrir o explorador.
