# Recomendador no BentoML

Imagine uma feira de artesanato na internet. Tem jarro de barro, renda, xilogravura,
cesto de palha. A pessoa abre a página de um jarro de Tracunhaém. Embaixo da foto,
aparecem outras peças: um prato da mesma técnica, uma boneca de barro, e mais duas
sugestões que muita gente já pediu. Ninguém digitou “cerâmica” na busca. A loja
simplesmente **chutou com cuidado** o que ainda pode interessar.

Esse “chute com cuidado” é o **sistema de recomendação**. Sem ele, a pessoa só vê o
que ela mesma procura — e a maior parte do catálogo fica invisível. Com ele, a loja
usa o produto da página (e, neste material, o histórico de pedidos de exemplo) para
montar uma lista curta de **outros** produtos. Não é um chatbot: não conversa. Não é
um classificador genérico: não rotula texto. É um ranqueador: recebe um produto e
devolve outros, cada um com uma nota e um motivo legível.

Este repositório traz um catálogo pequeno de
peças pernambucanas, um treino que calcula popularidade e “aparecem juntos”, e um
serviço HTTP no BentoML que responde a essas sugestões. Você sobe com dois comandos,
confere no Swagger ou no `curl`, e depois lê as contas no caderno e nos slides.

## Cesta de compra (o que é e onde mora no JSON)

Numa loja real, uma **cesta** (ou carrinho fechado) é o conjunto de produtos que a
pessoa levou **na mesma compra**. Se alguém pediu jarro + prato + boneca juntos,
esses três ids formam uma cesta. O recomendador usa isso para aprender
“aparecem juntos”: produtos que compartilham cestas tendem a se reforçar na nota
de co-ocorrência.

Neste material as cestas são **exemplos sintéticos** (não tickets de loja real).
Elas vivem em [`dados/catalogo.json`](dados/catalogo.json), no array `cestas`:
cada elemento é uma lista de ids de produto.

```json
"cestas": [
  ["p01", "p02", "p03"],
  ["p01", "p02"],
  ["p04", "p05", "p06"]
]
```

A primeira linha lê-se: “numa compra de exemplo saíram `p01`, `p02` e `p03`
juntos”. Ordem dentro da lista não importa para o treino; o que importa é o
**par** (a, b) aparecer na mesma cesta. O catálogo de itens (nome, técnica,
região, pedidos) fica no array irmão `produtos` — detalhes em
[`dados/README.md`](dados/README.md).

## Workflow

Dois momentos distintos, nesta ordem:

1. **Offline (`just treino`).** Lê [`dados/catalogo.json`](dados/catalogo.json), calcula
   popularidade e co-ocorrência, grava um artefato no store do BentoML
   (`recomendador:…`). Sem isso, o serviço não tem o que carregar.

   - **Popularidade:** quão pedido é cada produto. No dataset isso é o campo `pedidos`
     (contagem sintética). No treino viramos um número entre 0 e 1 dividindo pelo maior
     `pedidos` do catálogo — o item mais pedido fica em 1,0; os outros ficam abaixo.
   - **Co-ocorrência:** quão frequentemente dois produtos aparecem **juntos** nas
     `cestas` de exemplo (como se fossem a mesma compra). Para cada produto âncora,
     contamos os parceiros e normalizamos pelo parceiro mais frequente daquele âncora,
     também em 0…1. “Aparecem juntos” ≠ “são da mesma técnica”; técnica é outro filtro.
2. **Online (`just serve`).** Sobe o HTTP. A cada `POST /recomendar`, a vitrine manda o
   produto da página; o serviço monta a lista e devolve JSON. Não recalcula o catálogo
   inteiro a cada clique — só aplica a regra sobre o artefato já treinado.

```text
catalogo.json ──► treino.py ──► model store (pickle)
                                    │
vitrine WEB ──POST /recomendar──► service.py ──► JSON (items, reason, score)
```

Mudou o JSON? Rode `just treino` de novo e reinicie (ou deixe o `--reload` do serve
pegar a tag `latest`).

## Visão geral do algoritmo

O fluxo cabe em cinco passos, na ordem em que o serviço decide a lista:

