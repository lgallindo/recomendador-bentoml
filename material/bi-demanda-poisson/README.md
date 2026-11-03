# Explorador — demanda com regressão de Poisson

Painel local: taxa λ, função de massa, intervalo preditivo de 95% e cobertura
no walk-forward das quatro últimas semanas.

## Abrir

Abra `index.html` no navegador (ou a rota Pages `demanda-poisson/` quando publicada).

## Atualizar dados e figura

Na raiz do repositório:

```bash
uv run python scripts/gerar_bi_demanda_poisson.py
```

Isso reescreve `dados.js` e `material/imagens/bi-demanda-poisson-p01.png`.
