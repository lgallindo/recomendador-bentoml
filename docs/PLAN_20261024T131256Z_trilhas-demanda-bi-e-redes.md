# Plano — três trilhas após a média móvel

**Status:** planejado (ainda não implementado)  
**Data:** 2026-10-24  
**Repo:** `recomendador-bentoml`  
**Âncora já entregue:** média móvel com dados → tutorial → BI → Pages  
(`material/tutorial-media-movel-demanda-20261017.md`, `material/bi-demanda/`)  
**Continuação:** deep learning (visão) e fine-tuning em
[`PLAN_20261024T205137Z_deep-learning-e-fine-tuning.md`](PLAN_20261024T205137Z_deep-learning-e-fine-tuning.md)
(trilhas 4–5).

Este documento congela o escopo das próximas três peças didáticas. Não substitui
os tutoriais existentes; descreve o que falta construir e o formato de cada uma.

---

## Visão geral

| # | Trilha | Formato | Dados | BI / Pages |
| --- | --- | --- | --- | --- |
| 1 | Previsão de demanda por **mínimos quadrados** | Tutorial + explorador | `vendas_semanais.csv` (16×12) | Sim — parity com média móvel |
| 2 | Previsão de demanda com **perceptron** | Tutorial + explorador | Mesma série (entrada temporal / features simples) | Sim — parity com média móvel |
| 3 | **Visão geral** de treino de redes neurais | Tutorial de panorama | Datasets pequenos e públicos (ou sintéticos minúsculos) | Não — libs de alto nível, sem painel BI dedicado |
| 4–5 | Deep learning (visão) + fine-tuning | Ver plano seguinte | Toy / modelo pequeno | Não |

Ordem sugerida de implementação: **1 → 2 → 3 → 4 → 5** (1–2 reusam a série;
3 muda de ferramenta; 4–5 sobem o nível de abstração).

```text
vendas_semanais.csv
        │
        ├─► média móvel ──────────► bi-demanda/     (feito)
        ├─► mínimos quadrados ────► bi-demanda-mq/  (planejado)
        ├─► perceptron ───────────► bi-demanda-perc/(planejado)
        │
        └─ (trilha 3: treino NN · libs / dataset pequeno)
                 │
                 ├─► trilha 4: deep learning (visão alta)
                 └─► trilha 5: fine-tuning
```

---

## 1. Mínimos quadrados — dos dados ao BI

### Já existe

- [`material/tutorial-regressao-quadrados-minimos-demanda-20261017.md`](../material/tutorial-regressao-quadrados-minimos-demanda-20261017.md)
- Figura `regressao-minimos-quadrados-p01.png` (e link quebrado a
  `mapa-ia-regressao-demanda.png` — corrigir na implementação)
- Comparação walk-forward com média móvel / ingênua no texto

### A construir (parity com média móvel)

1. **Explorador** `material/bi-demanda-mq/` (HTML/CSS/JS + `dados.js`)
   - Seleção de produto
   - Série observada + reta ajustada + extrapolação da próxima semana
   - Erros absolutos no teste walk-forward
   - MAE agregado vs ingênua / MA(4) (e opcionalmente a própria reta)
   - Tabela auditável + export CSV/PNG
2. **Gerador** `scripts/gerar_bi_demanda_mq.py` → `dados.js` + `imagens/bi-demanda-mq-*.png`
3. **Prosa:** seção “Como BI ajuda…”, link web, roteiro +~15 min; house shared-prose
4. **Pages:** terceira entrada (ex. `/minimos-quadrados/` ou `/demanda/mq/`) no
   `gerar_site_tutorial.py`, nav Associação | Demanda | Mín. quadrados (ou
   submenu sob Demanda)
5. **Planilha de sala (opcional):** abas por produto com colunas para \(x\), \(y\),
   resíduos e previsão — só se a turma precisar de contas à mão além do tutorial

### Contrato pedagógico

- Unidade: linhas de pedido / produto / semana (igual à média móvel)
- Avaliação: walk-forward nas 4 últimas semanas; previsão final com histórico completo
- Mensagem: regressão linear como baseline supervisionado transparente; tendência
  linear é hipótese, não fato da série sintética

---

## 2. Perceptron — dos dados ao BI

### Ainda não existe

Novo pacote didático, paralelo à média móvel e aos mínimos quadrados.

### Escopo do modelo

