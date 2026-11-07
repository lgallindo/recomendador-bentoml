# Explorador — memória de usuário turno a turno

Painel da linha do tempo gravada por
[`demo_mem0_preferencias.py --roteiro`](../../scripts/demo_mem0_preferencias.py):
dois usuários, uma memória de sessão, dois updates e um delete. Você avança
turno a turno, confere o store e faz buscas sobre o estado de qualquer turno.

## Abrir o explorador

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
Os dados estão em `dados.js`; nada é baixado da internet.

## Roteiro de exploração

1. Vá ao **turno 6** e busque `frete Recife` como `aluno_demo`. Anote o score.
2. Troque o `user_id` para `outra_cliente` com a mesma consulta. Por que `m1`
   some?
3. No **turno 9**, busque `presente mãe` sem sessão, depois com `s1` e com `s2`.
4. Nos **turnos 10 a 13**, repita `frete Recife` e explique por que o score
   só cai depois do segundo update.
5. No **turno 16**, busque `palha`. O que o delete garantiu e o que ele não
   garante (backups, logs)?
6. Exporte o CSV e o PNG de scores para o relato.

## O que o painel faz

A linha do tempo é **gravada**; a busca é **recalculada no navegador** com a
mesma regra do script: score = número de tokens da consulta contidos no texto
da memória (minúsculas). O painel não grava nada no store.

## Reproduzir

Na raiz do repositório:

```bash
uv run python scripts/demo_mem0_preferencias.py --roteiro
uv run python scripts/gerar_bi_memoria.py
```
