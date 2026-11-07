# Explorador — rastro de uma chain na loja

Painel que percorre, passo a passo, a chain mínima do tutorial de LangChain:
**entrada → extrair id → ferramenta (lookup no catálogo) → prompt → modelo →
parser**. Cada passo mostra a carga exata que ele entrega ao seguinte.

## Abrir o explorador

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
Os dados estão em `dados.js`; nada é baixado da internet. A página de um HTML
no GitHub mostra o código, não executa o painel.

## Roteiro de exploração

1. Comece em **“Fala do p04”**. Avance passo a passo e anote o tipo da carga de
   cada seta (texto, dicionário, lista de mensagens, texto JSON, dicionário).
2. Troque para **“O que é o p13?”**. Em que passo a falha aparece? Ela é
   silenciosa ou explícita na saída?
3. Troque para **“Qual peça combina com renda?”**. Que produto a chain
   escolheu, e por quê? Isso é um defeito ou uma escolha de projeto?
4. Abra **“Fala do p04 e do p07”** e explique o alerta.
5. Na tabela, confira a coluna “Puro = LangChain” e exporte o CSV para o relato.

## O que o painel faz

Trocar a pergunta **relê rastros já gravados**: o navegador não executa a chain
nem chama um modelo. Para outras perguntas, edite `PERGUNTAS_LOTE` em
[`demo_langchain_loja.py`](../../scripts/demo_langchain_loja.py) e regenere.

## Reproduzir

Na raiz do repositório:

```bash
uv run --with langchain-core python scripts/demo_langchain_loja.py --lote
uv run python scripts/gerar_bi_chain.py
```
