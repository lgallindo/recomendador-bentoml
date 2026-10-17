# Como minerar e relatar regras de associação

Tutorial para um exercício de 40 minutos. Ao final, você deverá conseguir calcular
suporte, confiança e lift, ler um relatório de regras e justificar quais padrões
merecem investigação. Os dados são sintéticos: os resultados descrevem estas
dez cestas, sem constituir evidência sobre consumidores reais.

| Tempo | Atividade |
| --- | --- |
| 5 min | Ler as transações e formular a pergunta |
| 8 min | Construir as três métricas a partir de contagens |
| 7 min | Calcular uma regra e sua inversa |
| 7 min | Minerar itemsets e gerar regras |
| 8 min | Comparar resultados e escrever um relato |
| 5 min | Resolver o exercício e discutir a interpretação |

## 1. A pergunta e as transações

Uma loja de artesanato quer investigar: **quais produtos tendem a aparecer
juntos nas compras?** Uma regra como `{Jarro} → {Prato}` resume uma associação
entre presenças na mesma transação. A seta indica qual conjunto condiciona a
análise; não indica ordem de compra nem causa.

Usaremos somente `cestas` de [`dados/catalogo.json`](../dados/catalogo.json).
Cada linha é uma transação. A ordem dos produtos dentro dela não importa;
repetir um produto na mesma cesta não aumenta sua contagem. Duas linhas com os
mesmos itens contam como duas transações, pois representam compras distintas.

| Cesta | Itens |
| --- | --- |
| 1 | p01, p02, p03 |
| 2 | p01, p02 |
| 3 | p04, p05, p06 |
| 4 | p04, p05 |
| 5 | p07, p08 |
| 6 | p07, p08, p09 |
| 7 | p10, p11 |
| 8 | p01, p10 |
| 9 | p04, p07 |
| 10 | p02, p03, p01 |

| ID | Produto | Número de cestas |
| --- | --- | ---: |
| p01 | Jarro barro Tracunhaém | 4 |
| p02 | Prato esmaltado Tracunhaém | 3 |
| p03 | Boneca de barro | 2 |
| p04 | Rendeira Alto do Moura | 3 |
| p05 | Toalha de renda | 2 |
| p06 | Caminho de mesa renda | 1 |
| p07 | Xilogravura Pilar | 3 |
| p08 | Cordel ilustrado | 2 |
| p09 | Quadro xilo colorido | 1 |
| p10 | Cesto de palha | 2 |
| p11 | Bolsa de palha | 1 |
| p12 | Sousplat de palha | 0 |

Há 12 produtos cadastrados, mas apenas 11 observados nas cestas. `p12` tem
suporte zero nesta amostra. Os campos `pedidos` e a série de vendas semanais
não participam das contas: todas as frequências abaixo vêm destas dez transações.

## 2. Três perguntas, três denominadores

Sejam A e B conjuntos de itens não vazios e sem itens em comum.
`n(A)` é o número de cestas contendo **todos** os itens de A; `N` é o total
de cestas. `A ∪ B` reúne os itens dos dois lados.

### Suporte: com que frequência os dois lados aparecem juntos?

$$
\operatorname{suporte}(A\rightarrow B)=\frac{n(A\cup B)}{N}
$$

O suporte da regra é o suporte do conjunto completo. Não confundir com
suporte do antecedente `n(A)/N` ou do consequente `n(B)/N`.

### Confiança: entre as cestas com A, quantas também contêm B?

$$
\operatorname{confianca}(A\rightarrow B)=\frac{n(A\cup B)}{n(A)}
$$

É a frequência condicional observada de B dado A. O denominador muda ao
inverter a regra, portanto a confiança pode mudar. Só calculamos quando `n(A)>0`.

### Lift: quanto a confiança supera a frequência habitual de B?

$$
\operatorname{lift}(A\rightarrow B)
=\frac{\operatorname{confianca}(A\rightarrow B)}{n(B)/N}
=\frac{N\,n(A\cup B)}{n(A)n(B)}
$$

| Valor | Leitura na amostra |
| --- | --- |
| Lift > 1 | Os conjuntos ocorrem juntos mais que o esperado sob independência |
| Lift = 1 | A co-presença coincide com a frequência esperada sob independência |
| Lift < 1 | Os conjuntos ocorrem juntos menos que o esperado sob independência |

Lift 2,5 significa **2,5 vezes a frequência de referência**, não 2,5% nem
aumento de 250%. Suporte e confiança ficam entre 0 e 1; lift pode ultrapassar 1.
Essas interpretações seguem as definições da
[documentação de regras de associação do mlxtend](https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/association_rules/).

## 3. Conta completa: Jarro → Prato

Jarro (`p01`) aparece nas cestas 1, 2, 8 e 10: `n(A)=4`.
Prato (`p02`) aparece nas cestas 1, 2 e 10: `n(B)=3`.
Ambos aparecem nas cestas 1, 2 e 10: `n(A ∪ B)=3`. Temos `N=10`.

