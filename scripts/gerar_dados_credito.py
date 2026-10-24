"""Gere contratos inteiramente fictícios; nenhuma pessoa ou política real é modelada."""
from __future__ import annotations

import csv
import random
from pathlib import Path

RAIZ = Path(__file__).resolve().parents[1]
CAMPOS = ["id", "renda_mensal", "dividas_mensais", "parcela_proposta",
          "comprometimento_pct", "atrasos_anteriores", "atraso_30d_6m"]


def gravar(nome: str, linhas: list[dict[str, int | str]]) -> None:
    destino = RAIZ / "dados/credito" / nome
    destino.parent.mkdir(parents=True, exist_ok=True)
    with destino.open("w", newline="", encoding="utf-8") as arquivo:
        escritor = csv.DictWriter(arquivo, fieldnames=CAMPOS)
        escritor.writeheader()
        escritor.writerows(linhas)


def gerar() -> None:
    # Cartões construídos à mão para permitir contas pequenas e exceções visíveis.
    percentuais = [15, 20, 25, 30, 30, 35, 40, 45, 45, 50, 55, 60]
    anteriores = [0, 0, 1, 0, 2, 1, 0, 0, 2, 1, 2, 3]
    resultados = [0, 0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1]
    cartoes = [dict(zip(CAMPOS, [f"C{i:02d}", 2000, p * 20 - 200, 200, p, a, y]))
               for i, (p, a, y) in enumerate(zip(percentuais, anteriores, resultados), 1)]
    gravar("cartoes.csv", cartoes)
    # Grupos independentes, mesma distribuição artificial, sementes pré-fixadas.
    # A probabilidade abaixo é uma receita didática, não uma estimativa de risco.
    for nome, prefixo, n, semente in [("treino", "T", 240, 17),
                                     ("desenvolvimento", "D", 80, 18),
                                     ("teste", "E", 80, 19)]:
        rng = random.Random(semente)
        linhas = []
        for i in range(1, n + 1):
            renda = rng.choice([1600, 2000, 2400, 3000, 4000, 5000])
            percentual = rng.randint(10, 65)
            total = renda * percentual // 100
            parcela = rng.choice([100, 150, 200, 250])
            parcela = min(parcela, total)
            atrasos = rng.choices([0, 1, 2, 3], weights=[5, 3, 1, 1])[0]
            probabilidade = 0.12 + 0.43 * (percentual > 35) + 0.22 * (atrasos >= 2)
            resultado = int(rng.random() < probabilidade)
            linhas.append(dict(zip(CAMPOS, [f"{prefixo}{i:03d}", renda, total - parcela,
                                            parcela, percentual, atrasos, resultado])))
        gravar(f"{nome}.csv", linhas)


if __name__ == "__main__":
    gerar()
    print("Criados 12 cartões e 240/80/80 contratos sintéticos em dados/credito/.")
