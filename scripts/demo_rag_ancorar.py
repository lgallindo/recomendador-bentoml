"""Resposta ancorada: recupera FTS e cola trechos (sem LLM — generate = template)."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from demo_rag_fts import DB, buscar, indexar  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "material" / "rag"


def responder(pergunta: str) -> dict:
    if not DB.exists():
        indexar()
    hits = [
        {"path": p, "title": t, "snippet": s}
        for p, t, s in buscar(pergunta, limite=3)
    ]
    if not hits:
        texto = (
            f"Não encontrei trechos no corpus para «{pergunta}». "
            "O fato pode estar ausente da mini-wiki."
        )
    else:
        linhas = [f"Com base em {', '.join(h['path'] for h in hits)}:"]
        for h in hits:
            linhas.append(f"- ({h['path']}) {h['snippet']}")
        texto = "\n".join(linhas)
    return {"pergunta": pergunta, "hits": hits, "resposta_ancorada": texto}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--pergunta",
        default="Qual o prazo de devolução e o frete para Tracunhaém?",
    )
    args = parser.parse_args()
    SAIDA.mkdir(parents=True, exist_ok=True)
    out = responder(args.pergunta)
    caminho = SAIDA / "resultado_rag_ancorado.json"
    caminho.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(out["resposta_ancorada"])
    print(f"\n→ {caminho}")


if __name__ == "__main__":
    main()
