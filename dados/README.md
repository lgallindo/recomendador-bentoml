# Dados (`dados/`)

Catálogo de exemplo usado pelo treino e pelo serviço. Um único arquivo:
[`catalogo.json`](catalogo.json).

## Por que este conjunto existe

O marketplace da aula precisa de produtos com **técnica**, **região** e um sinal de
**demanda** (`pedidos`), mais algumas **cestas** (compras de exemplo) para medir
“aparecem juntos”. O JSON é pequeno de propósito: dá para conferir as contas à mão e
ainda assim exercitar a API de ponta a ponta.

Não é um dump do Banco Mundial nem do PI Origem em produção. É um brinquedo fiel o
bastante para a regra `mesma_técnica + popularidade`.

## Forma do arquivo

```json
{
  "produtos": [ { "id", "nome", "tecnica", "regiao", "pedidos" }, … ],
  "cestas": [ [ "p01", "p02", … ], … ]
}
```

| Campo | Onde | Significado |
| --- | --- | --- |
| `id` | produto | Chave estável (`p01` … `p12`); é o que a API recebe em `produto_na_pagina` |
| `nome` | produto | Rótulo legível na vitrine e na resposta JSON |
| `tecnica` | produto | Família artesanal: `ceramica`, `renda`, `xilogravura`, `cestaria` |
| `regiao` | produto | Polo (Tracunhaém, Alto do Moura, Comunidade do Pilar, …) |
| `pedidos` | produto | Contagem sintética de demanda; vira popularidade no treino |
| `cestas` | raiz | Listas de ids que “saíram juntos”; alimentam a co-ocorrência |

## Conteúdo atual (resumo)

| Técnica | Quantidade | Exemplos |
| --- | ---: | --- |
| ceramica | 3 | Jarro, prato esmaltado, boneca de barro (Tracunhaém) |
| renda | 3 | Rendeira, toalha, caminho de mesa (Alto do Moura) |
| xilogravura | 3 | Xilo, cordel, quadro (Comunidade do Pilar) |
| cestaria | 3 | Cesto, bolsa, sousplat (Pilar / Alto do Moura) |

Há **12 produtos** e **10 cestas**. O produto com mais pedidos é o jarro `p01` (42);
ele é a âncora do exemplo trabalhido em [`../material/calculos-trabalhados.md`](../material/calculos-trabalhados.md).

## Como o treino usa estes dados

1. Lê `produtos` → dicionário por `id`.
2. `popularidade = pedidos`; normaliza pelo máximo.
3. Percorre `cestas` → matriz de co-ocorrência (pares na mesma cesta).
4. Grava tudo no artefato BentoML (`recomendador:…`).

Mudou o JSON? Rode `just treino` de novo na raiz do repositório.

## Limites honestos

- Demanda e cestas são **inventadas para a aula**, não medidas em loja real.
- `regiao` viaja até a resposta da API, mas a regra atual **não ordena por região**.
- Não há usuários, timestamps nem estoque: só catálogo + cestas.
