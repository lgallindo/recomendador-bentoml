# Marketing orientado por dados: como minerar e relatar regras de associação

Tutorial para um exercício de 40 minutos. Ao final, você deverá conseguir calcular
suporte, confiança e lift, ler um relatório de regras e justificar quais padrões
merecem investigação e transformar esses padrões em hipóteses de marketing.
Os dados são sintéticos: os resultados descrevem estas
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

### O fio da aula: tornar o marketing centrado em dados

A loja precisa decidir o que expor junto, que oferta combinada experimentar e
qual sugestão apresentar no carrinho. Nesta aula, **marketing centrado em dados**
significa tornar explícita a ligação entre pergunta comercial, registros de
compra, critérios de análise, ação proposta e avaliação de resultado. As regras
de associação ajudam a construir essa ligação: tornam um padrão de consumo
mensurável, comunicável e verificável.

Essa é nossa aplicação didática de três perspectivas da literatura de marketing:
a pesquisa começa com um problema de decisão e organiza a coleta e a análise
(Malhotra, 2019); as métricas relacionam decisões a desempenho
(Farris et al., 2012); a tecnologia deve contribuir para o valor entregue na
jornada do cliente (Kotler, Kartajaya e Setiawan, 2021). As referências
bibliográficas e os links de consulta estão ao final.

| Passo | Pergunta da equipe de marketing | Entrega da análise |
| --- | --- | --- |
| Decisão | Que combinação de produtos vale testar na vitrine? | Objetivo comercial explícito |
| Evidência | Quais itens aparecem juntos nas compras registradas? | Transações e contagens auditáveis |
| Comparação | O padrão é frequente? Supera a frequência habitual do item? | Suporte, confiança e lift |
| Ação | Como transformar esse padrão em uma oferta relevante? | Hipótese de exposição conjunta ou venda complementar |
| Aprendizado | A mudança melhorou o resultado para a loja e o cliente? | Teste da ação com métricas definidas previamente |

**Fala sugerida para abrir a aula:** “Vamos partir de uma decisão de marketing:
que produtos apresentar juntos? Usaremos compras registradas para descobrir
padrões, explicar a força da evidência e propor um teste. A conta ganha sentido
quando ajuda a escolher uma ação e a aprender com seu resultado.”

