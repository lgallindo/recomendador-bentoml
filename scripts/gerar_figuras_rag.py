"""Figuras dos tutoriais llmwiki e RAG: loop, escada, índice invertido, ciclo,
contribuições BM25, prompt aumentado e recall por pergunta.

Os números vêm de `material/mini-wiki-rag/` e de `material/rag/avaliacao_rag.json`
(gere antes com `uv run python scripts/avaliar_rag.py`).
"""

from __future__ import annotations

import json
import sys
import textwrap
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

sys.path.insert(0, str(Path(__file__).resolve().parent))
from avaliar_rag import Bm25, carregar_corpus, tokenizar  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
IMAGENS = RAIZ / "material" / "imagens"
AVALIACAO = RAIZ / "material" / "rag" / "avaliacao_rag.json"
ANCORADO = RAIZ / "material" / "rag" / "resultado_rag_subperguntas.json"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
CLARO, CREME, VERDE_CLARO = "#e5edf7", "#fff1dc", "#c0dedc"


def caixa(ax, x, y, w, h, texto, cor, tamanho=11, peso="bold", borda=AZUL, cor_texto=AZUL):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.05",
                                facecolor=cor, edgecolor=borda, lw=2))
    ax.text(x + w / 2, y + h / 2, texto, ha="center", va="center", color=cor_texto,
            fontsize=tamanho, weight=peso)


def seta(ax, x0, y0, x1, y1, cor=BARRO, estilo="-|>"):
    ax.annotate("", xy=(x1, y1), xytext=(x0, y0),
                arrowprops={"arrowstyle": estilo, "color": cor, "lw": 2})


def salvar(fig, nome: str) -> None:
    fig.savefig(IMAGENS / nome, dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def figura_loop() -> None:
    fig, ax = plt.subplots(figsize=(12, 4.6))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 4.6)
    ax.axis("off")
    caixa(ax, 0.2, 1.9, 2.0, 1.2, "Pergunta\ndo cliente", "white")
    caixa(ax, 3.0, 1.9, 2.4, 1.2, "1 · Recuperar\nbusca no corpus", CLARO)
    caixa(ax, 6.2, 1.9, 2.4, 1.2, "2 · Enriquecer\nmonta o prompt", VERDE_CLARO)
    caixa(ax, 9.4, 1.9, 2.4, 1.2, "3 · Gerar\nresposta citada", CREME)
    for x0, x1 in [(2.25, 2.95), (5.45, 6.15), (8.65, 9.35)]:
        seta(ax, x0, 2.5, x1, 2.5)
    rotulos = [
        (2.6, "texto da\npergunta"),
        (5.8, "top-k:\n(path, trecho,\nscore)"),
        (9.0, "instrução +\ntrechos +\npergunta"),
    ]
    for x, t in rotulos:
        ax.text(x, 3.55, t, ha="center", va="bottom", color=BARRO, fontsize=9.5)
    caixa(ax, 5.0, 0.15, 6.8, 1.0,
          "Conferir: cada path citado existe e diz o fato?\nSem trecho relevante → abster-se",
          "white", tamanho=10, peso="normal", borda=VERDE)
    seta(ax, 10.6, 1.85, 10.6, 1.2, cor=VERDE)
    ax.set_title("RAG — o que viaja em cada seta", color=AZUL, weight="bold", fontsize=14)
    salvar(fig, "rag-loop.png")


