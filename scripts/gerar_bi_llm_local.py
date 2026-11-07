"""Gera dados.js do explorador «caminho do pedido» (Open WebUI · Ollama · LiteLLM).

Os cenários descrevem, salto a salto, quem fala com quem, em que porta, com qual
credencial e qual status volta. Corpos de erro marcados como «registrado» vêm de
material/litellm/respostas-registradas.json; os demais payloads são ilustrativos.

Uso (raiz do repositório):

    uv run python scripts/gerar_bi_llm_local.py
"""

from __future__ import annotations

import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")

import matplotlib.pyplot as plt
from matplotlib.patches import FancyArrowPatch, FancyBboxPatch

RAIZ = Path(__file__).resolve().parent.parent
PAINEL = RAIZ / "material" / "bi-llm-local"
IMAGENS = RAIZ / "material" / "imagens"
REGISTRADAS = RAIZ / "material" / "litellm" / "respostas-registradas.json"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"

NOS = {
    "navegador": {"rotulo": "Navegador", "sub": "você", "x": 90, "y": 95},
    "cliente": {"rotulo": "App / script", "sub": "curl · Python", "x": 90, "y": 265},
    "openwebui": {"rotulo": "Open WebUI", "sub": ":3000 → :8080", "x": 330, "y": 95},
    "litellm": {"rotulo": "LiteLLM", "sub": "proxy :4000", "x": 330, "y": 265},
    "ollama": {"rotulo": "Ollama", "sub": "runtime :11434", "x": 590, "y": 95},
    "provedor": {"rotulo": "Provedor", "sub": "nuvem (OpenAI…)", "x": 590, "y": 265},
    "pesos": {"rotulo": "Pesos", "sub": "volume ollama_data", "x": 820, "y": 95},
    "outro": {"rotulo": "Outro serviço", "sub": "na porta 4000", "x": 820, "y": 265},
}

PERGUNTA = "Qual o prazo de devolução de uma peça sem uso?"
PEDIDO_OLLAMA = json.dumps(
    {"model": "qwen2.5:0.5b", "messages": [{"role": "user", "content": PERGUNTA}], "stream": False},
    ensure_ascii=False,
)
RESPOSTA_OLLAMA = json.dumps(
    {"model": "qwen2.5:0.5b", "message": {"role": "assistant", "content": "…"}, "done": True,
     "eval_count": "…", "total_duration": "…"},
    ensure_ascii=False,
)
PEDIDO_OPENAI = json.dumps(
    {"model": "loja-chat", "messages": [{"role": "user", "content": PERGUNTA}], "max_tokens": 80},
    ensure_ascii=False,
)
RESPOSTA_OPENAI = json.dumps(
    {"object": "chat.completion", "model": "loja-chat",
     "choices": [{"index": 0, "message": {"role": "assistant", "content": "…"}, "finish_reason": "stop"}],
     "usage": {"prompt_tokens": "…", "completion_tokens": "…"}},
    ensure_ascii=False,
)
CARREGAR = "Na primeira chamada, o runtime lê o arquivo do volume e carrega os pesos na RAM."


def registradas() -> dict[str, dict]:
    dados = json.loads(REGISTRADAS.read_text(encoding="utf-8"))
    return {r["cenario"]: r for r in dados["respostas"]}


def salto(de, para, rota, porta, credencial, pedido, resposta, status, origem, nota):
    return {"de": de, "para": para, "rota": rota, "porta": porta, "credencial": credencial,
            "pedido": pedido, "resposta": resposta, "status": status, "origem": origem, "nota": nota}


