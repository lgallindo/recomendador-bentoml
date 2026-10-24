# Plano — deep learning (visão geral) e fine-tuning

**Status:** planejado (ainda não implementado)  
**Data:** 2026-10-24  
**Repo:** `recomendador-bentoml`  
**Antecede:** trilhas 1–3 em
[`PLAN_20261024T131256Z_trilhas-demanda-bi-e-redes.md`](PLAN_20261024T131256Z_trilhas-demanda-bi-e-redes.md)
(mínimos quadrados → perceptron → visão geral de treino de redes)  
**Continua em:** LangChain → llmwiki → RAG → Mem0 em
[`PLAN_20261024T205815Z_langchain-llmwiki-rag-memoria.md`](PLAN_20261024T205815Z_langchain-llmwiki-rag-memoria.md)
(trilhas 6–9).

Este documento congela **duas** aulas depois do panorama de treino de redes:
um tutorial **muito alto nível** de deep learning, e em seguida um de
**fine-tuning**. Ambos ficam no registro conceitual / demo mínima — **sem**
explorador BI nem Pages com iframe (igual à trilha 3).

---

## Posição na escada didática

```text
média móvel + BI          (feito)
mínimos quadrados + BI    (planejado · trilha 1)
perceptron + BI           (planejado · trilha 2)
visão geral treino NN     (planejado · trilha 3)   ← libs alto nível, dataset pequeno
deep learning (visão)     (este plano · trilha 4)  ← o que é “fundo”, famílias, quando usar
fine-tuning               (este plano · trilha 5)  ← adaptar um modelo já treinado
```

Ordem de implementação: **4 → 5**, só depois da trilha 3 estar legível em sala
(a 5 pressupõe “já existe um modelo pré-treinado”).

| # | Trilha | Tom | Dados | BI / Pages |
| --- | --- | --- | --- | --- |
| 4 | Deep learning — visão muito alta | Conceitos + 1 demo mínima | Toy / amostra minúscula | Não |
| 5 | Fine-tuning | Conceitos + 1 demo mínima | Modelo pequeno pré-treinado + poucos exemplos | Não |

---

## 4. Deep learning — visão muito alta

### Objetivo da aula

O aluno deve conseguir **situar** deep learning: o que muda em relação a uma
rede rasa / perceptron, quais famílias existem em traço grosso, e quando a
complexidade se justifica frente aos baselines de demanda já vistos.

### Conteúdo (deliberadamente raso)

1. **Razão de ser:** muitas camadas + representação aprendida; ligação com a
   trilha 3 (época, loss, otimizador) sem repetir o loop de treino inteiro
2. **Profundidade:** o que “fundo” costuma significar na prática (empilhar
   transformações), sem derivar backprop
3. **Famílias em um slide cada** (só o trabalho típico, sem arquitetura):
   - visão (imagens)
   - sequência / texto
   - tabular / séries (ponte curta à demanda: “possível, mas o baseline ainda
     manda em n=16”)
4. **Custo e dados:** mais parâmetros pedem mais dados e mais cuidado com
   vazamento / overfitting
5. **Demo mínima (opcional no mesmo MD):** treinar uma MLP de 2–3 camadas no
   mesmo toy da trilha 3 *ou* um CSV minúsculo — uma figura de loss, sem BI
6. **Ponte:** “daqui para adaptar um modelo que alguém já treinou” → trilha 5

### Artefatos

- `material/tutorial-deep-learning-visao-geral-<data>.md`
- 2–4 figuras conceituais (`imagens/dl-*.png`) geradas por script leve
- Entrada no `material/README.md`
- Sem `bi-*`, sem rota Pages dedicada (link a partir do índice basta)

### Fora de escopo

- Transformers / attention em detalhe
- Treino multi-GPU, mixed precision, distributed
- Reproduzir SOTA ou baixar pesos gigantes
- Explorador BI

### Duração sugerida

~45–60 min de leitura/aula; demo ≤15 min se houver máquina da turma.

---

## 5. Fine-tuning

### Objetivo da aula

O aluno deve explicar **o que** é fine-tuning (partir de pesos pré-treinados e
adaptar a uma tarefa/domínio com poucos dados), **por que** se usa, e rodar
**uma** adaptação mínima com lib de alto nível.

### Conteúdo

1. **Pré-treino vs fine-tuning vs treino do zero** — diagrama de três caixas
2. **Quando fine-tunar:** pouco dado rotulado, domínio próximo do pré-treino
3. **O que se congela / o que se atualiza** (cabeça vs tronco) — linguagem de
   aula, sem catálogo de PEFT
4. **Riscos:** esquecimento catastrófico (menção), overfitting no conjunto
   pequeno, vazamento se o split for frágil
5. **Demo mínima:** um modelo **pequeno** já disponível offline ou via hub
   com cache documentado; dataset **tiny** (dezenas/centenas de exemplos);
   poucas épocas; métrica simples antes/depois
6. **Ponte de volta à demanda:** fine-tuning *não* substitui MA/MQ/perceptron
   na série de 16 semanas; é outra família de problema (texto/imagem/classificação
   conforme o demo escolhido)

### Escolha de demo (fixixar na implementação)

Preferir, nesta ordem:

1. Classificação de texto curta com modelo compacto (ex. família Distil* /
   equivalente leve já usado no curso), **ou**
2. Classificação de imagem tiny (CNN pequena pré-treinada + 2 classes)

Evitar: LLM grande, GPU obrigatória, contas pagas, downloads > alguns GB sem
aviso no README.

### Artefatos

- `material/tutorial-fine-tuning-<data>.md`
- Script `scripts/demo_fine_tuning_*.py` (ou pasta `material/fine-tuning/`)
  com `uv run` e deps no `pyproject` **só se** a demo exigir — senão
  documentar `uv run --with …` pontual
- Figuras: pré-treino→adaptação; curva loss do fine-tune no toy set
- Entrada no `material/README.md`

### Fora de escopo

- LoRA / QLoRA / adapters como aula principal (menção de uma linha no máximo)
- RLHF, alignment, serving de LLM
- Fine-tune da série `vendas_semanais.csv` como caso principal
- BI / Pages

### Duração sugerida

~50–70 min; demo ≤20 min com ambiente pré-aquecido (cache de pesos).

---

## Dependências

| Trilha | Precisa estar pronta |
| --- | --- |
| 4 Deep learning visão | Trilha 3 (vocabulário de treino) |
| 5 Fine-tuning | Trilha 4 (o aluno já situou redes profundas) |

Trilhas 1–2 (MQ / perceptron + BI) **não** bloqueiam 4–5, mas a narrativa do
curso fica mais limpa se a demanda supervisionada clássica vier antes.

## Critérios de pronto

**Trilha 4**

- [ ] MD em pt-BR, shared-prose house rules, razão de ser no topo
- [ ] Famílias em traço grosso + ponte explícita aos baselines de demanda
- [ ] Demo opcional cabe em máquina sem GPU
- [ ] Indexado em `material/README.md`

**Trilha 5**

- [ ] Distinção pré-treino / fine-tune / do zero clara e ilustrada
- [ ] Demo reproduzível, modelo pequeno, dataset tiny, sem GPU obrigatória
- [ ] Aviso de tamanho de download / cache
- [ ] Indexado em `material/README.md`

## Não fazer neste plano

- Unificar 4 e 5 num único MD longo
- Empurrar fine-tuning de fundacionais grandes para a turma
- BI explorers ou Pages para estas duas aulas
