# Open WebUI + Ollama — chat local em Docker (CPU)

Uma janela de chat que responde com fluência e um `docker compose ps` todo
verde ainda não garantem que o **modelo certo** está carregado, que a UI fala
com o **runtime** pretendido, nem que a resposta está **ancorada** no material
da loja. Esta aula sobe o stack neste repositório, separa os papéis de cada
serviço e ensina a provar (e a falhar de propósito) o caminho Compose → Ollama
→ Open WebUI → conteúdo seu.

Compose canônico:
[`material/open-webui/docker-compose.yml`](open-webui/docker-compose.yml).

Mini-wiki para injetar contexto:
[`material/mini-wiki-rag/`](mini-wiki-rag/).

### Roteiro (~75–90 min)

| Bloco | O que você faz |
| --- | --- |
| Parábola | Verde na UI ≠ conteúdo adequado |
| Papéis | Ollama (runtime) vs Open WebUI (interface) |
| Fluxo | Subir → puxar modelo → conversar → ancorar → derrubar |
| Laboratório | Ritual ao vivo + experimento controle vs divergente |
| Entrega | Evidências objetivas (ps, modelo, turnos, falha, runbook) |

---

## 1. O que a luz verde não responde

Imagine a loja abrindo um “assistente” interno. Alguém pergunta o prazo de
devolução de uma peça de Tracunhaém. A interface carrega, o status dos
contêineres está saudável e o texto volta educado — porém cita uma política
que **não existe** na mini-wiki, ou usa um modelo que a máquina mal aguenta e
“esquece” o contexto no segundo turno.

Disponibilidade do stack (imagens no ar, porta `3000` respondendo) responde
apenas: *o pipeline de chat local está de pé?* A pergunta de adequação é
outra: *este runtime, este modelo e este material injetado bastam para a
tarefa da aula?*

Nesta página o caminho é **Docker Compose em CPU**, sem apontar outros
repositórios de ensino. Tudo que você precisa está sob `material/open-webui/`
e, para o exercício de conteúdo, sob `material/mini-wiki-rag/`.

---

## 2. Dois serviços, um contrato

| Serviço | Papel | Onde vive neste lab |
| --- | --- | --- |
| **Ollama** | Runtime que carrega pesos e atende a API de geração | Contêiner `ollama` (rede interna `:11434`) |
| **Open WebUI** | Interface (contas, chats, uploads, system prompt) na frente do runtime | Contêiner `open-webui` publicado em `http://127.0.0.1:3000` |

No Compose deste repositório a UI recebe `OLLAMA_BASE_URL=http://ollama:11434`.
Esse nome de host só resolve **dentro** da rede Docker criada pelo Compose. Do
seu navegador você fala com a UI na porta **3000**; a UI, por sua vez, fala
com o Ollama pelo nome do serviço.

Se a UI estiver no ar mas `OLLAMA_BASE_URL` apontar para o lugar errado, o
sintoma clássico é chat vazio, erro de conexão com o modelo, ou lista de
modelos inexistente — com a home page ainda “bonita”.

Volumes persistentes:

- `ollama_data` — modelos baixados;
- `open_webui_data` — dados da UI (contas, históricos, knowledge).

Derrubar com `docker compose down` **sem** `-v` preserva esses volumes; com
`-v` você apaga modelos e histórico locais do lab.

---

## 3. Fluxo da aula (esquerda → direita)

```text
[1 Compose up] → [2 Modelo leve] → [3 Chat 3 turnos]
        → [4 Conteúdo seu] → [5 Divergente / falha] → [6 Down + runbook]
```

1. **Compose up** — imagens, rede, volumes; prova com `docker compose ps`.
2. **Modelo leve** — `tinyllama` ou equivalente pequeno em CPU; anote o id.
3. **Chat** — três turnos sobre a loja (frete, devolução, peça `p01`).
4. **Conteúdo seu** — upload ou system prompt a partir da mini-wiki; peça uma
   resposta que cite o trecho.
5. **Divergente** — uma falha deliberada (modelo ausente, URL errada, ou
   pergunta fora do corpus) e o check antes de confiar.