| Métrica | Cálculo | Resultado |
| --- | --- | --- |
| Suporte do antecedente | 4/10 | 40% |
| Suporte do consequente | 3/10 | 30% |
| Suporte da regra | 3/10 | 30% |
| Confiança | 3/4 | 75% |
| Lift | 0,75/0,30 | 2,50 |

**Relato:** “Jarro e Prato aparecem juntos em 3 das 10 cestas (suporte 30%).
Das 4 cestas com Jarro, 3 também contêm Prato (confiança 75%). A frequência
de Prato nesse grupo é 2,5 vezes sua frequência geral de 30% (lift 2,50).”

Agora inverta: **Prato → Jarro**. O suporte permanece 30%, a confiança passa
a `3/3=100%` e o lift é `1/0,40=2,50`. Para a regra inversa, suporte e lift
são iguais, mas a confiança pode diferir. Os 100% descrevem apenas três casos;
não garantem o comportamento da próxima compra.

## 4. Como as regras são mineradas

Escolhemos, para esta demonstração:

- Suporte mínimo **20%**, inclusive: pelo menos 2 das 10 cestas.
- Confiança mínima **60%**, inclusive.
- Lift **estritamente maior que 1**, para relatar associações positivas.

São escolhas didáticas, não limites universais. Defina os critérios e o escopo
antes de selecionar exemplos. Reduzir o suporte pode revelar padrões raros,
mas também produz regras sustentadas por poucas observações.

O processo tem duas etapas:

1. **Encontrar conjuntos frequentes.** Contar itemsets e reter os que atendem
   ao suporte. `{p01,p02}` tem suporte 30%; `{p01,p02,p03}` tem suporte 20%.
2. **Gerar e filtrar regras.** Para cada conjunto frequente S com pelo menos
   dois itens, escolher cada subconjunto próprio não vazio A como antecedente
   e usar `B = S − A`. Calcular confiança e lift; aplicar os filtros.

O trio `{p01,p02,p03}` gera seis candidatas, incluindo
`{p01,p02} → {p03}` e `{p01} → {p02,p03}`. Um lado com vários itens exige
que **todos** estejam presentes. A segunda candidata tem confiança `2/4=50%`
e é descartada pelo limite de 60%.

Apriori economiza trabalho usando a propriedade: **todo subconjunto de um
itemset frequente também é frequente**. Assim, se um conjunto não alcança o
suporte mínimo, seus superconjuntos podem ser podados. Veja a
[documentação do Apriori](https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/apriori/).
Nosso script enumera os subconjuntos observados diretamente para deixar as
contas visíveis; ele não implementa Apriori. O custo cresce exponencialmente
com o tamanho da cesta, portanto esta implementação é para a pequena base da aula.

### Executar e abrir o relatório

Na raiz do repositório, com Python 3, sem instalar pacotes:

```bash
python3 scripts/minerar_regras_associacao.py
```

Resultado esperado: **10 cestas; 14 regras**. O arquivo
[`regras-associacao-20261017.csv`](regras-associacao-20261017.csv) inclui nomes,
IDs, contagens, métricas e os três limites usados. Suporte e confiança estão
em proporções: `0.300000` significa 30%. Decimais usam ponto. Os filtros usam
frações exatas; o CSV arredonda para seis casas somente na exportação.

Para experimentar outro filtro e preservar o relatório da aula:

```bash
python3 scripts/minerar_regras_associacao.py --suporte-minimo 0.3 --confianca-minima 0.75 --saida material/regras-experimento.csv
```

A ordenação do relatório é lift decrescente, depois confiança e suporte
decrescentes, com desempate pelos IDs. Essa ordem facilita a inspeção e não
define automaticamente a melhor ação comercial.

## 5. Resultados completos e comparação

Abreviações: J = Jarro (`p01`), P = Prato (`p02`), B = Boneca (`p03`),
R = Rendeira (`p04`), T = Toalha (`p05`), X = Xilogravura (`p07`),
C = Cordel (`p08`). Chaves denotam conjuntos.

| Regra | n(A) | n(B) | Juntos | Suporte | Confiança | Lift |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| {J,B} → P | 2 | 3 | 2 | 20% | 100% | 3,33 |
| B → P | 2 | 3 | 2 | 20% | 100% | 3,33 |
| B → {J,P} | 2 | 3 | 2 | 20% | 100% | 3,33 |
| T → R | 2 | 3 | 2 | 20% | 100% | 3,33 |
| C → X | 2 | 3 | 2 | 20% | 100% | 3,33 |
| {J,P} → B | 3 | 2 | 2 | 20% | 66,7% | 3,33 |
| P → B | 3 | 2 | 2 | 20% | 66,7% | 3,33 |
| P → {J,B} | 3 | 2 | 2 | 20% | 66,7% | 3,33 |
| R → T | 3 | 2 | 2 | 20% | 66,7% | 3,33 |
| X → C | 3 | 2 | 2 | 20% | 66,7% | 3,33 |
| P → J | 3 | 4 | 3 | 30% | 100% | 2,50 |
| {P,B} → J | 2 | 4 | 2 | 20% | 100% | 2,50 |
| B → J | 2 | 4 | 2 | 20% | 100% | 2,50 |
| J → P | 4 | 3 | 3 | 30% | 75% | 2,50 |

