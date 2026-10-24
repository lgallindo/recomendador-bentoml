"""Aprenda e avalie uma árvore didática, sem executar decisões reais de crédito."""
from __future__ import annotations

import argparse
import csv
import json
from importlib.metadata import version
from pathlib import Path

from sklearn.tree import DecisionTreeClassifier

RAIZ = Path(__file__).resolve().parents[1]
FEATURES = ["comprometimento_pct", "atrasos_anteriores"]
NOMES = ["Comprometimento (%)", "Atrasos anteriores"]
ALVO = "atraso_30d_6m"


def ler(nome: str, pasta: Path = RAIZ / "dados/credito") -> list[dict[str, str]]:
    with (pasta / f"{nome}.csv").open(encoding="utf-8", newline="") as arquivo:
        linhas = list(csv.DictReader(arquivo))
    if not linhas or len({r["id"] for r in linhas}) != len(linhas):
        raise ValueError(f"{nome}: base vazia ou identificadores repetidos")
    for r in linhas:
        renda, dividas, parcela = (int(r[c]) for c in
                                   ["renda_mensal", "dividas_mensais", "parcela_proposta"])
        if renda <= 0 or min(dividas, parcela, int(r["atrasos_anteriores"])) < 0:
            raise ValueError(f"{nome}: valores inválidos em {r['id']}")
        if abs(100 * (dividas + parcela) / renda - float(r[FEATURES[0]])) > 0.001:
            raise ValueError(f"{nome}: comprometimento inconsistente em {r['id']}")
        if r[ALVO] not in {"0", "1"}:
            raise ValueError(f"{nome}: alvo deve ser 0 ou 1")
    return linhas


def entradas(linhas: list[dict[str, str]]) -> list[list[float]]:
    return [[float(r[c]) for c in FEATURES] for r in linhas]


def respostas(linhas: list[dict[str, str]]) -> list[int]:
    return [int(r[ALVO]) for r in linhas]


def contar(y: list[int], pred: list[int]) -> dict[str, int | float]:
    if len(y) != len(pred) or not y:
        raise ValueError("Respostas e previsões devem ter mesmo tamanho, não vazio")
    tn = sum(a == 0 and p == 0 for a, p in zip(y, pred))
    fp = sum(a == 0 and p == 1 for a, p in zip(y, pred))
    fn = sum(a == 1 and p == 0 for a, p in zip(y, pred))
    tp = sum(a == 1 and p == 1 for a, p in zip(y, pred))
    return dict(n=len(y), acertos=tn + tp, erros=fp + fn, acuracia=(tn + tp) / len(y),
                sem_atraso_previsto_sem=tn, sem_atraso_previsto_com=fp,
                com_atraso_previsto_sem=fn, com_atraso_previsto_com=tp)


def aprender(treino: list[dict[str, str]], profundidade: int | None,
             minimo: int) -> DecisionTreeClassifier:
    return DecisionTreeClassifier(max_depth=profundidade, min_samples_leaf=minimo,
                                  random_state=17).fit(entradas(treino), respostas(treino))


def regras(modelo: DecisionTreeClassifier, treino: list[dict[str, str]]) -> str:
    """Conte casos diretamente, sem depender do formato versionado de tree_.value."""
    x = entradas(treino)
    y = respostas(treino)
    caminhos = modelo.decision_path(x)
    arvore = modelo.tree_
    linhas = []

    def visitar(no: int, nivel: int) -> None:
        ids = caminhos[:, no].nonzero()[0]
        sim = sum(y[i] for i in ids)
        nao = len(ids) - sim
        prefixo = "  " * nivel
        if arvore.children_left[no] == -1:
            pred = "com atraso" if sim > nao else "sem atraso"
            linhas.append(f"{prefixo}PREVER {pred}: {nao} sem / {sim} com ({len(ids)} casos de treino)")
            return
        nome = NOMES[arvore.feature[no]]
        limite = f"{arvore.threshold[no]:.2f}"
        linhas.append(f"{prefixo}SE {nome} <= {limite}:")
        visitar(arvore.children_left[no], nivel + 1)
        linhas.append(f"{prefixo}SENÃO:")
        visitar(arvore.children_right[no], nivel + 1)

    visitar(0, 0)
    return "\n".join(linhas) + "\n"