1. **Contexto.** A vitrine manda o id do produto aberto (`produto_na_pagina`), quantas
   sugestões quer (`limite`) e ids a omitir (`excluir`). O próprio produto da página
   entra automaticamente na lista de omitidos.
2. **Mesma técnica.** Entre os demais itens do catálogo, ficam só os que têm a mesma
   `tecnica` artesanal (por exemplo, todos de *ceramica* se a página é um jarro de barro).
3. **Nota e ordem nesse grupo.** Cada candidato recebe
   \(\mathrm{score} = 0{,}7 \times \text{popularidade} + 0{,}3 \times \text{co-ocorrência}\).
   A popularidade vem dos `pedidos` normalizados; a co-ocorrência mede quantas vezes
   dois produtos apareceram juntos nas cestas de exemplo do dataset. Ordenamos do maior
   score para o menor e pegamos até `limite` itens. O motivo gravado é `mesma_tecnica`.

   **Por que essa fórmula?** Queremos misturar dois sinais: “muita gente pede isso”
   (popularidade) e “costuma sair junto com o produto da página” (co-ocorrência). O peso
   **0,7 / 0,3** privilegia a demanda geral dentro da mesma técnica, sem ignorar o
   histórico das cestas. Não é uma lei da natureza — é um baseline explícito e fácil de
   mudar na aula (troque os pesos e compare o JSON).

   **O que é “normalizado”?** Os `pedidos` brutos são contagens (8, 28, 42…). Se
   somássemos pedidos crus com co-ocorrência (que já está em 0…1), o número grande
   dominaria a nota. Normalizar aqui significa **dividir pelo máximo do catálogo**:

   \[
   \mathrm{pop}_i = \frac{\mathrm{pedidos}_i}{\max_j \mathrm{pedidos}_j}
   \]

   Assim a popularidade também fica entre 0 e 1 (o jarro com 42 pedidos vira 1,0; quem
   tem 21 vira 0,5). A co-ocorrência já nasce normalizada por âncora: para o produto da
   página, contamos quantas vezes cada vizinho apareceu na mesma cesta e dividimos pelo
   vizinho mais frequente daquele âncora.

   Pseudocódigo (mesmo grupo, após filtrar técnica e exclusões):

   ```text
   max_pedidos ← máximo de pedidos entre todos os produtos
   para cada produto i:
       pop[i] ← pedidos[i] / max_pedidos          # 0…1

   # no treino, para cada par (a, b) que aparece junto numa cesta:
   #   conta[a][b] ← conta[a][b] + 1
   # depois, para cada âncora a:
   #   cooc[a][b] ← conta[a][b] / max_b conta[a][b]   # 0…1

   candidatos ← produtos com mesma tecnica que pagina
                e id ∉ excluir ∪ {pagina}

   para cada c em candidatos:
       score[c] ← 0.7 * pop[c] + 0.3 * cooc[pagina].get(c, 0)

   ordenar candidatos por score decrescente
   escolhidos ← primeiros `limite` de candidatos
   # reason ← "mesma_tecnica"
   ```
4. **Complemento por popularidade.** Se ainda faltarem vagas (poucos produtos daquela
   técnica), completamos com os mais pedidos do catálogo inteiro, ainda respeitando
   `excluir`. Nesses, \(\mathrm{score} = 0{,}5 \times \text{popularidade}\) e o motivo é
   `complemento_popularidade`. O campo `complemento_usado` fica `true`.
5. **Resposta.** Devolvemos a lista com id, nome, técnica, região, score, motivo e rank —
   pronta para a WEB desenhar a faixa “Você também pode gostar”.

Não há rede neural nem modelo de linguagem neste baseline: são contagens e uma regra
fixa, auditáveis no papel (ver [`material/calculos-trabalhados.md`](material/calculos-trabalhados.md)).
O dataset e o significado de cada campo estão em [`dados/README.md`](dados/README.md).

---

## O que a API espera e o que ela devolve

O serviço escuta em `http://127.0.0.1:3000` depois de `just serve`. O endpoint útil
para a vitrine é:

```http
POST /recomendar
Content-Type: application/json
```

### Entrada

