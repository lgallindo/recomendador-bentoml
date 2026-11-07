"""Resposta ancorada: recupera FTS e cola trechos (sem LLM — generate = template).

Opções acrescentadas: `--recuperador bm25` (BM25 da biblioteca padrão),
`--k`, `--subpergunta` (repita para dividir a pergunta) e `--saida`. Sem
opções, o comportamento original é mantido: FTS, três trechos,
`material/rag/resultado_rag_ancorado.json`.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from avaliar_rag import Bm25, carregar_corpus, tokenizar  # noqa: E402
from demo_rag_fts import DB, buscar, indexar  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
SAIDA = RAIZ / "material" / "rag"
WIKI = RAIZ / "material" / "mini-wiki-rag"

INSTRUCAO = (
    "Responda em português usando SOMENTE os trechos abaixo. "
    "Cite o arquivo de cada fato entre parênteses. "
    "Se os trechos não contiverem a resposta, diga que a informação não está no corpus."
)


def trecho_bm25(path: str, termos: list[str], largura: int = 160) -> str:
    """Primeira linha do corpo que contém algum termo da consulta, marcada como no FTS."""
    corpo = carregar_corpus()[path]["corpo"]
    linhas = [ln for ln in corpo.splitlines() if ln.strip() and not ln.startswith("#")]
    alvo = next((ln for ln in linhas if any(t in ln.lower() for t in termos)), linhas[0])
    for t in sorted(set(termos), key=len, reverse=True):
        alvo = re.sub(f"(?i)({re.escape(t)})", r">>>\1<<<", alvo)
    return alvo[:largura] + ("…" if len(alvo) > largura else "")


def recuperar(pergunta: str, recuperador: str, k: int) -> list[dict]:
    if recuperador == "fts":
        if not DB.exists():
            indexar()
        return [{"path": p, "title": t, "snippet": s} for p, t, s in buscar(pergunta, limite=k)]
    corpus = carregar_corpus()
    termos = tokenizar(pergunta)
    return [
        {
            "path": h["path"],
            "title": corpus[h["path"]]["title"],
            "score": h["score"],
            "snippet": trecho_bm25(h["path"], termos),
        }
        for h in Bm25(corpus).ranquear(pergunta)[:k]
    ]


def montar_prompt(pergunta: str, hits: list[dict]) -> str:
    blocos = [f"[{i}] ({h['path']}) {h['snippet'].strip()}" for i, h in enumerate(hits, 1)]
    return (
        f"INSTRUÇÃO: {INSTRUCAO}\n\nTRECHOS:\n"
        + ("\n".join(blocos) if blocos else "(nenhum trecho recuperado)")
        + f"\n\nPERGUNTA: {pergunta}"
    )


def responder(
    pergunta: str,
    *,
    recuperador: str = "fts",
    k: int = 3,
    subperguntas: list[str] | None = None,
) -> dict:
    if subperguntas:
        hits, vistos = [], set()
        for sub in subperguntas:
            for h in recuperar(sub, recuperador, k):
                if h["path"] not in vistos:
                    vistos.add(h["path"])
                    hits.append({**h, "subpergunta": sub})
                    break  # o melhor trecho novo de cada subpergunta
    else:
        hits = recuperar(pergunta, recuperador, k)
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
    citacoes = {h["path"]: (WIKI / h["path"]).is_file() for h in hits}
    return {
        "pergunta": pergunta,
        "hits": hits,
        "resposta_ancorada": texto,
        "recuperador": recuperador,
        "k": k,
        "subperguntas": subperguntas or [],
        "prompt_aumentado": montar_prompt(pergunta, hits),
        "citacoes_existem": citacoes,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--pergunta",
        default="Qual o prazo de devolução e o frete para Tracunhaém?",
    )
    parser.add_argument("--recuperador", choices=("fts", "bm25"), default="fts")
    parser.add_argument("--k", type=int, default=3)
    parser.add_argument("--subpergunta", action="append", dest="subperguntas")
    parser.add_argument("--saida", type=Path, default=SAIDA / "resultado_rag_ancorado.json")
    args = parser.parse_args()
    SAIDA.mkdir(parents=True, exist_ok=True)
    out = responder(
        args.pergunta, recuperador=args.recuperador, k=args.k, subperguntas=args.subperguntas
    )
    caminho = args.saida if args.saida.is_absolute() else RAIZ / args.saida
    caminho.write_text(json.dumps(out, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(out["resposta_ancorada"])
    print(f"\n→ {caminho}")


if __name__ == "__main__":
    main()
