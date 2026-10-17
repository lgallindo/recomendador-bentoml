# Scripts (`scripts/`)

A aula conta uma história na ordem do *arco* (problema → métricas → pipelines →
baseline → empacote…). O README da raiz documenta o sistema por seções técnicas;
os slides seguem o fio didático. Este script é a ponte: congela esse arco num
`.pptx` reproduzível.

| Arquivo | Papel |
| --- | --- |
| [`minerar_regras_associacao.py`](minerar_regras_associacao.py) | Minera as cestas e gera o CSV da [aula de regras de associação](../material/tutorial-regras-associacao-20261017.md), sem dependências externas |
| [`gerar_slides.py`](gerar_slides.py) | Gera [`../slides/recomendador-bentoml.pptx`](../slides/recomendador-bentoml.pptx) pelo **arco da aula** (ordem própria, distinta do README da raiz); uma variante por vez no deck |

```bash
just slides
```

Depois de editar títulos, prosa ou a sequência em `gerar_slides.py`, rode o
comando acima e recarregue o arquivo no LibreOffice / PowerPoint (um lock
`.~lock.…` indica visualizador com o deck ainda aberto).

Arco e índice: [`../slides/README.md`](../slides/README.md).

Para gerar o relatório de associação, rode na raiz:

```bash
python3 scripts/minerar_regras_associacao.py
```

Padrões: suporte ≥ 0,20, confiança ≥ 0,60 e lift > 1. Opções em `--help`.
O script enumera conjuntos observados; use apenas com cestas pequenas.
