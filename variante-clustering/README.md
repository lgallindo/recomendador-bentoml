# Variante clustering (cesta ⊕ cluster)

O baseline filtra candidatos pela técnica artesanal e ordena por uma nota única.
Nesta pasta a aula coloca **outra** pergunta — e só ela — no centro:

> E se agruparmos as peças por atributos e misturarmos isso com a cesta?

O treino forma clusters hierárquicos; a inferência **intercala** o que costuma
sair junto na compra com o que caiu no mesmo grupo da página. Enquanto você
estiver aqui, o foco é esse desenho de lista.

Pasta irmã do baseline em [`../`](../). Monta a lista **intercalando** dois sinais:

| Rank | Fonte | `reason` |
| ---: | --- | --- |
| 1, 3, 5, … | co-ocorrência nas `cestas` com o produto da página | `cesta` |
| 2, 4, 6, … | mesmo **cluster hierárquico** do produto da página | `cluster` |

| | Baseline (`../`) | Esta variante |
| --- | --- | --- |
| Técnica de grupo | filtro manual por `tecnica` | agglomerative (ward), `n_clusters=4` |
| Lista | score único ordenado | intercalação estrita cesta / cluster |
| Artefato | `recomendador:…` | `recomendador-cluster:…` |
| Porta | 3000 | **3002** |

## Subir

De novo os dois pipelines: treino grava `recomendador-cluster:…`; serve sobe a
inferência na porta **3002**. O `uv` / `.venv` ficam na raiz (`--project ..` no
`justfile`).

```bash
just treino
just serve
just curl-exemplo   # p07 → reasons cesta, cluster, cesta, cluster
```

Swagger: `http://127.0.0.1:3002`.

## Cluster hierárquico (o desenho)

Primeiro o **treino** desenha a árvore — isso é o lado offline. Cada produto vira
um vetor: one-hot de `tecnica` + one-hot de `regiao` + `pedidos` padronizado. O
linkage **ward** produz a árvore; cortamos em 4 grupos. O dendrograma gerado
fica em:

![Dendrograma do catálogo](material/dendrograma.png)

Os dados de entrada (mesmo catálogo do baseline) estão descritos em
[`dados/README.md`](dados/README.md).

## Intercalação

Na **inferência**, a lista deixa de ser um único ranking: ranks ímpares puxam a
fila da cesta; ranks pares, a do cluster. O pseudocódigo abaixo é o que
`service.py` faz a cada pedido.

```text
# Variáveis:
#   pagina, limite, excluir, usados
#   fila_cesta, fila_cluster, escolhidos, rank, src, pid

fila_cesta   ← ids ordenados por cooc[pagina] desc
fila_cluster ← ids do mesmo cluster que pagina, por pop desc
usados ← {pagina} ∪ excluir
escolhidos ← []
rank ← 1
enquanto |escolhidos| < limite:
    src ← cesta se rank ímpar senão cluster
    pid ← próximo de fila_src fora de usados
    se pid é nulo: pid ← próximo da outra fila fora de usados
    se pid é nulo: pare
    usados ← usados ∪ {pid}
    escolhidos.append(pid com reason da fila que forneceu)
    rank ← rank + 1
```

`intercalacao_completa` no JSON fica `true` só se cada vaga veio da fonte preferida
daquele rank.

```mermaid
sequenceDiagram
  participant Web as vitrine
  participant API as recomendar
  participant Art as artefato

  Web->>API: pagina limite excluir
  API->>Art: cooc[pagina] fila_cesta
  API->>Art: membros cluster[pagina] fila_cluster
  loop rank 1..limite
    alt rank impar
      API->>API: proximo de fila_cesta
    else rank par
      API->>API: proximo de fila_cluster
    end
  end
  API-->>Web: items intercalados
```

## Relação com o baseline e com ML

A intercalação continua sendo regra + agregados (e um clustering clássico no
treino). O degrau seguinte, com rótulo supervisionado e métrica de ranking, está
mapeado no [`../README.md`](../README.md#ds-para-ml-microsoft-learn). Para
imagem OCI desta inferência: `just imagem` · `just serve-container` nesta pasta
(tag `recomendador-cluster:aula`).

## Mapa de arquivos

| Arquivo | Papel |
| --- | --- |
| [`dados/catalogo.json`](dados/catalogo.json) | produtos + cestas (cópia do baseline) |
| [`treino.py`](treino.py) | pop, cooc, AgglomerativeClustering, dendrograma, pickle |
| [`service.py`](service.py) | `RecomendadorCluster.recomendar` |
| [`material/dendrograma.png`](material/dendrograma.png) | figura gerada no `just treino` |
| [`justfile`](justfile) | treino / serve :3002 / curl |
| [`bentofile.yaml`](bentofile.yaml) | empacote Bento / container desta variante |
