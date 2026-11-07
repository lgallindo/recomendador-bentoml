# Explore o caminho de um pedido de chat

Este explorador acompanha **um pedido de chat** pelos serviços de um stack de
LLM local: navegador, Open WebUI, LiteLLM, Ollama, provedor em nuvem e o volume
com os pesos do modelo. Para cada trecho, ele mostra rota, porta, credencial
que viaja e status que volta. Ele substitui, para estudo, um stack que você
nem sempre consegue subir na sua máquina; com o stack no ar, ele serve de mapa
para interpretar o que acontece.

## Abrir o explorador

Com uma cópia local do repositório, abra [index.html](index.html) no navegador.
Todos os recursos são locais; nenhuma conexão é necessária. A página de um
arquivo HTML no GitHub mostra o código, não executa o explorador.

## Roteiro de exploração

1. Abra **Chat no Open WebUI** e conte os saltos. Qual deles atravessa a porta
   publicada no host e qual fica só na rede interna do Compose?
2. Troque para **App → LiteLLM → Ollama**. Que credencial viaja no salto 1? E
   no salto 2?
3. Compare com **App → LiteLLM → provedor**: em que salto aparece a chave do
   provedor? O app chega a vê-la?
4. Percorra os quatro cenários de erro e anote, para cada um, o status que o
   cliente recebe e o salto onde a falha realmente acontece.
5. Exporte o PNG e o CSV de um cenário de erro para o seu relato.

## O que o seletor faz

Trocar o cenário **relê cenários pré-calculados**; nada é enviado pela rede.
Os payloads com «…» são ilustrativos: o texto gerado por um modelo varia a cada
execução. As linhas marcadas como *registrado* reproduzem respostas reais de um
proxy LiteLLM 1.108.2 sem banco de dados e sem Ollama no ar, guardadas em
[`../litellm/respostas-registradas.json`](../litellm/respostas-registradas.json).
Mensagens e códigos podem mudar em outras versões.

## Reproduzir os dados e a figura

Na raiz do repositório:

```bash
uv run python scripts/gerar_bi_llm_local.py
```

O comando grava `dados.js` e `material/imagens/bi-llm-local-cenario.png`.
