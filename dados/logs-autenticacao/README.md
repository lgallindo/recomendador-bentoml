# Logs sintéticos de autenticação

Arquivos independentes dos dados do marketplace. Não são logs do BentoML nem
registros das compras, de `pedidos` ou das vendas semanais.

- `descoberta-20261017.jsonl`: 20 sessões, 59 eventos únicos e uma reentrega.
- `validacao-20261017.jsonl`: 10 sessões, 24 eventos únicos e uma reentrega.

Datas, IDs e eventos são fictícios. Cada linha contém `event_id`, `timestamp`
com fuso, `session_id` e `evento`. As sessões incluem sucesso, falhas e fluxos
sem conclusão. Não há identificação de pessoas ou credenciais.

O gerador determinístico `python3 scripts/gerar_logs_autenticacao.py` reproduz
os dois arquivos. A repetição de uma falha com ID diferente representa nova
ocorrência; a repetição exata do mesmo ID representa reentrega.

Contrato, limites, comandos e resolução estão no
[tutorial](../../material/tutorial-regras-associacao-logs-autenticacao-20261017.md).
