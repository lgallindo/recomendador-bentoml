# Open WebUI + Ollama (Compose · CPU)

Chat local com interface web (Open WebUI) na frente de um runtime de modelos
(Ollama). Tudo roda em CPU; os pesos ficam num volume Docker.

| Arquivo | Papel |
| --- | --- |
| [`docker-compose.yml`](docker-compose.yml) | Os dois serviços, a porta 3000 da UI e os volumes |
| [`docker-compose.ollama-host.yml`](docker-compose.ollama-host.yml) | Opcional: publica a API do Ollama em `127.0.0.1:11434` para `curl` e LiteLLM rodando fora do Docker |
| [`exemplo-api-ollama.json`](exemplo-api-ollama.json) | Formato ilustrativo de pedido e resposta da API nativa do Ollama |

```bash
cd material/open-webui
docker compose up -d                       # UI em http://127.0.0.1:3000
docker compose exec ollama ollama pull qwen2.5:0.5b
docker compose down                        # para; os volumes continuam
```

Com a API do Ollama publicada no host:

```bash
docker compose -f docker-compose.yml -f docker-compose.ollama-host.yml up -d
curl -s http://127.0.0.1:11434/api/tags
```

Tutorial: [`../tutorial-open-webui-20261026.md`](../tutorial-open-webui-20261026.md).
Explorador do caminho do pedido: [`../bi-llm-local/index.html`](../bi-llm-local/index.html).