def figura_ladder() -> None:
    fig, ax = plt.subplots(figsize=(9, 5.4))
    ax.set_xlim(0, 9)
    ax.set_ylim(0, 6.4)
    ax.axis("off")
    degraus = [
        (0.3, "1 · Markdown versionado", "páginas com frontmatter; leitura direta, grep"),
        (1.6, "2 · Busca textual (FTS5 / SQLite)", "índice invertido; termos exatos, sem servidor"),
        (2.9, "3 · BM25 / llmwiki", "pesa raridade e tamanho; híbrido opcional"),
        (4.2, "4 · Vetores ou grafo", "sinônimos e paráfrases; mais custo e manutenção"),
    ]
    for i, (y, titulo, sub) in enumerate(degraus):
        x = 0.4 + 0.5 * i
        ax.add_patch(FancyBboxPatch((x, y), 6.0, 1.0, boxstyle="round,pad=0.05",
                                    facecolor=CLARO if i < 3 else CREME, edgecolor=AZUL, lw=2))
        ax.text(x + 0.25, y + 0.62, titulo, color=AZUL, fontsize=12, weight="bold", va="center")
        ax.text(x + 0.25, y + 0.25, sub, color=AZUL, fontsize=9.5, va="center")
    seta(ax, 8.4, 0.5, 8.4, 5.0, cor=VERDE)
    ax.text(8.6, 2.75, "suba só quando\no degrau de baixo\nfalhar nas suas\nperguntas-ouro",
            color=VERDE, fontsize=9.5, va="center")
    ax.set_title("Escada de recuperação local", color=AZUL, weight="bold", fontsize=14)
    salvar(fig, "rag-ladder.png")


def figura_indice_invertido() -> None:
    bm25 = Bm25(carregar_corpus())
    termos = ["frete", "devolução", "tracunhaém", "prazo"]
    fig, ax = plt.subplots(figsize=(12, 5.2))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 5.75)
    ax.axis("off")
    paginas = ["frete.md", "devolucao.md", "atendimento.md", "catalogo-p01.md"]
    for i, p in enumerate(paginas):
        y = 4.3 - i * 1.25
        toks = bm25.tokens[p]
        amostra = " ".join(toks[:9]) + " …"
        caixa(ax, 0.1, y, 3.9, 0.95, "", "white", borda=AZUL)
        ax.text(0.25, y + 0.66, p, color=AZUL, weight="bold", fontsize=10.5)
        ax.text(0.25, y + 0.28, textwrap.shorten(amostra, 46), color=AZUL, fontsize=8.5)
    seta(ax, 4.2, 2.8, 5.0, 2.8)
    ax.text(4.6, 3.05, "tokenizar\ne inverter", ha="center", va="bottom", color=BARRO, fontsize=9)
    ax.text(5.2, 5.38, "termo  →  lista de postagens (página: tf)", color=AZUL,
            fontsize=11, weight="bold")
    for i, t in enumerate(termos):
        y = 4.3 - i * 1.25
        postagens = [(p, bm25.tokens[p].count(t)) for p in bm25.tokens if t in bm25.tokens[p]]
        postagens.sort(key=lambda x: -x[1])
        caixa(ax, 5.2, y, 1.6, 0.95, f"{t}\ndf = {len(postagens)}", CLARO, tamanho=10)
        texto = "   ".join(f"{p.removesuffix('.md')}: {n}" for p, n in postagens)
        ax.text(7.0, y + 0.47, texto, color=AZUL, fontsize=9.5, va="center")
    ax.set_title(f"Índice invertido da mini-wiki ({bm25.n} páginas, "
                 f"{bm25.media:.0f} tokens em média)", color=AZUL, weight="bold", fontsize=13)
    salvar(fig, "llmwiki-indice-invertido.png")


def figura_ciclo() -> None:
    fig, ax = plt.subplots(figsize=(11, 4.4))
    ax.set_xlim(0, 11)
    ax.set_ylim(0, 4.4)
    ax.axis("off")
    etapas = [
        (0.2, "Escrever\npágina .md", "white"),
        (2.4, "Frontmatter\ntitle · description\n· tags", CREME),
        (4.6, "Indexar\nllmwiki index", CLARO),
        (6.8, "Buscar\nllmwiki search", VERDE_CLARO),
        (9.0, "Ler o hit\ne o trecho", "white"),
    ]
    for x, t, c in etapas:
        caixa(ax, x, 2.0, 1.8, 1.4, t, c, tamanho=10)
    for x in (2.05, 4.25, 6.45, 8.65):
        seta(ax, x, 2.7, x + 0.3, 2.7)
    ax.annotate("", xy=(5.5, 1.95), xytext=(9.9, 1.95),
                arrowprops={"arrowstyle": "-|>", "color": VERDE, "lw": 2,
                            "connectionstyle": "arc3,rad=-0.35"})
    ax.text(7.7, 0.55, "editou? reindexe (--incremental) antes de confiar na busca",
            ha="center", color=VERDE, fontsize=10)
    ax.text(3.3, 1.35, "sem frontmatter,\na página fica fora", ha="center", color=BARRO, fontsize=9)
    ax.set_title("Ciclo de vida de uma página na llmwiki", color=AZUL, weight="bold", fontsize=13)
    salvar(fig, "llmwiki-ciclo.png")


