"""Minera regras das cestas e exporta métricas e contagens auditáveis (sem dependências)."""

from __future__ import annotations

import argparse
import csv
import json
from collections import Counter
from fractions import Fraction
from itertools import combinations
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
CAMPOS = [
    "antecedente_ids", "consequente_ids", "antecedente", "consequente",
    "total_cestas", "contagem_antecedente", "contagem_consequente",
    "contagem_conjunta", "suporte", "confianca", "lift",
    "suporte_minimo", "confianca_minima", "lift_maior_que",
]


def proporcao(texto: str) -> Fraction:
    try:
        valor = Fraction(texto)
    except (ValueError, ZeroDivisionError) as erro:
        raise argparse.ArgumentTypeError("Informe uma proporção numérica válida.") from erro
    if not 0 < valor <= 1:
        raise argparse.ArgumentTypeError("Informe uma proporção maior que 0 e até 1.")
    return valor


def limite_lift(texto: str) -> Fraction:
    try:
        valor = Fraction(texto)
    except (ValueError, ZeroDivisionError) as erro:
        raise argparse.ArgumentTypeError("Informe um lift numérico válido.") from erro
    if valor < 0:
        raise argparse.ArgumentTypeError("Informe um lift não negativo.")
    return valor


def minerar(
    catalogo: dict,
    suporte_minimo: Fraction,
    confianca_minima: Fraction,
    lift_maior_que: Fraction,
) -> list[dict]:
    """Enumera itemsets observados e todas as suas partições direcionadas.

    Converte cada cesta em conjunto: quantidade e ordem dos itens não importam.
    Cestas idênticas em linhas distintas continuam sendo transações distintas.
    Usa frações exatas nos filtros; arredonda somente na exportação.
    Enumeração exponencial: destinada às pequenas cestas desta aula.
    """
    nomes = {p["id"]: p["nome"] for p in catalogo["produtos"]}
    cestas = [set(cesta) for cesta in catalogo["cestas"]]
    if not cestas:
        raise ValueError("O dataset precisa conter pelo menos uma cesta.")
    contagens: Counter[tuple[str, ...]] = Counter()
    for cesta in cestas:
        desconhecidos = cesta - nomes.keys()
        if desconhecidos:
            raise ValueError(f"Produtos desconhecidos nas cestas: {sorted(desconhecidos)}")
        for tamanho in range(1, len(cesta) + 1):
            contagens.update(combinations(sorted(cesta), tamanho))

    total = len(cestas)
    regras = []
    for itens, conjunta in sorted(contagens.items()):
        suporte = Fraction(conjunta, total)
        if len(itens) < 2 or suporte < suporte_minimo:
            continue
        for tamanho in range(1, len(itens)):
            for antecedente in combinations(itens, tamanho):
                consequente = tuple(i for i in itens if i not in antecedente)
                na = contagens[antecedente]
                nb = contagens[consequente]
                confianca = Fraction(conjunta, na)
                lift = confianca / Fraction(nb, total)
                if confianca < confianca_minima or lift <= lift_maior_que:
                    continue
                regras.append({
                    "antecedente_ids": " + ".join(antecedente),
                    "consequente_ids": " + ".join(consequente),
                    "antecedente": " + ".join(nomes[i] for i in antecedente),
                    "consequente": " + ".join(nomes[i] for i in consequente),
                    "total_cestas": total,
                    "contagem_antecedente": na,
                    "contagem_consequente": nb,
                    "contagem_conjunta": conjunta,
                    "suporte": suporte,
                    "confianca": confianca,
                    "lift": lift,
                    "suporte_minimo": suporte_minimo,
                    "confianca_minima": confianca_minima,
                    "lift_maior_que": lift_maior_que,
                })
    regras.sort(key=lambda r: (
        -r["lift"], -r["confianca"], -r["suporte"],
        r["antecedente_ids"], r["consequente_ids"],
    ))
    return regras


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dados", type=Path, default=RAIZ / "dados/catalogo.json")
    parser.add_argument("--saida", type=Path,
                        default=RAIZ / "material/regras-associacao-20261017.csv")
    parser.add_argument("--suporte-minimo", type=proporcao, default=Fraction(1, 5))
    parser.add_argument("--confianca-minima", type=proporcao, default=Fraction(3, 5))
    parser.add_argument("--lift-maior-que", type=limite_lift, default=Fraction(1))
    args = parser.parse_args()
    try:
        catalogo = json.loads(args.dados.read_text(encoding="utf-8"))
        regras = minerar(catalogo, args.suporte_minimo,
                        args.confianca_minima, args.lift_maior_que)
    except (ValueError, KeyError) as erro:
        parser.error(str(erro))
    with args.saida.open("w", encoding="utf-8", newline="") as arquivo:
        writer = csv.DictWriter(arquivo, fieldnames=CAMPOS)
        writer.writeheader()
        for regra in regras:
            writer.writerow({
                chave: f"{float(valor):.6f}" if isinstance(valor, Fraction) else valor
                for chave, valor in regra.items()
            })
    print(f"{len(catalogo['cestas'])} cestas; {len(regras)} regras → {args.saida}")


if __name__ == "__main__":
    main()
