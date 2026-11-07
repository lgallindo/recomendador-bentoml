"""Chain mínima no catálogo da loja — stub sempre; LangChain se estiver instalado.

Sem chave de API. O “modelo” é uma função determinística (ou FakeListChatModel)
que devolve JSON com nome e técnica do produto pedido.

Uso:

  uv run python scripts/demo_langchain_loja.py
  uv run --with langchain-core python scripts/demo_langchain_loja.py --modo langchain
  uv run --with langchain-core python scripts/demo_langchain_loja.py --lote

`--lote` roda as perguntas de PERGUNTAS_LOTE nos dois modos e grava, passo a
passo, o que viaja em cada seta em material/langchain/rastros.json.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any

RAIZ = Path(__file__).resolve().parent.parent
CATALOGO = RAIZ / "dados" / "catalogo.json"
SAIDA = RAIZ / "material" / "langchain"
ENTRADA_PADRAO = "Quero uma dica sobre o produto p01"
SISTEMA = "Você resume um produto do catálogo em JSON."
PERGUNTAS_LOTE = (
    "Quero uma dica sobre o produto p01",
    "Fala do p04",
    "Me conta da peça P07",
    "Fala do p04 e do p07",
    "O que é o p13?",
    "Qual peça combina com renda?",
)


def carregar_produtos() -> dict[str, dict[str, Any]]:
    dados = json.loads(CATALOGO.read_text(encoding="utf-8"))
    return {p["id"]: p for p in dados["produtos"]}


def lookup_produto(pid: str, produtos: dict[str, dict[str, Any]]) -> dict[str, str]:
    p = produtos.get(pid)
    if p is None:
        return {"id": pid, "erro": "produto_nao_encontrado"}
    return {
        "id": p["id"],
        "nome": p["nome"],
        "tecnica": p.get("tecnica", ""),
        "regiao": p.get("regiao", ""),
    }


def extrair_pid(texto: str) -> str:
    m = re.search(r"\b(p\d{2})\b", texto.lower())
    return m.group(1) if m else "p01"


def modelo_stub(pergunta: str, ficha: dict[str, str]) -> str:
    if "erro" in ficha:
        return json.dumps({"ok": False, "motivo": ficha["erro"]}, ensure_ascii=False)
    return json.dumps(
        {
            "ok": True,
            "produto": ficha["id"],
            "resumo": f"{ficha['nome']} — técnica {ficha['tecnica']} ({ficha['regiao']})",
            "pergunta": pergunta,
        },
        ensure_ascii=False,
    )


def chain_pura(pergunta: str, produtos: dict[str, dict[str, Any]]) -> dict[str, Any]:
    """Mesmos três passos sem framework: extrair id → ferramenta → ‘modelo’ → parse."""
    pid = extrair_pid(pergunta)
    ficha = lookup_produto(pid, produtos)
    bruto = modelo_stub(pergunta, ficha)
    parsed = json.loads(bruto)
    return {
        "modo": "script_puro",
        "rastro": {
            "entrada": pergunta,
            "pid": pid,
            "ferramenta_lookup": ficha,
            "saida_modelo": bruto,
        },
        "saida": parsed,
    }


def chain_langchain(pergunta: str, produtos: dict[str, dict[str, Any]]) -> dict[str, Any]:
    from langchain_core.output_parsers import StrOutputParser
    from langchain_core.prompts import ChatPromptTemplate
    from langchain_core.runnables import RunnableLambda, RunnablePassthrough

    def ferramenta(entrada: dict[str, Any]) -> dict[str, Any]:
        pid = extrair_pid(entrada["pergunta"])
        ficha = lookup_produto(pid, produtos)
        return {"pergunta": entrada["pergunta"], "pid": pid, "ficha": ficha}

    def chamar_modelo(estado: dict[str, Any]) -> str:
        return modelo_stub(estado["pergunta"], estado["ficha"])

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", "Você resume um produto do catálogo em JSON."),
            ("human", "{pergunta}"),
        ]
    )

    # prompt formata; a “LLM” é RunnableLambda determinística (sala sem chave).
    chain = (
        {"pergunta": RunnablePassthrough()}
        | RunnableLambda(lambda p: {"pergunta": p if isinstance(p, str) else p["pergunta"]})
        | RunnableLambda(ferramenta)
        | RunnableLambda(
            lambda estado: {
                **estado,
                "prompt_preview": prompt.format(pergunta=estado["pergunta"]),
            }
        )
        | RunnableLambda(chamar_modelo)
        | StrOutputParser()
    )

    bruto = chain.invoke(pergunta)
    parsed = json.loads(bruto)
    pid = extrair_pid(pergunta)
    return {
        "modo": "langchain",
        "rastro": {
            "entrada": pergunta,
            "pid": pid,
            "ferramenta_lookup": lookup_produto(pid, produtos),
            "saida_modelo": bruto,
            "nota": "ChatPromptTemplate + RunnableLambda (modelo fake) + StrOutputParser",
        },
        "saida": parsed,
    }


def rastro_detalhado(
    pergunta: str, produtos: dict[str, dict[str, Any]], *, usar_langchain: bool
) -> dict[str, Any]:
    """Executa a chain registrando a carga de cada seta (para tutorial e explorador)."""
    achado = re.search(r"\b(p\d{2})\b", pergunta.lower())
    pid = extrair_pid(pergunta)
    ficha = lookup_produto(pid, produtos)
    if usar_langchain:
        from langchain_core.prompts import ChatPromptTemplate

        prompt = ChatPromptTemplate.from_messages(
            [("system", SISTEMA), ("human", "{pergunta}")]
        )
        mensagens = [
            {"papel": m.type, "conteudo": m.content}
            for m in prompt.invoke({"pergunta": pergunta}).to_messages()
        ]
        resultado = chain_langchain(pergunta, produtos)
        bruto = resultado["rastro"]["saida_modelo"]
    else:
        mensagens = [
            {"papel": "system", "conteudo": SISTEMA},
            {"papel": "human", "conteudo": pergunta},
        ]
        bruto = modelo_stub(pergunta, ficha)
    try:
        saida: Any = json.loads(bruto)
        parse_ok = True
    except json.JSONDecodeError as exc:
        saida, parse_ok = {"erro_parse": str(exc)}, False
    ids_no_texto = re.findall(r"\b(p\d{2})\b", pergunta.lower())
    alertas = []
    if achado is None:
        alertas.append("sem id na pergunta: extrator usou o padrão p01")
    if len(ids_no_texto) > 1:
        alertas.append(f"vários ids {ids_no_texto}: só o primeiro foi usado")
    if "erro" in ficha:
        alertas.append("id inexistente no catálogo: ferramenta devolveu erro")
    return {
        "modo": "langchain" if usar_langchain else "script_puro",
        "pergunta": pergunta,
        "passos": [
            {"passo": "entrada", "carga": pergunta},
            {"passo": "extrair_id", "carga": {"pid": pid, "achado_no_texto": achado is not None}},
            {"passo": "ferramenta_lookup", "carga": ficha},
            {"passo": "prompt", "carga": mensagens},
            {"passo": "modelo", "carga": bruto},
            {"passo": "parser", "carga": saida, "parse_ok": parse_ok},
        ],
        "saida": saida,
        "alertas": alertas,
    }


def rodar_lote(produtos: dict[str, dict[str, Any]]) -> dict[str, Any]:
    try:
        import langchain_core

        versao: str | None = langchain_core.__version__
    except ImportError:
        versao = None
    casos = []
    for pergunta in PERGUNTAS_LOTE:
        puro = rastro_detalhado(pergunta, produtos, usar_langchain=False)
        caso: dict[str, Any] = {"pergunta": pergunta, "puro": puro}
        if versao:
            lc = rastro_detalhado(pergunta, produtos, usar_langchain=True)
            caso["langchain"] = lc
            caso["saidas_identicas"] = lc["saida"] == puro["saida"]
        casos.append(caso)
    return {
        "langchain_core": versao,
        "sistema": SISTEMA,
        "casos": casos,
        "nota": "Modelo determinístico (sem chave de API). Mesma I/O nos dois modos.",
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--pergunta", default=ENTRADA_PADRAO)
    parser.add_argument(
        "--modo",
        choices=("puro", "langchain", "auto"),
        default="auto",
        help="auto: tenta LangChain; cai no script puro se faltar o pacote",
    )
    parser.add_argument(
        "--lote",
        action="store_true",
        help="roda PERGUNTAS_LOTE nos dois modos e grava material/langchain/rastros.json",
    )
    args = parser.parse_args()
    produtos = carregar_produtos()
    SAIDA.mkdir(parents=True, exist_ok=True)

    if args.lote:
        lote = rodar_lote(produtos)
        caminho = SAIDA / "rastros.json"
        caminho.write_text(json.dumps(lote, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        for caso in lote["casos"]:
            print(caso["pergunta"], "→", json.dumps(caso["puro"]["saida"], ensure_ascii=False),
                  "| idênticas:", caso.get("saidas_identicas"), "|", caso["puro"]["alertas"])
        print(f"\n→ {caminho}")
        return

    modo = args.modo
    if modo == "auto":
        try:
            import langchain_core  # noqa: F401

            modo = "langchain"
        except ImportError:
            modo = "puro"

    if modo == "langchain":
        try:
            resultado = chain_langchain(args.pergunta, produtos)
        except ImportError as exc:
            resultado = chain_pura(args.pergunta, produtos)
            resultado["aviso"] = (
                f"langchain-core ausente ({exc}). Rode com "
                "`uv run --with langchain-core python scripts/demo_langchain_loja.py "
                "--modo langchain`."
            )
    else:
        resultado = chain_pura(args.pergunta, produtos)

    caminho = SAIDA / "resultado_chain_loja.json"
    caminho.write_text(json.dumps(resultado, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(resultado, ensure_ascii=False, indent=2))
    print(f"\n→ {caminho}")


if __name__ == "__main__":
    main()
