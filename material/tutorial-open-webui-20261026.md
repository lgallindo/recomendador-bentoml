# Open WebUI + Ollama — chat local em Docker (CPU)

Sobe uma interface de chat e um runtime de modelos locais. Ollama gera;
Open WebUI é a UI. Complementa as assíncronas ADS032 (conceito/CLI): aqui o
caminho é **Compose**.

## Objetivos

1. Subir o stack; mostrar `docker compose ps` e a URL.
2. Puxar um modelo pequeno; três turnos de chat.
3. Uma frase: Ollama = runtime; Open WebUI = UI.
4. Um recurso de “seu conteúdo” (upload / knowledge / system prompt).
5. Mini-runbook: start, stop, volumes, falha típica em CPU.

## 1. Subir

Na pasta do compose:

```bash
cd material/open-webui
docker compose up -d
docker compose ps
```

UI: [http://127.0.0.1:3000](http://127.0.0.1:3000)

**Caminho B:** se a máquina não puxar imagem, documente o erro e use o vídeo
da assíncrona + este runbook como leitura (sem nota de UI).

## 2. Modelo pequeno

Na UI (ou `docker compose exec ollama ollama pull tinyllama`), escolha um
modelo leve. Três turnos sobre a loja (frete, devolução, peça `p01`). Cole
o id do modelo e o resumo dos turnos.

## 3. Papéis

- **Ollama** — runtime que carrega o modelo e responde na API.
- **Open WebUI** — interface (contas, chats, uploads) na frente do runtime.

## 4. Seu conteúdo

Upload de um `.md` da mini-wiki **ou** system prompt colando um parágrafo de
`frete.md`. Mostre uma resposta que cite esse material.

## 5. Runbook (modelo)

| Ação | Comando / caminho |
| --- | --- |
| Start | `docker compose up -d` em `material/open-webui/` |
| Stop | `docker compose down` |
| Modelos | volume Docker `ollama_data` |
| Dados UI | volume `open_webui_data` |
| Falha CPU | pull de modelo grande → OOM / timeout — use `tinyllama` / `phi3:mini` |

## Exercício

Evidências: `docker compose ps`, três turnos, prova do recurso de conteúdo,
runbook preenchido.
