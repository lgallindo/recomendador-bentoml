# Dados da variante demográfica

No baseline, a feira conhece as peças e as cestas. Aqui a história ganha
**visitantes**: perfis sintéticos e um histórico curto de compras por pessoa.
Esses arrays existem para a afinidade `demo` — o sinal novo desta pasta.

Arquivo único: [`catalogo.json`](catalogo.json).

## Forma

Quatro blocos na raiz. Os dois primeiros ecoam o baseline; os dois últimos são
o que torna esta variante demográfica.

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

Ainda é o pipeline **offline**: lê o JSON, agrega, grava o artefato
`recomendador-demo`. A vitrine só entra depois, no `just serve`, quando manda
`cliente_id` no `POST /recomendar`.

1. `pop` e `cooc` como no baseline (campo `pedidos` + array `cestas`).
2. Para cada `faixa_etaria`, conta quantas vezes cada produto aparece nas
   `compras` de clientes daquela faixa → normaliza pelo máximo da faixa →
   `pop_faixa[faixa][id]`.
3. Grava também o dicionário `clientes` no artefato (o serviço resolve
   `cliente_id` sem reler o JSON).

`regiao_cliente` fica no artefato para a resposta JSON / explicabilidade; a nota
`demo` usa `tecnicas_preferidas`, `polos_interesse` e `pop_faixa`, não a cidade
do cliente (cidade ≠ polo do produto).

O cálculo da nota na inferência e os curls da aula estão no
[`../README.md`](../README.md) desta variante.
