# Baseline de recomendação no BentoML

treino:
    uv run python treino.py

serve:
    uv run bentoml serve service:Recomendador --reload

slides:
    uv run python scripts/gerar_slides.py

# Exemplos (com o serve no ar em :3000)
curl-exemplo:
    # Cliente abriu o jarro de barro (p01)
    curl -sS -X POST http://127.0.0.1:3000/recomendar \
      -H 'Content-Type: application/json' \
      -d '{"produto_na_pagina":"p01","limite":4,"excluir":[]}' | python3 -m json.tool

curl-complemento:
    # Poucos da mesma técnica → completa com os mais pedidos
    curl -sS -X POST http://127.0.0.1:3000/recomendar \
      -H 'Content-Type: application/json' \
      -d '{"produto_na_pagina":"p12","limite":4,"excluir":["p10","p11"]}' | python3 -m json.tool

curl-inexistente:
    curl -sS -X POST http://127.0.0.1:3000/recomendar \
      -H 'Content-Type: application/json' \
      -d '{"produto_na_pagina":"nao-existe","limite":4}' | python3 -m json.tool
