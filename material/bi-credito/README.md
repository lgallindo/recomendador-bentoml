# Explore árvores de decisão para crédito

Neste explorador você compara 35 árvores aprendidas nos mesmos 240 contratos
de treino, percorre um contrato do desenvolvimento pelas perguntas da árvore
e só então abre o teste da configuração que fixou. Os contratos são
inteiramente sintéticos; o painel não concede crédito nem recomenda limites.

## Abrir o explorador

Use o painel na
[versão web do tutorial de crédito](https://lgallindo.github.io/recomendador-bentoml/credito/#explorador-interativo),
incorporado às explicações.

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
JavaScript deve estar habilitado. Todos os recursos estão no repositório; você
não precisa de internet. A página do arquivo no GitHub mostra o código, não o
painel em funcionamento.

As bases são [`dados/credito/`](../../dados/credito/README.md): treino (240),
desenvolvimento (80) e teste (80).

## Roteiro de exploração

1. Clique em **Árvore curta do tutorial**. Confira 179/240 no treino e 54/80
   no desenvolvimento; compare com a referência que sempre prevê sem atraso
   (55/80).
2. Escolha um contrato e leia o caminho: perguntas, folha, contagens de treino,
   previsão e a ação da política fictícia.
3. Na grade, procure as configurações com mais acertos no desenvolvimento.
   Aplique o critério do tutorial: mais acertos; empate → menor profundidade;
   persistindo, menos folhas.
4. Escreva sua escolha e o motivo. Só então clique em **Fixar configuração e
   revelar teste**.
5. Exporte o CSV do teste e uma figura para o relato.

## O que o painel faz e o que não faz

As árvores foram aprendidas previamente em Python, com as mesmas funções e a
mesma semente de [`arvore_credito.py`](../../scripts/arvore_credito.py). O
navegador apenas percorre essas árvores com as entradas de cada contrato e
confere se reproduz as contagens calculadas em Python. Trocar a configuração
não retreina nada nem usa o desenvolvimento para aprender.

O teste aparece somente para a configuração fixada. Depois de revelado, o
painel não mostra o teste de outra escolha: usar esse número para trocar a
configuração faria o teste participar da seleção. Recarregar a página fecha o
painel de novo, mas não apaga o fato de que você já viu o resultado.

Para a execução padrão (árvore profunda), o CSV exportado do teste é idêntico
a [`previsoes-teste.csv`](../credito/previsoes-teste.csv).

## Reproduzir os dados e as figuras

Na raiz do repositório, com o ambiente do projeto instalado:

```bash
uv run python scripts/gerar_bi_credito.py
```

O comando grava `dados.js` e duas figuras em `material/imagens/`:
`bi-credito-grade.png` e `bi-credito-profundidade.png`. Ele interrompe a
execução se as contagens divergirem de [`relatorio.json`](../credito/relatorio.json).
