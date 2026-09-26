"""Serve recomendações com sinal demográfico além de produto."""

from __future__ import annotations

import pickle
from pathlib import Path

import bentoml

MODELO = "recomendador-demo:latest"
modelo = bentoml.models.get(MODELO)
ARTEFATO = "model.pkl"


def _afinidade_demo(
    cliente: dict,
    produto: dict,
    pop_faixa: dict[str, dict[str, float]],
    pid: str,
) -> float:
    """Mistura preferências declaradas + popularidade na faixa etária (0…1)."""
    tecnica_ok = 1.0 if produto["tecnica"] in cliente.get("tecnicas_preferidas", []) else 0.0
    polo_ok = 1.0 if produto["regiao"] in cliente.get("polos_interesse", []) else 0.0
    declarado = 0.5 * tecnica_ok + 0.5 * polo_ok
    faixa = cliente.get("faixa_etaria", "")
    na_faixa = pop_faixa.get(faixa, {}).get(pid, 0.0)
    return 0.5 * declarado + 0.5 * na_faixa


@bentoml.service(resources={"cpu": "1"})
class RecomendadorDemo:

    def __init__(self) -> None:
        caminho = Path(modelo.path_of(ARTEFATO))
        self.artefato = pickle.loads(caminho.read_bytes())

    @bentoml.api
    def recomendar(
        self,
        produto_na_pagina: str,
        cliente_id: str | None = None,
        limite: int = 4,
        excluir: list[str] | None = None,
    ) -> dict:
        """Sugestões usando produto da página e, se houver, perfil demográfico.

        Entrada:
          - produto_na_pagina: id aberto na vitrine
          - cliente_id: opcional; se omitido, cai no baseline só de produto
          - limite / excluir: iguais à variante raiz
        """
        produtos = self.artefato["produtos"]
        pagina = produto_na_pagina
        if pagina not in produtos:
            return {
                "erro": "produto_inexistente",
                "produto_na_pagina": pagina,
                "items": [],
            }

        cliente = None
        if cliente_id:
            cliente = self.artefato["clientes"].get(cliente_id)
            if cliente is None:
                return {
                    "erro": "cliente_inexistente",
                    "cliente_id": cliente_id,
                    "produto_na_pagina": pagina,
                    "items": [],
                }

        excluir_set = set(excluir or [])
        excluir_set.add(pagina)
        atual = produtos[pagina]
        tecnica = atual["tecnica"]
        pedidos_brutos = self.artefato["pedidos_brutos"]
        pop = self.artefato["pop"]
        cooc_pagina = self.artefato["cooc"].get(pagina, {})
        pop_faixa = self.artefato["pop_faixa"]
        pesos = self.artefato["pesos"]

        candidatos = [
            pid
            for pid, p in produtos.items()
            if p["tecnica"] == tecnica and pid not in excluir_set
        ]

        def score_candidato(pid: str) -> float:
            demo = 0.0
            if cliente is not None:
                demo = _afinidade_demo(cliente, produtos[pid], pop_faixa, pid)
            return (
                pesos["pop"] * pop[pid]
                + pesos["cooc"] * cooc_pagina.get(pid, 0.0)
                + pesos["demo"] * demo
            )

        candidatos.sort(key=score_candidato, reverse=True)
        escolhidos: list[str] = candidatos[: max(limite, 0)]
        complemento_usado = False

        if len(escolhidos) < limite:
            complemento_usado = True
            resto = [
                pid
                for pid in sorted(produtos, key=lambda x: pedidos_brutos[x], reverse=True)
                if pid not in excluir_set and pid not in escolhidos
            ]
            resto.sort(key=score_candidato, reverse=True)
            escolhidos.extend(resto[: limite - len(escolhidos)])

        items = []
        for rank, pid in enumerate(escolhidos, start=1):
            p = produtos[pid]
            mesma_tec = p["tecnica"] == tecnica
            demo = (
                _afinidade_demo(cliente, p, pop_faixa, pid) if cliente is not None else 0.0
            )
            if mesma_tec:
                score = score_candidato(pid)
                reason = "mesma_tecnica_demo" if cliente else "mesma_tecnica"
            else:
                score = 0.5 * pop[pid] + (0.3 * demo if cliente else 0.0)
                reason = "complemento_demo" if cliente else "complemento_popularidade"
            items.append(
                {
                    "product_id": pid,
                    "nome": p["nome"],
                    "tecnica": p["tecnica"],
                    "regiao": p["regiao"],
                    "score": round(score, 4),
                    "afinidade_demo": round(demo, 4),
                    "reason": reason,
                    "rank": rank,
                }
            )

        out: dict = {
            "items": items,
            "strategy": self.artefato["estrategia"],
            "pesos": pesos,
            "complemento_usado": complemento_usado,
            "produto_na_pagina": {
                "product_id": pagina,
                "nome": atual["nome"],
                "tecnica": tecnica,
                "regiao": atual["regiao"],
            },
            "modelo": str(modelo.tag),
            "cliente_id": cliente_id,
        }
        if cliente is not None:
            out["cliente"] = {
                "id": cliente["id"],
                "faixa_etaria": cliente["faixa_etaria"],
                "regiao_cliente": cliente["regiao_cliente"],
                "tecnicas_preferidas": cliente["tecnicas_preferidas"],
                "polos_interesse": cliente["polos_interesse"],
            }
        return out