| Campo | Tipo | Exemplo | Significado |
| --- | --- | --- | --- |
| `produto_na_pagina` | string | `"p01"` | Id do produto aberto na tela (obrigatório) |
| `limite` | inteiro | `4` | Quantos produtos sugerir (padrão 4) |
| `excluir` | lista de strings | `[]` | Ids que não devem voltar (já vistos, já no carrinho, etc.) |

O próprio `produto_na_pagina` **nunca** entra na lista de saída: a loja não recomenda
o item que a pessoa já está olhando.

### Saída (sucesso)

JSON com:

| Campo | Significado |
| --- | --- |
| `items` | Lista ordenada de sugestões |
| `items[].product_id` | Id no catálogo |
| `items[].nome` | Nome legível |
| `items[].tecnica` | Técnica artesanal (ceramica, renda, …) |
| `items[].regiao` | Polo / região |
| `items[].score` | Nota numérica usada na ordenação |
| `items[].reason` | Motivo: `mesma_tecnica` ou `complemento_popularidade` |
| `items[].rank` | Posição 1…N |
| `strategy` | Nome da estratégia gravada no treino |
| `complemento_usado` | `true` se faltaram candidatos da mesma técnica e a lista foi completada com popularidade geral |
| `produto_na_pagina` | Eco do produto de contexto (id, nome, técnica, região) |
| `modelo` | Tag do artefato no store do BentoML |

### Saída (produto inexistente)

Se o id não estiver no catálogo:

```json
{
  "erro": "produto_inexistente",
  "produto_na_pagina": "nao-existe",
  "items": []
}
```

---

## Como subir e o que esperar nos testes

