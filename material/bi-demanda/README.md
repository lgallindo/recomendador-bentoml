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
**16 semanas × 12 produtos** (corpus da **aula**). As quatro últimas semanas
formam o teste walk-forward. O classwork usa outro CSV em
[`dados/classwork/`](../../dados/classwork/).

O núcleo da aula: definir a **métrica de qualidade** e **escolher N** da média
móvel comparando MA(2)…MA(5) (e a ingênua) no mesmo holdout.

## Roteiro de exploração

1. Abra **Jarro (`p01`)**. Anote o MAE de **várias** janelas no mesmo teste.
2. Na tabela, reproduza à mão uma previsão walk-forward e confira o erro.
3. Compare **Ingênua** e MA(2)–MA(5) no gráfico de MAE agregado (48 previsões).
4. Escolha **N\*** pela métrica (menor MAE ou o desempate que você declarar).
5. Com N\*, leia a previsão da próxima semana; repita o ritual em **Boneca
   (`p03`)** se quiser um segundo produto.
6. Exporte CSV ou PNG para o relato da aula (classwork: série da oficina).

## O que o filtro faz

Trocar produto ou janela **rele a mesma série** de 16 semanas (método e
janela escolhidos no painel). O explorador aplica a regra fixa já definida no
tutorial; não estima parâmetros por otimização nem usa as semanas de extensão
da planilha de sala. Para outras séries, atualize o CSV e rode
[`gerar_bi_demanda.py`](../../scripts/gerar_bi_demanda.py).

## Reproduzir os dados e as figuras

Na raiz do repositório, com o ambiente do projeto instalado:

```bash
uv run python scripts/gerar_bi_demanda.py
```

O comando produz `dados.js` e três PNGs em `material/imagens/`:
`bi-demanda-serie-p01.png`, `bi-demanda-erros-p01.png` e
`bi-demanda-mae-janelas.png`.
