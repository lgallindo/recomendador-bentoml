# Previsão de demanda com média móvel

[Versão web com explorador](https://lgallindo.github.io/recomendador-bentoml/demanda/).

A loja abre a semana seguinte sem saber quantas linhas de pedido cada peça vai
gerar. Você aprende a **suavizar o passado** com uma média móvel, a **precificar
o erro** com funções de custo (incluindo regras de negócio de estoque) e a
**escolher o tamanho da janela N** medindo uma métrica em dados de ajuste e
conferindo o resultado em dados que ficaram de fora.

Dados:
[`dados/vendas_semanais.csv`](../dados/vendas_semanais.csv) (16 semanas × 12
produtos).

### Roteiro (~90 min)

| Bloco | O que você faz |
| --- | --- |
| Definição | O que é média móvel simples de ordem N |
| IA / ML | Onde o método e a escolha de N se encaixam |
| Custos | \(L_2\), \(L_1\), LinLin e métrica de estoque (sobra / quebra) |
| Procedimentos | Treinar/avaliar em conjuntos separados; otimizar N pela métrica |
| Laboratório | Série → cartão de métrica → N\* → previsão |

---

## 1. Definindo média móvel

Uma **média móvel simples de ordem N** (*simple moving average*, SMA) estima o
próximo valor de uma série temporal como a média aritmética das **N
observações mais recentes já conhecidas**:

$$
\widehat{y}_{t+1}
= \frac{1}{N}\sum_{i=0}^{N-1} y_{t-i}
= \frac{y_t + y_{t-1} + \cdots + y_{t-N+1}}{N}.
$$

- **Móvel:** a janela desliza no tempo — sai a observação mais antiga; entra a
  nova.
- **Simples:** cada entrada pesa \(1/N\).
- **N:** parâmetro inteiro do algoritmo. N pequeno reage rápido e oscila mais;
  N grande suaviza e atrasa.

Unidade neste material: **linhas de pedido por produto por semana**. Zero é
observação válida.

### Exemplo numérico (N = 4)

Observações: \(1,\,3,\,3,\,4\). Previsão:

\[
(1+3+3+4)/4 = 2{,}75.
\]

Na semana seguinte a série vira \(3,\,3,\,4,\,3\); a previsão passa a
\((3+3+4+3)/4 = 3{,}25\).

Campos do CSV:

| Campo | Significado |
| --- | --- |
| `week_start` | Segunda-feira que inicia a semana |
| `product_id` | Id do produto |
| `order_line_count` | Linhas na semana |

```bash
uv run python scripts/validar_vendas_semanais.py
```

---

## 2. Média móvel, aprendizado de máquina e inteligência artificial

**Inteligência artificial (IA)** é o campo amplo de sistemas que apoiam ou
automatizam tarefas cognitivas: perceber, prever, decidir. **Aprendizado de
máquina (ML)** é a família de métodos em que o comportamento do sistema
**depende de dados** — parâmetros ou estruturas ajustados a exemplos.

| Peça | Leitura |
| --- | --- |
| MA(N) com N fixo imposto à mão | Baseline **estatístico** de séries temporais. |
| Escolher N **medindo** uma métrica em dados e ficando com o N que a otimiza | **Seleção de hiperparâmetro** — gesto central de ML. A previsão continua SMA; o **procedimento de escolha** aprende a partir dos dados. |
| Usar a previsão para comprar, estocar ou alertar | **IA aplicada** (apoio à decisão). |

Nesta aula o gesto central é treinar o parâmetro N sob uma métrica escrita e
avaliar com disciplina temporal.

---

## 3. O preço do erro

Seja \(e = y - \widehat{y}\) (observado menos previsto). Uma **função de
custo** transforma \(e\) (ou o par previsão/demanda sob regras de estoque) num
número agregável no tempo.

### 3.1 Perda quadrática (simétrica) — Gauss e Legendre

$$
L_2(e) = e^2 = (y - \widehat{y})^2.
$$

\(L_2(e)=L_2(-e)\). Erros grandes pesam desproporcionalmente.

**História.** Legendre (1805) e Gauss popularizaram os **mínimos quadrados**
para órbitas e medidas — o caso de Ceres é o episódio clássico. A média da
perda no teste é o **MSE**:

$$
\mathrm{MSE} = \frac{1}{n}\sum_{t=1}^{n}(y_t-\widehat{y}_t)^2.
$$

**Minúcia.** Erro \(\pm 1\) → custo \(1\). Erro \(\pm 2\) → custo \(4\).

### 3.2 Perda absoluta (simétrica) — Boscovich e Laplace

$$
L_1(e) = |e| = |y - \widehat{y}|.
$$

Crescimento linear na magnitude; outliers pesam menos que no \(L_2\).

**História.** Ajustes por **desvios absolutos** (*least absolute deviations*).
A média amostral é o **MAE**:

$$
\mathrm{MAE} = \frac{1}{n}\sum_{t=1}^{n}|y_t-\widehat{y}_t|.
$$

**Minúcia.** Erro \(\pm 1\) → custo \(1\). Erro \(\pm 2\) → custo \(2\).

### 3.3 Perda assimétrica linear (LinLin)

Pesos \(a>0\) (custo da subprevisão, \(e>0\)) e \(b>0\) (custo da
superprevisão, \(e<0\)), com \(a\neq b\):

$$
L_{a,b}(e) = a\max(e,0) + b\max(-e,0).
$$

**História.** Problema do **jornaleiro** (*newsvendor*): sobra e falta têm
custos unitários distintos; a perda assimétrica escolhe o lado caro.

**Minúcia.** \(y=5\), \(\widehat{y}=3\), \(a=3\), \(b=1\) → \(e=+2\), custo
\(6\). Com \(\widehat{y}=7\) → \(e=-2\), custo \(2\).

### 3.4 Métrica de estoque — sobra e quebra por regras de negócio

Aqui o custo **não** é só uma função abstrata de \(e\). A loja transforma a
previsão em **estoque preparado** e aplica regras explícitas.

#### Regras de negócio (nesta aula)

| Id | Regra |
| --- | --- |
| **RN-1** | Para a semana \(t\), o estoque preparado é \(s_t = \mathrm{round}(\widehat{y}_t)\), com \(\mathrm{round}\) half-up (0,5 → 1). A previsão fracionária vira inteiro operacional. |
| **RN-2** | A demanda realizada é \(y_t\) (linhas de pedido). |
| **RN-3 — quebra de estoque** | Se \(y_t > s_t\), a quebra é \(q_t = y_t - s_t\). Custo unitário de quebra: \(c_{\mathrm{quebra}} = 40\) (margem + atendimento perdidos por linha não atendida). |
| **RN-4 — sobra (overstock)** | Se \(s_t > y_t\), a sobra é \(o_t = s_t - y_t\). Custo unitário de sobra na semana: \(c_{\mathrm{sobra}} = 5\) (capital e espaço parados). |
| **RN-5** | Se \(y_t = s_t\), \(q_t=o_t=0\). |

Custo da semana \(t\):

$$
C_t = c_{\mathrm{quebra}}\,q_t + c_{\mathrm{sobra}}\,o_t
= 40\cdot\max(y_t-s_t,0) + 5\cdot\max(s_t-y_t,0).
$$

**Métrica de estoque** no holdout de \(n\) semanas de teste:

$$
M_{\mathrm{estoque}}
= \frac{1}{n}\sum_{t\in\mathrm{teste}} C_t.
$$

Menor \(M_{\mathrm{estoque}}\) → melhor segundo as regras RN-1…RN-5.

#### Minúcia numérica

Previsão \(\widehat{y}=3{,}4\) → \(s=\mathrm{round}(3{,}4)=3\).

| Demanda \(y\) | Quebra \(q\) | Sobra \(o\) | \(C\) |
| ---: | ---: | ---: | ---: |
| 5 | 2 | 0 | \(40\times 2=80\) |
| 3 | 0 | 0 | \(0\) |
| 1 | 0 | 2 | \(5\times 2=10\) |

A mesma magnitude de erro de previsão gera custos diferentes conforme as
regras — e \(M_{\mathrm{estoque}}\) pode eleger um N\* distinto do MAE ou do MSE.

---

## 4. Dois procedimentos de alto nível

### Procedimento A — Treinar parâmetros num conjunto e avaliar noutro

```text
# Variáveis:
# D_treino — observações usadas para fixar parâmetros
# D_teste  — observações guardadas; fora da escolha dos parâmetros
# θ        — parâmetros (aqui, N)
# M        — métrica (MAE, MSE, LinLin, M_estoque, …)
# ŷ        — previsões com θ em D_teste

1. Particione no tempo: D_treino = passado; D_teste = holdout futuro relativo.
2. Em D_treino (ou walk-forward na região permitida), escolha θ.
3. Congele θ.
4. Gere ŷ em D_teste só com informação anterior a cada instante.
5. Calcule M em D_teste e reporte esse valor.
```

### Procedimento B — Definir a métrica e ajustar o parâmetro para otimizá-la

```text
# Variáveis:
# M, Θ, θ*, score(θ)

1. Escreva M (nome, fórmula, holdout, agregação; se for M_estoque, cite RN-1…5).
2. Para cada θ em Θ, calcule score(θ) com o Procedimento A.
3. θ* ← argmin score(θ).
4. Empate → desempate declarado.
5. Previsão operacional com θ* (MA(N*)).
```

---

## 5. Laboratório

Arquivo: [`dados/vendas_semanais.csv`](../dados/vendas_semanais.csv).

Partição sugerida: últimas **4** semanas = `D_teste`. Candidatos:
\(N\in\{2,3,4,5\}\).

1. Escolha **M** (MAE, MSE, LinLin ou \(M_{\mathrm{estoque}}\) com RN-1…RN-5).
2. Tabela \(N\mapsto\mathrm{score}(N)\).
3. Declare \(N^\star\) e a previsão da próxima semana com MA(\(N^\star\)).
4. Opcional: compare \(N^\star\) sob MAE versus sob \(M_{\mathrm{estoque}}\).

```python
from pathlib import Path

import pandas as pd

vendas = pd.read_csv(
    Path("dados/vendas_semanais.csv"), parse_dates=["week_start"]
)
serie = (
    vendas.pivot(index="week_start", columns="product_id", values="order_line_count")
    .sort_index()["p01"]
)
k_teste = 4
c_quebra, c_sobra = 40.0, 5.0


def m_estoque_wf(serie: pd.Series, n: int, k_teste: int) -> float:
    custos = []
    for pos in range(len(serie) - k_teste, len(serie)):
        yhat = float(serie.iloc[pos - n : pos].mean())
        s = int(round(yhat))  # RN-1
        y = int(serie.iloc[pos])
        q = max(y - s, 0)
        o = max(s - y, 0)
        custos.append(c_quebra * q + c_sobra * o)
    return sum(custos) / len(custos)


scores = {n: m_estoque_wf(serie, n, k_teste) for n in (2, 3, 4, 5)}
n_star = min(scores, key=scores.get)
print(scores, "N* =", n_star, "prev =", float(serie.iloc[-n_star:].mean()))
```

O [explorador BI](https://lgallindo.github.io/recomendador-bentoml/demanda/)
mostra MAE por janela nesta série.

---

## 6. Exercício

Escolha um produto. Entregue:

1. Cartão de M (se usar estoque, copie RN-1…RN-5 ou declare variantes).
2. Em um instante de teste: \(L_2\), \(L_1\) e \(C_t\) (quebra/sobra) com o
   mesmo \(y\) e a mesma \(\widehat{y}\).
3. Tabela N→score sob a M escolhida; N\*; previsão da próxima semana.
4. Uma figura (BI ou gráfico próprio).

---

## Referências no repositório

| Artefato | Papel |
| --- | --- |
| `dados/vendas_semanais.csv` | Série do laboratório |
| `material/bi-demanda/` | Painel |
| `scripts/validar_vendas_semanais.py` | Sanidade do CSV |
