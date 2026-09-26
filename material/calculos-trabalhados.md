# Cálculos trabalhados — baseline de recomendação

Complemento da aula. Todas as contas usam o catálogo em `dados/catalogo.json`.
Nada de rede neural: só normalização, co-ocorrência e a fórmula do *score*.

## 1. Popularidade normalizada

Para cada produto \(i\):

\[
\mathrm{pop\_norm}(i) = \frac{\mathrm{pedidos}(i)}{\max_j \mathrm{pedidos}(j)}
\]

No catálogo, o máximo de pedidos é **42** (`p01`).

| ID | Pedidos | \(\mathrm{pop\_norm}\) |
| --- | ---: | ---: |
| `p01` | 42 | \(42/42 = 1{,}0000\) |
| `p02` | 28 | \(28/42 \approx 0{,}6667\) |
| `p03` | 19 | \(19/42 \approx 0{,}4524\) |
| `p04` | 35 | \(35/42 \approx 0{,}8333\) |
| `p05` | 22 | \(22/42 \approx 0{,}5238\) |
| `p06` | 11 | \(11/42 \approx 0{,}2619\) |

## 2. Co-ocorrência nas cestas (similaridade)

Cada cesta é um conjunto de ids. Para cada par \(\{a,b\}\) na mesma cesta,
somamos \(1\) em ambas as direções. Depois, para cada âncora \(a\), dividimos
pelo **máximo** entre os vizinhos de \(a\) (fica entre 0 e 1).

Exemplo parcial com as cestas que envolvem `p01`:

| Cesta | Pares que tocam `p01` |
| --- | --- |
| `p01, p02, p03` | (`p01`,`p02`), (`p01`,`p03`) |
| `p01, p02` | (`p01`,`p02`) |
| `p01, p10` | (`p01`,`p10`) |
| `p02, p03, p01` | (`p01`,`p02`), (`p01`,`p03`) |

Contagens brutas a partir de `p01` (só estes pares):

| Vizinho | Contagem |
| --- | ---: |
| `p02` | 3 |
| `p03` | 2 |
| `p10` | 1 |

Máximo = 3 → similaridade:

| Vizinho | \(\mathrm{sim}(\mathrm{p01}, \cdot)\) |
| --- | ---: |
| `p02` | \(3/3 = 1{,}00\) |
| `p03` | \(2/3 \approx 0{,}67\) |
| `p10` | \(1/3 \approx 0{,}33\) |

(O `treino.py` calcula isso para **todas** as cestas do JSON.)

## 3. Score na mesma técnica

Se o candidato tem a **mesma técnica** da âncora:

\[
\mathrm{score} = 0{,}7 \cdot \mathrm{pop\_norm} + 0{,}3 \cdot \mathrm{sim}
\]

Âncora **`p01`** (cerâmica). Candidatos cerâmica: `p02`, `p03`.

**`p02`:**

\[
0{,}7 \times 0{,}6667 + 0{,}3 \times 1{,}00 = 0{,}4667 + 0{,}3000 = 0{,}7667
\]

**`p03`:**

\[
0{,}7 \times 0{,}4524 + 0{,}3 \times 0{,}6667 \approx 0{,}3167 + 0{,}2000 = 0{,}5167
\]

Ordem: `p02` (0,7667) → `p03` (0,5167).

## 4. Fallback por popularidade global

Pedimos `limite = 4`, mas só há **2** outros produtos de cerâmica. Faltam 2
vagas → `fallback_used = true`.

Completamos com os mais pedidos do catálogo **excluindo** a âncora e os já
escolhidos. Os líderes são `p01` (excluído), depois `p04` (35) e `p07` (31).

Para *fallback*, o código usa:

\[
\mathrm{score} = 0{,}5 \cdot \mathrm{pop\_norm}
\]

| ID | \(\mathrm{pop\_norm}\) | Score *fallback* | `reason` |
| --- | ---: | ---: | --- |
| `p04` | 0,8333 | 0,4167 | `fallback_popularidade` |
| `p07` | \(31/42 \approx 0{,}7381\) | 0,3690 | `fallback_popularidade` |

Lista final para `p01`, `limite=4`, `excluir=[]`:

1. `p02` — `mesma_tecnica` — 0,7667  
2. `p03` — `mesma_tecnica` — 0,5167  
3. `p04` — `fallback_popularidade` — 0,4167  
4. `p07` — `fallback_popularidade` — 0,3690  

Confira com:

```bash
just curl-ancora
```

## 5. Por que isso ainda não é “AM clássico”

- Os pesos \(0{,}7\) e \(0{,}3\) foram **escolhidos à mão**, não estimados por
  perda / gradiente.
- Não há conjunto de treino/teste com rótulo de “clicou / comprou”.
- A co-ocorrência é uma tabela de contagem, não um modelo ajustado.

Nas aulas seguintes, o módulo
[Fundamentos do aprendizado de máquina](https://learn.microsoft.com/pt-br/training/modules/fundamentals-machine-learning/)
serve para substituir essa regra por um modelo treinado — sem abandonar o
contrato HTTP do BentoML.