def figura_contribuicoes() -> None:
    pergunta = "Qual o prazo de devolução e o frete para Tracunhaém?"
    ranking = Bm25(carregar_corpus()).ranquear(pergunta)
    termos = list(dict.fromkeys(tokenizar(pergunta)))
    cores = dict(zip(termos, [AZUL, VERDE, BARRO, "#d9a441"], strict=False))
    fig, ax = plt.subplots(figsize=(10, 4.8))
    nomes = [h["path"] for h in ranking][::-1]
    base = [0.0] * len(nomes)
    for t in termos:
        vals = [next(h for h in ranking if h["path"] == n)["termos"].get(t, {}).get(
            "contribuicao", 0.0) for n in nomes]
        ax.barh(nomes, vals, left=base, color=cores[t], label=t, edgecolor="white")
        base = [b + v for b, v in zip(base, vals, strict=True)]
    for i, total in enumerate(base):
        ax.text(total + 0.04, i, f"{total:.2f}".replace(".", ","), va="center",
                color=AZUL, fontsize=10)
    ax.set_xlabel("score BM25 (soma das contribuições por termo; k1 = 1,2; b = 0,75)")
    ax.set_title(f"BM25 por página — «{pergunta}»", color=AZUL, weight="bold", fontsize=12)
    ax.legend(title="termo", frameon=False, loc="lower right")
    ax.spines[["top", "right"]].set_visible(False)
    salvar(fig, "llmwiki-bm25-contribuicoes.png")


def figura_prompt() -> None:
    dados = json.loads(ANCORADO.read_text(encoding="utf-8"))
    linhas_prompt = dados["prompt_aumentado"].split("\n")
    fig, ax = plt.subplots(figsize=(12, 5.0))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 5.6)
    ax.axis("off")
    blocos = [
        (4.1, 1.15, CREME, "Instrução", "regras de uso: só os trechos, citar, abster-se"),
        (1.6, 2.35, CLARO, "Trechos recuperados", "um bloco por hit, com o path de origem"),
        (0.3, 1.1, VERDE_CLARO, "Pergunta", "o texto original do cliente"),
    ]
    for y, h, cor, titulo, sub in blocos:
        ax.add_patch(FancyBboxPatch((0.2, y), 2.8, h - 0.15, boxstyle="round,pad=0.04",
                                    facecolor=cor, edgecolor=AZUL, lw=2))
        ax.text(0.35, y + h - 0.45, titulo, color=AZUL, weight="bold", fontsize=11)
        ax.text(0.35, y + 0.2, textwrap.fill(sub, 30), color=AZUL, fontsize=8.5)
    ax.add_patch(FancyBboxPatch((3.4, 0.3), 8.4, 4.9, boxstyle="round,pad=0.04",
                                facecolor="white", edgecolor=VERDE, lw=1.5))
    texto = []
    for ln in linhas_prompt:
        ln = ln.replace(">>>", "").replace("<<<", "")
        texto.extend(textwrap.wrap(ln, 80) or [""])
    ax.text(3.55, 5.05, "\n".join(texto[:22]), family="monospace", fontsize=9.2,
            color=AZUL, va="top")
    ax.set_title("Anatomia do prompt aumentado (subperguntas, FTS, gerado pelo script)",
                 color=AZUL, weight="bold", fontsize=12)
    salvar(fig, "rag-prompt-aumentado.png")


