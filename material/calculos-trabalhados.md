# Contas trabalhadas — com nomes de produtos

Usamos o catálogo em `dados/catalogo.json`. O cliente **abriu a página** do
produto **Jarro barro Tracunhaém** (id `p01`, técnica *ceramica*).

Pedimos **4** sugestões. Não excluimos ninguém ainda (`excluir = []`).

## Passo A — popularidade em 0…1

Dividimos os pedidos de cada produto pelo maior número de pedidos do catálogo
(**42**, o próprio jarro).

| Produto | Pedidos | Nota de popularidade |
| --- | ---: | ---: |
| Jarro barro Tracunhaém (`p01`) | 42 | $42/42 = 1{,}00$ |
| Prato esmaltado Tracunhaém (`p02`) | 28 | $28/42 \approx 0{,}67$ |
| Boneca de barro (`p03`) | 19 | $19/42 \approx 0{,}45$ |
| Rendeira Alto do Moura (`p04`) | 35 | $35/42 \approx 0{,}83$ |
| Xilogravura Pilar (`p07`) | 31 | $31/42 \approx 0{,}74$ |

## Passo B — “aparecem juntos” nas cestas de exemplo

Olhamos as cestas do JSON em que o jarro (`p01`) entra. Contamos quantas vezes
cada outro produto aparece **na mesma cesta** que ele. Depois dividimos pelo
maior contador (fica entre 0 e 1).

| Outro produto | Vezes junto do jarro | Nota “juntos” |
| --- | ---: | ---: |
| Prato esmaltado (`p02`) | 3 | $3/3 = 1{,}00$ |
| Boneca de barro (`p03`) | 2 | $2/3 \approx 0{,}67$ |

(O `treino.py` faz isso para todos os pares; aqui só o necessário para o exemplo.)

## Passo C — candidatos da mesma técnica

Técnica do jarro = *ceramica*. Outros de cerâmica (sem o próprio jarro):

- Prato esmaltado (`p02`)
- Boneca de barro (`p03`)

Só **dois**. Pedimos **quatro** → vamos precisar completar depois.

## Passo D — nota de cada candidato da mesma técnica

Fórmula usada no código:

```math
\mathrm{score} = 0{,}7 \times (\text{popularidade}) + 0{,}3 \times (\text{juntos})
```

**Prato (`p02`):**

```math
0{,}7 \times 0{,}67 + 0{,}3 \times 1{,}00 \approx 0{,}47 + 0{,}30 = 0{,}77
```

**Boneca (`p03`):**

```math
0{,}7 \times 0{,}45 + 0{,}3 \times 0{,}67 \approx 0{,}32 + 0{,}20 = 0{,}52
```

Ordem até aqui: Prato → Boneca.

## Passo E — completar até 4 com os mais pedidos

Faltam 2 vagas. Pegamos os produtos com **mais pedidos no catálogo inteiro**,
exceto o jarro e os já escolhidos:

1. Rendeira (`p04`, 35 pedidos)
2. Xilogravura (`p07`, 31 pedidos)

Para esses, a nota no código é só metade da popularidade:

```math
\mathrm{score} = 0{,}5 \times (\text{popularidade})
```

| Produto | Score |
| --- | ---: |
| Rendeira (`p04`) | $0{,}5 \times 0{,}83 \approx 0{,}42$ |
| Xilogravura (`p07`) | $0{,}5 \times 0{,}74 \approx 0{,}37$ |

## Lista final (o que a API devolve)

| # | Produto | Motivo (`reason`) | Score |
| ---: | --- | --- | ---: |
| 1 | Prato esmaltado Tracunhaém | `mesma_tecnica` | ≈ 0,77 |
| 2 | Boneca de barro | `mesma_tecnica` | ≈ 0,52 |
| 3 | Rendeira Alto do Moura | `complemento_popularidade` | ≈ 0,42 |
| 4 | Xilogravura Pilar | `complemento_popularidade` | ≈ 0,37 |

Campo `complemento_usado`: **true** (porque só havia 2 cerâmicas).

Conferir no ar:

```bash
just curl-exemplo
```
