# Explorador — demanda com LMS / ADALINE

Painel da série semanal com pesos online (LMS), curva de MSE e MAE frente a
média móvel e mínimos quadrados em lote.

Os tutoriais usam **Jarro (`p01`)** e **Boneca (`p03`)** como exemplos
trabalhados. Selecione os dois no painel; os pesos ficam em `pesos_p01.json` e
`pesos_p03.json`.

```bash
uv run python scripts/gerar_bi_demanda_perceptron.py
```

Abra `index.html` ou a rota Pages `demanda-perc/` quando publicada. O script
também regenera `bi-demanda-perc-serie-*.png` e `bi-demanda-perc-mse-*.png` para
`p01` e `p03`.
