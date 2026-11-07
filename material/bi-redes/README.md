# Explore treino, profundidade e fine-tuning de redes neurais

Este explorador reúne, numa página, os resultados de três experimentos com
redes neurais pequenas na série semanal sintética do Jarro (`p01`):

1. quatro corridas de uma MLP rasa, mudando um hiperparâmetro de cada vez;
2. redes com 1 a 4 camadas escondidas, cada uma treinada com 5 sementes;
3. pré-treino em 12 produtos, fine-tune da cabeça em `p01` e treino do zero.

Todas as previsões são comparadas, no **mesmo teste de quatro semanas**, com
referências simples: média do treino, previsão ingênua, média móvel MA(4) e LMS.
O painel só apresenta resultados já calculados; ele não treina redes no
navegador.

## Abrir o explorador

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
JavaScript deve estar habilitado; não há serviço nem acesso à internet. A página
de um arquivo HTML no GitHub mostra seu código, não executa o explorador.

## Roteiro de exploração

1. Em **02 · Aprendizado**, compare as quatro curvas de perda. Qual cai mais
   rápido? Qual oscila no começo?
2. Em **03 · Teste**, escolha a corrida `base` e depois `η = 0,05`. Observe
   como as previsões quadradas se aproximam (ou não) dos pontos observados.
3. Marque **Média do treino** e **LMS** nas referências e leia, no resumo, a
   diferença entre a corrida e a melhor referência marcada.
4. Em **05 · Profundidade**, troque a semente. Anote a faixa de MAE de cada
   arquitetura e decida se a profundidade explica as diferenças.
5. Em **06 · Fine-tuning**, compare pré-treino, fine-tune e do zero em `p01` e
   veja o que aconteceu com os outros 11 produtos.
6. Exporte o CSV da tabela e um PNG para o seu relato.

## O que os controles fazem

- **Corrida:** escolhe qual das quatro corridas da MLP rasa aparece destacada.
- **Referências:** liga e desliga as linhas tracejadas e define a “melhor
  referência” do resumo.
- **Semente:** destaca uma semente no painel de profundidade (ou a média).

A perda exibida é a `loss_curve_` do scikit-learn: metade do erro quadrático
médio mais a penalidade L2. Ela mede o treino; o MAE mede o teste.

## Reproduzir os dados e as figuras

Na raiz do repositório:

```bash
uv run python scripts/demo_treino_mlp_demanda.py
uv run python scripts/demo_deep_vs_rasa.py
uv run python scripts/demo_fine_tuning_mlp.py
uv run python scripts/gerar_bi_redes.py
```

Os três primeiros comandos gravam os JSON em `material/redes/`. O último
produz `dados.js` e os espelhos estáticos `material/imagens/bi-redes-*.png`.
Os diagramas conceituais vêm de `uv run python .local/scripts/gerar_figuras_redes.py`.
