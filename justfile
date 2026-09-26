# Baseline de recomendação no BentoML (esta pasta só)

treino:
    uv run python treino.py

serve:
    uv run bentoml serve service:Recomendador --reload

slides:
    uv run python scripts/gerar_slides.py

# Exemplos (com o serve no ar em :3000)
curl-ancora:
    curl -sS -X POST http://127.0.0.1:3000/recomendar \
      -H 'Content-Type: application/json' \
      -d '{"produto_ancora":"p01","limite":4,"excluir":[]}' | python3 -m json.tool

curl-fallback:
    # Âncora com poucos pares na técnica + exclusões → dispara fallback
    curl -sS -X POST http://127.0.0.1:3000/recomendar \
      -H 'Content-Type: application/json' \
      -d '{"produto_ancora":"p12","limite":4,"excluir":["p10","p11"]}' | python3 -m json.tool

curl-inexistente:
    curl -sS -X POST http://127.0.0.1:3000/recomendar \
      -H 'Content-Type: application/json' \
      -d '{"produto_ancora":"nao-existe","limite":4}' | python3 -m json.tool
