"""Gera `material/bi-logs/dados.js` e o espelho `imagens/bi-logs-padroes.png`.

Usa as funções do minerador de logs (sem alterá-lo) e confere que as regras
recalculadas coincidem com os CSVs de `material/logs-autenticacao/`.

Uso (raiz do repositório):

    uv run python scripts/gerar_bi_logs.py
"""

from __future__ import annotations

import csv
import json
import sys
from collections import Counter
from fractions import Fraction
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt  # noqa: E402

RAIZ = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(RAIZ / "scripts"))
from minerar_logs_autenticacao import EVENTOS, avaliar, ler_eventos, montar_sessoes  # noqa: E402
from minerar_regras_associacao import minerar  # noqa: E402

DADOS = RAIZ / "dados" / "logs-autenticacao"
RELATORIOS = RAIZ / "material" / "logs-autenticacao"
PAINEL = RAIZ / "material" / "bi-logs"
IMAGENS = RAIZ / "material" / "imagens"
TINTA, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
BLOCO = {"descoberta": 20, "validacao": 10}


def ler_csv(cenario: str) -> list[dict]:
    with (RELATORIOS / f"{cenario}-20261017.csv").open(encoding="utf-8", newline="") as fh:
        return list(csv.DictReader(fh))


def cenario(nome: str) -> dict:
    caminho = DADOS / f"{nome}-20261017.jsonl"
    linhas = caminho.read_text(encoding="utf-8").splitlines()
    eventos, duplicatas = ler_eventos(caminho)
    sessoes = montar_sessoes(eventos)
    recalculadas = minerar(
        {"produtos": [{"id": k, "nome": v} for k, v in EVENTOS.items()],
         "cestas": list(sessoes.values())},
        Fraction(1, 5), Fraction(3, 5), Fraction(1),
    )
    csv_regras = ler_csv(nome)
    assert len(recalculadas) == len(csv_regras), nome
    for a, b in zip(recalculadas, csv_regras):
        assert a["antecedente_ids"] == b["antecedente_ids"], (nome, a, b)
        assert abs(float(a["lift"]) - float(b["lift"])) < 1e-6, (nome, a, b)
    padroes = Counter(" + ".join(itens) for itens in sessoes.values())
    ids_bloco = sorted(sessoes)[: BLOCO[nome]]
    brutas = [json.loads(ln) for ln in linhas]
    amostra = [r for r in brutas[: sum(1 for r in brutas if r["session_id"] in ids_bloco) + 5]
               if r["session_id"] in ids_bloco]
    return {
        "arquivo": f"dados/logs-autenticacao/{caminho.name}",
        "linhas": len(linhas),
        "eventos_unicos": len(eventos),
        "reentregas": duplicatas,
        "sessoes": len(sessoes),
        "bloco_base": BLOCO[nome],
        "ultima_linha": brutas[-1],
        "amostra_linhas": amostra,
        "padroes": [{"itens": k.split(" + "), "sessoes": v} for k, v in padroes.most_common()],
        "regras": [
            {
                "antecedente": r["antecedente_ids"].split(" + "),
                "consequente": r["consequente_ids"].split(" + "),
                "n_a": int(r["contagem_antecedente"]),
                "n_b": int(r["contagem_consequente"]),
                "juntos": int(r["contagem_conjunta"]),
                "suporte": float(r["suporte"]),
                "confianca": float(r["confianca"]),
                "lift": float(r["lift"]),
            }
            for r in csv_regras
        ],
        "regra_fixa": avaliar(sessoes),
    }


def espelho(dados: dict) -> None:
    fig, eixos = plt.subplots(1, 2, figsize=(12.5, 4.6), sharex=True)
    for ax, nome, titulo in zip(eixos, ["descoberta", "validacao"],
                                ["Descoberta · 2000 sessões", "Validação · 1000 sessões"]):
        c = dados["cenarios"][nome]
        rotulos = [" + ".join(EVENTOS[i] for i in p["itens"]) for p in c["padroes"]]
        fr = [p["sessoes"] / c["sessoes"] for p in c["padroes"]]
        cores = [BARRO if {"falha_senha", "desafio_mfa"} <= set(p["itens"]) else VERDE
                 for p in c["padroes"]]
        ax.barh(range(len(fr)), fr, color=cores)
        ax.set_yticks(range(len(fr)), rotulos, fontsize=8)
        ax.invert_yaxis()
        for i, v in enumerate(fr):
            ax.text(v, i, f" {v:.0%}", va="center", fontsize=8.5, color=TINTA)
        ax.set_title(titulo, color=TINTA, weight="bold")
        ax.xaxis.set_major_formatter(lambda v, _: f"{v:.0%}")
        ax.spines[["top", "right"]].set_visible(False)
        ax.set_xlim(0, 0.45)
    fig.suptitle("Tipos de sessão (conjunto de eventos) · terra = contém falha de senha e desafio MFA",
                 color=TINTA, weight="bold", fontsize=12)
    fig.tight_layout()
    fig.savefig(IMAGENS / "bi-logs-padroes.png", dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def main() -> None:
    PAINEL.mkdir(parents=True, exist_ok=True)
    dados = {
        "origem": "dados/logs-autenticacao/*.jsonl · material/logs-autenticacao/*.csv",
        "eventos": EVENTOS,
        "criterios": {"suporte_minimo": 0.2, "confianca_minima": 0.6, "lift_maior_que": 1.0},
        "cenarios": {nome: cenario(nome) for nome in ("descoberta", "validacao")},
    }
    (PAINEL / "dados.js").write_text(
        "window.BI_LOGS = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    espelho(dados)
    d, v = dados["cenarios"]["descoberta"], dados["cenarios"]["validacao"]
    print(f"descoberta: {d['sessoes']} sessões, {len(d['regras'])} regras; "
          f"validação: {v['sessoes']} sessões, {len(v['regras'])} regras → {PAINEL / 'dados.js'}")


if __name__ == "__main__":
    main()
