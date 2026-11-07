"""Cliente OpenAI-compatible contra o proxy LiteLLM (só biblioteca padrão).

Faz três pedidos, na ordem: liveliness, lista de modelos e uma chat completion
no alias `loja-chat`. Traduz os erros mais comuns em diagnóstico.

Uso (raiz do repositório):

    uv run python scripts/demo_litellm_proxy.py --offline
    uv run python scripts/demo_litellm_proxy.py
    uv run python scripts/demo_litellm_proxy.py --modelo nao-existe
    LITELLM_MASTER_KEY=sk-errada uv run python scripts/demo_litellm_proxy.py
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ENV = RAIZ / "material" / "litellm" / ".env"

DIAGNOSTICO = {
    400: "Alias desconhecido ou parâmetro inválido: confira GET /v1/models e o model_list.",
    401: "Chave rejeitada: o header precisa ser Authorization: Bearer <LITELLM_MASTER_KEY>.",
    404: "Rota ou alias inexistente: confira a URL base (/v1) e o model_list.",
    500: "O proxy aceitou, mas o destino falhou (Ollama parado, modelo não baixado, chave do provedor).",
}


def ler_env(caminho: Path) -> dict[str, str]:
    """Lê KEY=valor simples; o ambiente do processo tem prioridade."""
    valores: dict[str, str] = {}
    if caminho.exists():
        for linha in caminho.read_text(encoding="utf-8").splitlines():
            linha = linha.strip()
            if linha and not linha.startswith("#") and "=" in linha:
                k, v = linha.split("=", 1)
                valores[k.strip()] = v.strip()
    return valores


def redigir(chave: str) -> str:
    return chave[:3] + "***" if chave else "(vazia)"


def pedido(metodo: str, url: str, chave: str, corpo: dict | None = None) -> urllib.request.Request:
    dados = json.dumps(corpo).encode("utf-8") if corpo is not None else None
    req = urllib.request.Request(url, data=dados, method=metodo)
    req.add_header("Authorization", f"Bearer {chave}")
    if dados is not None:
        req.add_header("Content-Type", "application/json")
    return req


def mostrar(req: urllib.request.Request, chave: str) -> None:
    print(f"{req.get_method()} {req.full_url}")
    print(f"  Authorization: Bearer {redigir(chave)}")
    if req.data:
        print("  Content-Type: application/json")
        print("  " + json.dumps(json.loads(req.data), ensure_ascii=False))


def enviar(req: urllib.request.Request) -> tuple[int | None, str]:
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return resp.status, resp.read().decode("utf-8")
    except urllib.error.HTTPError as exc:
        return exc.code, exc.read().decode("utf-8", errors="replace")
    except urllib.error.URLError as exc:
        return None, str(exc.reason)


def main() -> int:
    env = {**ler_env(ENV), **os.environ}
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--base", default=env.get("LITELLM_BASE_URL", "http://127.0.0.1:4000"))
    parser.add_argument("--modelo", default="loja-chat")
    parser.add_argument("--pergunta", default="Em uma frase: o que faz um gateway de LLM?")
    parser.add_argument("--offline", action="store_true", help="só imprime os pedidos")
    args = parser.parse_args()
    chave = env.get("LITELLM_MASTER_KEY", "")

    pedidos = [
        ("liveliness", pedido("GET", f"{args.base}/health/liveliness", chave)),
        ("modelos", pedido("GET", f"{args.base}/v1/models", chave)),
        (
            "chat",
            pedido(
                "POST",
                f"{args.base}/v1/chat/completions",
                chave,
                {
                    "model": args.modelo,
                    "messages": [{"role": "user", "content": args.pergunta}],
                    "max_tokens": 80,
                },
            ),
        ),
    ]

    if args.offline:
        print("Pedidos que o cliente enviaria (chave redigida):\n")
        for nome, req in pedidos:
            print(f"[{nome}]")
            mostrar(req, chave)
            print()
        return 0

    for nome, req in pedidos:
        status, corpo = enviar(req)
        if status is None:
            print(f"[{nome}] sem resposta HTTP: {corpo}", file=sys.stderr)
            print("O proxy está no ar na porta 4000? (conexão recusada = processo parado)", file=sys.stderr)
            return 1
        if status >= 400:
            print(f"[{nome}] HTTP {status}: {corpo[:300]}", file=sys.stderr)
            if "no_db_connection" in corpo:
                # Sem banco, o proxy só conhece a master key: qualquer outra chave cai aqui.
                print("Chave diferente da master key (proxy sem banco de chaves virtuais).", file=sys.stderr)
            else:
                print(DIAGNOSTICO.get(status, "Veja os logs do proxy."), file=sys.stderr)
            return 1
        if nome != "liveliness":
            try:
                json.loads(corpo)
            except json.JSONDecodeError:
                print(f"[{nome}] HTTP {status}, mas a resposta não é JSON: {corpo.strip()[:60]!r}", file=sys.stderr)
                print("Algum outro serviço ocupa esta porta. Confira com: ss -ltnp | grep 4000", file=sys.stderr)
                return 1
        if nome == "modelos":
            ids = [m["id"] for m in json.loads(corpo).get("data", [])]
            print(f"[modelos] HTTP {status}: {', '.join(ids) or '(vazio)'}")
        elif nome == "chat":
            msg = json.loads(corpo)["choices"][0]["message"]["content"]
            print(f"[chat] HTTP {status} · modelo pedido: {args.modelo}")
            print(msg.strip())
        else:
            print(f"[{nome}] HTTP {status}: {corpo.strip()[:80]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
