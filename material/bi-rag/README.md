# Explore busca e RAG na mini-wiki

Este explorador reúne, numa página só, as duas perguntas que um sistema de
respostas precisa fazer antes de escrever qualquer coisa: **quais páginas
falam do assunto?** e **o trecho certo chegou ao prompt?** O corpus é a
mini-wiki de políticas da loja ([`../mini-wiki-rag/`](../mini-wiki-rag/)),
com oito páginas sintéticas.

## Abrir o explorador

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
JavaScript deve estar habilitado. Os dados e o código são locais; você não
precisa de servidor, chave de API, modelo de linguagem nem internet. A página
de um arquivo HTML no GitHub mostra o código e não executa o explorador.

## O que cada painel faz

| Painel | O que mostra |
| --- | --- |
| 01 · Escolha a consulta | Perguntas prontas do conjunto-ouro, consulta livre, recuperador, estratégia e k |
| 02 · Recuperar | Ranking das páginas; no BM25, a contribuição de cada termo (tf, df, idf, tamanho) |
| 03 · Enriquecer | O prompt aumentado exatamente como um modelo o receberia |
| 04 · Gerar e conferir | Resposta por template, checagem de citações e de páginas relevantes ausentes |
| 05 · Avaliar | Recall@k nas cinco perguntas com resposta e abstenção na pergunta sem resposta |

**BM25 ao vivo** é recalculado no navegador com a mesma tokenização de
[`scripts/avaliar_rag.py`](../../scripts/avaliar_rag.py) (k1 = 1,2; b = 0,75).
Aceita qualquer consulta. **FTS5** e **llmwiki** aparecem como rankings já
calculados pelos scripts, por isso só existem para as perguntas prontas.

## Roteiro de exploração

1. Abra com **Restaurar**: pergunta q1, FTS5, k = 3. Leia a checagem do painel 04:
   `devolucao.md` ficou fora do prompt, e o prazo de 7 dias some da resposta.
2. Troque para **BM25 ao vivo**. Na tabela de termos, descubra por que
   `devolucao.md` passa a caber nos três primeiros.
3. Volte ao FTS5 e escolha **Subperguntas intercaladas**. O recall de q1 vai a 1.
4. Escolha **q6** (Pix) e compare os três recuperadores. Qual deles se abstém?
5. Digite uma consulta sua no BM25 e mude k de 1 a 5; observe o corte no ranking.
6. Exporte o CSV do painel 05 e um PNG do ranking para o relato.

## O que o explorador não faz

Ele não indexa novas páginas nem roda a llmwiki ou o SQLite no navegador.
Também não gera texto com um modelo. Para mudar o corpus, edite a mini-wiki e
regenere os dados.

## Reproduzir os dados

Na raiz do repositório:

```bash
uv run python scripts/avaliar_rag.py
uv run python scripts/gerar_bi_rag.py
```

O primeiro comando grava `material/rag/avaliacao_rag.json`; o segundo grava
`dados.js`. Com `llmwiki` no PATH, os rankings da llmwiki entram junto com a
versão do binário; sem ela, o explorador mostra só FTS5 e BM25.
