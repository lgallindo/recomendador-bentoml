#!/usr/bin/env python3
"""Gera o deck HTML: cena → sinais → métricas → cesta → pipelines.

Storytelling (razão de ser): a loja já observa demanda e compras juntas;
transforma isso em sugestões ranqueadas na página do produto.

Tom afirmativo: o que o sistema É e FAZ.

    just slides
    # ou: uv run python scripts/gerar_slides.py
"""

from __future__ import annotations

import html
from pathlib import Path

SAIDA = Path(__file__).resolve().parent.parent / "slides" / "recomendador-bentoml.html"

# Cada item: (titulo, corpo_html) — corpo já em HTML interno (sem <section>).
SLIDES: list[tuple[str, str]] = [
    (
        "Recomendador no BentoML",
        """
<div class="lede">
  <p>A pessoa abre a página de um jarro de Tracunhaém.</p>
  <p>Embaixo: outras peças — mesma técnica, associação, demanda.</p>
  <p><strong>Ranqueador HTTP:</strong> produto da página → lista curta com score e motivo legível.</p>
</div>
<div class="row">
  <div class="card dark">
    <h3>Entrada</h3>
    <p class="mono">produto_na_pagina · limite · excluir</p>
  </div>
  <div class="card accent">
    <h3>Saída</h3>
    <p class="mono">items[] com score, reason, rank</p>
  </div>
</div>
""",
    ),
    (
        "Pacotes",
        """
<p class="sub">Baseline na raiz; pastas irmãs numeradas por complexidade (artefato e porta próprios).</p>
<div class="stack">
  <div class="card light"><p><strong>Raiz</strong> · porta :3000 · <span class="mono">recomendador</span><br>técnica + pop + cooc</p></div>
  <div class="card dark"><p><strong>01-variante-demografica/</strong> · porta :3001 · <span class="mono">recomendador-demo</span><br>perfil + compras por faixa</p></div>
  <div class="card light"><p><strong>02-variante-clustering/</strong> · porta :3002 · <span class="mono">recomendador-cluster</span><br>dendrograma + cesta ⊕ cluster</p></div>
  <div class="card dark"><p><strong>03-variante-embeddings/</strong> · porta :3003 · <span class="mono">recomendador-embed</span><br>encoder HF + cosseno semântico</p></div>
</div>
""",
    ),
    (
        "Sinais que a loja observa",
        """
<p class="sub">Antes de ranquear, a loja já acumula duas leituras do passado. Elas chegam ao recomendador como matéria-prima da nota.</p>
<div class="row">
  <div class="card light">
    <h3>Demanda</h3>
    <p>Quantas vezes cada peça já foi pedida. Mostra o que a vitrine costuma vender bem.</p>
  </div>
  <div class="card dark">
    <h3>Compra conjunta</h3>
    <p>Quais peças saíram na mesma compra. Mostra pares que andam juntos.</p>
  </div>
</div>
""",
    ),
    (
        "Métricas do projeto",
        """
<p class="sub">Linguagem comum da ordenação — o que cada número significa neste material.</p>
<div class="stack tight">
  <div class="card light"><p><strong>Popularidade</strong> — Quão pedido é cada produto no histórico da loja. Vira um peso na ordenação.</p></div>
  <div class="card dark"><p><strong>Co-ocorrência</strong> — Quão frequentemente dois produtos saem na mesma compra. Reforça pares que andam juntos.</p></div>
  <div class="card light"><p><strong>Score</strong> — Nota única que mistura esses sinais — e, nas variantes, sinais extras — para ranquear candidatos.</p></div>
  <div class="card dark"><p><strong>Reason</strong> — Rótulo legível do motivo da sugestão (<span class="mono">mesma_tecnica</span>, complemento, ou os das variantes).</p></div>
</div>
<p class="foot-note">01 demográfica = perfil; 02 clustering = grupo; 03 embeddings = encoder neural.</p>
""",
    ),
    (
        "Cesta de mercado",
        """
<p class="sub">Numa compra, a cesta é o conjunto de produtos que saíram juntos. O recomendador usa esse padrão para aprender associação entre itens: peças que compartilham compras tendem a se reforçar na co-ocorrência.</p>
<div class="card code">
  <p class="label">Estrutura: lista de cestas; cada cesta = lista de ids de produto</p>
<pre>"cestas": [
  ["p01", "p02", "p03"],
  ["p01", "p02"],
  ["p04", "p05", "p06"]
]</pre>
  <p class="muted">Ordem dentro da lista irrelevante — importa o par na mesma cesta.</p>
</div>
""",
    ),
    (
        "Métricas nos dados",
        """
<div class="row">
  <div class="card light">
    <h3>Popularidade (pop)</h3>
    <p>Parte da contagem de pedidos de cada produto.</p>
    <p class="mono">pop = pedidos / max(pedidos)</p>
    <p>Escala 0…1 no artefato. O serviço usa <span class="mono">pop</span> no score.</p>
  </div>
  <div class="card dark">
    <h3>Co-ocorrência (cooc)</h3>
    <p>Parte das cestas de mercado. Conta pares na mesma compra.</p>
    <p>Normaliza pelo parceiro mais frequente de cada item.</p>
    <p>Escala 0…1 no artefato.</p>
  </div>
</div>
""",
    ),
    (
        "Dois pipelines — treino e inferência",
        """
<p class="sub">Dois momentos distintos. Quem treina prepara o artefato; a vitrine consome a API.</p>
<div class="row">
  <div class="card accent">
    <h3>Treino · offline</h3>
    <ul>
      <li>MLOps: training / batch</li>
      <li>Comando: <span class="mono">just treino</span></li>
      <li>Arquivo: <span class="mono">treino.py</span></li>
      <li>Quem: operador (local, CI, job)</li>
      <li>Quando: catálogo ou regra muda</li>
      <li>Lê dados → pop e cooc → grava <span class="mono">recomendador:…</span></li>
    </ul>
  </div>
  <div class="card dark">
    <h3>Inferência · online</h3>
    <ul>
      <li>MLOps: inference / serving</li>
      <li>Comando: <span class="mono">just serve</span></li>
      <li>Arquivo: <span class="mono">service.py</span></li>
      <li>Quem: vitrine (cliente HTTP)</li>
      <li>Quando: cada página de produto</li>
      <li>Carrega artefato → <span class="mono">POST /recomendar</span> → JSON</li>
    </ul>
  </div>
</div>
""",
    ),
    (
        "Só o treino (offline)",
        """
<p class="sub">Ator: operador que prepara o artefato. A vitrine fica de fora deste momento.</p>
<div class="flow">
  <div class="card accent"><p><strong>1</strong><br>Operador<br><span class="mono">just treino</span></p></div>
  <div class="card dark"><p><strong>2</strong><br><span class="mono">treino.py</span><br>lê produtos + cestas</p></div>
  <div class="card accent"><p><strong>3</strong><br>Cálculo<br>pop e cooc</p></div>
  <div class="card dark"><p><strong>4</strong><br>Model store<br>grava artefato</p></div>
  <div class="card accent"><p><strong>5</strong><br>Saída<br>imprime tag</p></div>
</div>
<p class="foot-note">Este passo deixa o artefato pronto para o serviço carregar. Catálogo novo? Rode <span class="mono">just treino</span> de novo.</p>
""",
    ),
    (
        "Só a inferência (online)",
        """
<p class="sub">Sobe o serviço uma vez; depois a vitrine conversa com a API a cada página.</p>
<div class="card dark wide">
  <p class="mono">Uma vez: just serve → carrega recomendador:latest → processo HTTP no ar</p>
</div>
<div class="card light wide">
  <h3>Loop — cada página de produto</h3>
  <p>vitrine → <span class="mono">POST /recomendar</span> (pagina, limite, excluir)</p>
  <p><span class="mono">service.py</span> → aplica a regra sobre o artefato já carregado</p>
  <p>vitrine ← JSON (items, reason, score)</p>
  <p class="muted">A cada clique: usa o pickle pronto. O treino fica quieto.</p>
</div>
""",
    ),
    (
        "Artefato no meio — quem depende de quem",
        """
<p class="sub">Depois de separar os pipelines: a seta que os liga é o model store.</p>
<div class="flow">
  <div class="card light"><p class="mono">catalogo.json</p><p>dados/</p></div>
  <div class="card dark"><p class="mono">treino.py</p><p>pop + cooc</p></div>
  <div class="card accent"><p class="mono">model store</p><p>recomendador:…</p></div>
  <div class="card dark"><p class="mono">service.py</p><p>POST /recomendar</p></div>
  <div class="card light"><p class="mono">JSON</p><p>items[]</p></div>
</div>
<p class="foot-note">Esquerda do store = treino. Direita do store = inferência. A vitrine fala com <span class="mono">service.py</span>; o JSON de dados alimenta o treino.</p>
""",
    ),
    (
        "Algoritmo na inferência (baseline)",
        """
<ol class="steps">
  <li>Contexto — pagina, limite, excluir</li>
  <li>Mesma técnica — candidatos</li>
  <li>Score 0,7×pop + 0,3×cooc — ordena</li>
  <li>Complemento por popularidade se faltar vaga</li>
  <li>Resposta JSON (items, reason, rank)</li>
</ol>
""",
    ),
    (
        "API — POST /recomendar",
        """
<div class="row">
  <div class="card code">
    <h3>Entrada</h3>
    <pre>produto_na_pagina  string
limite              int (padrão 4)
excluir             lista de ids</pre>
    <p class="muted">A própria página fica de fora da lista de sugestões.</p>
  </div>
  <div class="card accent">
    <h3>Saída (sucesso)</h3>
    <p><span class="mono">items[]</span>: product_id, nome, tecnica, regiao, score, reason, rank</p>
    <p><span class="mono">complemento_usado</span> · strategy · modelo</p>
  </div>
</div>
<p class="mono muted">Id fora do catálogo → {"erro":"produto_inexistente","items":[]}</p>
""",
    ),
    (
        "Como subir — treino depois serve",
        """
<div class="row">
  <div class="card accent">
    <h3>Pipeline treino</h3>
    <p class="mono">just treino</p>
    <p>Lê <span class="mono">dados/catalogo.json</span>, grava no model store.</p>
    <p>Rode de novo quando o JSON ou a regra mudar.</p>
  </div>
  <div class="card dark">
    <h3>Pipeline inferência</h3>
    <p class="mono">just serve</p>
    <p class="mono">http://127.0.0.1:3000</p>
    <p class="mono">just curl-exemplo</p>
    <p class="mono">just curl-complemento</p>
    <p class="mono">just curl-inexistente</p>
  </div>
</div>
""",
    ),
    (
        "Exemplo p01 — jarro de Tracunhaém",
        """
<div class="row">
  <div class="card code">
    <p class="mono">just curl-exemplo</p>
<pre>{"produto_na_pagina":"p01",
 "limite":4,"excluir":[]}</pre>
    <p class="muted">Contas: <span class="mono">material/calculos-trabalhados.md</span></p>
  </div>
  <div class="card dark">
    <h3>Lista esperada</h3>
    <ol>
      <li>Prato · <span class="mono">mesma_tecnica</span></li>
      <li>Boneca · <span class="mono">mesma_tecnica</span></li>
      <li>Rendeira · complemento…</li>
      <li>Xilogravura · complemento…</li>
    </ol>
    <p><span class="mono">complemento_usado: true</span> — duas outras cerâmicas; as vagas restantes vêm da popularidade geral.</p>
  </div>
</div>
""",
    ),
    (
        "Nomes no código — offline | online",
        """
<div class="row">
  <div class="card code">
    <h3 class="mono">treino.py (offline)</h3>
<pre>catalogo → pedidos_brutos
  → max_pedidos → pop
cestas → conta → cooc
→ artefato recomendador</pre>
  </div>
  <div class="card accent">
    <h3 class="mono">service.py (online)</h3>
<pre>recomendar()
candidatos = mesma tecnica
score = 0.7*pop + 0.3*cooc
se faltar → complemento</pre>
  </div>
</div>
""",
    ),
    (
        "Literatura de recomendação",
        """
<table class="map">
  <tr><td class="mono">pop / pedidos_brutos</td><td>popularity baseline</td></tr>
  <tr><td class="mono">cooc / cestas</td><td>co-ocorrência item–item</td></tr>
  <tr><td class="mono">filtro por tecnica</td><td>filtragem por conteúdo</td></tr>
  <tr><td class="mono">0,7×pop + 0,3×cooc</td><td>híbrido ponderado (regra)</td></tr>
  <tr><td class="mono">complemento por pop</td><td>fallback / cobertura</td></tr>
  <tr><td class="mono">reason no JSON</td><td>explicabilidade por regra</td></tr>
  <tr><td class="mono">artefato + POST</td><td>offline compute + online inference</td></tr>
</table>
""",
    ),
    (
        "Data Science → Machine Learning",
        """
<p class="sub">Hoje: ciência de dados + serviço. Próximo passo: features, rótulo e métrica.</p>
<div class="row triple">
  <div class="card accent"><h3>Hoje</h3><p>Regra fixa 0,7 / 0,3<br>pickle de mapas<br>reason = nome da regra</p></div>
  <div class="card dark"><h3>Amanhã (ML)</h3><p>features + label<br>treino / validação<br>MAE · Precision@k</p></div>
  <div class="card light"><h3>Contrato HTTP</h3><p><span class="mono">POST /recomendar</span><br>mesmo I/O<br>muda a origem do score</p></div>
</div>
""",
    ),
    (
        "Variantes",
        """
<div class="stack">
  <div class="card dark"><p><strong>Baseline (raiz :3000)</strong><br>mesma técnica · 0,7 pop + 0,3 cooc · complemento</p></div>
  <div class="card light"><p><strong>01 Demográfica (:3001)</strong><br>cliente_id · demo = preferências + pop na faixa</p></div>
  <div class="card light"><p><strong>02 Clustering (:3002)</strong><br>ímpar=cesta · par=cluster · dendrograma ward k=4</p></div>
  <div class="card dark"><p><strong>03 Embeddings (:3003)</strong><br>SentenceTransformer · encode no serve · cosseno</p></div>
</div>
<p class="foot-note">Arco: regra → perfil → cluster local → encoder baixado. Predição de demanda → repo irmão <span class="mono">predicao-demanda-bentoml</span>.</p>
""",
    ),
    (
        "Empacote — inferência portátil",
        """
<p class="sub"><span class="mono">bentofile.yaml</span> congela service + deps + modelo. Container = empacote do pipeline online.</p>
<div class="card code">
<pre># depois de just treino
just imagem
just serve-container

# ou, equivalente:
uv run bentoml build
uv run bentoml containerize Recomendador:latest --image-tag recomendador:aula
docker run --rm -p 3000:3000 recomendador:aula serve

# mesmo POST /recomendar
just curl-exemplo</pre>
</div>
""",
    ),
]


