# Plano — LangChain, llmwiki, RAG e memória de agentes

**Status:** planejado (ainda não implementado)  
**Data:** 2026-10-24  
**Repo:** `recomendador-bentoml`  
**Antecede:** deep learning + fine-tuning em
[`PLAN_20261024T205137Z_deep-learning-e-fine-tuning.md`](PLAN_20261024T205137Z_deep-learning-e-fine-tuning.md)  
**Decisão (memória):** **Mem0** — defesa abaixo; log GStack no estado local do skill

Este documento congela **quatro** aulas depois de fine-tuning. Formato: tutorial
MD + demo mínima. **Sem** explorador BI / Pages com iframe (igual às trilhas 3–5).

---

## Posição na escada

```text
… → NN visão → deep learning → fine-tuning
        │
        ├─► 6  LangChain          (orquestração / chains)
        ├─► 7  llmwiki            (corpus Markdown local · house)
        ├─► 8  RAG                (padrão retrieve→generate)
        └─► 9  Mem0               (memória de agente · proposta vencedora)
```

Ordem de implementação: **6 → 7 → 8 → 9**. A 8 formaliza o padrão que a 7 já
exerceu na prática; a 9 é outro eixo (fato sobre o *usuário/sessão*, não
chunk de documento).

| # | Trilha | Tom | Dados / stack | BI |
| --- | --- | --- | --- | --- |
| 6 | LangChain | Conceito + 1 chain mínima | LLM local ou API documentada; dataset tiny | Não |
| 7 | llmwiki | Tool house de corpus MD | Mini-wiki no repo + índice gitignored | Não |
| 8 | RAG | Padrão + ladder house | Mesmo corpus; FTS → llmwiki → (mencionar vec) | Não |
| 9 | Mem0 | Memória de agente | Preferências fake + add/search | Não |

**Nota de governança:** o stack house (`STACK_RAG_KG.md`) **não** adota
LangChain como default de produto. Aqui LangChain entra como **aula de
mercado** (o que a indústria chama de glue), contrastada depois com llmwiki /
FTS locais.

---

## 6. LangChain

### Objetivo

O aluno monta uma **chain** mínima (prompt → modelo → parse) e situa LangChain
como camada de orquestração, não como substituto de dados/avaliação.

### Conteúdo

1. Razão de ser: compor passos (retrieve, prompt, call, parse)
2. Vocabulário: chain, runnable, tool (nível slide)
3. Demo: 1 chain com LLM **pequeno/local** ou stub documentado se a sala não
   tiver chave; entrada = texto curto; saída = JSON ou string estruturada
4. Ponte: “orquestrar é uma coisa; lembrar fatos de documento é outra” → 7–8;
   “lembrar o usuário entre turnos” → 9

### Fora de escopo

- LangGraph multi-agente completo
- LangSmith / tracing pago como requisito
- Substituir o stack house de RAG por LC defaults

### Artefatos

- `material/tutorial-langchain-<data>.md`
- Script `scripts/demo_langchain_*.py` via `uv run` (deps só se necessário)
- Índice em `material/README.md`

---

## 7. llmwiki

### Objetivo

O aluno indexa um **mini-corpus Markdown** e consulta com `llmwiki` (CLI /
MCP), alinhado a RAG-003 do house stack.

### Conteúdo

1. Razão de ser: Markdown como fonte de verdade; índice híbrido local
2. Instalar via rustup/cargo (espelhar CESAR/bureaucracy)
3. Demo: pasta `material/mini-wiki-rag/` (ou similar) com 5–15 páginas; index;
   3 perguntas com trechos recuperados
4. Ponte: isso *é* retrieval; a aula 8 nomeia o padrão RAG e a ladder

### Fora de escopo

- Neo4j / Pinecone / Chroma-as-a-service
- Commitar `.index/` (gitignore)

### Artefatos

- Tutorial MD + mini-wiki versionada
- Comandos `llmwiki index` / search no texto
- Entrada no README

---

## 8. RAG

### Objetivo

O aluno desenha o loop **retrieve → augment → generate** e situa a ladder
house (INDEX → FTS5 → llmwiki → sqlite-vec → graphvec).

### Conteúdo

1. Diagrama do padrão (sem framework mega)
2. Chunking / query / grounding em traço grosso
3. Ladder house (citar `STACK_RAG_KG.md` em linguagem de aula)
4. Demo: mesma mini-wiki; opcional FTS5 SQLite de um único arquivo; gerar
   resposta com contexto recuperado (LLM local ou template se offline)
5. Ponte: RAG ≠ memória de preferências do usuário → Mem0

### Fora de escopo

- Avaliação RAGAS completa
- Vector DB remoto como default da aula

### Artefatos

- `material/tutorial-rag-<data>.md`
- Figuras: loop RAG + ladder
- README

---

## 9. Memória de agentes — propostas e decisão

