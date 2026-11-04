# LiteLLM — SDK e proxy OpenAI-compatible

Apps falam a API OpenAI. LiteLLM encaminha para o provedor (ou Ollama) por
trás. Separe **chave do provedor** e **master key do proxy**.

## Objetivos (4)

1. Separar as duas chaves; forma do `.env` com segredos redactados.
2. Caminho A — SDK: uma completion com `import litellm` (sem processo proxy).
3. Subir o proxy (uv **ou** Docker); health/models na porta **4000**.
4. Cliente OpenAI-compatible em `http://127.0.0.1:4000/v1` com a master key.

## Como rodar neste repositório

Tudo abaixo usa só este clone. Crie um diretório de trabalho local (por
exemplo `material/litellm-lab/`, fora do Git se preferir) com um `.env` e os
comandos desta página. Não é necessário abrir outro repositório de ensino.

## 1. Duas chaves

```bash
# .env (NÃO commitado) — valores de exemplo redactados
OPENAI_API_KEY=sk-prov-***          # só o proxy/SDK fala com o provedor
LITELLM_MASTER_KEY=sk-proxy-***     # o app cliente usa esta no header
```

O app cliente **segura a master** do proxy. A chave do provedor fica no
servidor LiteLLM (ou no ambiente do script SDK).

## 2. SDK (sem proxy)

Com as variáveis carregadas do `.env`:

```bash
uv run --no-project --with litellm python -c "
import os
from litellm import completion
r = completion(
    model='gpt-4o-mini',  # ou o modelo/local que a aula indicar
    messages=[{'role': 'user', 'content': 'ping'}],
    api_key=os.environ['OPENAI_API_KEY'],
)
print(r.choices[0].message.content)
"
```

Cole I/O ou trecho da execução (sem colar chaves). Se a aula usar só Ollama,
aponta o SDK para a URL local do Ollama em vez da chave do provedor.

## 3. Proxy na :4000

Suba o proxy LiteLLM (binário `litellm` via `uv`/`pip`, ou imagem Docker
oficial) escutando em `127.0.0.1:4000`, com a chave do provedor no ambiente
do processo e a master key para clientes.

```bash
curl -s http://127.0.0.1:4000/health
curl -s http://127.0.0.1:4000/v1/models -H "Authorization: Bearer $LITELLM_MASTER_KEY"
```

## 4. Cliente → proxy

`base_url=http://127.0.0.1:4000/v1` e `api_key=<master>`. Uma chat completion.
O cliente **não** aponta para api.openai.com.

## Exercício

Três linhas das chaves; prova SDK; prova health :4000; uma completion via proxy.
