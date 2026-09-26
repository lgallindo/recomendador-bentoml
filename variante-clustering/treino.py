"""Lê catálogo, calcula pop/cooc, cluster hierárquico + dendrograma, guarda no BentoML."""

from __future__ import annotations

import json
import pickle
from collections import defaultdict
from pathlib import Path

import bentoml
import matplotlib.pyplot as plt
import numpy as np
from scipy.cluster.hierarchy import dendrogram, linkage
from sklearn.cluster import AgglomerativeClustering
from sklearn.preprocessing import OneHotEncoder, StandardScaler

DADOS = Path(__file__).resolve().parent / "dados" / "catalogo.json"
DENDRO = Path(__file__).resolve().parent / "material" / "dendrograma.png"
ARTEFATO = "model.pkl"
MODELO = "recomendador-cluster"
N_CLUSTERS = 4


def _cooc(cestas: list[list[str]]) -> dict[str, dict[str, float]]:
    conta: dict[str, dict[str, float]] = defaultdict(lambda: defaultdict(float))
    for cesta in cestas:
        ids = list(dict.fromkeys(cesta))
        for i, a in enumerate(ids):
            for b in ids[i + 1 :]:
                conta[a][b] += 1.0
                conta[b][a] += 1.0
    cooc: dict[str, dict[str, float]] = {}
    for a, vizinhos in conta.items():
        m = max(vizinhos.values()) if vizinhos else 1.0
        cooc[a] = {b: v / m for b, v in vizinhos.items()}
    return cooc


def _matriz_atributos(produtos: dict[str, dict]) -> tuple[np.ndarray, list[str]]:
    ids = sorted(produtos)
    tecnicas = [[produtos[i]["tecnica"]] for i in ids]
    regioes = [[produtos[i]["regiao"]] for i in ids]
    pedidos = np.array(
        [[float(produtos[i]["pedidos"])] for i in ids], dtype=float
    )
    enc_t = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
    enc_r = OneHotEncoder(sparse_output=False, handle_unknown="ignore")
    xt = enc_t.fit_transform(tecnicas)
    xr = enc_r.fit_transform(regioes)
    xp = StandardScaler().fit_transform(pedidos)
    x = np.hstack([xt, xr, xp])
    return x, ids


def _agrupar(x: np.ndarray, ids: list[str]) -> tuple[dict[str, int], dict[int, list[str]], np.ndarray]:
    modelo = AgglomerativeClustering(n_clusters=N_CLUSTERS, linkage="ward")
    rotulos = modelo.fit_predict(x)
    cluster_de = {pid: int(rotulos[i]) for i, pid in enumerate(ids)}
    membros: dict[int, list[str]] = defaultdict(list)
    for pid, k in cluster_de.items():
        membros[k].append(pid)
    for k in membros:
        membros[k].sort()
    Z = linkage(x, method="ward")
    return cluster_de, dict(membros), Z


def _salvar_dendrograma(Z: np.ndarray, ids: list[str], destino: Path) -> None:
    destino.parent.mkdir(parents=True, exist_ok=True)
    fig, ax = plt.subplots(figsize=(10, 5))
    dendrogram(Z, labels=ids, leaf_rotation=90, ax=ax)
    ax.set_title(f"Cluster hierárquico (ward) — corte em {N_CLUSTERS} grupos")
    ax.set_ylabel("distância")
    fig.tight_layout()
    fig.savefig(destino, dpi=120)
    plt.close(fig)


def main() -> None:
    catalogo = json.loads(DADOS.read_text(encoding="utf-8"))
    produtos = {p["id"]: p for p in catalogo["produtos"]}
    pedidos_brutos = {pid: float(p["pedidos"]) for pid, p in produtos.items()}
    max_pedidos = max(pedidos_brutos.values()) or 1.0
    pop = {pid: n / max_pedidos for pid, n in pedidos_brutos.items()}
    cooc = _cooc(catalogo["cestas"])

    x, ids = _matriz_atributos(produtos)
    cluster_de, membros_do_cluster, Z = _agrupar(x, ids)
    _salvar_dendrograma(Z, ids, DENDRO)

    artefato = {
        "produtos": produtos,
        "pedidos_brutos": pedidos_brutos,
        "pop": pop,
        "cooc": cooc,
        "cluster_de": cluster_de,
        "membros_do_cluster": membros_do_cluster,
        "n_clusters": N_CLUSTERS,
        "estrategia": "intercala_cesta_cluster",
        "dendrograma": str(DENDRO.relative_to(Path(__file__).resolve().parent)),
    }

    with bentoml.models.create(
        MODELO,
        labels={
            "aula": "recomendador-bentoml",
            "variante": "clustering",
            "regra": "cesta+cluster-hierarquico",
        },
        metadata={
            "n_produtos": len(produtos),
            "n_clusters": N_CLUSTERS,
            "estrategia": artefato["estrategia"],
        },
    ) as model:
        Path(model.path_of(ARTEFATO)).write_bytes(pickle.dumps(artefato))
        tag = model.tag

    print(f"produtos     {len(produtos)}")
    print(f"n_clusters   {N_CLUSTERS}")
    print(f"dendrograma  {DENDRO}")
    print(f"tag store    {tag}")
    for k, membros in sorted(membros_do_cluster.items()):
        print(f"  cluster {k}: {', '.join(membros)}")


if __name__ == "__main__":
    main()
