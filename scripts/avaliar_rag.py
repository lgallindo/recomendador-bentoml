"""Avalie a recuperação na mini-wiki: FTS5, BM25 da biblioteca padrão e llmwiki.

Para cada pergunta do conjunto-ouro (`material/rag/perguntas-ouro.json`) o
script ordena as páginas com cada recuperador, calcula recall@k e precisão@k e
verifica a abstenção quando o corpus não tem a resposta. A estratégia
"subperguntas" recupera cada parte da pergunta separadamente e intercala os
resultados.

Uso (raiz do repositório):

    uv run python scripts/avaliar_rag.py
    uv run python scripts/avaliar_rag.py --explicar "frete" --pagina frete.md
"""

from __future__ import annotations

import argparse
import json
import math
import re
import shutil
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from demo_rag_fts import _STOP, DB, buscar, indexar, titulo_e_corpo  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
WIKI = RAIZ / "material" / "mini-wiki-rag"
OURO = RAIZ / "material" / "rag" / "perguntas-ouro.json"
SAIDA = RAIZ / "material" / "rag" / "avaliacao_rag.json"
K1, B = 1.2, 0.75
KS = (1, 3)


def carregar_corpus() -> dict[str, dict[str, str]]:
    """Páginas com frontmatter; o texto pesquisável junta title, description e corpo."""
    corpus: dict[str, dict[str, str]] = {}
    for path in sorted(WIKI.glob("*.md")):
        if path.name.upper() == "README.MD":
            continue
        texto = path.read_text(encoding="utf-8")
        cabecalho = re.match(r"^---\n(.*?)\n---\n", texto, flags=re.S)
        if not cabecalho:
            continue
        campos = dict(
            re.findall(r"^(title|description|tags): (.*)$", cabecalho.group(1), flags=re.M)
        )
        _, corpo = titulo_e_corpo(texto)
        corpus[path.name] = {
            "title": campos.get("title", ""),
            "description": campos.get("description", ""),
            "tags": campos.get("tags", ""),
            "corpo": corpo.strip(),
            "pesquisavel": f"{campos.get('title', '')}\n{campos.get('description', '')}\n{corpo}",
        }
    return corpus


def tokenizar(texto: str) -> list[str]:
    """Minúsculas, palavras com acento preservado, sem stopwords nem tokens de 1 letra."""
    return [
        t
        for t in re.findall(r"[0-9a-zà-ÿ]+", texto.lower())
        if t not in _STOP and len(t) > 1
    ]


class Bm25:
    def __init__(self, corpus: dict[str, dict[str, str]], k1: float = K1, b: float = B):
        self.k1, self.b = k1, b
        self.tokens = {p: tokenizar(d["pesquisavel"]) for p, d in corpus.items()}
        self.n = len(self.tokens)
        self.media = sum(len(t) for t in self.tokens.values()) / self.n

    def df(self, termo: str) -> int:
        return sum(1 for t in self.tokens.values() if termo in t)

    def idf(self, termo: str) -> float:
        df = self.df(termo)
        return math.log(1 + (self.n - df + 0.5) / (df + 0.5))

    def contribuicao(self, termo: str, pagina: str) -> dict[str, float]:
        toks = self.tokens[pagina]
        tf = toks.count(termo)
        idf = self.idf(termo)
        norm = 1 - self.b + self.b * len(toks) / self.media
        valor = idf * tf * (self.k1 + 1) / (tf + self.k1 * norm) if tf else 0.0
        return {
            "tf": tf,
            "df": self.df(termo),
            "idf": round(idf, 4),
            "comprimento": len(toks),
            "comprimento_medio": round(self.media, 4),
            "contribuicao": round(valor, 4),
        }

    def ranquear(self, consulta: str) -> list[dict]:
        termos = list(dict.fromkeys(tokenizar(consulta)))
        saida = []
        for pagina in self.tokens:
            det = {t: self.contribuicao(t, pagina) for t in termos}
            det = {t: d for t, d in det.items() if d["tf"]}
            if det:
                total = sum(d["contribuicao"] for d in det.values())
                saida.append({"path": pagina, "score": round(total, 4), "termos": det})
        saida.sort(key=lambda h: (-h["score"], h["path"]))
        return saida


def ranquear_fts(consulta: str) -> list[dict]:
    if not DB.exists():
        indexar()
    return [
        {"path": p, "score": None, "snippet": s}
        for p, _, s in buscar(consulta, limite=8)
    ]


def versao_llmwiki() -> str | None:
    if not shutil.which("llmwiki"):
        return None
    saida = subprocess.run(["llmwiki", "--version"], capture_output=True, text=True)
    return saida.stdout.strip() or None


