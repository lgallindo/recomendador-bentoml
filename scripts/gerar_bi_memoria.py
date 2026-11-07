"""Gera material/bi-memoria/dados.js a partir de material/memoria/linha-do-tempo.json.

Rode antes: uv run python scripts/demo_mem0_preferencias.py --roteiro

Uso (raiz do repo):

    uv run python scripts/gerar_bi_memoria.py
"""

from __future__ import annotations

import json
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
LINHA = RAIZ / "material" / "memoria" / "linha-do-tempo.json"
PAINEL = RAIZ / "material" / "bi-memoria"


def main() -> None:
    dados = json.loads(LINHA.read_text(encoding="utf-8"))
    dados["origem"] = "material/memoria/linha-do-tempo.json"
    PAINEL.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.MEMORIA_LOJA = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    print(f"{len(dados['turnos'])} turnos → {(PAINEL / 'dados.js').relative_to(RAIZ)}")


if __name__ == "__main__":
    main()
