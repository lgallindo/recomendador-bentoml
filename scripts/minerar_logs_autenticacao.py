"""Reconstrói sessões de logs sintéticos e minera associações, sem dependências."""

from __future__ import annotations

import argparse
import csv
import json
from datetime import datetime
from fractions import Fraction
from pathlib import Path

from minerar_regras_associacao import CAMPOS, minerar

RAIZ = Path(__file__).resolve().parent.parent
EVENTOS = {
    "falha_senha": "Falha de senha",
    "senha_aceita": "Senha aceita",
    "desafio_mfa": "Desafio MFA",
    "falha_mfa": "Falha MFA",
    "login_sucesso": "Login com sucesso",
}


def ler_eventos(caminho: Path) -> tuple[list[dict], int]:
    """Valida o contrato; ignora somente entregas exatamente duplicadas."""
    unicos = {}
    duplicatas = 0
    for numero, linha in enumerate(caminho.read_text(encoding="utf-8").splitlines(), 1):
        origem = f"{caminho}:{numero}"
        try:
            registro = json.loads(linha)
            campos = {"event_id", "timestamp", "session_id", "evento"}
            if not isinstance(registro, dict) or set(registro) != campos:
                raise ValueError("campos esperados: " + ", ".join(sorted(campos)))
            if any(not isinstance(v, str) or not v.strip() for v in registro.values()):
                raise ValueError("todos os campos devem ser strings não vazias")
            instante = datetime.fromisoformat(registro["timestamp"])
            if instante.utcoffset() is None:
                raise ValueError("timestamp precisa incluir fuso horário")
            if registro["evento"] not in EVENTOS:
                raise ValueError(f"evento desconhecido: {registro['evento']}")
            chave = registro["event_id"]
            if chave in unicos:
                if unicos[chave] != registro:
                    raise ValueError(f"event_id conflitante: {chave}")
                duplicatas += 1
            else:
                unicos[chave] = registro
        except ValueError as erro:
            raise ValueError(f"{origem}: {erro}") from erro
    if not unicos:
        raise ValueError(f"{caminho}: log vazio")
    return list(unicos.values()), duplicatas


def montar_sessoes(eventos: list[dict]) -> dict[str, list[str]]:
    sessoes: dict[str, set[str]] = {}
    for evento in eventos:
        sessoes.setdefault(evento["session_id"], set()).add(evento["evento"])
    return {chave: sorted(sessoes[chave]) for chave in sorted(sessoes)}


def avaliar(sessoes: dict[str, list[str]]) -> dict:
    """Avalia uma regra fixa, inclusive quando ela não passa nos filtros."""
    cestas = [set(itens) for itens in sessoes.values()]
    total = len(cestas)
    na = sum("falha_senha" in c for c in cestas)
    nb = sum("desafio_mfa" in c for c in cestas)
    juntos = sum({"falha_senha", "desafio_mfa"} <= c for c in cestas)
    confianca = Fraction(juntos, na) if na else None
    lift = confianca / Fraction(nb, total) if na and nb else None
    return {
        "regra": "falha_senha -> desafio_mfa", "total_sessoes": total,
        "contagem_antecedente": na, "contagem_consequente": nb,
        "contagem_conjunta": juntos, "suporte": float(Fraction(juntos, total)),
        "confianca": float(confianca) if confianca is not None else None,
        "lift": float(lift) if lift is not None else None,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cenario", choices=["descoberta", "validacao"], default="descoberta")
    parser.add_argument("--logs", type=Path, help="Substitui o log do cenário selecionado")
    parser.add_argument("--diretorio-saida", type=Path, default=RAIZ / "material/logs-autenticacao")
    args = parser.parse_args()
    caminho = args.logs or RAIZ / f"dados/logs-autenticacao/{args.cenario}-20261017.jsonl"
    try:
        eventos, duplicatas = ler_eventos(caminho)
        sessoes = montar_sessoes(eventos)
        regras = minerar({
            "produtos": [{"id": chave, "nome": nome} for chave, nome in EVENTOS.items()],
            "cestas": list(sessoes.values()),
        }, Fraction(1, 5), Fraction(3, 5), Fraction(1))
        args.diretorio_saida.mkdir(parents=True, exist_ok=True)
        base = args.diretorio_saida / f"{args.cenario}-20261017"
        resumo = {
            "fonte": str(caminho.name), "eventos_unicos": len(eventos),
            "entregas_duplicadas": duplicatas, "sessoes": sessoes,
            "total_regras": len(regras), "avaliacao_regra_fixa": avaliar(sessoes),
        }
        base.with_suffix(".json").write_text(
            json.dumps(resumo, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        campos = ["total_sessoes" if c == "total_cestas" else c for c in CAMPOS]
        with base.with_suffix(".csv").open("w", encoding="utf-8", newline="") as arquivo:
            writer = csv.DictWriter(arquivo, fieldnames=campos)
            writer.writeheader()
            for regra in regras:
                writer.writerow({
                    "total_sessoes" if c == "total_cestas" else c:
                    f"{float(v):.6f}" if isinstance(v, Fraction) else v
                    for c, v in regra.items()
                })
    except (OSError, ValueError) as erro:
        parser.error(str(erro))
    print(f"{len(eventos)} eventos únicos; {duplicatas} duplicatas; "
          f"{len(sessoes)} sessões; {len(regras)} regras → {base}")


if __name__ == "__main__":
    main()
