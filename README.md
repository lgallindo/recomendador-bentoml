# Recomendador no BentoML

Pasta **autossuficiente** (pt-BR): dados, treino, serviço e material da aula.

## Objetivo

Dado o **produto que o cliente está vendo na página**, devolver uma lista curta
de **outros produtos** (mesma técnica artesanal, priorizando os mais pedidos).
Se não houver candidatos suficientes, completar com os mais pedidos do catálogo.

## Entrada e saída

**Entrada** (`POST /recomendar`):

| Campo | Exemplo | Significado |
| --- | --- | --- |
| `produto_na_pagina` | `"p01"` | Id do produto aberto na tela |
| `limite` | `4` | Quantos produtos sugerir |
| `excluir` | `[]` | Ids que não devem aparecer (já vistos / já comprados) |

**Saída:** JSON com `items` (id, nome, técnica, região, nota `score`, motivo
`reason`, posição `rank`).

## Como subir

```bash
just treino
just serve
```

Swagger: <http://127.0.0.1:3000> · demo: `just curl-exemplo`

## Fluxo ↔ arquivos

| Passo | Arquivo |
| --- | --- |
| Catálogo e cestas de exemplo | `dados/catalogo.json` |
| Calcular popularidade / co-ocorrência e gravar | `treino.py` |
| Receber pedido HTTP e montar a lista | `service.py` |
| Empacotar depois (opcional) | `bentofile.yaml` |

## Material da aula

| Arquivo | Conteúdo |
| --- | --- |
| [`slides/recomendador-bentoml.pptx`](slides/recomendador-bentoml.pptx) | 5 slides |
| [`material/calculos-trabalhados.md`](material/calculos-trabalhados.md) | Contas com nomes de produtos |
| [`scripts/gerar_slides.py`](scripts/gerar_slides.py) | Regenera o `.pptx` |

## Próximas aulas (fora deste repositório)

1. Ligar esta API à vitrine do marketplace da primeira aula.
2. Evoluir a regra para um modelo de AM com
   [Fundamentos do aprendizado de máquina](https://learn.microsoft.com/pt-br/training/modules/fundamentals-machine-learning/)
   (Microsoft Learn, pt-BR).

Este repositório **não depende** desses passos para rodar.

## Licença

**GPL-3.0** — ver [`LICENSE`](LICENSE).

Dependências principais (licenças próprias, não alteram a licença deste código):
BentoML (Apache-2.0), python-pptx (MIT, só para gerar slides).