CSS = """
:root {
  --tinta: #1a1a1a;
  --papel: #f7f5f0;
  --escuro: #1e2a2e;
  --acento: #0d7a6f;
  --claro: #ffffff;
  --apagado: #4a5558;
  --caixa: #e8f2f0;
  --codigo: #243236;
  --serif: Georgia, "Times New Roman", serif;
  --sans: "Segoe UI", Calibri, system-ui, sans-serif;
  --mono: Consolas, "Cascadia Mono", ui-monospace, monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body {
  height: 100%;
  background: #111;
  color: var(--tinta);
  font-family: var(--sans);
}
#deck {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.slide {
  display: none;
  flex-direction: column;
  justify-content: flex-start;
  height: 100%;
  width: 100%;
  padding: 3.2vh 5vw 4.5rem;
  background: var(--papel);
  position: absolute;
  inset: 0;
}
.slide.on { display: flex; }
.slide.dark { background: var(--escuro); color: var(--claro); }
.slide h1 {
  font-family: var(--serif);
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  font-weight: 700;
  margin-bottom: 1.2vh;
  line-height: 1.2;
}
.slide.dark h1 { color: var(--claro); }
.sub, .lede p {
  font-size: clamp(1rem, 1.6vw, 1.25rem);
  line-height: 1.45;
  margin-bottom: 0.7rem;
  color: var(--apagado);
}
.slide.dark .sub, .slide.dark .lede p { color: #d5e0de; }
.lede strong { color: inherit; }
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  margin-top: 1rem;
  flex: 1;
  align-content: start;
}
.row.triple { grid-template-columns: 1fr 1fr 1fr; }
.stack { display: flex; flex-direction: column; gap: 0.85rem; margin-top: 1rem; }
.stack.tight { gap: 0.55rem; }
.flow {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.6rem;
  margin-top: 1.2rem;
}
.card {
  border-radius: 0.7rem;
  padding: 1.1rem 1.2rem;
  border: 1px solid transparent;
}
.card.light { background: var(--caixa); border-color: var(--acento); }
.card.dark { background: var(--escuro); color: var(--claro); }
.card.accent { background: var(--acento); color: var(--claro); }
.card.code { background: var(--codigo); color: #b8e0d8; }
.card.wide { margin-top: 0.9rem; }
.card h3 {
  font-size: clamp(1.05rem, 1.5vw, 1.25rem);
  margin-bottom: 0.55rem;
}
.card p, .card li {
  font-size: clamp(0.95rem, 1.35vw, 1.15rem);
  line-height: 1.4;
}
.card ul { padding-left: 1.1rem; }
.card li { margin: 0.25rem 0; }
.mono { font-family: var(--mono); font-size: 0.95em; }
pre {
  font-family: var(--mono);
  font-size: clamp(0.9rem, 1.3vw, 1.1rem);
  line-height: 1.45;
  white-space: pre-wrap;
  margin: 0.5rem 0;
}
.label { color: #d5e0de; margin-bottom: 0.4rem; }
.muted { color: #9aa8ab; margin-top: 0.5rem; }
.foot-note {
  margin-top: auto;
  padding-top: 1rem;
  font-size: clamp(0.9rem, 1.2vw, 1.05rem);
  color: var(--apagado);
}
.slide.dark .foot-note { color: #9aa8ab; }
ol.steps {
  list-style: none;
  counter-reset: step;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}
ol.steps li {
  counter-increment: step;
  background: var(--caixa);
  border: 1px solid var(--acento);
  border-radius: 0.6rem;
  padding: 0.85rem 1.1rem;
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
  font-weight: 600;
}
ol.steps li:nth-child(odd) {
  background: var(--acento);
  color: var(--claro);
  border-color: transparent;
}
ol.steps li::before {
  content: counter(step) ". ";
}
table.map {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 0.45rem;
  margin-top: 1rem;
}
table.map td {
  padding: 0.65rem 0.9rem;
  font-size: clamp(0.95rem, 1.35vw, 1.15rem);
}
table.map td:first-child {
  width: 48%;
  background: var(--caixa);
  border: 1px solid var(--acento);
  border-radius: 0.5rem 0 0 0.5rem;
  font-family: var(--mono);
}
table.map td:last-child {
  background: var(--escuro);
  color: var(--claro);
  border-radius: 0 0.5rem 0.5rem 0;
}
table.map tr:nth-child(even) td:last-child { background: var(--acento); }
#bar {
  position: fixed;
  left: 0; right: 0; bottom: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 1.2rem;
  background: rgba(30, 42, 46, 0.92);
  color: #d5e0de;
  font-size: 0.85rem;
  z-index: 10;
  font-family: var(--sans);
}
#bar button {
  background: var(--acento);
  color: white;
  border: 0;
  border-radius: 0.35rem;
  padding: 0.35rem 0.75rem;
  cursor: pointer;
  font: inherit;
}
#bar .hint { opacity: 0.75; }
@media (max-width: 900px) {
  .row, .row.triple, .flow { grid-template-columns: 1fr; }
}
"""