### O que está em jogo

Depois de RAG (corpus), a turma precisa de **um** exemplo de memória
*conversacional / por usuário*: fatos que persistem entre sessões sem serem
páginas de wiki. Escolher o OSS errado vira aula de infra (Neo4j) ou de
runtime inteiro (Letta) em vez de `add` / `search`.

### Propostas (outubro/2026)

Números checados via GitHub API nesta data (exceto survey, citado à parte).

| Opção | Papel | Stars (aprox.) | Encaixa na aula? |
| --- | --- | --- | --- |
| **A · Mem0** (`mem0ai/mem0`) | Camada de memória drop-in (extract → add/update/search) | **~67.7k** · Apache-2.0 | Sim — API curta, Python |
| **B · Graphiti / Zep** (`getzep/graphiti`) | Grafo temporal (valid_at / invalid_at) | ~32.2k | Pesado: Neo4j/FalkorDB; Zep CE deprecado |
| **C · Letta** (`letta-ai/letta`) | Runtime de agente com memória (ex-MemGPT) | ~25.2k | É o *agente inteiro*, não só memória |
| **D · LangMem** (`langchain-ai/langmem`) | Memória nativa LangGraph | ~1.7k | Natural pós-LC, mas bem menos adoção |

Sinais extras (não só stars):

- **Stack Overflow Developer Survey 2026** (AI agent memory): Mem0 **20%** de
  uso no recorte — líder; LangMem 15%; Graphiti/Zep/Letta ~11% cada. Mercado
  fragmentado, mas Mem0 no topo.
- PyPI / narrativa de comunidade: Mem0 como “memory layer” genérica; Letta
  como plataforma; Graphiti como motor de grafo.
- Fora da shortlist de aula: `claude-mem` (~100k stars) é tooling Claude-Code,
  não biblioteca geral de memória para a turma; MemPalace/Hindsight crescem
  rápido mas ainda são piores para “o exemplo padrão do mercado” em 2026-10.

### Decisão recomendada (GStack office-hours)

**Escolha: A · Mem0**

**Defesa:**

1. **Popularidade mensurável:** líder em stars entre camadas *gerais* de
   memória + líder no SO 2026 no recorte de agent memory.
2. **Formato didático:** biblioteca com `add` / `search` e escopos
   user/session/agent — cabe em uma demo de 15–20 min sem subir grafo DB.
3. **Encadeamento:** depois de LangChain (orquestração) e RAG (corpus), Mem0
   ensina o terceiro verbo: *persistir fatos do diálogo*.
4. **Licença e linguagem:** Apache-2.0, Python — alinhado ao curso `uv`.

**Por que não as outras (resumo):**

- **Graphiti:** aula vira temporal KG + ops de banco; ótimo *módulo avançado*
  opcional, mau *primeiro* contato com “memória”.
- **Letta:** troca o assunto para “rodar um OS de agente”; conflita com o
  foco LangChain já dado na trilha 6.
- **LangMem:** bom se a turma já estiver em LangGraph; stars/survey ficam
  atrás de Mem0; pode ser *menção* de uma linha na aula 6 ou 9.

### Conteúdo da aula 9 (Mem0)

1. Pré-treino/RAG/memória: três caixas (o que cada uma guarda)
2. Extract → ADD/UPDATE/DELETE/NOOP (nível slide)
3. Demo: 5–10 turnos fake; gravar preferências; nova sessão recupera
4. Limites: memória ≠ fonte de verdade documental; não substitui llmwiki
5. Menção honesta: Graphiti (tempo), Letta (runtime), LangMem (LangGraph)

### Fora de escopo (aula 9)

- Mem0 Cloud como requisito
- Neo4j / Graphiti lab completo
- Letta server como lab principal
- gbrain (memória do *agente de coding* GStack) — fora do material da turma;
  se surgir pergunta, uma frase: tooling interno ≠ Mem0 de produto

### Artefatos

- `material/tutorial-memoria-agentes-mem0-<data>.md`
- `scripts/demo_mem0_*.py` (store local embutido; aviso de deps/LLM)
- Figuras: três caixas; ciclo extract/update
- README

---

## Critérios de pronto

- [ ] 6–9 em pt-BR, shared-prose house rules, razão de ser no topo
- [ ] Demos CPU-friendly; downloads avisados; sem GPU obrigatória
- [ ] Aula 7–8 citam ladder house sem impor LangChain como default de produto
- [ ] Aula 9 usa Mem0; tabela de alternativas no próprio MD (versão curta)
- [ ] Indexados em `material/README.md`

## Não fazer neste plano

- Unificar 6–9 num único MD
- Trocar llmwiki por Chroma/Pinecone na demo principal
- BI / Pages para estas trilhas
- Adotar LangChain no `STACK_RAG_KG` house (aula ≠ default de engenharia)
