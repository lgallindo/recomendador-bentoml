"""Gera as figuras do tutorial de associação em logs de autenticação.

Lê os logs sintéticos de `dados/logs-autenticacao/` com as funções do minerador
e os relatórios de `material/logs-autenticacao/`. Grava em `material/imagens/`:

- logs-pipeline.png — das linhas do log às sessões e às regras
- logs-matriz-sessoes.png — presença de eventos no bloco-base de 20 sessões
- logs-descoberta-validacao.png — regra fixa nas duas bases
- logs-dispersao-regras.png — suporte × confiança das regras selecionadas

Uso (raiz do repositório):

    uv run python scripts/gerar_figuras_logs.py
"""

from __future__ import annotations

import csv
import sys
from collections import Counter
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt  # noqa: E402
from matplotlib.patches import FancyBboxPatch  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
from minerar_logs_autenticacao import (  # noqa: E402
    EVENTOS,
    avaliar,
    ler_eventos,
    montar_sessoes,
)

DADOS = RAIZ / "dados" / "logs-autenticacao"
RELATORIOS = RAIZ / "material" / "logs-autenticacao"
IMAGENS = RAIZ / "material" / "imagens"
TINTA, VERDE, BARRO, AZUL_CLARO, CREME = "#18374b", "#157c80", "#b65432", "#e5edf7", "#fff1dc"
ORDEM = ["falha_senha", "senha_aceita", "desafio_mfa", "falha_mfa", "login_sucesso"]
CRITERIOS = {"suporte": 0.20, "confianca": 0.60, "lift": 1.0}


def carregar(cenario: str) -> tuple[list[str], list[dict], int, dict[str, list[str]]]:
    caminho = DADOS / f"{cenario}-20261017.jsonl"
    linhas = caminho.read_text(encoding="utf-8").splitlines()
    eventos, duplicatas = ler_eventos(caminho)
    return linhas, eventos, duplicatas, montar_sessoes(eventos)


def ler_regras(cenario: str) -> list[dict]:
    with (RELATORIOS / f"{cenario}-20261017.csv").open(encoding="utf-8", newline="") as fh:
        return list(csv.DictReader(fh))


def salvar(fig, nome: str) -> None:
    fig.savefig(IMAGENS / nome, dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)
    print(f"  · {nome}")


def caixa(ax, x, y, w, h, titulo, corpo, cor=AZUL_CLARO, borda=TINTA):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.02,rounding_size=0.12",
                                facecolor=cor, edgecolor=borda, linewidth=2))
    ax.text(x + w / 2, y + h - 0.28, titulo, ha="center", va="top", color=TINTA,
            fontsize=11.5, weight="bold")
    ax.text(x + w / 2, y + h / 2 - 0.45, corpo, ha="center", va="center", color=TINTA,
            fontsize=9.2, linespacing=1.45)


def figura_pipeline(desc) -> None:
    linhas, eventos, duplicatas, sessoes = desc
    fig, ax = plt.subplots(figsize=(13.5, 4.6))
    ax.set_xlim(0, 13.5)
    ax.set_ylim(0, 4.6)
    ax.axis("off")
    etapas = [
        ("1 · Ler e\nvalidar", f"{len(linhas)} linhas JSON\ncampos, fuso, categoria"),
        ("2 · Remover\nreentregas", f"mesmo event_id e conteúdo\n{len(eventos)} eventos únicos\n{duplicatas} reentrega"),
        ("3 · Agrupar\npor sessão", f"chave: session_id\n{len(sessoes)} sessões\n(com e sem sucesso)"),
        ("4 · Conjunto\nde eventos", "presença, sem ordem\nnem repetição\n= uma transação"),
        ("5 · Contar\ne filtrar", "suporte ≥ 20%\nconfiança ≥ 60%\nlift > 1 → 27 regras"),
    ]
    w, gap = 2.3, 0.4
    for i, (t, c) in enumerate(etapas):
        x = 0.2 + i * (w + gap)
        caixa(ax, x, 1.55, w, 2.3, t, c, cor=CREME if i == 3 else AZUL_CLARO,
              borda=BARRO if i == 3 else TINTA)
        if i < len(etapas) - 1:
            ax.annotate("", xy=(x + w + gap - 0.03, 2.7), xytext=(x + w + 0.03, 2.7),
                        arrowprops={"arrowstyle": "-|>", "color": BARRO, "lw": 2})
    ax.text(6.75, 0.95,
            "descoberta-0001: falha_senha, falha_senha, senha_aceita, desafio_mfa, login_sucesso"
            "  →  {falha_senha, senha_aceita, desafio_mfa, login_sucesso}",
            ha="center", color=TINTA, fontsize=9.6, family="monospace")
    ax.text(6.75, 0.45, "O denominador das métricas é o número de sessões, não o de linhas.",
            ha="center", color=VERDE, fontsize=10.5, weight="bold")
    ax.set_title("Das linhas do log às transações (base de descoberta)", color=TINTA,
                 weight="bold", fontsize=14, pad=4)
    salvar(fig, "logs-pipeline.png")


