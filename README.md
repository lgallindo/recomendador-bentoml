# Recomendador baseline no BentoML

Pasta **autossuficiente** (pt-BR): dados, treino, serviço e material da aula vivem aqui.

## O que é

Baseline de recomendação (mesma técnica + popularidade, com *fallback* pelos mais
pedidos) exposto como API HTTP com [BentoML](https://docs.bentoml.com/). Dois
arquivos Python: `treino.py` monta o artefato; `service.py` serve o endpoint.

**Não é** filtragem colaborativa por comportamento real. O catálogo e as cestas
em `dados/catalogo.json` são **sintéticos** (artesanato / PE).

## Subir em 2 comandos

Na raiz **desta** pasta:

```bash
just treino
just serve
```

Swagger: <http://127.0.0.1:3000>. Ou:

```bash
just curl-ancora
```

## Material da aula

| Arquivo | Conteúdo |
| --- | --- |
| [`slides/recomendador-bentoml.pptx`](slides/recomendador-bentoml.pptx) | 5 slides (objetivo, diagrama, cálculo, código, mapa IA/AM) |
| [`material/calculos-trabalhados.md`](material/calculos-trabalhados.md) | Contas passo a passo do *score* e da co-ocorrência |
| [`scripts/gerar_slides.py`](scripts/gerar_slides.py) | Regenera o `.pptx` |

## Contrato da API

`POST /recomendar`

| Campo | Tipo | Papel |
| --- | --- | --- |
| `produto_ancora` | string | Produto na ficha (`p01` … `p12`) |
| `limite` | int | Quantos itens (padrão 4) |
| `excluir` | list[string] | Já vistos / já comprados na sessão |

Resposta: `items[]` com `product_id`, `score`, `reason`, `rank`, mais `strategy`
e `fallback_used`.

## Arquivos do serviço

| Arquivo | Função |
| --- | --- |
| `dados/catalogo.json` | Catálogo + cestas sintéticas |
| `treino.py` | Monta artefato e salva no *store* BentoML |
| `service.py` | `@bentoml.service` / `@bentoml.api` |
| `bentofile.yaml` | Empacote futuro (`bentoml build`) |
| `justfile` | `treino`, `serve`, *curls* de demo |

## O que o baseline **não** aprende

- Histórico real de navegação
- Preferências individuais além da lista `excluir`
- “Quem comprou X também comprou Y” em produção (as cestas só ajudam o *score*
  dentro da mesma técnica)

## Próximas aulas (fora deste repositório)

1. **Integrar a API com a vitrine** do marketplace da primeira aula (frontend
   local de catálogo/produto) — o serviço HTTP já existe; a WEB só precisa
   chamar `POST /recomendar`.
2. **Evoluir o baseline para um modelo de aprendizado de máquina** com o módulo
   Microsoft Learn (pt-BR):
   [Fundamentos do aprendizado de máquina](https://learn.microsoft.com/pt-br/training/modules/fundamentals-machine-learning/).

Este repositório **não depende** desses passos para rodar.

## Licença

MIT — ver [`LICENSE`](LICENSE).