def figura_recall() -> None:
    dados = json.loads(AVALIACAO.read_text(encoding="utf-8"))
    perguntas = [q for q in dados["perguntas"] if q["relevantes"]]
    recs = list(perguntas[0]["recuperadores"])
    cores = {"fts": BARRO, "bm25": VERDE, "llmwiki": AZUL}
    fig, ax = plt.subplots(figsize=(11, 4.8))
    largura = 0.8 / len(recs)
    for j, r in enumerate(recs):
        xs = [i + (j - (len(recs) - 1) / 2) * largura for i in range(len(perguntas))]
        ys = [q["recuperadores"][r]["inteira"]["recall@3"] for q in perguntas]
        ax.bar(xs, ys, width=largura, color=cores.get(r, AZUL), label=r)
        for x, y in zip(xs, ys, strict=True):
            ax.text(x, y + 0.02, f"{y:.1f}".replace(".", ","), ha="center", fontsize=8.5,
                    color=AZUL)
    ax.set_xticks(range(len(perguntas)))
    ax.set_xticklabels([f"{q['id']}\n" + textwrap.fill(q["pergunta"], 22) for q in perguntas],
                       fontsize=8)
    ax.set_ylim(0, 1.18)
    ax.set_ylabel("recall@3 (pergunta inteira)")
    ax.set_title("Recall@3 por pergunta-ouro — a q1 expõe o FTS", color=AZUL, weight="bold")
    ax.legend(frameon=False, ncol=3, loc="upper right")
    ax.spines[["top", "right"]].set_visible(False)
    salvar(fig, "rag-falha-recall.png")


def figura_mapa() -> None:
    fig, ax = plt.subplots(figsize=(12, 5.2))
    ax.set_xlim(0, 12)
    ax.set_ylim(0, 5.4)
    ax.axis("off")
    ax.add_patch(FancyBboxPatch((0.2, 0.2), 11.6, 4.5, boxstyle="round,pad=0.05",
                                facecolor=CLARO, edgecolor=AZUL, lw=2))
    ax.text(0.5, 4.3, "Inteligência artificial", color=AZUL, weight="bold", fontsize=13)
    ax.add_patch(FancyBboxPatch((0.6, 1.5), 4.8, 2.5, boxstyle="round,pad=0.05",
                                facecolor="white", edgecolor=VERDE, lw=2))
    ax.text(0.8, 3.5, "Recuperação de informação", color=VERDE, weight="bold", fontsize=11.5)
    ax.text(0.8, 2.55, "índice invertido · FTS\nBM25 (llmwiki)\nvetores · grafo\n"
            "métricas: recall@k, precisão@k", color=AZUL, fontsize=10, va="center")
    ax.add_patch(FancyBboxPatch((6.6, 1.5), 4.8, 2.5, boxstyle="round,pad=0.05",
                                facecolor="white", edgecolor=BARRO, lw=2))
    ax.text(6.8, 3.25, "Aprendizado de máquina:\nmodelos de linguagem", color=BARRO, weight="bold", fontsize=11.5)
    ax.text(6.8, 2.55, "geram texto aprendido de dados\nfluência sem garantia de fato\n"
            "nesta aula: um template\nno lugar do modelo", color=AZUL, fontsize=10,
            va="center")
    caixa(ax, 4.6, 0.35, 2.8, 0.85, "RAG = recuperar\n+ gerar com citação", CREME, tamanho=10.5)
    seta(ax, 4.6, 0.8, 3.0, 1.45, cor=VERDE)
    seta(ax, 7.4, 0.8, 9.0, 1.45, cor=BARRO)
    ax.set_title("Onde a busca local e o RAG se situam", color=AZUL, weight="bold", fontsize=14)
    salvar(fig, "rag-mapa-ia.png")


def main() -> None:
    IMAGENS.mkdir(parents=True, exist_ok=True)
    figura_loop()
    figura_ladder()
    figura_indice_invertido()
    figura_ciclo()
    figura_contribuicoes()
    figura_mapa()
    gerados = ["rag-loop.png", "rag-ladder.png", "llmwiki-indice-invertido.png",
               "llmwiki-ciclo.png", "llmwiki-bm25-contribuicoes.png", "rag-mapa-ia.png"]
    if ANCORADO.exists():
        figura_prompt()
        gerados.append("rag-prompt-aumentado.png")
    if AVALIACAO.exists():
        figura_recall()
        gerados.append("rag-falha-recall.png")
    print("ok → " + ", ".join(gerados))


if __name__ == "__main__":
    main()