def figura_matriz(desc) -> None:
    _, _, _, sessoes = desc
    ids = sorted(sessoes)[:20]
    fig, ax = plt.subplots(figsize=(9.5, 7.2))
    for i, sid in enumerate(ids):
        itens = set(sessoes[sid])
        ambos = {"falha_senha", "desafio_mfa"} <= itens
        if ambos:
            ax.add_patch(plt.Rectangle((-0.5, i - 0.5), len(ORDEM), 1, facecolor=CREME,
                                       edgecolor=BARRO, linewidth=1.6, zorder=0))
        for j, ev in enumerate(ORDEM):
            presente = ev in itens
            ax.add_patch(plt.Rectangle((j - 0.4, i - 0.4), 0.8, 0.8,
                                       facecolor=VERDE if presente else "white",
                                       edgecolor="#9bafb4", linewidth=1, zorder=1))
    ax.set_xlim(-0.5, len(ORDEM) - 0.5)
    ax.set_ylim(len(ids) - 0.5, -0.5)
    ax.set_xticks(range(len(ORDEM)), [EVENTOS[e] for e in ORDEM], rotation=0, fontsize=9.5)
    ax.xaxis.tick_top()
    ax.set_yticks(range(len(ids)), [s.replace("descoberta-", "sessão ") for s in ids], fontsize=8.5)
    ax.tick_params(colors=TINTA, length=0)
    for lado in ax.spines.values():
        lado.set_visible(False)
    n_ambos = sum({"falha_senha", "desafio_mfa"} <= set(sessoes[s]) for s in ids)
    ax.set_title(
        f"Bloco-base da descoberta: 20 sessões × 5 eventos\n"
        f"contorno = falha de senha e desafio MFA juntos ({n_ambos} de 20 = {n_ambos / 20:.0%})",
        color=TINTA, weight="bold", fontsize=12, pad=34)
    ax.text(2, len(ids) + 0.4, "O arquivo repete este bloco 100 vezes: 2000 sessões, mesmas proporções.",
            ha="center", va="top", color=TINTA, fontsize=9.5)
    salvar(fig, "logs-matriz-sessoes.png")


