# Slides (`slides/`)

Apresentação curta da aula (gerada por código). Os diagramas da sessão estão
**dentro do deck**, não neste README.

| Arquivo | Conteúdo |
| --- | --- |
| [`recomendador-bentoml.pptx`](recomendador-bentoml.pptx) | Objetivo, fluxo↔código, `treino.py`, exemplo do jarro, código, mapa IA |

```mermaid
flowchart LR
  S["../scripts/gerar_slides.py"] -->|"just slides"| D["recomendador-bentoml.pptx"]
```

Regenerar:

```bash
just slides
```

Arquivos de lock temporários do LibreOffice (`.~lock.…`) não entram no git.
