# Contratos de crédito inteiramente sintéticos

Base **sintética** para o
[tutorial de árvores de decisão](../../material/tutorial-arvore-decisao-credito-20261017.md):
loja de móveis e contratos fictícios, separados do catálogo/cestas/vendas do
recomendador. Os arquivos servem à aula; **não** são dados pessoais nem risco
estimado de uma população real.

## Arquivos e unidade de observação

Cada linha representa um contrato de crédito **anteriormente aprovado**, com
informações congeladas no instante da solicitação e seis meses de acompanhamento
completo depois da concessão. Cada ID é um contrato distinto; não simulamos
pessoas com múltiplos contratos. Nenhuma linha representa uma solicitação negada.

| Arquivo | Casos | Uso |
| --- | ---: | --- |
| `cartoes.csv` | 12 | Atividade manual; não faz parte das outras bases |
| `treino.csv` | 240 | Aprender perguntas, cortes e classes das folhas |
| `desenvolvimento.csv` | 80 | Escolher entre configurações de árvore |
| `teste.csv` | 80 | Avaliar uma única configuração já escolhida |

Os grupos foram gerados separadamente com sementes 17, 18 e 19; não são períodos
cronológicos. Os IDs não se repetem. Combinações iguais de características podem
aparecer com resultados diferentes: são contratos distintos, não cópias de uma
pessoa. Os cartões foram construídos à mão e não devem ser adicionados ao treino.

## Dicionário

| Coluna | Tipo / unidade | Significado e disponibilidade |
| --- | --- | --- |
| `id` | Texto | Identificador artificial; somente auditoria, nunca entrada do modelo |
| `renda_mensal` | Inteiro, R$/mês | Renda informada na solicitação; positiva |
| `dividas_mensais` | Inteiro, R$/mês | Parcelas de dívidas existentes declaradas na solicitação |
| `parcela_proposta` | Inteiro, R$/mês | Prestação do novo contrato solicitada |
| `comprometimento_pct` | Número, pontos percentuais | `100 × (dividas_mensais + parcela_proposta) / renda_mensal` |
| `atrasos_anteriores` | Inteiro não negativo | Quantidade de parcelas anteriores que ultrapassaram 30 dias de atraso nos 12 meses **anteriores** à solicitação; histórico completo por construção |
| `atraso_30d_6m` | 0 ou 1 | Alvo observado depois: 1 se alguma parcela do novo contrato ultrapassou 30 dias de atraso dentro dos primeiros seis meses após concessão; 0 caso contrário |

Um contrato com atraso de 10 dias recebe 0; uma parcela paga depois de ultrapassar
30 dias ainda pode produzir 1. O alvo não significa perda definitiva, fraude ou
qualidade moral da pessoa. No mundo real, ausência de histórico e histórico sem
atrasos precisam ser distinguidos; aqui não há valores faltantes.

O modelo usa somente `comprometimento_pct` e `atrasos_anteriores`. As três colunas
monetárias permitem conferir a proporção; renda isolada não entra na árvore.
Esse recorte reduz a carga de leitura da aula, sem demonstrar que essas duas
variáveis sejam suficientes ou adequadas para um sistema de crédito real.

## Receita artificial e reprodução

Na raiz, sem dependências externas:

```bash
python3 scripts/gerar_dados_credito.py
```

Nos três grupos maiores, o gerador sorteia renda, comprometimento, parcela e
histórico. Sorteia o alvo usando a receita:

```text
probabilidade artificial = 0,12
                         + 0,43 se comprometimento > 35
                         + 0,22 se atrasos anteriores >= 2
```

Os sorteios de resultado criam exceções. Essa receita foi escrita para ensino;
os números e limites não vêm de pesquisa sobre crédito. Não existe efeito
causal demonstrado de alterar uma característica. Sementes e tamanhos são fixos.
A seleção de configurações usa desenvolvimento; o teste não altera a receita,
as perguntas ou a escolha do modelo no script.

Não se pode inferir como os solicitantes recusados teriam pago: eles não estão
representados. Tampouco é possível medir desigualdade entre grupos demográficos
com esta base, que não contém essas informações. Não ter atributos sensíveis nas
entradas não comprova ausência de discriminação.
