# Dados da variante demográfica

Arquivo único: [`catalogo.json`](catalogo.json).

## Forma

```json
{
  "produtos": [ { "id", "nome", "tecnica", "regiao", "pedidos" }, … ],
  "cestas": [ [ "p01", "p02", … ], … ],
  "clientes": [
    {
      "id", "nome", "faixa_etaria", "regiao_cliente",
      "tecnicas_preferidas", "polos_interesse"
    }
  ],
  "compras": [ { "cliente_id", "itens": [ "p…" ] }, … ]
}
```

| Campo | Significado |
| --- | --- |
| `produtos` / `cestas` | Iguais à ideia do baseline (catálogo + pares na compra) |
| `faixa_etaria` | Faixa do cliente (`18-24`, `25-34`, …) — usada em `pop_faixa` |
| `regiao_cliente` | Onde a pessoa mora / compra (não é o polo do artesão) |
| `tecnicas_preferidas` | Técnicas que o perfil declara gostar |
| `polos_interesse` | Polos artesanais que o perfil declara acompanhar |
| `compras` | Histórico sintético cliente → itens (alimenta popularidade por faixa) |

Há **12 produtos**, **6 clientes** e **12 compras** de exemplo.

## Como o treino usa a demografia

1. `pop` e `cooc` como no baseline (campo `pedidos` + array `cestas`).
2. Para cada `faixa_etaria`, conta quantas vezes cada produto aparece nas
   `compras` de clientes daquela faixa → normaliza pelo máximo da faixa →
   `pop_faixa[faixa][id]`.
3. Grava também o dicionário `clientes` no artefato (o serviço resolve
   `cliente_id` sem reler o JSON).

`regiao_cliente` fica no artefato para a resposta JSON / explicabilidade; a nota
`demo` usa `tecnicas_preferidas`, `polos_interesse` e `pop_faixa`, não a cidade
do cliente (cidade ≠ polo do produto).
