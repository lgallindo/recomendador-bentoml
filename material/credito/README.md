# Materiais da aula de árvores e crédito

Comece pelo [tutorial](../tutorial-arvore-decisao-credito-20261017.md).
Os contratos são inteiramente sintéticos; os artefatos não concedem crédito.

| Arquivo | Uso |
| --- | --- |
| [cartoes-impressao.pdf](cartoes-impressao.pdf) | Imprima em A4: páginas 1–2 têm 12 cartões; página 3 tem rótulos separados para recortar. Não é um esquema de impressão frente e verso. |
| [arvore-curta.txt](arvore-curta.txt) | Todas as perguntas e contagens da árvore de profundidade 2 |
| [arvore-profunda.txt](arvore-profunda.txt) | Todas as perguntas e contagens da árvore sem limite de profundidade |
| [relatorio.json](relatorio.json) | Configurações, versão da biblioteca, seleção no desenvolvimento, contagens e avaliação final de referência |
| [previsoes-teste.csv](previsoes-teste.csv) | Previsão, resultado observado, folha e baseline para cada contrato do teste |

**Para o docente:** o relatório publicado inclui o gabarito do teste. Distribua
somente cartões, treino e desenvolvimento antes da atividade final. Em estudo
individual, não abra o gabarito até fixar a configuração.

Reprodução na raiz, com as dependências do projeto instaladas:

```bash
uv run python scripts/gerar_dados_credito.py
uv run python scripts/arvore_credito.py --saida material/credito-experimento
```

O segundo comando escreve somente resultados de treino e desenvolvimento.
Compare configurações com `--profundidade` e `--minimo-folha`, sempre nessa pasta
separada. Depois de fixar os valores, acrescente `--avaliar-teste`. Se continuar
ajustando após ver o teste, ele passa a participar do desenvolvimento; uma nova
avaliação independente seria necessária.

Para reproduzir exatamente os artefatos publicados, inclusive o gabarito:

```bash
uv run python scripts/arvore_credito.py --avaliar-teste --saida material/credito
uv run python scripts/gerar_figuras_credito.py
uv run python -m unittest discover -s scripts -p 'test_credito.py'
```

A saída padrão para experimentos é `material/credito-experimento`.
O comando de reprodução acima usa explicitamente `material/credito`. As figuras são escritas em `material/imagens`.
O gerador de figuras exige o relatório padrão, com profundidade 2, mínimo de 12
casos por folha e teste final. Os TXT listam contagens do **treino** em cada folha;
a matriz de avaliação contém contratos do **teste**. A versão de referência é
scikit-learn 1.9.1; versões diferentes podem mudar desempates.
