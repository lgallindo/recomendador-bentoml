# LiteLLM — pacote local da aula

Tudo o que o tutorial de LiteLLM usa está nesta pasta e em dois scripts da
raiz. Nenhum outro repositório é necessário.

| Arquivo | Papel | Versionado? |
| --- | --- | --- |
| [`config.example.yaml`](config.example.yaml) | `model_list` com os aliases `loja-chat` (Ollama local) e `loja-chat-nuvem` (OpenAI, opcional) | sim |
| [`.env.example`](.env.example) | Forma das variáveis: master key do proxy, endereço do Ollama, chave do provedor | sim |
| `config.yaml`, `.env` | Suas cópias de trabalho | **não** (`.gitignore` desta pasta) |
| [`docker-compose.yml`](docker-compose.yml) | Proxy em contêiner, ligado à rede do stack Open WebUI + Ollama | sim |
| [`respostas-registradas.json`](respostas-registradas.json) | Respostas reais do proxy (LiteLLM 1.108.2) em cenários de erro | sim |
| [`../../scripts/demo_litellm_sdk.py`](../../scripts/demo_litellm_sdk.py) | Caminho A: biblioteca, sem proxy | sim |
| [`../../scripts/demo_litellm_proxy.py`](../../scripts/demo_litellm_proxy.py) | Cliente do proxy só com biblioteca padrão; `--offline` mostra os pedidos | sim |

## Preparar (uma vez)

```bash
cp material/litellm/.env.example material/litellm/.env
cp material/litellm/config.example.yaml material/litellm/config.yaml
git check-ignore -v material/litellm/.env material/litellm/config.yaml
```

## Três jeitos de rodar

```bash
# A — biblioteca (sem proxy)
uv run --with litellm python scripts/demo_litellm_sdk.py

# B — proxy no host, via uv (terminal 1)
set -a && . material/litellm/.env && set +a
uv run --with 'litellm[proxy]' litellm --config material/litellm/config.yaml --host 127.0.0.1 --port 4000

# C — proxy em contêiner (exige o stack de material/open-webui no ar)
cd material/litellm && docker compose up -d

# cliente (terminal 2), para B ou C
uv run python scripts/demo_litellm_proxy.py
```

Tutorial: [`../tutorial-litellm-20261026.md`](../tutorial-litellm-20261026.md).
