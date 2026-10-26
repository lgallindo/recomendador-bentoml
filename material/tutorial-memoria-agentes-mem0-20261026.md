# Memória de agentes — preferências entre turnos (padrão Mem0)

RAG guarda **documentos**. Esta aula guarda **fatos sobre o usuário/sessão**
entre turnos. O produto de referência é **Mem0** (camada drop-in; Apache-2.0).
O demo da sala usa um store JSON local com a mesma forma `add` / `search` /
`update`, sem Cloud.

## Objetivos

1. Três caixas: RAG vs memória de usuário vs pesos do modelo.
2. Docs Mem0: `add` / `search` e escopos (user / session / agent).
3. Guardar ≥3 fatos; recuperar numa “nova” consulta.
4. Update: fato velho deixa de vencer.
5. Quando memória ajuda vs quando a verdade fica no corpus wiki.

## 1. Três caixas

| Caixa | Guarda | Exemplo nesta loja |
| --- | --- | --- |
| RAG / wiki | Políticas e fichas | “Devolução em 7 dias” |
| Memória de usuário | Preferências da sessão | “Prefere frete para Olinda” |
| Pesos (fine-tune) | Padrão estatístico no modelo | Raro na sala; aula 5 |

## 2. API (pesquisa)

Na documentação atual do Mem0, anote:

- como `add` recebe mensagens/fatos;
- como `search` filtra por `user_id` (e session/agent se aparecer);
- onde o store vive (local vs Cloud).

Link + quatro bullets.

## 3–4. Demo local

```bash
uv run python scripts/demo_mem0_preferencias.py
```

Arquivos:

- `material/memoria/store_preferencias.json`
- `material/memoria/resultado_memoria_preferencias.json`

Compare `search_frete_recife_antes` vs depois do update, e o hit em Olinda.

## 5. Fronteira

Um parágrafo: preferência de CEP → memória; regra de frete grátis → wiki/RAG.
Não misture os dois no mesmo bucket sem rótulo.

## Outras camadas (uma linha)

Graphiti / Letta / LangMem resolvem fatias parecidas com outros contratos — aqui
o laboratório fixa a forma Mem0.

## Exercício

1–5 conforme objetivos. Sem GPU. Sem chave Cloud.
