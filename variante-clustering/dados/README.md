# Dados da variante clustering

Aqui a feira usa o **mesmo** catálogo e as **mesmas** cestas do baseline. O que
muda é o que o treino *extrai* desse arquivo: além de `pop` e `cooc`, um vetor
de atributos por peça para o clustering hierárquico. A intercalação cesta /
cluster na API nasce desses dois usos do mesmo JSON.

Arquivo: [`catalogo.json`](catalogo.json) — mesmos `produtos` e `cestas` do baseline
(sem demografia). O treino deriva daqui `pop`, `cooc` e os rótulos de cluster.

| Campo | Uso nesta variante |
| --- | --- |
| `tecnica`, `regiao`, `pedidos` | vetor de atributos do clustering |
| `cestas` | fila `cesta` (co-ocorrência com a página) |
| `id` | chave da API e rótulos do dendrograma |

Depois do `just treino`, o desenho da árvore aparece em
[`../material/dendrograma.png`](../material/dendrograma.png). A regra de
intercalação e os comandos da aula estão no [`../README.md`](../README.md).
