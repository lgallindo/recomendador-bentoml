window.LLM_LOCAL = {
  "origem": "scripts/gerar_bi_llm_local.py",
  "registro": "material/litellm/respostas-registradas.json (LiteLLM 1.108.2, 2026-11-07)",
  "nos": {
    "navegador": {
      "rotulo": "Navegador",
      "sub": "você",
      "x": 90,
      "y": 95
    },
    "cliente": {
      "rotulo": "App / script",
      "sub": "curl · Python",
      "x": 90,
      "y": 265
    },
    "openwebui": {
      "rotulo": "Open WebUI",
      "sub": ":3000 → :8080",
      "x": 330,
      "y": 95
    },
    "litellm": {
      "rotulo": "LiteLLM",
      "sub": "proxy :4000",
      "x": 330,
      "y": 265
    },
    "ollama": {
      "rotulo": "Ollama",
      "sub": "runtime :11434",
      "x": 590,
      "y": 95
    },
    "provedor": {
      "rotulo": "Provedor",
      "sub": "nuvem (OpenAI…)",
      "x": 590,
      "y": 265
    },
    "pesos": {
      "rotulo": "Pesos",
      "sub": "volume ollama_data",
      "x": 820,
      "y": 95
    },
    "outro": {
      "rotulo": "Outro serviço",
      "sub": "na porta 4000",
      "x": 820,
      "y": 265
    }
  },
  "cenarios": [
    {
      "id": "owui",
      "titulo": "Chat no Open WebUI",
      "resumo": "Você digita no navegador; a UI repassa ao runtime pela rede interna do Compose.",
      "licao": "A UI e o runtime são processos diferentes. A porta 11434 nem precisa sair do Docker.",
      "saltos": [
        {
          "de": "navegador",
          "para": "openwebui",
          "rota": "POST /api/chat/completions",
          "porta": "3000 (host) → 8080",
          "credencial": "token de sessão do Open WebUI",
          "pedido": "{\"model\": \"qwen2.5:0.5b\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"max_tokens\": 80}",
          "resposta": "{\"object\": \"chat.completion\", \"model\": \"qwen2.5:0.5b\", \"choices\": [{\"index\": 0, \"message\": {\"role\": \"assistant\", \"content\": \"…\"}, \"finish_reason\": \"stop\"}], \"usage\": {\"prompt_tokens\": \"…\", \"completion_tokens\": \"…\"}}",
          "status": 200,
          "origem": "ilustrativo",
          "nota": "A conta criada no primeiro acesso vira administradora."
        },
        {
          "de": "openwebui",
          "para": "ollama",
          "rota": "POST /api/chat",
          "porta": "11434 (rede interna)",
          "credencial": "nenhuma",
          "pedido": "{\"model\": \"qwen2.5:0.5b\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"stream\": false}",
          "resposta": "{\"model\": \"qwen2.5:0.5b\", \"message\": {\"role\": \"assistant\", \"content\": \"…\"}, \"done\": true, \"eval_count\": \"…\", \"total_duration\": \"…\"}",
          "status": 200,
          "origem": "ilustrativo",
          "nota": "Endereço vem de OLLAMA_BASE_URL=http://ollama:11434."
        },
        {
          "de": "ollama",
          "para": "pesos",
          "rota": "leitura de arquivo",
          "porta": "—",
          "credencial": "nenhuma",
          "pedido": "qwen2.5:0.5b",
          "resposta": "pesos na memória",
          "status": "ok",
          "origem": "ilustrativo",
          "nota": "Na primeira chamada, o runtime lê o arquivo do volume e carrega os pesos na RAM."
        }
      ]
    },
    {
      "id": "curl-ollama",
      "titulo": "curl direto no Ollama",
      "resumo": "Sem interface: um cliente fala com a API nativa do runtime.",
      "licao": "Exige publicar 127.0.0.1:11434 (arquivo docker-compose.ollama-host.yml). Sem isso: conexão recusada.",
      "saltos": [
        {
          "de": "cliente",
          "para": "ollama",
          "rota": "POST /api/chat",
          "porta": "127.0.0.1:11434",
          "credencial": "nenhuma",
          "pedido": "{\"model\": \"qwen2.5:0.5b\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"stream\": false}",
          "resposta": "{\"model\": \"qwen2.5:0.5b\", \"message\": {\"role\": \"assistant\", \"content\": \"…\"}, \"done\": true, \"eval_count\": \"…\", \"total_duration\": \"…\"}",
          "status": 200,
          "origem": "ilustrativo",
          "nota": "O Ollama não pede chave: proteja a porta, publique só em 127.0.0.1."
        },
        {
          "de": "ollama",
          "para": "pesos",
          "rota": "leitura de arquivo",
          "porta": "—",
          "credencial": "nenhuma",
          "pedido": "qwen2.5:0.5b",
          "resposta": "pesos na memória",
          "status": "ok",
          "origem": "ilustrativo",
          "nota": "Na primeira chamada, o runtime lê o arquivo do volume e carrega os pesos na RAM."
        }
      ]
    },
    {
      "id": "litellm-ollama",
      "titulo": "App → LiteLLM → Ollama",
      "resumo": "O app pede o alias loja-chat; o proxy traduz para o formato do Ollama.",
      "licao": "O app fala só OpenAI-compatible e só conhece a master key.",
      "saltos": [
        {
          "de": "cliente",
          "para": "litellm",
          "rota": "POST /v1/chat/completions",
          "porta": "127.0.0.1:4000",
          "credencial": "Bearer LITELLM_MASTER_KEY",
          "pedido": "{\"model\": \"loja-chat\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"max_tokens\": 80}",
          "resposta": "{\"object\": \"chat.completion\", \"model\": \"loja-chat\", \"choices\": [{\"index\": 0, \"message\": {\"role\": \"assistant\", \"content\": \"…\"}, \"finish_reason\": \"stop\"}], \"usage\": {\"prompt_tokens\": \"…\", \"completion_tokens\": \"…\"}}",
          "status": 200,
          "origem": "ilustrativo",
          "nota": "model_list: loja-chat → ollama_chat/qwen2.5:0.5b."
        },
        {
          "de": "litellm",
          "para": "ollama",
          "rota": "POST /api/chat",
          "porta": "OLLAMA_API_BASE (:11434)",
          "credencial": "nenhuma",
          "pedido": "{\"model\": \"qwen2.5:0.5b\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"stream\": false}",
          "resposta": "{\"model\": \"qwen2.5:0.5b\", \"message\": {\"role\": \"assistant\", \"content\": \"…\"}, \"done\": true, \"eval_count\": \"…\", \"total_duration\": \"…\"}",
          "status": 200,
          "origem": "ilustrativo",
          "nota": "Do host: http://127.0.0.1:11434. De contêiner: http://ollama:11434."
        },
        {
          "de": "ollama",
          "para": "pesos",
          "rota": "leitura de arquivo",
          "porta": "—",
          "credencial": "nenhuma",
          "pedido": "qwen2.5:0.5b",
          "resposta": "pesos na memória",
          "status": "ok",
          "origem": "ilustrativo",
          "nota": "Na primeira chamada, o runtime lê o arquivo do volume e carrega os pesos na RAM."
        }
      ]
    },
    {
      "id": "litellm-provedor",
      "titulo": "App → LiteLLM → provedor",
      "resumo": "Mesmo contrato no app; o proxy usa a chave do provedor guardada no próprio .env.",
      "licao": "Trocar loja-chat por loja-chat-nuvem não muda nenhuma linha do app além do nome do modelo.",
      "saltos": [
        {
          "de": "cliente",
          "para": "litellm",
          "rota": "POST /v1/chat/completions",
          "porta": "127.0.0.1:4000",
          "credencial": "Bearer LITELLM_MASTER_KEY",
          "pedido": "{\"model\": \"loja-chat-nuvem\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"max_tokens\": 80}",
          "resposta": "{\"object\": \"chat.completion\", \"model\": \"loja-chat-nuvem\", \"choices\": [{\"index\": 0, \"message\": {\"role\": \"assistant\", \"content\": \"…\"}, \"finish_reason\": \"stop\"}], \"usage\": {\"prompt_tokens\": \"…\", \"completion_tokens\": \"…\"}}",
          "status": 200,
          "origem": "ilustrativo",
          "nota": "O app nunca vê OPENAI_API_KEY."
        },
        {
          "de": "litellm",
          "para": "provedor",
          "rota": "POST /v1/chat/completions",
          "porta": "443 (HTTPS)",
          "credencial": "Bearer OPENAI_API_KEY",
          "pedido": "{\"model\": \"gpt-4o-mini\", \"messages\": \"…\"}",
          "resposta": "{\"object\": \"chat.completion\", \"choices\": \"…\"}",
          "status": 200,
          "origem": "ilustrativo",
          "nota": "Cobrança por token acontece aqui."
        }
      ]
    },
    {
      "id": "chave-errada",
      "titulo": "Master key errada",
      "resumo": "O app apresenta uma chave que o proxy não reconhece.",
      "licao": "Sem banco de chaves virtuais, o LiteLLM 1.108.2 respondeu 400 «No connected db.»; com banco, espere 401.",
      "saltos": [
        {
          "de": "cliente",
          "para": "litellm",
          "rota": "GET /v1/models",
          "porta": "127.0.0.1:4000",
          "credencial": "Bearer sk-errada",
          "pedido": "(sem corpo)",
          "resposta": "{\"error\": {\"message\": \"No connected db.\", \"type\": \"no_db_connection\", \"code\": \"400\"}}",
          "status": 400,
          "origem": "registrado",
          "nota": "O pedido para no primeiro salto; nenhum destino é acionado."
        }
      ]
    },
    {
      "id": "alias-desconhecido",
      "titulo": "Alias desconhecido",
      "resumo": "O app pede um modelo que não está no model_list.",
      "licao": "Liste os aliases com GET /v1/models antes de culpar o provedor.",
      "saltos": [
        {
          "de": "cliente",
          "para": "litellm",
          "rota": "POST /v1/chat/completions",
          "porta": "127.0.0.1:4000",
          "credencial": "Bearer LITELLM_MASTER_KEY",
          "pedido": "{\"model\": \"nao-existe\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"max_tokens\": 80}",
          "resposta": "{\"error\": {\"message\": \"/chat/completions: Invalid model name passed in model=nao-existe. Call `/v1/models` to view available models for your key.\", \"type\": \"invalid_request_error\", \"code\": \"400\"}}",
          "status": 400,
          "origem": "registrado",
          "nota": "O proxy recusa antes de escolher destino."
        }
      ]
    },
    {
      "id": "ollama-parado",
      "titulo": "Ollama fora do ar",
      "resumo": "O proxy aceita o pedido, mas não alcança o runtime.",
      "licao": "500 com «Cannot connect to host … 11434»: o problema está no segundo salto, não na chave.",
      "saltos": [
        {
          "de": "cliente",
          "para": "litellm",
          "rota": "POST /v1/chat/completions",
          "porta": "127.0.0.1:4000",
          "credencial": "Bearer LITELLM_MASTER_KEY",
          "pedido": "{\"model\": \"loja-chat\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"max_tokens\": 80}",
          "resposta": "{\"error\": {\"message\": \"litellm.APIConnectionError: Ollama_chatException - Cannot connect to host REDACTED:11434 [...] LiteLLM: model group 'loja-chat' failed with the error above. No fallback was attempted.\"}}",
          "status": 500,
          "origem": "registrado",
          "nota": "O status que o app recebe descreve a falha do salto seguinte."
        },
        {
          "de": "litellm",
          "para": "ollama",
          "rota": "POST /api/chat",
          "porta": "OLLAMA_API_BASE (:11434)",
          "credencial": "nenhuma",
          "pedido": "{\"model\": \"qwen2.5:0.5b\", \"messages\": [{\"role\": \"user\", \"content\": \"Qual o prazo de devolução de uma peça sem uso?\"}], \"stream\": false}",
          "resposta": "(sem resposta: conexão recusada)",
          "status": "recusada",
          "origem": "registrado",
          "nota": "Suba o stack ou publique a porta para o host."
        }
      ]
    },
    {
      "id": "porta-ocupada",
      "titulo": "Outro serviço na porta 4000",
      "resumo": "Algo responde em :4000, mas não é o LiteLLM.",
      "licao": "HTTP 200 com HTML no lugar de JSON: confira com ss -ltnp | grep 4000 e mude a porta.",
      "saltos": [
        {
          "de": "cliente",
          "para": "outro",
          "rota": "GET /v1/models",
          "porta": "127.0.0.1:4000",
          "credencial": "Bearer LITELLM_MASTER_KEY",
          "pedido": "(sem corpo)",
          "resposta": "<!DOCTYPE html> …",
          "status": 200,
          "origem": "registrado",
          "nota": "Situação real encontrada na máquina de preparo desta aula."
        }
      ]
    }
  ]
};