6. **Down + runbook** — parar o stack; preencher a tabela de operação.

A figura completa do fluxo permanece estável; cada bloco abaixo só aprofunda
o mesmo caminho.

---

## 4. Subir o stack

Na pasta do Compose:

```bash
cd material/open-webui
docker compose up -d
docker compose ps
```

Esperado: serviços `ollama` e `open-webui` em execução (ou reinício saudável).
UI: [http://127.0.0.1:3000](http://127.0.0.1:3000).

Na primeira subida o Docker pode demorar para puxar `ollama/ollama` e
`ghcr.io/open-webui/open-webui`. Não encerre o terminal no primeiro silêncio
longo sem olhar `docker compose ps` e `docker compose logs --tail=50`.

**Caminho B (máquina sem pull):** se a imagem não baixar, registre o erro
completo (`docker compose logs` + mensagem de rede/disco) e use o restante
desta página como leitura do contrato UI ↔ runtime, sem nota de interface.

---

## 5. Modelo pequeno em CPU

Prefira um modelo leve. Exemplos comuns em laboratório: `tinyllama`,
`phi3:mini`. Modelos grandes em CPU costumam gerar *timeout*, troca excessiva
ou OOM — isso é falha de **adequação do modelo à máquina**, não “UI quebrada”.

Pelo host (com o stack no ar):

```bash
docker compose exec ollama ollama pull tinyllama
docker compose exec ollama ollama list
```

Na UI, selecione o mesmo id de modelo. Três turnos sugeridos:

1. *Qual o prazo de devolução citado no material da loja?*
2. *E o frete para Tracunhaém?*
3. *A peça `p01` aparece no catálogo da mini-wiki?*

Guarde: id do modelo, se a UI listou o modelo **antes** do `pull`, e um
resumo de uma frase por turno (sem colar paredes de texto).

---

## 6. Ancorar no material da loja

Sem conteúdo seu, o modelo responde do parâmetro geral. Com conteúdo, a aula
exige disciplina de citação: a resposta deve poder apontar trecho ou arquivo
que você mesmo forneceu.

Fontes no repo (abra e escolha um parágrafo curto):

- [`mini-wiki-rag/frete.md`](mini-wiki-rag/frete.md)
- [`mini-wiki-rag/devolucao.md`](mini-wiki-rag/devolucao.md)
- [`mini-wiki-rag/catalogo-p01.md`](mini-wiki-rag/catalogo-p01.md)

Caminhos na UI (nomes variam conforme a versão da imagem; use o que existir):

- **Upload / Knowledge** de um `.md` da mini-wiki; ou
- **System prompt** colando um parágrafo integral de `frete.md` ou
  `devolucao.md`.

Peça de novo o prazo de devolução ou o frete e verifique se a resposta
reproduz (ou cita) o trecho injetado. Se o modelo “completa de cabeça” com
política inventada, registre isso como falha de ancoragem — a UI continua
verde.

Este bloco prepara o salto para as aulas de **RAG** e **llmwiki** no mesmo
caderno: lá o retrieve é explícito; aqui a ênfase é o contrato
interface ↔ runtime ↔ material colado.

---

## 7. Experimento: controle versus divergente

Congele o resto do stack. Mude **uma** variável por vez.

| Condição | O que fazer | O que observar |
| --- | --- | --- |
| **Controle** | Modelo leve listado; `OLLAMA_BASE_URL` padrão do Compose; pergunta coberta por `devolucao.md` injetado | Resposta utilizável; ps verde |
| **Divergente A** | Chat **antes** de qualquer `ollama pull` (ou modelo apagado da lista) | Erro / lista vazia; UI ainda abre |
| **Divergente B** | Pergunta deliberadamente **fora** do material injetado (“política de garantia estendida inventada”) | Fluência sem trecho sustentado → não confiar |
| **Divergente C** (opcional) | Alterar temporariamente `OLLAMA_BASE_URL` para um host inválido, recriar só o serviço da UI, depois **reverter** | UI no ar, geração indisponível |

Regra de inconclusivo: se o `pull` não terminou ou a máquina está em *thrash*
de CPU/memória, marque **INCONCLUSIVO** e documente recursos (`docker stats`
por um minuto) em vez de inventar métricas de qualidade do modelo.

Ao testar o divergente C, devolva o `docker-compose.yml` ao estado do
repositório antes de encerrar a aula (`git checkout -- material/open-webui/docker-compose.yml`
se tiver editado o arquivo versionado).

---

## 8. Falhas típicas e checks

| Sintoma | Parece | Check antes de confiar |
| --- | --- | --- |
| Home da UI abre, chat falha | “Rede / Docker quebrado” | `docker compose ps`; logs do `open-webui` e do `ollama`; URL `OLLAMA_BASE_URL` |
| Modelo não aparece na lista | Bug da UI | `docker compose exec ollama ollama list` no host |
| Resposta fluida, fato errado | Assistente “inteligente” | Confrontar com o `.md` injetado; se não estiver lá, recusar |
| Pull eterno / OOM | Stack “lento” | Trocar para modelo menor; não insistir em pesos grandes em CPU |
| Dados sumiram após `down -v` | Compose “apaga tudo sempre” | Confirmar se usou `-v`; volumes nomeados no YAML |

---

## 9. Runbook operacional

| Ação | Comando / caminho |
| --- | --- |
| Start | `docker compose up -d` em `material/open-webui/` |
| Status | `docker compose ps` |
| Logs | `docker compose logs --tail=80 open-webui ollama` |
| Pull modelo | `docker compose exec ollama ollama pull tinyllama` |
| Stop (mantém volumes) | `docker compose down` |
| Stop + apaga volumes do lab | `docker compose down -v` (destrutivo para modelos/históricos locais) |
| UI | `http://127.0.0.1:3000` |
| API Ollama (rede interna) | `http://ollama:11434` |

Não use opções `--force` em limpezas Docker neste lab. Se um comando exigir
forçar remoção, pare e registre o bloqueio.

---

## 10. Ritual ao vivo (ordem fixa)

1. `cd material/open-webui` → `docker compose up -d` → `docker compose ps`.
2. Abrir a UI; criar/entrar na conta local do lab se a imagem pedir.
3. `ollama pull` de modelo leve; confirmar na UI.
4. Três turnos da loja **sem** knowledge (baseline).
5. Injetar trecho da mini-wiki; repetir uma pergunta coberta pelo trecho.
6. Um divergente da tabela da seção 7; anotar o check.
7. `docker compose down` (sem `-v` salvo se a aula pedir reset limpo).
8. Preencher a entrega abaixo.

---

## 11. Entrega

Entregue um pacote curto (Markdown ou PDF da aula), sem segredos:

1. Saída de `docker compose ps` (ou captura equivalente).
2. Id do modelo e prova de `ollama list`.
3. Resumo dos três turnos (baseline) + um turno ancorado com indicação do
   arquivo/trecho usado.
4. Um divergente: o que mudou, o que quebrou, qual check aplicou.
5. Runbook preenchido (start/stop/volumes/falha típica em CPU).

Critério mínimo de fechamento: itens 1–4 presentes. UI verde sem modelo, sem
turnos ou sem divergente **não** fecha.

---

## 12. Irmã de trilha

- **LiteLLM** ([`tutorial-litellm-20261026.md`](tutorial-litellm-20261026.md)) —
  mesma família “falar API de chat”, porém SDK/proxy em vez de UI Compose.
- **RAG / llmwiki** — retrieve explícito sobre a mesma mini-wiki; use depois
  que o contrato UI ↔ runtime estiver sólido.

---

## Exercício (checklist)

- [ ] Stack no ar; `ps` anexado  
- [ ] Modelo leve puxado e selecionado na UI  
- [ ] Três turnos baseline + um turno ancorado na mini-wiki  
- [ ] Um divergente com check escrito  
- [ ] Runbook preenchido; stack derrubado ao final  

## Referência

- Compose: [`open-webui/docker-compose.yml`](open-webui/docker-compose.yml)
- Mini-wiki: [`mini-wiki-rag/`](mini-wiki-rag/)
- Imagens: `ollama/ollama`, `ghcr.io/open-webui/open-webui` (tags do YAML)
