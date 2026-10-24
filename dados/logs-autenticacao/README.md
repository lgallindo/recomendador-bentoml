# Logs sintéticos de autenticação

Exercício **à parte** do marketplace: sessões fictícias de autenticação para o
tutorial de associação em logs. Independente do catálogo, das cestas, de
`pedidos` e das vendas semanais (e do BentoML).

- `descoberta-20261017.jsonl`: 2000 sessões, 5900 eventos únicos e uma reentrega
  (bloco-base de 20 sessões repetido 100 vezes).
- `validacao-20261017.jsonl`: 1000 sessões, 2400 eventos únicos e uma reentrega
  (bloco-base de 10 sessões repetido 100 vezes).

Cada linha traz `event_id`, `timestamp` com fuso, `session_id` e `evento`
(sucesso, falha ou fluxo sem conclusão). IDs e datas são fictícios; o gerador
**não** inclui credenciais nem identificação de pessoas.

O gerador determinístico `python3 scripts/gerar_logs_autenticacao.py` reproduz
os dois arquivos (`FATOR = 100` no script). A repetição de uma falha com ID
diferente representa nova ocorrência; a repetição exata do mesmo ID representa
reentrega. As proporções do bloco-base permanecem; só a escala muda.

Contrato, limites, comandos e resolução estão no
[tutorial](../../material/tutorial-regras-associacao-logs-autenticacao-20261017.md).