def cenarios() -> list[dict]:
    reg = registradas()
    erro_chave = json.dumps(reg["chave diferente da master key (proxy sem banco)"]["corpo"], ensure_ascii=False)
    erro_alias = json.dumps(reg["alias inexistente"]["corpo"], ensure_ascii=False)
    erro_ollama = json.dumps(reg["Ollama fora do ar"]["corpo"], ensure_ascii=False)
    pesos = salto("ollama", "pesos", "leitura de arquivo", "—", "nenhuma", "qwen2.5:0.5b",
                  "pesos na memória", "ok", "ilustrativo", CARREGAR)
    return [
        {
            "id": "owui", "titulo": "Chat no Open WebUI",
            "resumo": "Você digita no navegador; a UI repassa ao runtime pela rede interna do Compose.",
            "licao": "A UI e o runtime são processos diferentes. A porta 11434 nem precisa sair do Docker.",
            "saltos": [
                salto("navegador", "openwebui", "POST /api/chat/completions", "3000 (host) → 8080",
                      "token de sessão do Open WebUI", PEDIDO_OPENAI.replace("loja-chat", "qwen2.5:0.5b"),
                      RESPOSTA_OPENAI.replace("loja-chat", "qwen2.5:0.5b"), 200, "ilustrativo",
                      "A conta criada no primeiro acesso vira administradora."),
                salto("openwebui", "ollama", "POST /api/chat", "11434 (rede interna)", "nenhuma",
                      PEDIDO_OLLAMA, RESPOSTA_OLLAMA, 200, "ilustrativo",
                      "Endereço vem de OLLAMA_BASE_URL=http://ollama:11434."),
                pesos,
            ],
        },
        {
            "id": "curl-ollama", "titulo": "curl direto no Ollama",
            "resumo": "Sem interface: um cliente fala com a API nativa do runtime.",
            "licao": "Exige publicar 127.0.0.1:11434 (arquivo docker-compose.ollama-host.yml). Sem isso: conexão recusada.",
            "saltos": [
                salto("cliente", "ollama", "POST /api/chat", "127.0.0.1:11434", "nenhuma",
                      PEDIDO_OLLAMA, RESPOSTA_OLLAMA, 200, "ilustrativo",
                      "O Ollama não pede chave: proteja a porta, publique só em 127.0.0.1."),
                pesos,
            ],
        },
        {
            "id": "litellm-ollama", "titulo": "App → LiteLLM → Ollama",
            "resumo": "O app pede o alias loja-chat; o proxy traduz para o formato do Ollama.",
            "licao": "O app fala só OpenAI-compatible e só conhece a master key.",
            "saltos": [
                salto("cliente", "litellm", "POST /v1/chat/completions", "127.0.0.1:4000",
                      "Bearer LITELLM_MASTER_KEY", PEDIDO_OPENAI, RESPOSTA_OPENAI, 200, "ilustrativo",
                      "model_list: loja-chat → ollama_chat/qwen2.5:0.5b."),
                salto("litellm", "ollama", "POST /api/chat", "OLLAMA_API_BASE (:11434)", "nenhuma",
                      PEDIDO_OLLAMA, RESPOSTA_OLLAMA, 200, "ilustrativo",
                      "Do host: http://127.0.0.1:11434. De contêiner: http://ollama:11434."),
                pesos,
            ],
        },
        {
            "id": "litellm-provedor", "titulo": "App → LiteLLM → provedor",
            "resumo": "Mesmo contrato no app; o proxy usa a chave do provedor guardada no próprio .env.",
            "licao": "Trocar loja-chat por loja-chat-nuvem não muda nenhuma linha do app além do nome do modelo.",
            "saltos": [
                salto("cliente", "litellm", "POST /v1/chat/completions", "127.0.0.1:4000",
                      "Bearer LITELLM_MASTER_KEY", PEDIDO_OPENAI.replace("loja-chat", "loja-chat-nuvem"),
                      RESPOSTA_OPENAI.replace("loja-chat", "loja-chat-nuvem"), 200, "ilustrativo",
                      "O app nunca vê OPENAI_API_KEY."),
                salto("litellm", "provedor", "POST /v1/chat/completions", "443 (HTTPS)",
                      "Bearer OPENAI_API_KEY",
                      json.dumps({"model": "gpt-4o-mini", "messages": "…"}, ensure_ascii=False),
                      json.dumps({"object": "chat.completion", "choices": "…"}, ensure_ascii=False),
                      200, "ilustrativo", "Cobrança por token acontece aqui."),
            ],
        },
        {
            "id": "chave-errada", "titulo": "Master key errada",
            "resumo": "O app apresenta uma chave que o proxy não reconhece.",
            "licao": "Sem banco de chaves virtuais, o LiteLLM 1.108.2 respondeu 400 «No connected db.»; com banco, espere 401.",
            "saltos": [
                salto("cliente", "litellm", "GET /v1/models", "127.0.0.1:4000", "Bearer sk-errada",
                      "(sem corpo)", erro_chave, 400, "registrado",
                      "O pedido para no primeiro salto; nenhum destino é acionado."),
            ],
        },
        {
            "id": "alias-desconhecido", "titulo": "Alias desconhecido",
            "resumo": "O app pede um modelo que não está no model_list.",
            "licao": "Liste os aliases com GET /v1/models antes de culpar o provedor.",
            "saltos": [
                salto("cliente", "litellm", "POST /v1/chat/completions", "127.0.0.1:4000",
                      "Bearer LITELLM_MASTER_KEY", PEDIDO_OPENAI.replace("loja-chat", "nao-existe"),
                      erro_alias, 400, "registrado", "O proxy recusa antes de escolher destino."),
            ],
        },
        {
            "id": "ollama-parado", "titulo": "Ollama fora do ar",
            "resumo": "O proxy aceita o pedido, mas não alcança o runtime.",
            "licao": "500 com «Cannot connect to host … 11434»: o problema está no segundo salto, não na chave.",
            "saltos": [
                salto("cliente", "litellm", "POST /v1/chat/completions", "127.0.0.1:4000",
                      "Bearer LITELLM_MASTER_KEY", PEDIDO_OPENAI, erro_ollama, 500, "registrado",
                      "O status que o app recebe descreve a falha do salto seguinte."),
                salto("litellm", "ollama", "POST /api/chat", "OLLAMA_API_BASE (:11434)", "nenhuma",
                      PEDIDO_OLLAMA, "(sem resposta: conexão recusada)", "recusada", "registrado",
                      "Suba o stack ou publique a porta para o host."),
            ],
        },
        {
            "id": "porta-ocupada", "titulo": "Outro serviço na porta 4000",
            "resumo": "Algo responde em :4000, mas não é o LiteLLM.",
            "licao": "HTTP 200 com HTML no lugar de JSON: confira com ss -ltnp | grep 4000 e mude a porta.",
            "saltos": [
                salto("cliente", "outro", "GET /v1/models", "127.0.0.1:4000", "Bearer LITELLM_MASTER_KEY",
                      "(sem corpo)", "<!DOCTYPE html> …", 200, "registrado",
                      "Situação real encontrada na máquina de preparo desta aula."),
            ],
        },
    ]


