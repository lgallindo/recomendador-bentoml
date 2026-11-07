# Explore regras de associação em logs de autenticação

Este explorador acompanha o
[tutorial de associação em logs](../tutorial-regras-associacao-logs-autenticacao-20261017.md).
Você reconstrói uma sessão a partir das linhas do log, compara os tipos de
sessão, localiza as regras na dispersão de suporte e confiança e reconta uma
regra nas duas bases. Os registros são sintéticos: as métricas descrevem
co-presença de eventos e não indicam causa, ordem nem ataque.

## Abrir o explorador

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
JavaScript deve estar habilitado; os dados estão em `dados.js` e nenhuma conexão
é necessária. A página de um HTML no GitHub mostra o código, não executa o painel.

## Roteiro de exploração

1. Em **Reconstruir uma sessão**, escolha `descoberta-0001`. Conte as linhas,
   identifique a reentrega riscada e confira o conjunto de quatro eventos.
2. Em **Tipos de sessão**, some as barras em terra: elas formam os 30% de sessões
   com falha de senha e desafio MFA.
3. Na dispersão, selecione o círculo de suporte 30% e confiança 66,7%. Quantas
   regras ele reúne? A tabela passa a mostrar só essas.
4. Clique em **falha_senha → desafio_mfa** e leia a comparação: a mesma regra é
   recontada na validação, onde não passa nos critérios.
5. Troque a base para **Validação** e repita: 9 regras passam; a regra fixa não
   está entre elas, mas continua avaliada no painel 05.
6. Baixe o CSV e um PNG para o relatório.

## O que os controles fazem

Os filtros escolhem quais regras já selecionadas aparecem; eles não mineram novas
regras nem mudam os critérios (suporte ≥ 20%, confiança ≥ 60%, lift > 1). O painel
05 reconta qualquer regra a partir dos tipos de sessão da base, por isso mostra
valores mesmo quando a regra não passa nos filtros. A lista de sessões cobre o
bloco-base (20 sessões na descoberta, 10 na validação), que os arquivos repetem
100 vezes.

## Reproduzir

Na raiz do repositório:

```bash
uv run python scripts/gerar_bi_logs.py
uv run python scripts/gerar_figuras_logs.py
```

O primeiro comando confere que as regras recalculadas coincidem com
`material/logs-autenticacao/*.csv` e grava `dados.js` e `imagens/bi-logs-padroes.png`.
O segundo produz as figuras `logs-*.png` do tutorial.
