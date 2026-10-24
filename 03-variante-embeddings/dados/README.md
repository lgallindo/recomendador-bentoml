# Dados da variante embeddings

Mesmo catálogo do baseline (`produtos` + `cestas`). O treino e o serviço usam
só os campos de texto do produto — `nome`, `tecnica`, `regiao` — para montar a
frase enviada ao encoder. As `cestas` e `pedidos` **não** entram no score desta
variante (um sinal = uma lição).

Arquivo: [`catalogo.json`](catalogo.json).

| Campo | Uso nesta variante |
| --- | --- |
| `nome`, `tecnica`, `regiao` | texto → embedding → cosseno |
| `id` | chave da API e exclusões |
| `pedidos`, `cestas` | ignorados no score (ficam no JSON por paridade com o baseline) |

Comandos e regra: [`../README.md`](../README.md).
