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
| [bi-demanda-serie-p01.png](bi-demanda-serie-p01.png) | Espelho estático do explorador: série de `p01` com MA(4) e janela de teste |
| [bi-demanda-erros-p01.png](bi-demanda-erros-p01.png) | Espelho estático do explorador: erros absolutos de MA(4) no teste de `p01` |
| [bi-demanda-mae-janelas.png](bi-demanda-mae-janelas.png) | Espelho estático do explorador: MAE agregado ingênua e MA(2)–MA(5) |
| [regressao-minimos-quadrados-p01.png](regressao-minimos-quadrados-p01.png) | Reta de mínimos quadrados e extrapolação sintética para `p01` |
| [distribuicao-poisson-p01.png](distribuicao-poisson-p01.png) | Probabilidades de contagens futuras para `p01` segundo regressão de Poisson |

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

Os espelhos estáticos do explorador de demanda (`bi-demanda-*.png`) vêm de:

```bash
uv run python scripts/gerar_bi_demanda.py
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

## Figuras do tutorial de crédito

As figuras abaixo acompanham o
[tutorial de árvores de decisão e crédito](../tutorial-arvore-decisao-credito-20261017.md).
As contagens são inteiramente sintéticas e vêm de `dados/credito/`. O script
`uv run python scripts/gerar_figuras_credito.py` reproduz os oito diagramas e
gráficos e o PDF de cartões; execute antes a avaliação padrão com
`uv run python scripts/arvore_credito.py --avaliar-teste --saida material/credito`.

| Arquivo | Conteúdo |
| --- | --- |
| [credito-loja.png](credito-loja.png) | Cena ilustrativa de solicitação, informações e análise em uma loja de móveis |
| [credito-linha-tempo.png](credito-linha-tempo.png) | Disponibilidade das entradas na solicitação e observação posterior do alvo |
| [credito-comprometimento.png](credito-comprometimento.png) | Renda e compromissos monetários do cartão C04 |
| [credito-pilhas.png](credito-pilhas.png) | Os 12 cartões antes e depois da divisão em 35% |
| [credito-arvore-manual.png](credito-arvore-manual.png) | Perguntas, previsões e contagens da atividade manual |
| [credito-arvore-curta.png](credito-arvore-curta.png) | Árvore aprendida com duas perguntas por caminho e contagens do treino |
| [credito-arvore-profunda.png](credito-arvore-profunda.png) | Início da árvore profunda; ramos omitidos são explicitamente marcados |
| [credito-comparacao.png](credito-comparacao.png) | Acertos no treino e desenvolvimento para as duas árvores |
| [credito-matriz-teste.png](credito-matriz-teste.png) | Contagens de previsão versus resultado no teste final da árvore selecionada |

A cena `credito-loja.png` foi criada com a ferramenta integrada imagegen e
salva nesta pasta. É uma ilustração narrativa; os pictogramas não são dados nem
uma representação fiel da árvore aprendida. Prompt final usado:

```text
Use case: illustration-story. Asset type: wide opening illustration for a Brazilian Portuguese educational tutorial about decision trees and installment credit. Primary request: three connected scenes across one landscape: in a small Brazilian furniture store a customer discusses an installment purchase with a shop assistant, a desk with anonymous application sheets and simple branching question pictograms, and the assistant reviewing a computer with a small question tree while the customer waits. Warm approachable editorial flat illustration with subtle paper texture, cream background, teal, terracotta and dark blue palette. Ordinary diverse adults, dignified equal treatment, simple sofa and dining furniture in background. Clear uncluttered composition. No text, no letters, no numbers, no brands, no currency symbols, no robots, no brain icons, no appearance-based judgments, no automatic approval stamp. Illustrate people using records and questions to support a review, not certainty about future repayment.
```
