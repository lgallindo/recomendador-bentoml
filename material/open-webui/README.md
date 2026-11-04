# Open WebUI + Ollama (Compose · CPU)

Stack local da aula: runtime Ollama + interface Open WebUI, sem GPU.

```bash
cd material/open-webui
docker compose up -d
docker compose ps
```

- UI: [http://127.0.0.1:3000](http://127.0.0.1:3000)
- Tutorial (fluxo, ancoragem, controle vs divergente, entrega):
  [`../tutorial-open-webui-20261026.md`](../tutorial-open-webui-20261026.md)
- Mini-wiki para injetar contexto: [`../mini-wiki-rag/`](../mini-wiki-rag/)

Parar mantendo volumes: `docker compose down`.  
Reset destrutivo do lab (apaga modelos/históricos locais): `docker compose down -v`.
