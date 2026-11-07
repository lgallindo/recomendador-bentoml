"""Gera material/bi-chain/dados.js a partir de material/langchain/rastros.json.

Rode antes: uv run --with langchain-core python scripts/demo_langchain_loja.py --lote

Uso (raiz do repo):

    uv run python scripts/gerar_bi_chain.py
"""

from __future__ import annotations

import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RASTROS = RAIZ / "material" / "langchain" / "rastros.json"
PAINEL = RAIZ / "material" / "bi-chain"


def main() -> None:
    lote = json.loads(RASTROS.read_text(encoding="utf-8"))
    dados = {
        "origem": "material/langchain/rastros.json",
        "langchain_core": lote["langchain_core"],
        "sistema": lote["sistema"],
        "casos": [
            {
                "pergunta": c["pergunta"],
                "passos": c["puro"]["passos"],
                "alertas": c["puro"]["alertas"],
                "saidas_identicas": c.get("saidas_identicas"),
            }
            for c in lote["casos"]
        ],
    }
    PAINEL.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.CHAIN_LOJA = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(dados['casos'])} casos → {(PAINEL / 'dados.js').relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