JS = """
(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  let i = 0;
  const idx = document.getElementById("idx");
  function show(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    slides.forEach((s, k) => s.classList.toggle("on", k === i));
    idx.textContent = (i + 1) + " / " + slides.length;
    location.hash = String(i + 1);
  }
  function fromHash() {
    const n = parseInt(location.hash.replace("#", ""), 10);
    if (!Number.isNaN(n)) show(n - 1);
    else show(0);
  }
  document.getElementById("prev").onclick = () => show(i - 1);
  document.getElementById("next").onclick = () => show(i + 1);
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
      e.preventDefault(); show(i + 1);
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault(); show(i - 1);
    } else if (e.key === "Home") { show(0); }
    else if (e.key === "End") { show(slides.length - 1); }
  });
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
"""


def _esc(s: str) -> str:
    return html.escape(s, quote=True)


def build_html() -> str:
    parts: list[str] = [
        "<!DOCTYPE html>",
        '<html lang="pt-BR">',
        "<head>",
        '<meta charset="utf-8">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        "<title>Recomendador no BentoML</title>",
        f"<style>{CSS}</style>",
        "</head>",
        "<body>",
        '<div id="deck">',
    ]
    dark_titles = {
        "Recomendador no BentoML",
        "API — POST /recomendar",
        "Nomes no código — offline | online",
        "Empacote — inferência portátil",
    }
    for k, (title, body) in enumerate(SLIDES, start=1):
        cls = "slide dark" if title in dark_titles else "slide"
        parts.append(f'<section class="{cls}" data-i="{k}">')
        parts.append(f"<h1>{_esc(title)}</h1>")
        parts.append(body.strip())
        parts.append("</section>")
    parts.extend(
        [
            "</div>",
            '<div id="bar">',
            '<button type="button" id="prev" aria-label="Anterior">←</button>',
            '<span><span id="idx">1 / 1</span>'
            ' · cena → métricas → cesta → pipelines'
            ' · <span class="hint">← → · espaço · Home/End</span></span>',
            '<button type="button" id="next" aria-label="Próximo">→</button>',
            "</div>",
            f"<script>{JS}</script>",
            "</body>",
            "</html>",
            "",
        ]
    )
    return "\n".join(parts)


def main() -> None:
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    html_out = build_html()
    SAIDA.write_text(html_out, encoding="utf-8")
    print(f"escrito {SAIDA}  ({SAIDA.stat().st_size} bytes)  slides={len(SLIDES)}")


if __name__ == "__main__":
    main()
