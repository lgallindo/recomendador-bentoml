# Dados da variante clustering

Arquivo: [`catalogo.json`](catalogo.json) — mesmos `produtos` e `cestas` do baseline
(sem demografia). O treino deriva daqui `pop`, `cooc` e os rótulos de cluster.

| Campo | Uso nesta variante |
| --- | --- |
| `tecnica`, `regiao`, `pedidos` | vetor de atributos do clustering |
| `cestas` | fila `cesta` (co-ocorrência com a página) |
| `id` | chave da API e rótulos do dendrograma |