- **Perceptron** (ou regressão linear online / ADALINE, se a conta de erro
  quadrático ensinar melhor o passo a passo) aplicado à previsão de demanda
- Entrada mínima: índice de semana (e, se útil em uma segunda etapa, uma feature
  simples como média móvel atrasada — documentar a escolha no tutorial)
- Saída: previsão contínua de linhas de pedido (tratar como regressão com
  atualização iterativa; se usar perceptron clássico 0/1, reformular o alvo
  como “acima da mediana” e deixar explícito que o problema mudou)

Preferência deste plano: **unidade contínua** (alinhar com as outras trilhas de
demanda). Se o perceptron binário for o objeto histórico a ensinar, fazer uma
subseção curta de classificação e manter a trilha principal em atualização de
pesos para erro de previsão contínua (ADALINE / LMS).

### A construir

1. Tutorial `material/tutorial-perceptron-demanda-<data>.md`
2. Script de treino/avaliação reproduzível em `scripts/`
3. Explorador `material/bi-demanda-perceptron/` — série, trajetória de pesos ou
   perda ao longo das épocas (no conjunto de treino temporal), erros no teste,
   MAE vs baselines já conhecidos
4. `scripts/gerar_bi_demanda_perceptron.py` + PNGs estáticos
5. Pages + índice em `material/README.md`

### Contrato pedagógico

- Mesma CSV de 16 semanas
- Separação temporal treino/teste (sem embaralhar semanas)
- BI mostra o **caminho de aprendizado** (perda/épocas) além da previsão final
- Deixar claro: convergência em série curta e sintética é didática

---

## 3. Visão geral — treinar redes neurais

### Formato diferente das trilhas 1–2

Panorama de **como se treina** uma rede com bibliotecas de alto nível, em
datasets **pequenos**, sem construir explorador BI nem Pages dedicados (um
link a partir do índice de demanda basta).

### Conteúdo alvo

1. O que é uma época, um batch, loss, otimizador — em linguagem de aula
2. Fluxo mínimo: dados → modelo → `fit` / loop de treino → avaliação
3. Demonstração com **uma** lib de alto nível (preferência: API estilo Keras /
   `torch` de alto nível já no ecossistema do curso; fixar na implementação)
4. Dataset pequeno (ex.: regressão sintética de brinquedo, ou um CSV minúsculo
   de contagem; **não** ImageNet / LLM)
5. Onde demanda semanal entra: *opcional* notebook curto reutilizando
   `vendas_semanais.csv` com uma MLP de uma camada escondida — sem parity BI
6. Limitações: overfitting em n pequeno, vazamento temporal, custo vs baseline

### Artefatos

- `material/tutorial-visao-geral-treino-redes-<data>.md`
- Script ou notebook reproduzível sob `scripts/` ou `material/redes/`
- Figuras conceituais leves (fluxo treino; curva de loss em toy set)
- Entrada no `material/README.md` e, se fizer sentido, um parágrafo de ponte
  no fim da trilha do perceptron

### Fora de escopo desta trilha

- Explorador BI interativo
- Publicação Pages com iframe
- Treino distribuído, GPUs obrigatórias, fine-tuning de fundacionais

---

## Dependências entre entregas

| Entrega | Depende de |
| --- | --- |
| BI mínimos quadrados | Tutorial MQ existente; padrão `bi-demanda/` |
| Perceptron + BI | Série + contratos de MAE das trilhas anteriores |
| Visão geral redes | Independente de BI; preferível depois do perceptron para o aluno já ter visto pesos/atualização |

## Critérios de pronto (trilhas 1–2)

- [ ] Tutorial em pt-BR, shared-prose house rules
- [ ] `dados.js` regenerável a partir do CSV
- [ ] Explorador abre offline (clone local)
- [ ] Página Pages com iframe e nav atualizada
- [ ] MAE / contas de referência batem com o Markdown
- [ ] Índice em `material/README.md`

## Critérios de pronto (trilha 3)

- [ ] Tutorial + script/notebook roda com `uv run` e deps declaradas
- [ ] Dataset pequeno versionado ou gerado no script
- [ ] Sem depender de GPU
- [ ] Ponte explícita: “baseline da demanda ainda é MA / MQ / perceptron”

---

## Não fazer neste plano

- Extender o BI às 104 semanas da planilha de sala
- Reescrever associação ou crédito
- Empurrar WIP local não relacionado neste commit de planejamento
