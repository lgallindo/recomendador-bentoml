# Scripts (`scripts/`)

Utilitários da pasta de aula. Não fazem parte do caminho crítico
`treino → serve → /recomendar`.

| Arquivo | Função |
| --- | --- |
| [`gerar_slides.py`](gerar_slides.py) | Regenera [`../slides/recomendador-bentoml.pptx`](../slides/recomendador-bentoml.pptx) com python-pptx |

```mermaid
flowchart LR
  G["scripts/gerar_slides.py"] -->|"just slides"| P["slides/recomendador-bentoml.pptx"]
```

Na raiz do repositório:

```bash
just slides
```

(isso chama `uv run python scripts/gerar_slides.py`). Edite o **gerador** se mudar a
narrativa; não edite o `.pptx` à mão se quiser que a próxima regeneração preserve
o texto.
