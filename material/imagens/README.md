# Figuras do tutorial de associação

Você pode abrir os PNGs separadamente ou acompanhar suas legendas e descrições
no [tutorial](../tutorial-regras-associacao-20261017.md).

| Arquivo | O que você pode observar |
| --- | --- |
| [venn-ia-aprendizado-regras.png](venn-ia-aprendizado-regras.png) | Inclusão entre IA, ML, aprendizado não supervisionado e mineração de associações; posição dos sistemas especialistas clássicos |
| [matriz-cestas.png](matriz-cestas.png) | Presenças nas dez transações originais e ocorrências conjuntas de Jarro e Prato |
| [descoberta-validacao.png](descoberta-validacao.png) | Métricas da mesma regra em dois conjuntos sintéticos separados |
| [marketing-artesanato.png](marketing-artesanato.png) | Ilustração de compras, sugestão de produtos e comparação de apresentações |

## Reproduzir os diagramas e gráficos

O [script de figuras](../../scripts/gerar_figuras_associacao.py) usa Matplotlib
e os arquivos JSON do exercício. Na raiz do repositório, com o ambiente do
projeto instalado, execute:

```bash
uv run python scripts/gerar_figuras_associacao.py
```

Os valores da matriz vêm de `dados/catalogo.json`. O gráfico compara essa base
com `material/cestas-validacao-20261017.json`. O diagrama de inclusão é um mapa
conceitual; seus tamanhos não representam medidas dos campos.

## Sobre a ilustração da loja

`marketing-artesanato.png` foi criada com a ferramenta integrada de geração de
imagens. É uma ilustração sintética, não uma fotografia nem uma visualização dos
dados. As barras não têm valores medidos. Para comparar instruções de geração
com o resultado visual, você pode consultar o prompt completo abaixo:

```text
Use case: illustration-story. Asset type: wide educational illustration for a Brazilian Portuguese student tutorial on association-rule mining in marketing. Create a polished warm editorial illustration in three connected scenes across a single landscape image: a small Pernambuco craft shop with terracotta jug, glazed ceramic plate, clay doll and woven baskets; purchase receipts represented by simple pictograms leading to a laptop displaying a product-pair suggestion with jug and plate; two alternative shop-page layouts being compared with small outcome bar charts. A human shopkeeper uses the computer. Consistent recognizable jug and plate throughout. Clear uncluttered flat illustration with subtle paper texture, cream background, terracotta, teal and dark blue palette. No lettering, no numbers, no logos, no invented statistical results. Do not depict robots or brains. The image explains purchase records leading to a testable merchandising suggestion, not a proven sales increase. Wide landscape composition.
```
