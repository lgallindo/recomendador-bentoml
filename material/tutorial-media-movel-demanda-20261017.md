# Previsão de demanda semanal com média móvel

[Leia a versão web com o explorador interativo](https://lgallindo.github.io/recomendador-bentoml/demanda/).

Você organiza vendas semanais, **define uma métrica de qualidade**, compara
médias móveis com janelas diferentes e **escolhe N** — o número de observações
na média — com base nessa métrica. Só depois emite a previsão da próxima semana.

Os dados da **aula** são sintéticos e vivem em
[`dados/vendas_semanais.csv`](../dados/vendas_semanais.csv) (16 semanas × 12
produtos do catálogo). O **classwork** usa outro arquivo
([`dados/classwork/demanda_semanal_oficina.csv`](../dados/classwork/demanda_semanal_oficina.csv));
não misture os dois corpora nas contas.

### Roteiro de estudo (~65 min)

| Tempo | Atividade |
| --- | --- |
| 8 min | Problema, unidade e série da aula |
| 10 min | Média móvel MA(N) e exemplo à mão |
| 12 min | Definir a métrica de qualidade (holdout temporal) |
| 15 min | Comparar N e escolher N\* |
| 10 min | BI: conferir a mesma lógica no painel |
| 10 min | Exercício na série da aula |

## 1. A pergunta de previsão

> Quantas linhas de pedido deste produto esperamos na próxima semana?

Unidade: **linhas de pedido por produto por semana**. A popularidade
agregada do catálogo (`pedidos`) não traz datas; a série semanal acrescenta o
eixo do tempo.

Campos do CSV da aula:

| Campo | Significado |
| --- | --- |
| `week_start` | Segunda-feira que inicia a semana |
| `product_id` | Id do produto (`p01`…`p12`) |
| `order_line_count` | Linhas naquela semana (zero conta) |

```bash
uv run python scripts/validar_vendas_semanais.py
```

## 2. Média móvel de N observações

Com janela **N**, a previsão da semana seguinte é a média das N observações
mais recentes já conhecidas:

$$
\widehat{y}_{t+1}
= \frac{1}{N}\sum_{i=0}^{N-1} y_{t-i}
$$

N é um **parâmetro**. Janela curta reage mais rápido; janela longa suaviza mais.
Nesta aula você **não** recebe N pronto: escolhe N depois de medir qualidade.

### Conta com N = 4 (só para fixar a álgebra)

Para o jarro `p01`, quatro semanas finais da série da aula:

| Semana | Linhas |
| --- | ---: |
| 2026-09-14 | 4 |
| 2026-09-21 | 2 |
| 2026-09-28 | 2 |
| 2026-10-05 | 2 |

$$
\widehat{y}_{\mathrm{próxima}} = \frac{4+2+2+2}{4} = 2{,}5
$$

Isso ilustra a conta. A escolha de N vem da seção 4.

### Referência ingênua

$$
\widehat{y}_{t+1}^{\mathrm{ingênua}} = y_t
$$

Útil como baseline na mesma métrica e no mesmo holdout.

## 3. Definindo a métrica de qualidade

Antes de comparar janelas, escreva o que “bom” significa.

**Protocolo desta aula (use-o ou declare outro com a mesma clareza):**

1. Ordene as semanas no tempo (nunca embaralhe).
2. Reserve as **últimas K semanas** como teste (aqui K = 4).
3. Para cada semana de teste, forme a previsão **só** com semanas anteriores
   (walk-forward).
4. Calcule o erro absoluto em cada semana de teste e a média desses erros
   (**MAE**):

$$
\mathrm{MAE} = \frac{1}{n}\sum_{t=1}^{n}|y_t-\widehat{y}_t|
$$

Menor MAE no holdout → melhor segundo **esta** métrica. Outras métricas
(MSE, viés) são válidas se você as definir e aplicar a todos os N do mesmo
jeito.

![Fluxo walk-forward: janela de N semanas → previsão → erro → avança.](imagens/fluxo-walk-forward-demanda.png)

*Figura 1 — Cada previsão usa só o passado. A métrica resume os erros do
período de teste.*

### Cartão da métrica (faça o seu)

Preencha em até oito linhas: nome; fórmula ou descrição; K do holdout; se a
métrica agrega um produto ou vários; o que fazer em empate.

## 4. Escolhendo N pela métrica

Candidatos típicos: N ∈ {2, 3, 4, 5}. Para **cada** N, rode o mesmo walk-forward
e a mesma métrica. Monte:

| N | MAE (exemplo de protocolo) |
| ---: | ---: |
| 2 | … |
| 3 | … |
| 4 | … |
| 5 | … |

Escolha **N\*** = argmin da métrica (ou o desempate que você declarou). Só então
calcule a previsão da semana seguinte com MA(N\*).

### Código (série da aula, um produto)

Na raiz do repositório (`uv run --with pandas` se precisar):

```python
from pathlib import Path

import pandas as pd

vendas = pd.read_csv(
    Path("dados/vendas_semanais.csv"), parse_dates=["week_start"]
)
matriz = (
    vendas.pivot(index="week_start", columns="product_id", values="order_line_count")
    .sort_index()
)
serie = matriz["p01"]
k_teste = 4
candidatos = [2, 3, 4, 5]


def mae_walk_forward(serie: pd.Series, n: int, k_teste: int) -> float:
    erros = []
    for pos in range(len(serie) - k_teste, len(serie)):
        hist = serie.iloc[pos - n : pos]
        if len(hist) < n:
            continue
        prev = float(hist.mean())
        erros.append(abs(float(serie.iloc[pos]) - prev))
    return float(sum(erros) / len(erros))


tabela = {n: mae_walk_forward(serie, n, k_teste) for n in candidatos}
n_estrela = min(tabela, key=tabela.get)
previsao = float(serie.iloc[-n_estrela:].mean())
print(tabela)
print("N* =", n_estrela, "previsão próxima =", previsao)
```

Repita a lógica para outros produtos ou para o MAE agregado em todos os
produtos — desde que o protocolo fique explícito no cartão da métrica.

![MAE por janela na série sintética da aula.](imagens/comparacao-media-movel-mae.png)

*Figura 2 — Exemplo de comparação de janelas no corpus da aula. Na sua conta,
a ordem dos N pode mudar; o ritual (métrica → tabela → N\*) é o que importa.*

## 5. Explorar no BI

O [explorador de demanda](https://lgallindo.github.io/recomendador-bentoml/demanda/)
mostra série, erros e MAE por janela na **série da aula**. Use-o para conferir
o ritual; ao entregar o classwork, troque para o CSV da oficina.

Roteiro rápido:

1. Fixe um produto e anote o MAE de várias janelas no mesmo teste.
2. Escolha N\* pela métrica do painel (ou pela sua).
3. Exporte um PNG da série ou da comparação de MAE.

![Série p01 com previsões e faixa de teste.](imagens/bi-demanda-serie-p01.png)

## 6. Exercício (série da aula)

Escolha **um** produto em `vendas_semanais.csv` (sugestão: Boneca `p03`).

1. Escreva o cartão da métrica (seção 3).
2. Tabela N → métrica para pelo menos três N no holdout das quatro últimas
   semanas.
3. Declare N\* e a previsão da próxima semana com MA(N\*).
4. Uma figura (BI ou gráfico próprio) com produto e N\* legíveis.

### Classwork

No Google Classroom, repita o **mesmo ritual** em
[`dados/classwork/demanda_semanal_oficina.csv`](../dados/classwork/demanda_semanal_oficina.csv)
(kits `k01`…`k06`). Números da loja (`p01`…) não substituem as contas da oficina.

## Referências no repositório

| Artefato | Papel |
| --- | --- |
| `dados/vendas_semanais.csv` | Corpus da aula |
| `dados/classwork/` | Corpus do classwork |
| `material/bi-demanda/` | Explorador local |
| `scripts/validar_vendas_semanais.py` | Sanidade do CSV da aula |
