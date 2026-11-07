"""Caminho A — LiteLLM como biblioteca: uma completion sem processo proxy.

Padrão: modelo local no Ollama (sem chave paga). O script fala direto com o
runtime; não há porta 4000 envolvida.

Uso (raiz do repositório):

    uv run python scripts/demo_litellm_sdk.py --offline
    uv run --with litellm python scripts/demo_litellm_sdk.py
    uv run --with litellm python scripts/demo_litellm_sdk.py --modelo openai/gpt-4o-mini
"""

from __future__ import annotations

import argparse
import json
import os
import sys

try:
    from litellm import completion
except ImportError:  # o modo --offline funciona sem o pacote
    completion = None

PERGUNTA_PADRAO = "Em uma frase: qual o prazo de devolução de uma peça sem uso?"
CONTEXTO = (
    "Política da loja: o cliente tem 7 dias corridos após o recebimento para "
    "solicitar devolução de peça sem uso, com embalagem original."
)


def montar_chamada(modelo: str, api_base: str | None, pergunta: str) -> dict:
    chamada: dict = {
        "model": modelo,
        "messages": [
            {"role": "system", "content": CONTEXTO},
            {"role": "user", "content": pergunta},
        ],
        "max_tokens": 80,
    }
    if modelo.startswith(("ollama/", "ollama_chat/")):
        chamada["api_base"] = api_base
    return chamada


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--modelo", default="ollama_chat/qwen2.5:0.5b")
    parser.add_argument(
        "--api-base",
        default=os.environ.get("OLLAMA_API_BASE", "http://127.0.0.1:11434"),
    )
    parser.add_argument("--pergunta", default=PERGUNTA_PADRAO)
    parser.add_argument(
        "--offline",
        action="store_true",
        help="só mostra a chamada que seria feita; não acessa rede",
    )
    args = parser.parse_args()

    chamada = montar_chamada(args.modelo, args.api_base, args.pergunta)
    if args.offline:
        print("Chamada que litellm.completion receberia:")
        print(json.dumps(chamada, ensure_ascii=False, indent=2))
        if args.modelo.startswith("openai/"):
            presente = "sim" if os.environ.get("OPENAI_API_KEY") else "não"
            print(f"OPENAI_API_KEY no ambiente: {presente} (o valor nunca é impresso)")
        return 0

    if completion is None:
        print("Pacote litellm ausente. Rode com: uv run --with litellm python …", file=sys.stderr)
        return 1
    if args.modelo.startswith("openai/") and not os.environ.get("OPENAI_API_KEY"):
        print("Defina OPENAI_API_KEY para usar um modelo openai/…", file=sys.stderr)
        return 1
    try:
        resposta = completion(**chamada)
    except Exception as exc:  # noqa: BLE001 — aula: mostrar a falha como ela vem
        print(f"Falha na chamada: {type(exc).__name__}: {exc}", file=sys.stderr)
        print("Ollama no ar? Modelo baixado? Confira --api-base.", file=sys.stderr)
        return 1
    print(resposta.choices[0].message.content)
    uso = getattr(resposta, "usage", None)
    if uso is not None:
        print(f"tokens: prompt={uso.prompt_tokens} resposta={uso.completion_tokens}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