def ranquear_llmwiki(consulta: str) -> list[dict]:
    saida = subprocess.run(
        ["llmwiki", "search", "--wiki-root", str(WIKI), "--keyword", consulta],
        capture_output=True,
        text=True,
        check=True,
    ).stdout
    return [
        {"path": p, "score": float(s)}
        for p, s in re.findall(r"^\[\d+\]\s+(\S+)\s+\(score: ([0-9.]+)\)", saida, flags=re.M)
    ]


def intercalar(listas: list[list[dict]]) -> list[dict]:
    """Primeiro de cada subpergunta, depois o segundo de cada… sem repetir páginas."""
    vistos, saida = set(), []
    for posicao in range(max((len(x) for x in listas), default=0)):
        for lista in listas:
            if posicao < len(lista) and lista[posicao]["path"] not in vistos:
                vistos.add(lista[posicao]["path"])
                saida.append(lista[posicao])
    return saida


def metricas(ranking: list[dict], relevantes: list[str]) -> dict:
    saida = {}
    for k in KS:
        topo = [h["path"] for h in ranking[:k]]
        if relevantes:
            acertos = len(set(topo) & set(relevantes))
            saida[f"recall@{k}"] = round(acertos / len(relevantes), 4)
            saida[f"precisao@{k}"] = round(acertos / k, 4)
        else:
            saida[f"absteve@{k}"] = not topo
    return saida


def avaliar() -> dict:
    corpus = carregar_corpus()
    bm25 = Bm25(corpus)
    ouro = json.loads(OURO.read_text(encoding="utf-8"))
    recuperadores = {"fts": ranquear_fts, "bm25": bm25.ranquear}
    versao = versao_llmwiki()
    if versao:
        recuperadores["llmwiki"] = ranquear_llmwiki
    resultados = []
    for q in ouro["perguntas"]:
        item = {k: q[k] for k in ("id", "pergunta", "relevantes", "subperguntas")}
        item["recuperadores"] = {}
        for nome, fn in recuperadores.items():
            inteira = fn(q["pergunta"])
            partes = intercalar([fn(s) for s in q["subperguntas"]])
            item["recuperadores"][nome] = {
                "inteira": {"ranking": inteira, **metricas(inteira, q["relevantes"])},
                "subperguntas": {"ranking": partes, **metricas(partes, q["relevantes"])},
            }
        resultados.append(item)

    resumo: dict[str, dict] = {}
    respondiveis = [r for r in resultados if r["relevantes"]]
    for nome in recuperadores:
        for estrategia in ("inteira", "subperguntas"):
            chave = f"{nome}/{estrategia}"
            resumo[chave] = {
                f"recall@{k}_medio": round(
                    sum(r["recuperadores"][nome][estrategia][f"recall@{k}"] for r in respondiveis)
                    / len(respondiveis),
                    4,
                )
                for k in KS
            }
            resumo[chave]["abstencoes_corretas@3"] = sum(
                1
                for r in resultados
                if not r["relevantes"] and r["recuperadores"][nome][estrategia]["absteve@3"]
            )
    return {
        "corpus": "material/mini-wiki-rag/",
        "n_paginas": bm25.n,
        "comprimento_medio_tokens": round(bm25.media, 4),
        "bm25": {"k1": K1, "b": B},
        "llmwiki_versao": versao,
        "fts": "SQLite FTS5, tokenize='porter unicode61', termos unidos por OR, ORDER BY rank",
        "perguntas": resultados,
        "resumo": resumo,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--explicar", help="termo para detalhar o cálculo BM25")
    parser.add_argument("--pagina", default="frete.md")
    args = parser.parse_args()
    if args.explicar:
        bm25 = Bm25(carregar_corpus())
        termo = tokenizar(args.explicar)[0]
        print(json.dumps({"termo": termo, "pagina": args.pagina, "N": bm25.n,
                          "k1": K1, "b": B, **bm25.contribuicao(termo, args.pagina)},
                         ensure_ascii=False, indent=2))
        return
    saida = avaliar()
    SAIDA.write_text(json.dumps(saida, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{'recuperador/estratégia':<26} recall@1  recall@3  abstenção correta")
    for chave, m in saida["resumo"].items():
        print(f"{chave:<26} {m['recall@1_medio']:>8.2f}  {m['recall@3_medio']:>8.2f}  "
              f"{m['abstencoes_corretas@3']:>6} de 1")
    for r in saida["perguntas"]:
        tops = {n: [h["path"] for h in v["inteira"]["ranking"][:3]]
                for n, v in r["recuperadores"].items()}
        print(f"\n{r['id']} {r['pergunta']}\n   relevantes: {r['relevantes']}")
        for n, t in tops.items():
            print(f"   {n:<8} top-3: {t}")
    print(f"\n→ {SAIDA.relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
