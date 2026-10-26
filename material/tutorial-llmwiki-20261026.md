# llmwiki — Markdown vira índice local

Uma pasta pequena de políticas da loja vira busca por palavra-chave (e híbrida)
sem servidor. O binário `llmwiki` (Rust) lê Markdown com frontmatter e grava
`.index/` no disco.

## Objetivos

1. Mostrar `llmwiki --help` (ou `--version`) depois de instalar via cargo.
2. Conhecer a mini-wiki versionada (árvore + uma página).
3. Indexar; confirmar que `.index/` está no gitignore.
4. Três perguntas com top hits.
5. Typo de propósito → reindex → hits mudam.

## 1. Instalar / localizar

```bash
cargo install llmwiki   # uma vez; precisa rustup
llmwiki --version
```

Na máquina da aula, se já existir em `~/.cargo/bin`, só confira o PATH.

## 2. Corpus

Pasta: `material/mini-wiki-rag/` (páginas com `title` / `description` / `tags`
no frontmatter). Sem esses campos o arquivo **não entra** no índice.

```bash
find material/mini-wiki-rag -name '*.md' | sort
```

Amostra: `frete.md`, `devolucao.md`, `catalogo-p01.md`.

## 3. Indexar

```bash
llmwiki init --wiki-root material/mini-wiki-rag
llmwiki index --wiki-root material/mini-wiki-rag
llmwiki list --wiki-root material/mini-wiki-rag
```

O diretório `material/mini-wiki-rag/.index/` está no `.gitignore` da raiz e no
`.gitignore` da pasta. Não commite o índice.

## 4. Três perguntas

```bash
llmwiki search --wiki-root material/mini-wiki-rag --keyword "frete Tracunhaém"
llmwiki search --wiki-root material/mini-wiki-rag --keyword "devolução 7 dias"
llmwiki search --wiki-root material/mini-wiki-rag --keyword "jarro p01"
```

Cole, para cada uma, o path do top hit e um trecho curto.

## 5. Typo e reindex

1. Em `frete.md`, troque temporariamente `Tracunhaém` por `Tracunhaen` (typo).
2. `llmwiki index --wiki-root material/mini-wiki-rag --incremental`
3. Repita a busca `frete Tracunhaém` e anote o que mudou.
4. **Restaure** o texto correto e reindexe (deixe o repo limpo).

## Exercício

Entregue: versão do binário; árvore; prova de ignore; três consultas; antes/depois
do typo.

## Referência

- `material/mini-wiki-rag/`
- Ponte: o padrão retrieve→generate na aula de RAG