def figura_descoberta_validacao(desc, val) -> None:
    ad, av = avaliar(desc[3]), avaliar(val[3])
    fig, eixos = plt.subplots(1, 3, figsize=(12, 4.2))
    metricas = [("suporte", "Suporte", True), ("confianca", "Confiança", True), ("lift", "Lift", False)]
    for ax, (chave, nome, pct) in zip(eixos, metricas):
        valores = [ad[chave], av[chave]]
        barras = ax.bar(["Descoberta\n(2000 sessões)", "Validação\n(1000 sessões)"], valores,
                        color=[VERDE, BARRO], width=0.55)
        ax.axhline(CRITERIOS[chave], color=TINTA, linestyle="--", linewidth=1.3)
        limite = f"{CRITERIOS[chave]:.0%}" if pct else "1"
        ax.text(1.32, CRITERIOS[chave], f"critério {('≥ ' if pct else '> ') + limite}",
                va="bottom", ha="right", fontsize=8.5, color=TINTA)
        for b, v in zip(barras, valores):
            rotulo = f"{v * 100:.1f}%".replace(".", ",") if pct else f"{v:.2f}".replace(".", ",")
            ax.text(b.get_x() + b.get_width() / 2, v, rotulo, ha="center", va="bottom",
                    fontsize=11, color=TINTA, weight="bold")
        ax.set_title(nome, color=TINTA, weight="bold")
        ax.set_ylim(0, max(valores + [CRITERIOS[chave]]) * 1.25)
        ax.spines[["top", "right"]].set_visible(False)
        ax.tick_params(colors=TINTA, labelsize=9)
        if pct:
            ax.yaxis.set_major_formatter(lambda v, _: f"{v:.0%}")
    fig.suptitle("Regra fixa falha_senha → desafio_mfa: descoberta 600/900/900 · validação 100/400/300",
                 color=TINTA, weight="bold", fontsize=12.5)
    fig.tight_layout()
    salvar(fig, "logs-descoberta-validacao.png")


def figura_dispersao() -> None:
    fig, eixos = plt.subplots(1, 2, figsize=(12.5, 5), sharey=True)
    for ax, cenario, titulo in zip(eixos, ["descoberta", "validacao"],
                                   ["Descoberta: 27 regras", "Validação exploratória: 9 regras"]):
        regras = ler_regras(cenario)
        grupos = Counter((float(r["suporte"]), float(r["confianca"])) for r in regras)
        maior_lift: dict[tuple[float, float], float] = {}
        for r in regras:
            k = (float(r["suporte"]), float(r["confianca"]))
            maior_lift[k] = max(maior_lift.get(k, 0), float(r["lift"]))
        xs, ys = zip(*grupos)
        cores = [maior_lift[k] for k in grupos]
        sc = ax.scatter(xs, ys, s=[130 + 70 * n for n in grupos.values()], c=cores, cmap="YlOrBr",
                        vmin=1.0, vmax=2.1, edgecolors=TINTA, linewidths=1.2, zorder=3)
        for (x, y), n in grupos.items():
            claro = maior_lift[(x, y)] > 1.6
            ax.text(x, y, str(n), ha="center", va="center", fontsize=8.5,
                    color="white" if claro else TINTA, weight="bold", zorder=4)
        ax.axvline(0.2, color=TINTA, linestyle="--", linewidth=1)
        ax.axhline(0.6, color=TINTA, linestyle="--", linewidth=1)
        if cenario == "descoberta":
            mesmo = grupos[(0.3, 0.666667)] - 1
            ax.annotate(f"falha_senha → desafio_mfa\n(e outras {mesmo} no mesmo ponto)", xy=(0.30, 0.667),
                        xytext=(0.44, 0.63), fontsize=8.5, color=BARRO,
                        arrowprops={"arrowstyle": "->", "color": BARRO})
        ax.set_xlim(0.15, 0.8)
        ax.set_ylim(0.55, 1.05)
        ax.set_xlabel("Suporte", color=TINTA)
        ax.set_title(titulo, color=TINTA, weight="bold")
        ax.xaxis.set_major_formatter(lambda v, _: f"{v:.0%}")
        ax.yaxis.set_major_formatter(lambda v, _: f"{v:.0%}")
        ax.spines[["top", "right"]].set_visible(False)
        ax.grid(alpha=0.2)
    eixos[0].set_ylabel("Confiança", color=TINTA)
    barra = fig.colorbar(sc, ax=eixos, shrink=0.85)
    barra.set_label("maior lift do ponto", color=TINTA)
    fig.suptitle("Regras que passam nos filtros (número = regras no mesmo ponto)", color=TINTA,
                 weight="bold", fontsize=12.5)
    salvar(fig, "logs-dispersao-regras.png")


def main() -> None:
    IMAGENS.mkdir(parents=True, exist_ok=True)
    desc, val = carregar("descoberta"), carregar("validacao")
    figura_pipeline(desc)
    figura_matriz(desc)
    figura_descoberta_validacao(desc, val)
    figura_dispersao()


if __name__ == "__main__":
    main()
