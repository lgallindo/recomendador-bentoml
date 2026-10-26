"""Memória de preferências estilo Mem0 — store JSON local (add / search / update).

Espelha a forma da API (user_id + mensagens/fatos) sem exigir Mem0 Cloud.
Opcional: trocar o backend por mem0ai quando a sala tiver o pacote.
"""

from __future__ import annotations

import argparse
import json
import re
import time
import uuid
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
STORE = RAIZ / "material" / "memoria" / "store_preferencias.json"
SAIDA = RAIZ / "material" / "memoria"


def carregar() -> dict:
    if not STORE.exists():
        return {"memories": []}
    return json.loads(STORE.read_text(encoding="utf-8"))


def salvar(dados: dict) -> None:
    STORE.parent.mkdir(parents=True, exist_ok=True)
    STORE.write_text(json.dumps(dados, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def add(texto: str, *, user_id: str) -> dict:
    dados = carregar()
    item = {
        "id": str(uuid.uuid4())[:8],
        "user_id": user_id,
        "memory": texto,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    dados["memories"].append(item)
    salvar(dados)
    return item


def search(query: str, *, user_id: str) -> list[dict]:
    dados = carregar()
    tokens = [t for t in re.split(r"\W+", query.lower()) if t]
    hits = []
    for m in dados["memories"]:
        if m["user_id"] != user_id:
            continue
        blob = m["memory"].lower()
        score = sum(1 for t in tokens if t in blob)
        if score or not tokens:
            hits.append({**m, "score": score})
    hits.sort(key=lambda h: h["score"], reverse=True)
    return hits


def update(mem_id: str, novo_texto: str) -> dict | None:
    dados = carregar()
    for m in dados["memories"]:
        if m["id"] == mem_id:
            m["memory"] = novo_texto
            m["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            salvar(dados)
            return m
    return None


def demo_padrao(user_id: str) -> dict:
    STORE.unlink(missing_ok=True)
    adds = [
        add("Cliente prefere frete para Recife.", user_id=user_id),
        add("Não gosta de peças de palha.", user_id=user_id),
        add("Orçamento máximo cerca de R$ 150.", user_id=user_id),
    ]
    antes = search("frete Recife", user_id=user_id)
    alvo = next(a for a in adds if "Recife" in a["memory"])
    update(alvo["id"], "Cliente prefere frete para Olinda (mudou de Recife).")
    depois = search("frete Recife", user_id=user_id)
    depois_olinda = search("frete Olinda", user_id=user_id)
    return {
        "user_id": user_id,
        "adds": adds,
        "search_frete_recife_antes": antes,
        "search_frete_recife_depois_update": depois,
        "search_frete_olinda_depois": depois_olinda,
        "nota": (
            "Store local JSON espelhando add/search/update. "
            "Mem0 Cloud / mem0ai é opcional; Graphiti/Letta/LangMem = outras camadas."
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--user-id", default="aluno_demo")
    args = parser.parse_args()
    SAIDA.mkdir(parents=True, exist_ok=True)
    out = demo_padrao(args.user_id)
    caminho = SAIDA / "resultado_memoria_preferencias.json"
    caminho.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"\n→ {caminho}")


if __name__ == "__main__":
    main()
