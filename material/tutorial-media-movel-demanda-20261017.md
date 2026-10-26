# Previsão de demanda com média móvel

[Versão web com explorador](https://lgallindo.github.io/recomendador-bentoml/demanda/).

A loja abre a semana seguinte sem saber quantas linhas de pedido cada peça vai
gerar. Você vai aprender a **suavizar o passado** com uma média móvel, a
**nomear o preço do erro** com funções de custo — simétricas e assimétricas —
e a **escolher o tamanho da janela** como quem treina um parâmetro: mede em
dados de treino, confere em dados que ficaram de fora.

Corpus da **aula:**
[`dados/vendas_semanais.csv`](../dados/vendas_semanais.csv) (16 semanas × 12
produtos). Corpus do **classwork** (outro universo):
[`dados/classwork/demanda_semanal_oficina.csv`](../dados/classwork/demanda_semanal_oficina.csv).

### Roteiro (~90 min)

| Bloco | O que você faz |
| --- | --- |
| Definição e cultura | O que é média móvel; onde ela aparece no noticiário e no mercado |
| IA / ML | Em que prateleira intelectual o método e a escolha de N se encaixam |
| Custos do erro | Duas perdas simétricas e uma assimétrica, com história e conta |
| Dois procedimentos | Treinar/avaliar em conjuntos separados; otimizar N pela métrica |
| Laboratório | Série da aula → cartão de métrica → N\* → previsão |

---

## 1. Definindo média móvel

Uma **média móvel simples de ordem N** (em inglês, *simple moving average*,
SMA) estima o próximo valor de uma série temporal como a média aritmética das
**N observações mais recentes já conhecidas**:

$$
\widehat{y}_{t+1}
= \frac{1}{N}\sum_{i=0}^{N-1} y_{t-i}
= \frac{y_t + y_{t-1} + \cdots + y_{t-N+1}}{N}.
$$

- **Móvel:** quando o tempo avança, a janela desliza — a observação mais
  antiga sai; a nova entra.
- **Simples:** cada uma das N entradas pesa \(1/N\). (Há variantes
  exponenciais e ponderadas; esta aula fixa a SMA.)
- **N:** inteiro positivo; é o **parâmetro** do algoritmo. Pequeno N → a
  previsão reage rápido e oscila mais. Grande N → a curva fica mais lisa e
  atrasada.

Unidade neste material: **linhas de pedido por produto (ou kit) por semana**.
Zero é observação válida.

### Exemplo numérico (N = 4)

Observações: \(1,\,3,\,3,\,4\). Previsão da próxima semana:

\[
(1+3+3+4)/4 = 2{,}75.
\]

Na semana seguinte a série vira \(3,\,3,\,4,\,3\); a previsão passa a
\((3+3+4+3)/4 = 3{,}25\). A janela andou.

---

## 2. Onde a média móvel aparece na cultura pop e no noticiário

Você já viu a ideia mesmo sem o nome formal:

| Arena | Como a média móvel entra na conversa |
| --- | --- |
| **Mercado financeiro** | Gráficos de ações e criptomoedas exibem a “média móvel de 50 dias” ou “de 200 dias”. Âncoras de TV e threads no X apontam cruzamentos (“a cotação furrou a média de 200 dias”) como sinal de tendência — narrativa popular, não prova científica. |
| **Saúde pública** | Na pandemia de COVID-19, jornais e dashboards publicavam a **média móvel de 7 dias** de casos ou óbitos para amortecer o efeito do fim de semana na notificação. |
| **Esportes** | Comentaristas falam da “forma recente”: pontos ou rebatidas nas últimas N partidas — uma SMA informal do desempenho. |
| **Audiência e bilheteria** | Rankings semanais e médias de audiência em janelas curtas suavizam um feriado atípico ou uma estreia isolada. |
| **Clima na tela** | Mapas e apps mostram temperatura ou chuva “na média dos últimos dias” para falar de onda de calor sem um único pico distorcer a frase. |

O padrão cultural é o mesmo da aula: **suavizar ruído curto** para contar uma
história sobre tendência — e alguém, nos bastidores, escolheu um N.

---

## 3. Média móvel, aprendizado de máquina e inteligência artificial

**Inteligência artificial (IA)** é o campo amplo de sistemas que apoiam ou
automatizam tarefas cognitivas: perceber, prever, decidir. **Aprendizado de
máquina (ML)** é a família de métodos em que o comportamento do sistema
**depende de dados** — parâmetros ou estruturas ajustados a exemplos.

Onde a SMA se encaixa:

| Peça | Leitura honesta |
| --- | --- |
| Fórmula MA(N) com N fixo imposto à mão | Baseline **estatístico** de séries temporais. Transparente, barato, clássico. Ainda não “aprendeu” nada: o humano escolheu N. |
| Escolher N **medindo** uma métrica em dados e pegando o N que otimiza essa métrica | **Seleção de hiperparâmetro** / model selection — um gesto central de ML. O algoritmo de previsão continua simples; o **procedimento de escolha** é aprendizado a partir de dados. |
| Usar a previsão para decidir compra, estoque ou alerta | Caso de uso de **IA aplicada** (apoio à decisão), independentemente de a previsão vir de SMA, regressão ou rede neural. |

Nesta aula o protagonista intelectual é o segundo gesto: você **treina o
parâmetro N** sob uma métrica e **avalia** o resultado com disciplina
temporal. A SMA é o veículo didático; o ritual métrica → parâmetro é o que
viaja para modelos mais ricos depois.

---

## 4. O preço do erro: duas perdas simétricas e uma assimétrica

Seja \(e = y - \widehat{y}\) o erro (observado menos previsto). Uma **função
de custo** (ou de perda) transforma \(e\) num número que você soma ou média
ao longo do tempo. Ela responde: *quanto dói errar deste jeito?*

### 4.1 Perda quadrática (simétrica) — herança de Gauss e Legendre

$$
L_2(e) = e^2 = (y - \widehat{y})^2.
$$

**Simetria:** \(L_2(e) = L_2(-e)\). Superestimar em 2 dói igual a subestimar
em 2. Erros grandes pesam **desproporcionalmente** (o quadrado).

**Motivação histórica.** No limiar do século XIX, Adrien-Marie Legendre
(1805) e Carl Friedrich Gauss publicaram o método dos **mínimos quadrados**
para ajustar órbitas e medidas astronômicas — notoriamente o planeta anão
Ceres. Minimizar a soma dos \(e^2\) tornou-se o padrão de “melhor ajuste”
linear; a média da perda no conjunto de teste é o **MSE** (*mean squared
error*):

$$
\mathrm{MSE} = \frac{1}{n}\sum_{t=1}^{n}(y_t-\widehat{y}_t)^2.
$$

A raiz \(\mathrm{RMSE}=\sqrt{\mathrm{MSE}}\) devolve a unidade original
(linhas de pedido), ainda sob a mesma filosofia quadrática.

**Minúcia numérica.** Erros \(+1\) e \(-1\): custo \(1\) cada. Erros \(+2\) e
\(-2\): custo \(4\) cada — quatro vezes o custo do erro unitário, não o dobro.

### 4.2 Perda absoluta (simétrica) — a linha de Boscovich e Laplace

$$
L_1(e) = |e| = |y - \widehat{y}|.
$$

**Simetria:** de novo \(L_1(e)=L_1(-e)\). A diferença: o custo cresce **linear**
com a magnitude; um outlier não explode a conta como no \(L_2\).

**Motivação histórica.** Roger Joseph Boscovich (século XVIII) e Pierre-Simon
Laplace desenvolveram ajustes por **desvios absolutos** (*least absolute
deviations*). A média amostral dessa perda é o **MAE** (*mean absolute
error*):

$$
\mathrm{MAE} = \frac{1}{n}\sum_{t=1}^{n}|y_t-\widehat{y}_t|.
$$

O minimizador teórico do MAE sob certas condições é a **mediana** dos erros;
o do MSE, a **média**. Por isso MAE e MSE podem eleger N\* diferentes na
mesma série — e isso é feature, não bug.

**Minúcia numérica.** Erros \(+1\) e \(-1\): custo \(1\). Erros \(+2\) e
\(-2\): custo \(2\). O dobro do erro → dobro do custo, não o quádruplo.

### 4.3 Perda assimétrica linear (LinLin) — quando sobrar dói diferente de faltar

No estoque de artesanato, **ficar sem peça** (demanda maior que a previsão)
pode custar venda perdida e cliente irritado; **produzir ou comprar demais**
pode custar capital parado e espaço. Os dois erros **não** são simétricos.

Defina pesos \(a>0\) (custo por unidade de **subprevisão**, \(y>\widehat{y}\))
e \(b>0\) (custo por unidade de **superprevisão**, \(y<\widehat{y}\)), com
\(a \neq b\):

$$
L_{a,b}(e) =
\begin{cases}
a\,e & \text{se } e \ge 0 \quad (y \ge \widehat{y}),\\[4pt]
b\,(-e) & \text{se } e < 0 \quad (y < \widehat{y}).
\end{cases}
$$

Equivalente compacto: \(L_{a,b}(e) = a\max(e,0) + b\max(-e,0)\).

**Assimetria:** se \(a=3\) e \(b=1\), errar para baixo em 2 custa \(6\); errar
para cima em 2 custa \(2\). A função **penaliza mais o lado caro**.

**Motivação histórica.** O problema do **jornaleiro** (*newsvendor*),
clássico de pesquisa operacional e teoria da decisão: uma única chance de
encomendar antes da demanda revelar-se; sobra e falta têm custos unitários
distintos. Funções de perda assimétricas e a *pinball loss* (quantis) da
previsão probabilística moderna prolongam essa intuição — prever o **quantil**
adequado ao custo relativo \(a/(a+b)\).

**Minúcia numérica (exemplo de sala).** Seja \(y=5\), \(\widehat{y}=3\) →
\(e=+2\). Com \(a=3\), \(b=1\): custo \(3\times 2=6\). Se \(\widehat{y}=7\) →
\(e=-2\): custo \(1\times 2=2\). Mesma magnitude de erro; custos diferentes.

A média amostral \(n^{-1}\sum_t L_{a,b}(e_t)\) é a métrica assimétrica que
você pode otimizar no lugar do MAE ou do MSE.

---

## 5. Dois procedimentos de alto nível

Estes procedimentos são o esqueleto da aula. Modelos futuros (reta, rede,
RAG) repetem a mesma disciplina com outros parâmetros.

### Procedimento A — Treinar parâmetros num conjunto e avaliar noutro

```text
# Variáveis:
# D_treino — observações usadas para fixar parâmetros do algoritmo
# D_teste  — observações guardadas; não entram na escolha dos parâmetros
# θ        — parâmetros (aqui, N da média móvel)
# M        — métrica de qualidade (MAE, MSE, LinLin, …)
# ŷ        — previsões produzidas com θ em D_teste

1. Particione a série no tempo: D_treino = passado; D_teste = futuro relativo
   (holdout temporal; sem embaralhar semanas).
2. Em D_treino (ou por walk-forward só dentro da região permitida), escolha θ.
3. Congele θ.
4. Gere ŷ em D_teste usando apenas informação anterior a cada instante.
5. Calcule M(y, ŷ) em D_teste e relate esse número como desempenho
   fora da amostra de ajuste.
```

**Ideia:** o parâmetro “viu” um pedaço do mundo; a nota final vem de um pedaço
que ele **não** usou para se escolher. Isso controla o otimismo ilusório de
testar no mesmo lugar em que se treinou.

### Procedimento B — Definir a métrica e ajustar o parâmetro para otimizá-la

```text
# Variáveis:
# M     — métrica escolhida a priori (e escrita em prosa + fórmula)
# Θ     — conjunto candidato de parâmetros (ex.: N ∈ {2,3,4,5})
# θ*    — parâmetro selecionado
# score(θ) — valor de M obtido sob o protocolo de avaliação acordado

1. Escreva M com precisão (nome, fórmula, holdout, agregação).
2. Para cada θ em Θ, calcule score(θ) com o Procedimento A (ou walk-forward
   equivalente).
3. θ* ← argmin_θ score(θ)   # ou argmax, se M for utilidade
4. Em empate, aplique um desempate declarado (menor N, maior estabilidade…).
5. Publique a previsão operacional com θ* (aqui: MA(N*) na próxima semana).
```

**Ideia:** primeiro o **critério**, depois a **busca**. Sem M escrito, “melhor
N” não significa nada. Com M escrito, N\* é auditável: qualquer colega
recalcula a tabela e chega ao mesmo escolhido (salvo o desempate).

Na SMA, θ = N. Em mínimos quadrados, θ serão inclinação e intercepto; o
**procedimento** permanece.

---

## 6. Laboratório na série da aula

Arquivo: [`dados/vendas_semanais.csv`](../dados/vendas_semanais.csv).

Sugestão de partição: últimas **4** semanas = `D_teste`; anteriores =
região de treino / walk-forward. Candidatos: \(N \in \{2,3,4,5\}\).

1. Escreva o cartão de **M** (escolha MAE, MSE ou LinLin com \(a,b\)
   explícitos).
2. Monte a tabela \(N \mapsto \mathrm{score}(N)\) no mesmo protocolo.
3. Declare \(N^\star\) e a previsão da próxima semana com MA(\(N^\star\)).
4. Opcional: compare o \(N^\star\) sob MAE com o \(N^\star\) sob MSE ou
   LinLin — eles podem divergir; explique com uma frase.

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


def mae_wf(serie: pd.Series, n: int, k_teste: int) -> float:
    erros = []
    for pos in range(len(serie) - k_teste, len(serie)):
        prev = float(serie.iloc[pos - n : pos].mean())
        erros.append(abs(float(serie.iloc[pos]) - prev))
    return sum(erros) / len(erros)


scores = {n: mae_wf(serie, n, k_teste) for n in (2, 3, 4, 5)}
n_star = min(scores, key=scores.get)
print(scores, "N* =", n_star, "prev =", float(serie.iloc[-n_star:].mean()))
```

O [explorador BI](https://lgallindo.github.io/recomendador-bentoml/demanda/)
visualiza MAE por janela na série da aula. Use-o para conferir o Procedimento
B; no classwork, troque o arquivo.

---

## 7. Exercício (aula) e ponte ao classwork

**Na aula (este CSV):** um produto, cartão de M, tabela N→score, N\*, previsão,
uma figura.

**No classwork:** o mesmo ritual intelectual no CSV da **oficina de kits** —
incluindo calcular, para o kit escolhido, um exemplo numérico de **\(L_2\)**,
**\(L_1\)** e **\(L_{a,b}\)** em pelo menos um instante de teste, e otimizar N
sob a métrica que você eleger (pode ser a média de uma delas).

Detalhe operacional e entrega: pacote Classroom
`ads032-demanda-media-movel`.

---

## Referências rápidas no repositório

| Artefato | Papel |
| --- | --- |
| `dados/vendas_semanais.csv` | Treino/demo da aula |
| `dados/classwork/demanda_semanal_oficina.csv` | Avaliação independente do classwork |
| `material/bi-demanda/` | Painel da série da aula |
| `scripts/validar_vendas_semanais.py` | Sanidade do CSV da loja |
