# Scripts (`scripts/`)

Utilitários da pasta de aula. Não fazem parte do caminho crítico
`treino → serve → /recomendar`.

| Arquivo | Função |
| --- | --- |
| [`gerar_slides.py`](gerar_slides.py) | Regenera [`../slides/recomendador-bentoml.pptx`](../slides/recomendador-bentoml.pptx) com python-pptx |

Na raiz do repositório:

```bash
just slides
```

(isso chama `uv run python scripts/gerar_slides.py` com o grupo `dev` se
necessário). Edite o gerador se mudar a narrativa dos slides; não edite o `.pptx`
à mão se quiser que a próxima regeneração preserve o texto.