O cadastro e o histórico de compras também aparecem no material brasileiro do
[Sebrae sobre cadastro de clientes](https://meuatendimento.sebrae.com.br/sites/PortalSebrae/ufs/ap/artigos/como-elaborar-um-cadastro-de-clientes%2Cd1440d36ecfa1610VgnVCM1000004c00210aRCRD)
como insumos para identificar oportunidades de vendas. Para as regras desta
aula basta o conjunto de itens por transação; identificar pessoas é desnecessário.

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

Na discussão de marketing, suporte informa o alcance observado do padrão;
confiança informa a frequência de B entre as compras com A; lift compara essa
frequência com uma referência. Nenhuma das três mede, por si, lucro ou retorno
de campanha. Em especial, o **lift da regra não é o aumento de vendas causado
por uma campanha**: ele descreve uma associação nas transações analisadas.

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

### Da regra ao plano de marketing

O quadro abaixo é uma proposta de aplicação à loja, não um experimento realizado
nem uma conclusão dos dados sintéticos.

| Elemento | Exemplo de decisão documentada |
| --- | --- |
| Evidência exploratória | Jarro → Prato: suporte 30%, confiança 75%, lift 2,50 em dez cestas sintéticas |
| Hipótese comercial | Apresentar Prato como complemento ao Jarro pode facilitar a descoberta do produto |
| Ação a testar com dados reais | Exibir a sugestão de Prato na página do Jarro |
| Comparação | Distribuir aleatoriamente visitantes elegíveis entre a página atual e a página com sugestão; manter o visitante no mesmo grupo |
| Métrica principal | Pedidos contendo Prato por visitante elegível de cada grupo |
| Métricas complementares | Conversão total, receita e margem de contribuição por visitante; devoluções |
| Critério de decisão | Definir antes do teste o efeito mínimo relevante, tamanho da amostra, duração e análise de incerteza |
| Aprendizado | Decidir se adota, ajusta ou abandona a sugestão com base no efeito estimado e no custo da ação |

Cliques na sugestão ajudam a entender o processo, mas o resultado comercial
precisa ser avaliado com compras e custos. Oferecer desconto para montar um
combo é outra intervenção, com impacto próprio sobre margem; deve ter sua
hipótese e sua avaliação. Um teste que gere mais pedidos pode ainda reduzir
o resultado financeiro se o custo da oferta superar o ganho.

Separar a descoberta de uma associação da avaliação de uma ação é coerente com
a discussão de pesquisa experimental em marketing de Hernandez, Basso e
Brandão (2014). O desenho acima é uma adaptação didática: o artigo fundamenta
a lógica experimental, sem avaliar esta loja ou estes produtos.

**Pergunta para a turma:** “Se o lift é 2,50, podemos prometer aumento de 150%
nas vendas ao mudar a vitrine?” Resposta: não. Esse número compara frequências
observadas; o efeito da mudança precisa ser estimado em um teste apropriado.

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

## Referências bibliográficas e roteiro de leitura

Priorizamos edições brasileiras em português e produção brasileira de marketing.
As obras de marketing dão o enquadramento gerencial; a documentação técnica
fundamenta as fórmulas e a mineração. As indicações abaixo se baseiam em fichas
editoriais, registros bibliográficos e materiais públicos consultados; não
atribuem às obras exemplos ou páginas internas que não foram verificados.
Links de livros levam a informações bibliográficas ou editoriais, sem pressupor
acesso gratuito ao texto integral. Consulta dos materiais on-line: 17 out. 2026.

### Marketing, pesquisa e decisão — português brasileiro

1. KOTLER, Philip; KARTAJAYA, Hermawan; SETIAWAN, Iwan.
   **Marketing 5.0: tecnologia para a humanidade**. Tradução: André Fontenelle.
   Rio de Janeiro: Sextante, 2021. ISBN 9786555642407.
   [Ficha e apresentação da editora](https://sextante.com.br/products/marketing-5-0).
   **Na aula:** enquadrar o uso da tecnologia na criação de valor ao longo da
   jornada do cliente; orientar a discussão sobre relevância da sugestão.

2. MALHOTRA, Naresh K. **Pesquisa de marketing: uma orientação aplicada**.
   7. ed. Porto Alegre: Bookman, 2019. ISBN impresso 9788582605097.
   [Ficha e sumário da editora](https://loja.grupoa.com.br/novo/pesquisa-de-marketing9788582605103-p1005514).
   **Na aula:** ligar o problema de decisão ao desenho da pesquisa, à análise
   de dados e à comunicação das recomendações.

3. FARRIS, Paul W.; BENDLE, Neil T.; PFEIFER, Phillip E.; REIBSTEIN, David J.
   **Métricas de marketing: o guia definitivo de avaliação do desempenho do
   marketing**. 2. ed. Porto Alegre: Bookman, 2012.
   [Apresentação e sumário da edição brasileira](https://books.google.com.br/books?id=CnGveVVsldEC);
   [referência da edição no plano de ensino da Univesp](https://assets.univesp.br/blackboard/plano-de-ensino/disciplinas/ADM330.html).
   **Na aula:** conectar indicadores de marketing a produto, promoção,
   rentabilidade e desempenho financeiro. Leitura complementar às três
   métricas de associação, sem equipará-las a retorno financeiro.

4. HERNANDEZ, José Mauro da Costa; BASSO, Kenny; BRANDÃO, Marcelo Moll.
   **Pesquisa experimental em marketing**. *Revista Brasileira de Marketing*,
   v. 13, n. 2, 2014. DOI: 10.5585/remark.v13i2.2692.
   [Registro e resumo no repositório da USP](https://repositorio.usp.br/item/002515847);
   [texto no periódico](https://periodicos.uninove.br/remark/article/download/12035/5670/58711).
   **Na aula:** fundamentar a passagem de associação observada para uma
   hipótese de intervenção e explicar a função de experimentos em marketing.

5. SEBRAE. **Como elaborar um cadastro de clientes**. Atualizado em
   30 maio 2025.
   [Artigo institucional](https://meuatendimento.sebrae.com.br/sites/PortalSebrae/ufs/ap/artigos/como-elaborar-um-cadastro-de-clientes%2Cd1440d36ecfa1610VgnVCM1000004c00210aRCRD).
   **Na aula:** leitura introdutória sobre registros de clientes, histórico de
   compras e oportunidades de vendas para pequenos negócios.

### Fundamentos técnicos e reprodução

6. MLXTEND. **Association rules: association rules generation from frequent
   itemsets**. Documentação em inglês, [disponível on-line](https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/association_rules/).
   **Na aula:** consultar as definições de suporte, confiança e lift.

7. MLXTEND. **Apriori: frequent itemsets via the Apriori algorithm**.
   Documentação em inglês, [disponível on-line](https://rasbt.github.io/mlxtend/user_guide/frequent_patterns/apriori/).
   **Na aula:** aprofundar a geração de itemsets frequentes e a propriedade
   de fechamento para subconjuntos.

Para uma leitura breve antes da aula, comece pelo Sebrae e pelo resumo do
artigo de Hernandez, Basso e Brandão; use as obras de Kotler, Malhotra e
Farris para aprofundamento gerencial. Para reproduzir os números, consulte
os [dados da aula](../dados/catalogo.json) e o
[script reproduzível](../scripts/minerar_regras_associacao.py).

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
