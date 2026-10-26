"""Índice FTS5 da mini-wiki — degrau INDEX/FTS da ladder house (sem servidor)."""

from __future__ import annotations

import argparse
import re
import sqlite3
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
WIKI = RAIZ / "material" / "mini-wiki-rag"
DB = RAIZ / "material" / "rag" / "fts.sqlite"


def titulo_e_corpo(texto: str) -> tuple[str, str]:
    titulo = next((ln[2:].strip() for ln in texto.splitlines() if ln.startswith("# ")), "")
    corpo = re.sub(r"^---\n.*?\n---\n", "", texto, count=1, flags=re.S)
    return titulo or "(sem título)", corpo


def indexar() -> int:
    DB.parent.mkdir(parents=True, exist_ok=True)
    if DB.exists():
        DB.unlink()
    conn = sqlite3.connect(DB)
    conn.execute(
        "CREATE VIRTUAL TABLE docs USING fts5(path, title, body, tokenize='porter unicode61')"
    )
    n = 0
    for path in sorted(WIKI.glob("*.md")):
        if path.name.upper() == "README.MD":
            continue
        texto = path.read_text(encoding="utf-8")
        if not texto.startswith("---"):
            continue
        title, body = titulo_e_corpo(texto)
        conn.execute(
            "INSERT INTO docs(path, title, body) VALUES (?, ?, ?)",
            (path.name, title, body),
        )
        n += 1
    conn.commit()
    conn.close()
    return n


_STOP = {
    "a", "o", "os", "as", "de", "da", "do", "das", "dos", "e", "ou", "um", "uma",
    "para", "por", "com", "sem", "em", "no", "na", "nos", "nas", "que", "qual",
    "quais", "se", "ao", "à", "é",
}


def consulta_fts(query: str) -> str:
    """FTS5 rejeita pontuação solta; tokens úteis unidos com OR."""
    brutos = re.findall(r"[0-9A-Za-zÀ-ÿ]+", query, flags=re.UNICODE)
    tokens = [t for t in brutos if t.lower() not in _STOP and len(t) > 1]
    if not tokens:
        tokens = brutos[:3] or ['""']
    return " OR ".join(tokens)


def buscar(query: str, limite: int = 5) -> list[tuple[str, str, str]]:
    if not DB.exists():
        raise SystemExit("Rode primeiro: uv run python scripts/demo_rag_fts.py --indexar")
    conn = sqlite3.connect(DB)
    rows = conn.execute(
        """
        SELECT path, title, snippet(docs, 2, '>>>', '<<<', '…', 20)
        FROM docs WHERE docs MATCH ? ORDER BY rank LIMIT ?
        """,
        (consulta_fts(query), limite),
    ).fetchall()
    conn.close()
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--indexar", action="store_true")
    parser.add_argument("query", nargs="*", help="consulta FTS5")
    args = parser.parse_args()
    if args.indexar or not DB.exists():
        n = indexar()
        print(f"indexado {n} docs → {DB.relative_to(RAIZ)}")
    if args.query:
        q = " ".join(args.query)
        rows = buscar(q)
        if not rows:
            print("(nenhum hit)")
            return
        for path, title, snip in rows:
            print(f"## {title}  [{path}]")
            print(snip)
            print()


if __name__ == "__main__":
    main()
