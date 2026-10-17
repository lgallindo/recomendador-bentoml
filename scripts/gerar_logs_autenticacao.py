"""Reproduz os logs fictícios do exercício; não representa um servidor real."""

import json
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
# Caminhos de autenticação construídos, incluindo desistências e falhas.
CAMINHOS = {
    "recuperada_mfa": ["falha_senha", "falha_senha", "senha_aceita", "desafio_mfa", "login_sucesso"],
    "falhou_mfa": ["falha_senha", "senha_aceita", "desafio_mfa", "falha_mfa"],
    "recuperada": ["falha_senha", "senha_aceita", "login_sucesso"],
    "falhou_senha": ["falha_senha", "falha_senha"],
    "mfa": ["senha_aceita", "desafio_mfa", "login_sucesso"],
    "simples": ["senha_aceita", "login_sucesso"],
    "abandono_mfa": ["senha_aceita", "desafio_mfa"],
    "abandono": ["senha_aceita"],
}
CENARIOS = {
    "descoberta": ["recuperada_mfa"] * 5 + ["falhou_mfa", "recuperada", "falhou_senha"]
    + ["mfa"] * 2 + ["simples"] * 7 + ["abandono_mfa", "abandono", "falhou_senha"],
    "validacao": ["recuperada_mfa", "recuperada", "falhou_senha", "falhou_senha",
                  "mfa", "abandono_mfa", "simples", "simples", "simples", "abandono"],
}


def main() -> None:
    destino = RAIZ / "dados/logs-autenticacao"
    destino.mkdir(parents=True, exist_ok=True)
    for indice, (cenario, caminhos) in enumerate(CENARIOS.items()):
        inicio = datetime(2026, 10, 1 + indice, 12, tzinfo=timezone.utc)
        registros = []
        for sessao, caminho in enumerate(caminhos, 1):
            for passo, evento in enumerate(CAMINHOS[caminho], 1):
                registros.append({
                    "event_id": f"{cenario}-{sessao:02d}-{passo:02d}",
                    "timestamp": (inicio + timedelta(minutes=sessao, seconds=passo)).isoformat(),
                    "session_id": f"{cenario}-{sessao:02d}", "evento": evento,
                })
        registros.append(dict(registros[0]))  # Reentrega exata, não nova tentativa.
        (destino / f"{cenario}-20261017.jsonl").write_text(
            "".join(json.dumps(r, ensure_ascii=False) + "\n" for r in registros), encoding="utf-8")


if __name__ == "__main__":
    main()
