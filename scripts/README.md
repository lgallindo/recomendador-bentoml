# Scripts (`scripts/`)

A aula conta uma história na ordem do *arco* (problema → métricas → pipelines →
baseline → empacote…). O README da raiz documenta o sistema por seções técnicas;
os slides seguem o fio didático. Este script é a ponte: congela esse arco num
`.pptx` reproduzível.

| Arquivo | Papel |
| --- | --- |
| [`gerar_slides.py`](gerar_slides.py) | Gera [`../slides/recomendador-bentoml.pptx`](../slides/recomendador-bentoml.pptx) pelo **arco da aula** (ordem própria, distinta do README da raiz); uma variante por vez no deck |

```bash
just slides
```

Depois de editar títulos, prosa ou a sequência em `gerar_slides.py`, rode o
comando acima e recarregue o arquivo no LibreOffice / PowerPoint (um lock
`.~lock.…` indica visualizador com o deck ainda aberto).

Arco e índice: [`../slides/README.md`](../slides/README.md).