Prato → Boneca tem lift maior que Jarro → Prato, mas ocorre em menos cestas.
O primeiro destaca uma associação proporcionalmente mais forte; o segundo
abrange mais transações. Relate ambos os aspectos antes de sugerir uma ação.

Algumas regras são redundantes: nesta amostra, adicionar Jarro ao antecedente
de Boneca → Prato não altera os casos cobertos nem as métricas. Um relatório
curto pode priorizar a regra mais simples e declarar como removeu redundâncias.
O CSV preserva todas as 14 para permitir auditoria.

### Por que confiança alta não basta?

**Exemplo hipotético separado, fora do JSON:** em 100 cestas, B está em 90;
A está em 10; ambos estão em 8. A regra A → B tem suporte 8%, confiança 80%
e lift `0,80/0,90 ≈ 0,89`. Apesar dos 80%, B é menos frequente entre cestas
com A que na amostra inteira. O lift revela essa diferença de referência.

## 6. Como escrever o relatório

Comece pela origem e pelo tamanho da amostra, unidade de transação, período
(aqui: exemplos sintéticos sem período real), critérios de seleção e método.
Apresente a regra por nome, suas contagens e as três métricas. Finalize com
uma interpretação e uma decisão proporcional à evidência.

Modelo reutilizável:

> Na base [origem/período], com N transações, usamos suporte ≥ […], confiança
> ≥ […] e lift > […]. A regra A → B aparece em […] transações (suporte […]).
> Entre […] transações com A, […] incluem B (confiança […]), enquanto B ocorre
> em […] da base inteira. O lift […] indica […]. Propomos investigar […],
> considerando o número de observações e validando em novos dados.

Para a loja, uma hipótese seria testar exposição conjunta de Jarro e Prato.
As métricas da amostra não demonstram que essa exposição aumentará vendas.
Em uso real, avalie estabilidade em outro período e faça um teste da intervenção.

Evite relatar apenas as maiores confianças ou lifts. Declare quantas regras
passaram nos filtros, não esconda a contagem absoluta e considere redundância.
Esta base minúscula serve para aprender a conta; associações observadas podem
ser instáveis. Associação não estabelece causalidade nem sequência temporal.

## 7. Exercício e gabarito

**Antes de mostrar o gabarito:** calcule Prato → Boneca. Escreva uma frase
para cada métrica, compare com a regra inversa e decida se passa nos filtros.
Depois responda: por que Jarro → {Prato,Boneca} não aparece no relatório?

**Gabarito:** Prato aparece em 3 cestas; Boneca em 2; ambos nas cestas 1 e 10.
Suporte `2/10=20%`; confiança `2/3≈66,7%`; lift `(2/3)/(2/10)=10/3≈3,33`.
Passa nos três filtros. A inversa tem confiança `2/2=100%`, com o mesmo
suporte e lift. “Em 2 das 10 cestas há Prato e Boneca; dois terços das cestas
com Prato incluem Boneca, cerca de 3,33 vezes a frequência geral de Boneca.”
Jarro → {Prato,Boneca} tem suporte 20% e lift 2,50, mas confiança de 50%:
é excluída pelo filtro de confiança.

## Referências

- [mlxtend: definições e geração de regras de associação](https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/association_rules/).
- [mlxtend: Apriori e itemsets frequentes](https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/apriori/).
- [Dados usados nesta aula](../dados/catalogo.json) e [script reproduzível](../scripts/minerar_regras_associacao.py).

---

**Nota de rodapé — relação com o recomendador existente.** A popularidade atual
é `pedidos / max(pedidos)`, calculada a partir de outro agregado; suporte usa
frequências nas cestas. A co-ocorrência começa com a mesma contagem de pares,
mas divide cada linha pelo maior contador de parceiros do produto de origem:
`cooc[A][B] = n({A,B}) / max_C n({A,C})`. As contagens são simétricas;
essa normalização pode produzir scores diferentes nos dois sentidos.
Confiança divide pelo número de cestas com o antecedente; lift também considera
a frequência do consequente. Portanto, co-ocorrência normalizada não é confiança
nem lift. A fórmula `0,7 × pop + 0,3 × cooc` e o filtro por técnica são escolhas
manuais do serviço. Aqui, as regras são geradas a partir de conjuntos observados
e selecionadas pelos limites declarados; este tutorial não modifica a API.
