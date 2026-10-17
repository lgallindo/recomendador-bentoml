# Figuras dos tutoriais

Você pode abrir os PNGs separadamente ou acompanhar suas legendas e descrições
nos tutoriais da pasta [material](../).

| Arquivo | O que você pode observar |
| --- | --- |
| [venn-ia-aprendizado-regras.png](venn-ia-aprendizado-regras.png) | Inclusão entre IA, ML, aprendizado não supervisionado e mineração de associações; posição dos sistemas especialistas clássicos |
| [matriz-cestas.png](matriz-cestas.png) | Presenças nas dez transações originais e ocorrências conjuntas de Jarro e Prato |
| [descoberta-validacao.png](descoberta-validacao.png) | Métricas da mesma regra em dois conjuntos sintéticos separados |
| [marketing-artesanato.png](marketing-artesanato.png) | Ilustração de compras, sugestão de produtos e comparação de apresentações |
| [bi-dispersao.png](bi-dispersao.png) | Suporte e confiança das regras, com contagem de coincidências e cor pelo maior lift de cada grupo |
| [bi-matriz.png](bi-matriz.png) | Lift por conjunto antecedente e consequente; células ausentes não representam zeros |
| [bi-rede.png](bi-rede.png) | Rede direcionada entre conjuntos inteiros, com confiança representada pela espessura |
| [mapa-ia-previsao-demanda.png](mapa-ia-previsao-demanda.png) | Diferença conceitual entre IA/ML e abordagens estatísticas de previsão; média móvel em destaque |
| [serie-media-movel-p01.png](serie-media-movel-p01.png) | Vendas semanais sintéticas de `p01`, previsões retrospectivas MA(4) e previsão seguinte |
| [comparacao-media-movel-mae.png](comparacao-media-movel-mae.png) | MAE walk-forward da previsão ingênua e médias móveis MA(2)–MA(5) |
| [fluxo-walk-forward-demanda.png](fluxo-walk-forward-demanda.png) | Janela temporal, previsão, observação posterior e avanço da avaliação walk-forward |

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

Para reproduzir as três figuras de BI e os dados do
[explorador interativo](../bi/README.md), execute:

```bash
uv run python scripts/gerar_bi_associacao.py
```

As figuras do tutorial de previsão são geradas separadamente pelo
[script de demanda](../../scripts/gerar_figuras_demanda.py), a partir de
`dados/vendas_semanais.csv`:

```bash
uv run python scripts/gerar_figuras_demanda.py
```

Os gráficos são visualizações das contagens sintéticas e da regra MA(4);
nenhuma ilustração deve ser interpretada como evidência de vendas reais.

## Sobre a ilustração da loja

`marketing-artesanato.png` foi criada com a ferramenta integrada de geração de
imagens. É uma ilustração sintética, não uma fotografia nem uma visualização dos
dados. As barras não têm valores medidos. Para comparar instruções de geração
com o resultado visual, você pode consultar o prompt completo abaixo:

```text
Use case: illustration-story. Asset type: wide educational illustration for a Brazilian Portuguese student tutorial on association-rule mining in marketing. Create a polished warm editorial illustration in three connected scenes across a single landscape image: a small Pernambuco craft shop with terracotta jug, glazed ceramic plate, clay doll and woven baskets; purchase receipts represented by simple pictograms leading to a laptop displaying a product-pair suggestion with jug and plate; two alternative shop-page layouts being compared with small outcome bar charts. A human shopkeeper uses the computer. Consistent recognizable jug and plate throughout. Clear uncluttered flat illustration with subtle paper texture, cream background, terracotta, teal and dark blue palette. No lettering, no numbers, no logos, no invented statistical results. Do not depict robots or brains. The image explains purchase records leading to a testable merchandising suggestion, not a proven sales increase. Wide landscape composition.
```