def figura_espelho(cenario: dict) -> None:
    fig, ax = plt.subplots(figsize=(11, 5.2))
    ax.set_xlim(0, 920)
    ax.set_ylim(420, 20)
    ax.axis("off")
    usados = {s["de"] for s in cenario["saltos"]} | {s["para"] for s in cenario["saltos"]}
    for nid, no in NOS.items():
        ativo = nid in usados
        ax.add_patch(FancyBboxPatch((no["x"] - 70, no["y"] - 32), 140, 64,
                                    boxstyle="round,pad=2,rounding_size=10",
                                    facecolor="#fff1dc" if ativo else "#f2f4f5",
                                    edgecolor=BARRO if ativo else "#c3ccd1", linewidth=2))
        ax.text(no["x"], no["y"] - 6, no["rotulo"], ha="center", va="center",
                color=AZUL if ativo else "#8a9aa3", fontsize=11, weight="bold")
        ax.text(no["x"], no["y"] + 14, no["sub"], ha="center", va="center",
                color=AZUL if ativo else "#8a9aa3", fontsize=8.5)
    for i, s in enumerate(cenario["saltos"], start=1):
        a, b = NOS[s["de"]], NOS[s["para"]]
        ax.add_patch(FancyArrowPatch((a["x"] + 72, a["y"]), (b["x"] - 72, b["y"]),
                                     arrowstyle="-|>", mutation_scale=16, color=VERDE, linewidth=2.4))
        mx, my = (a["x"] + b["x"]) / 2, (a["y"] + b["y"]) / 2
        ax.text(mx, my, str(i), ha="center", va="center", fontsize=10, color="white", weight="bold",
                bbox={"boxstyle": "circle,pad=0.3", "facecolor": VERDE, "edgecolor": "white"})
        legenda = f"{i} · {a['rotulo']} → {b['rotulo']} · {s['rota']} · credencial: {s['credencial']}"
        ax.text(20, 330 + 22 * i, legenda, fontsize=9.5, color=AZUL)
    ax.set_title(f"Caminho do pedido — {cenario['titulo']}", color=AZUL, weight="bold", fontsize=14)
    fig.tight_layout()
    fig.savefig(IMAGENS / "bi-llm-local-cenario.png", dpi=160, bbox_inches="tight", facecolor="white")
    plt.close(fig)


def main() -> None:
    lista = cenarios()
    dados = {
        "origem": "scripts/gerar_bi_llm_local.py",
        "registro": "material/litellm/respostas-registradas.json (LiteLLM 1.108.2, 2026-11-07)",
        "nos": NOS,
        "cenarios": lista,
    }
    PAINEL.mkdir(parents=True, exist_ok=True)
    (PAINEL / "dados.js").write_text(
        "window.LLM_LOCAL = " + json.dumps(dados, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )
    figura_espelho(next(c for c in lista if c["id"] == "litellm-ollama"))
    print(f"{len(lista)} cenários → material/bi-llm-local/dados.js")
    print("espelho → material/imagens/bi-llm-local-cenario.png")


if __name__ == "__main__":
    main()
