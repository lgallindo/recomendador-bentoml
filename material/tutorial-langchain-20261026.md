# LangChain — uma chain mínima na loja

A indústria cola passos (prompt → modelo → parse → ferramenta) com frameworks
de orquestração. Esta aula monta **uma** chain no catálogo sintético e situa
quando um script Python puro basta.

O stack de retrieval da casa (aulas seguintes) **não** troca o default por
LangChain — aqui o foco é o vocabulário de mercado.

## Objetivos

1. Explicar o que é uma chain (entrada → passos → saída estruturada).
2. Consultar a documentação **atual** do LangChain (nomes mudam) e listar o que
   você vai chamar.
3. Rodar a chain: template → “modelo” → parse (JSON).
4. Ver o rastro com **uma** ferramenta (`lookup` no catálogo).
5. Cinco linhas: quando usaria o framework vs script puro.

## 1. Quatro caixas

```text
pergunta  →  extrair id / lookup  →  “modelo”  →  JSON parseado
```

No demo o modelo é **determinístico** (sem chave de API): devolve um resumo do
produto a partir da ficha.

## 2. Documentação (tarefa de pesquisa)

Abra a doc atual de *LangChain Expression Language* / Runnables e anote:

- como encadear com `|`;
- um tipo de prompt (`ChatPromptTemplate` ou equivalente vigente);
- um output parser (`StrOutputParser` ou JSON).

Cole o link da página que você usou + três bullets.

## 3. Rodar

Sem instalar nada extra (script puro):

```bash
uv run python scripts/demo_langchain_loja.py --modo puro
```

Com o pacote de núcleo (mesma I/O, API LangChain):

```bash
uv run --with langchain-core python scripts/demo_langchain_loja.py --modo langchain
```

Saída em `material/langchain/resultado_chain_loja.json`. Olhe `rastro`:
entrada → `ferramenta_lookup` → `saida_modelo` → `saida`.

## 4. Ferramenta

A função `lookup_produto` lê `dados/catalogo.json`. Troque a pergunta:

```bash
uv run python scripts/demo_langchain_loja.py --pergunta "Fala do p04"
```

O rastro deve mudar o `pid` e a ficha.

## 5. Framework vs script

Escreva cinco linhas: em que situação a cola do framework ajuda (vários
provedores, tools, tracing) e quando três funções suas são mais claras para a
sala.

## Exercício

1. Fluxo em até oito linhas ou quatro caixas.
2. Link da doc + três bullets.
3. Cole um exemplo de I/O do JSON.
4. Descreva o rastro da ferramenta.
5. Comparação framework vs puro.

## Referência

- `scripts/demo_langchain_loja.py`
- Ponte: retrieval local nas aulas llmwiki / RAG
