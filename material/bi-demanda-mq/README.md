# Explorador — demanda com mínimos quadrados

Painel local para a série semanal sintética: reta ajustada, erros walk-forward
e MAE ao lado de média móvel e previsão ingênua.

Os tutoriais de MQ trabalham de ponta a ponta **Jarro (`p01`)** e **Boneca
(`p03`)**. No seletor do painel, abra os dois produtos e compare intercepto,
inclinação, previsão da próxima semana e a tabela de teste.

## Abrir

Abra `index.html` no navegador (ou a rota Pages `demanda-mq/` quando publicada).

## Atualizar dados e figuras

Na raiz do repositório:

```bash
uv run --with scikit-learn python scripts/gerar_bi_demanda_mq.py
```

Isso reescreve `dados.js` e as imagens `bi-demanda-mq-*.png` em
`material/imagens/` (série e erros para `p01` e `p03`, mais o MAE agregado).
