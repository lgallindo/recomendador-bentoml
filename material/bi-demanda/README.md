# Explore previsões de demanda com BI

**Business Intelligence (BI)** reúne práticas e ferramentas para organizar,
analisar e apresentar dados que apoiam decisões. Neste explorador, você
percorre a série semanal de um produto, confere previsões de média móvel e
compara erros no período de teste. O painel apresenta previsões; ele não
define estoque nem demonstra vendas futuras.

## Abrir o explorador

Você pode usar o painel na
[versão web do tutorial de demanda](https://lgallindo.github.io/recomendador-bentoml/demanda/#explorador-interativo),
incorporado às explicações.

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
JavaScript deve estar habilitado. Todos os recursos estão no repositório; você
não precisa instalar um serviço nem acessar a internet. A página de um arquivo
HTML no GitHub mostra seu código, não executa o explorador.

A base é [`dados/vendas_semanais.csv`](../../dados/vendas_semanais.csv):
**16 semanas × 12 produtos**. As quatro últimas semanas formam o teste
walk-forward. A planilha de sala com extensão sintética
([`planilha-media-movel-demanda.xlsx`](../planilha-media-movel-demanda.xlsx))
não alimenta este painel.

## Roteiro de exploração

1. Confira o produto inicial **Jarro (`p01`)** com **MA(4)**: série, previsão
   da próxima semana e MAE nas quatro semanas de teste.
2. Na tabela, reproduza à mão uma linha do teste (soma das quatro semanas
   anteriores ÷ 4) e compare com a coluna Previsão.
3. Troque o método para **Ingênua** e observe como os erros e o MAE mudam.
4. No gráfico de MAE agregado, compare Ingênua e MA(2)–MA(5) nas mesmas
   48 previsões do tutorial.
5. Selecione **Boneca (`p03`)** e MA(4): use o exercício do tutorial para
   conferir previsão futura e MAE.
6. Exporte o CSV do teste ou um PNG de gráfico para anexar ao relato.

## Filtrar não é treinar de novo

Trocar produto ou janela recalcula a leitura das mesmas 16 semanas. O painel
não estima parâmetros por otimização e não usa as semanas de extensão da
planilha de sala. Para outras séries, atualize o CSV e rode
[`gerar_bi_demanda.py`](../../scripts/gerar_bi_demanda.py).

## Reproduzir os dados e as figuras

Na raiz do repositório, com o ambiente do projeto instalado:

```bash
uv run python scripts/gerar_bi_demanda.py
```

O comando produz `dados.js` e três PNGs em `material/imagens/`:
`bi-demanda-serie-p01.png`, `bi-demanda-erros-p01.png` e
`bi-demanda-mae-janelas.png`.