def executar(destino: Path, profundidade: int = 2, minimo: int = 12,
             incluir_teste: bool = False) -> dict:
    if not incluir_teste and (destino / "previsoes-teste.csv").exists():
        raise ValueError("Esta pasta já contém teste revelado; use outra --saida para nova exploração")
    treino, dev = ler("treino"), ler("desenvolvimento")
    if {r["id"] for r in treino} & {r["id"] for r in dev}:
        raise ValueError("Treino e desenvolvimento compartilham identificadores")
    modelos = {"curta": aprender(treino, profundidade, minimo),
               "profunda": aprender(treino, None, 1)}
    # Critério fixado antes do teste: mais acertos no desenvolvimento;
    # desempate por menor profundidade e depois menor número de folhas.
    escolhido = max(modelos, key=lambda k: (
        contar(respostas(dev), modelos[k].predict(entradas(dev)).tolist())["acertos"],
        -modelos[k].get_depth(), -modelos[k].get_n_leaves()))
    maioria = int(sum(respostas(treino)) > len(treino) / 2)
    grupos = {"treino": treino, "desenvolvimento": dev}
    if incluir_teste:
        teste = ler("teste")  # Só depois da seleção; nunca entra em fit ou escolha.
        if {r["id"] for r in teste} & {r["id"] for r in treino + dev}:
            raise ValueError("Teste compartilha identificadores com outros grupos")
        grupos["teste"] = teste
    relatorio = {"sklearn": version("scikit-learn"), "features": FEATURES,
                 "parametros": {"profundidade_curta": profundidade, "minimo_folha": minimo},
                 "criterio": "acertos no desenvolvimento; desempate por profundidade e folhas",
                 "selecionado": escolhido, "classe_baseline": maioria, "modelos": {},
                 "baseline": {g: contar(respostas(rs), [maioria] * len(rs))
                              for g, rs in grupos.items()}}
    destino.mkdir(parents=True, exist_ok=True)
    for nome, modelo in modelos.items():
        # A concorrente não é avaliada no teste: ele serve ao modelo já escolhido.
        medidas = {g: contar(respostas(rs), modelo.predict(entradas(rs)).tolist())
                   for g, rs in grupos.items() if g != "teste" or nome == escolhido}
        relatorio["modelos"][nome] = dict(profundidade=int(modelo.get_depth()),
                                          folhas=int(modelo.get_n_leaves()), medidas=medidas)
        (destino / f"arvore-{nome}.txt").write_text(regras(modelo, treino), encoding="utf-8")
    (destino / "relatorio.json").write_text(json.dumps(relatorio, ensure_ascii=False, indent=2) + "\n",
                                           encoding="utf-8")
    if incluir_teste:
        modelo = modelos[escolhido]
        pred = modelo.predict(entradas(teste)).tolist()
        folhas = modelo.apply(entradas(teste)).tolist()
        with (destino / "previsoes-teste.csv").open("w", encoding="utf-8", newline="") as arquivo:
            escritor = csv.writer(arquivo)
            escritor.writerow(["id", "observado", "previsto", "folha", "baseline"])
            escritor.writerows((r["id"], r[ALVO], p, f, maioria)
                               for r, p, f in zip(teste, pred, folhas))
    print(f"Selecionado no desenvolvimento: {escolhido}; baseline prevê classe {maioria}.")
    for nome, info in relatorio["modelos"].items():
        for grupo, m in info["medidas"].items():
            print(f"{nome:8s} | {grupo:15s} | {m['acertos']}/{m['n']} acertos")
    return relatorio


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--saida", type=Path, default=RAIZ / "material/credito-experimento")
    parser.add_argument("--profundidade", type=int, default=2)
    parser.add_argument("--minimo-folha", type=int, default=12)
    parser.add_argument("--avaliar-teste", action="store_true",
                        help="Revelar teste somente após fixar as configurações")
    args = parser.parse_args()
    if args.profundidade < 1 or args.minimo_folha < 1:
        parser.error("Profundidade e mínimo por folha devem ser positivos")
    executar(args.saida, args.profundidade, args.minimo_folha, args.avaliar_teste)


if __name__ == "__main__":
    main()
