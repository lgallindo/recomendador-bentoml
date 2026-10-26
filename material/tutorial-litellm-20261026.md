# LiteLLM — SDK e proxy OpenAI-compatible

Apps falam a API OpenAI. LiteLLM encaminha para o provedor (ou Ollama) por
trás. Separe **chave do provedor** e **master key do proxy**.

## Objetivos (4)

1. Separar as duas chaves; forma do `.env` com segredos redactados.
2. Caminho A — SDK: uma completion com `import litellm` (sem processo proxy).
3. Subir o proxy (uv **ou** Docker); health/models na porta **4000**.
4. Cliente OpenAI-compatible em `http://127.0.0.1:4000/v1` com a master key.

## Material canônico (CESAR)

A rampa completa com `just setup` / `sdk` / `proxy` / `smoke` vive em:

- `CESAR/teaching/litellm-setup/`
- variante agente: `CESAR/teaching/ads032-agente-litellm/`

Clone ou abra essa pasta na máquina da aula. Este tutorial só fixa os quatro
objetivos e o vocabulário.

## 1. Duas chaves

```bash
# .env (NÃO commitado) — valores de exemplo redactados
OPENAI_API_KEY=sk-prov-***          # só o proxy/SDK fala com o provedor
LITELLM_MASTER_KEY=sk-proxy-***     # o app cliente usa esta no header
```

O app cliente **segura a master** do proxy. A chave do provedor fica no
servidor LiteLLM (ou no ambiente do script SDK).

## 2. SDK (sem proxy)

Na pasta `litellm-setup`:

```bash
just setup    # depois edite .env
just sdk
```

Cole I/O ou trecho da execução (sem colar chaves).

## 3. Proxy na :4000

```bash
just proxy-uv          # terminal 1
# ou: just proxy-docker
curl -s http://127.0.0.1:4000/health
curl -s http://127.0.0.1:4000/v1/models -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

## 4. Cliente → proxy

`base_url=http://127.0.0.1:4000/v1` e `api_key=<master>`. Uma chat completion.
O cliente **não** aponta para api.openai.com.

## Exercício

Três linhas das chaves; prova SDK; prova health :4000; uma completion via proxy.