Pré-requisitos: [uv](https://docs.astral.sh/uv/) e [just](https://github.com/casey/just).
Nesta pasta:

```bash
just treino    # lê dados/catalogo.json, grava o modelo no store do BentoML
just serve     # sobe o serviço (deixe este terminal aberto)
```

Em outro terminal, ou pela UI em <http://127.0.0.1:3000>:

### Exemplo 1 — página do jarro (`p01`), quatro sugestões

É o caso trabalhado em [`material/calculos-trabalhados.md`](material/calculos-trabalhados.md).

```bash
just curl-exemplo
```

Corpo enviado:

```json
{"produto_na_pagina": "p01", "limite": 4, "excluir": []}
```

Resultado esperado (ordem e motivos):

| rank | produto | reason | score (aprox.) |
| ---: | --- | --- | ---: |
| 1 | Prato esmaltado Tracunhaém (`p02`) | `mesma_tecnica` | ≈ 0,77 |
| 2 | Boneca de barro (`p03`) | `mesma_tecnica` | ≈ 0,52 |
| 3 | Rendeira Alto do Moura (`p04`) | `complemento_popularidade` | ≈ 0,42 |
| 4 | Xilogravura Pilar (`p07`) | `complemento_popularidade` | ≈ 0,37 |

`complemento_usado` deve ser **true**: só existem duas outras cerâmicas no catálogo,
então as duas últimas vagas vêm dos mais pedidos do catálogo inteiro.

### Exemplo 2 — forçar o complemento (pouca mesma técnica)

```bash
just curl-complemento
```

Corpo:

```json
{"produto_na_pagina": "p12", "limite": 4, "excluir": ["p10", "p11"]}
```

Aqui o produto da página é o sousplat de palha (`p12`, cestaria). Excluímos os outros
dois de cestaria (`p10`, `p11`). Sobram **zero** candidatos da mesma técnica → a lista
inteira tende a ser preenchida por popularidade geral (`reason` =
`complemento_popularidade`, `complemento_usado`: true).

### Exemplo 3 — id que não existe

```bash
just curl-inexistente
```

Deve devolver `erro: "produto_inexistente"` e `items` vazio, sem inventar produtos.

---

## Mergulho técnico

### Ideia da regra (baseline, sem rede neural)

1. **Popularidade.** Cada produto tem um contador `pedidos` no JSON. No treino,
   normalizamos pelo máximo do catálogo: \(\mathrm{pop}_i = \mathrm{pedidos}_i /
   \max_j \mathrm{pedidos}_j\).
2. **Co-ocorrência.** Nas cestas de exemplo, contamos quantas vezes dois produtos
   aparecem juntos; para cada âncora, normalizamos pelo vizinho mais frequente.
3. **Candidatos.** Todos os produtos com a **mesma técnica** do item da página,
   exceto ele próprio e os ids em `excluir`.
4. **Ordenação (mesma técnica).**
   \(\mathrm{score} = 0{,}7 \cdot \mathrm{pop} + 0{,}3 \cdot \mathrm{coocorrência}\).
5. **Complemento.** Se a lista ainda for menor que `limite`, completamos com os
   produtos de maior `pedidos` no catálogo (mesmo filtro de exclusão). Para esses,
   \(\mathrm{score} = 0{,}5 \cdot \mathrm{pop}\).

A região entra no JSON de saída (útil para a vitrine e para a especificação da
disciplina), mas **esta versão não usa região na ordenação**. Se o requisito EARS
da squad pedir reforço por região, esse é o próximo passo natural no código.

### Mapa de arquivos

| Arquivo | Papel |
| --- | --- |
| [`dados/catalogo.json`](dados/catalogo.json) | 12 produtos + cestas de exemplo |
| [`treino.py`](treino.py) | Calcula popularidade e co-ocorrência; grava pickle no model store (`recomendador:…`) |
| [`service.py`](service.py) | Classe BentoML `Recomendador`; API `recomendar` |
| [`bentofile.yaml`](bentofile.yaml) | Empacote opcional (`bentoml build`) |
| [`justfile`](justfile) | Atalhos `treino`, `serve`, curls |
| [`material/calculos-trabalhados.md`](material/calculos-trabalhados.md) | Contas do exemplo `p01` no papel |
| [`slides/recomendador-bentoml.pptx`](slides/recomendador-bentoml.pptx) | Slides da aula |
| [`scripts/gerar_slides.py`](scripts/gerar_slides.py) | Regenera o `.pptx` (`just slides`) |

### Dependências e ambiente

- Python **≥ 3.13**, gerenciado por **uv** (`pyproject.toml` / `uv.lock`).
- Dependência de runtime: **BentoML**.
- Grupo `dev`: **python-pptx** (só para gerar slides).
- Comandos passam por `uv run …` (via `just`), com venv local nesta pasta.

### Ciclo treino → serve

`treino.py` lê o JSON, monta um dicionário Python e o serializa com `pickle` dentro
de um modelo BentoML chamado `recomendador`. `service.py` faz
`bentoml.models.get("recomendador:latest")` e carrega esse artefato na subida do
serviço. Mudou o catálogo? Rode `just treino` de novo e reinicie (ou confie no
`--reload` do `just serve`).

### O que este material não é

Não é aprendizado profundo, não é filtragem colaborativa com matriz de usuários
reais, não autentica, não persiste log de impressões, não avalia Precision@k.
É o **baseline honesto** que a especificação da AV1 já pede: técnica, popularidade,
exclusões, JSON, motivo legível — servido como API para a WEB consumir.

### Para onde ir depois (fora deste repositório)

1. Ligar `POST /recomendar` à vitrine do marketplace da disciplina.
2. Incluir região (ou popularidade por polo) na ordenação, se o requisito exigir.
3. Trocar a regra por um modelo de aprendizado de máquina, por exemplo seguindo
   [Fundamentos do aprendizado de máquina](https://learn.microsoft.com/pt-br/training/modules/fundamentals-machine-learning/)
   (Microsoft Learn, pt-BR).

Nada disso é necessário para este pacote rodar sozinho.

### Licença

**GPL-3.0** — ver [`LICENSE`](LICENSE).

BentoML (Apache-2.0) e python-pptx (MIT) têm licenças próprias; elas não alteram a
licença deste código.

---

No fim das contas, um marketplace precisa de recomendação pela mesma razão que a
feira física coloca peças parecidas na mesma banca: a pessoa já mostrou um interesse
(abriu um jarro) e a loja responde com vizinhança útil, sem obrigá-la a adivinhar o
vocabulário do catálogo. Este projeto deixa essa ideia pequena, auditável e no ar —
você vê o JSON, confere as contas no caderno e entende cada `reason`. Quando a
vitrine do Origem (ou do Fiscalize, no caso da triagem) pedir o módulo de verdade,
o contrato HTTP e a lógica de baseline já estão aqui para crescer.
