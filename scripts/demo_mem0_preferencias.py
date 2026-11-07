"""Memória de preferências estilo Mem0 — store JSON local (add / search / update).

Espelha a forma da API (user_id + mensagens/fatos) sem exigir Mem0 Cloud.
Opcional: trocar o backend por mem0ai quando a sala tiver o pacote.

`--roteiro` grava material/memoria/linha-do-tempo.json: turno a turno, com
dois usuários, uma memória de sessão, update, update com histórico e delete.
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


def add(
    texto: str,
    *,
    user_id: str,
    session_id: str | None = None,
    mem_id: str | None = None,
) -> dict:
    dados = carregar()
    item = {
        "id": mem_id or str(uuid.uuid4())[:8],
        "user_id": user_id,
        "memory": texto,
        "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }
    if session_id is not None:
        item["session_id"] = session_id
    dados["memories"].append(item)
    salvar(dados)
    return item


def search(query: str, *, user_id: str, session_id: str | None = None) -> list[dict]:
    dados = carregar()
    tokens = [t for t in re.split(r"\W+", query.lower()) if t]
    hits = []
    for m in dados["memories"]:
        if m["user_id"] != user_id:
            continue
        if "session_id" in m and m["session_id"] != session_id:
            continue
        blob = m["memory"].lower()
        score = sum(1 for t in tokens if t in blob)
        if score or not tokens:
            hits.append({**m, "score": score})
    hits.sort(key=lambda h: h["score"], reverse=True)
    return hits


def update(mem_id: str, novo_texto: str, *, guardar_historico: bool = False) -> dict | None:
    dados = carregar()
    for m in dados["memories"]:
        if m["id"] == mem_id:
            if guardar_historico:
                m.setdefault("historico", []).append(m["memory"])
            m["memory"] = novo_texto
            m["updated_at"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            salvar(dados)
            return m
    return None


def delete(mem_id: str) -> bool:
    dados = carregar()
    antes = len(dados["memories"])
    dados["memories"] = [m for m in dados["memories"] if m["id"] != mem_id]
    salvar(dados)
    return len(dados["memories"]) < antes


def roteiro() -> dict:
    """Linha do tempo didática: cada turno registra ação, resultado e store."""
    STORE.unlink(missing_ok=True)
    turnos: list[dict] = []

    def registrar(acao: str, descricao: str, resultado: object, **ctx: object) -> None:
        turnos.append({
            "turno": len(turnos) + 1,
            "acao": acao,
            "descricao": descricao,
            **ctx,
            "resultado": resultado,
            "store_depois": [
                {k: v for k, v in m.items() if k not in ("created_at", "updated_at")}
                for m in carregar()["memories"]
            ],
        })

    a, b = "aluno_demo", "outra_cliente"
    registrar("add", "Cliente conta onde recebe as compras.",
              add("Cliente prefere frete para Recife.", user_id=a, mem_id="m1"), user_id=a)
    registrar("add", "Cliente diz o que não quer ver.",
              add("Não gosta de peças de palha.", user_id=a, mem_id="m2"), user_id=a)
    registrar("add", "Limite de gasto.",
              add("Orçamento máximo cerca de R$ 150.", user_id=a, mem_id="m3"), user_id=a)
    registrar("add", "Fato que só vale nesta conversa (escopo de sessão).",
              add("Hoje procura presente para a mãe.", user_id=a, session_id="s1", mem_id="m4"),
              user_id=a, session_id="s1")
    registrar("add", "Outra pessoa, outro escopo de usuário.",
              add("Cliente prefere frete para Caruaru.", user_id=b, mem_id="m5"), user_id=b)
    registrar("search", "Busca da primeira cliente.",
              search("frete Recife", user_id=a), user_id=a, consulta="frete Recife")
    registrar("search", "Mesma palavra, outro usuário: só vê o que é dele.",
              search("frete", user_id=b), user_id=b, consulta="frete")
    registrar("search", "Nova sessão s2: a memória de sessão s1 fica de fora.",
              search("presente mãe", user_id=a, session_id="s2"),
              user_id=a, session_id="s2", consulta="presente mãe")
    registrar("search", "Na sessão s1 ela aparece.",
              search("presente mãe", user_id=a, session_id="s1"),
              user_id=a, session_id="s1", consulta="presente mãe")
    registrar("update", "Cliente se mudou; o texto novo ainda cita Recife.",
              update("m1", "Cliente prefere frete para Olinda (mudou de Recife)."), user_id=a)
    registrar("search", "O token antigo continua casando: score 2.",
              search("frete Recife", user_id=a), user_id=a, consulta="frete Recife")
    registrar("update", "Política melhor: texto limpo e valor antigo no histórico.",
              update("m1", "Cliente prefere frete para Olinda.", guardar_historico=True),
              user_id=a)
    registrar("search", "Agora só 'frete' casa: score 1.",
              search("frete Recife", user_id=a), user_id=a, consulta="frete Recife")
    registrar("search", "A preferência atual vence com score 2.",
              search("frete Olinda", user_id=a), user_id=a, consulta="frete Olinda")
    registrar("delete", "Cliente pede para esquecer a preferência sobre palha.",
              delete("m2"), user_id=a)
    registrar("search", "Depois do delete, nada sobre palha.",
              search("palha", user_id=a), user_id=a, consulta="palha")
    return {
        "pontuacao": "score = número de tokens da consulta contidos no texto da memória",
        "usuarios": [a, b],
        "turnos": turnos,
    }


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
    parser.add_argument("--roteiro", action="store_true",
                        help="grava material/memoria/linha-do-tempo.json")
    args = parser.parse_args()
    SAIDA.mkdir(parents=True, exist_ok=True)
    if args.roteiro:
        out = roteiro()
        caminho = SAIDA / "linha-do-tempo.json"
        caminho.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n",
                           encoding="utf-8")
        for t in out["turnos"]:
            res = t["resultado"]
            if isinstance(res, list):
                res = [(h["id"], h["score"]) for h in res]
            elif isinstance(res, dict):
                res = res.get("memory")
            print(f"{t['turno']:>2} {t['acao']:<6} {t.get('consulta', ''):<14} → {res}")
        print(f"\n→ {caminho}")
        return
    out = demo_padrao(args.user_id)
    caminho = SAIDA / "resultado_memoria_preferencias.json"
    caminho.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(out, ensure_ascii=False, indent=2))
    print(f"\n→ {caminho}")


if __name__ == "__main__":
    main()
