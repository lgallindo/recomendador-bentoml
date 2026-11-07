"use strict";

(() => {
  const dados = window.BI_RAG;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432", ouro = "#d9a441";
  const coresTermo = [ink, teal, terra, ouro, "#6b8fa3", "#8c5a3c"];
  const stop = new Set(dados.stopwords);
  const num = (n, dig = 2) => n === null || n === undefined || Number.isNaN(n)
    ? "—"
    : n.toLocaleString("pt-BR", { minimumFractionDigits: dig, maximumFractionDigits: dig });

  // ---------- BM25 (mesma tokenização de scripts/avaliar_rag.py) ----------
  function tokenizar(texto) {
    return (texto.toLowerCase().match(/[0-9a-zà-ÿ]+/g) || [])
      .filter(t => !stop.has(t) && t.length > 1);
  }
  const tokens = Object.fromEntries(dados.paginas.map(p => [p.path, tokenizar(p.pesquisavel)]));
  const N = dados.paginas.length;
  const media = Object.values(tokens).reduce((s, t) => s + t.length, 0) / N;
  const df = termo => Object.values(tokens).filter(t => t.includes(termo)).length;
  const idf = termo => Math.log(1 + (N - df(termo) + 0.5) / (df(termo) + 0.5));

  function contribuicao(termo, path) {
    const toks = tokens[path];
    const tf = toks.filter(t => t === termo).length;
    const norm = 1 - dados.b + dados.b * toks.length / media;
    const valor = tf ? idf(termo) * tf * (dados.k1 + 1) / (tf + dados.k1 * norm) : 0;
    return { tf, df: df(termo), idf: idf(termo), norm: toks.length / media, valor };
  }

  function rankBm25(consulta) {
    const termos = [...new Set(tokenizar(consulta))];
    const saida = [];
    dados.paginas.forEach(p => {
      const det = {};
      termos.forEach(t => {
        const c = contribuicao(t, p.path);
        if (c.tf) det[t] = c;
      });
      const score = Object.values(det).reduce((s, c) => s + c.valor, 0);
      if (score > 0) saida.push({ path: p.path, score, termos: det });
    });
    saida.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
    saida.forEach(h => { h.snippet = trecho(h.path, termos); });
    return saida;
  }

  function trecho(path, termos, largura = 160) {
    const corpo = dados.paginas.find(p => p.path === path).corpo;
    const linhas = corpo.split("\n").filter(l => l.trim() && !l.startsWith("#"));
    const alvo = linhas.find(l => termos.some(t => l.toLowerCase().includes(t))) || linhas[0];
    return alvo.length > largura ? alvo.slice(0, largura) + "…" : alvo;
  }

  function intercalar(listas) {
    const vistos = new Set(), saida = [];
    const max = Math.max(0, ...listas.map(l => l.length));
    for (let i = 0; i < max; i++) {
      listas.forEach(l => {
        if (i < l.length && !vistos.has(l[i].path)) { vistos.add(l[i].path); saida.push(l[i]); }
      });
    }
    return saida;
  }

  // ---------- estado ----------
  const pronta = () => dados.perguntas.find(q => q.pergunta === $("consulta").value.trim());
  const k = () => Math.max(1, Math.min(8, parseInt($("k").value, 10) || 3));

  function subperguntas(consulta) {
    const q = dados.perguntas.find(p => p.pergunta === consulta.trim());
    if (q) return q.subperguntas;
    return consulta.split(/\s+e\s+|[?;,]/).map(s => s.trim()).filter(Boolean);
  }

  function ranking(recuperador, consulta, estrategia) {
    if (recuperador === "bm25") {
      if (estrategia === "subperguntas") return intercalar(subperguntas(consulta).map(rankBm25));
      return rankBm25(consulta);
    }
    const q = dados.perguntas.find(p => p.pergunta === consulta.trim());
    const pre = q && q.precalculado[recuperador];
    return pre ? pre[estrategia] : null;
  }

  function recall(topo, relevantes) {
    if (!relevantes.length) return null;
    const set = new Set(topo.map(h => h.path));
    return relevantes.filter(r => set.has(r)).length / relevantes.length;
  }

  function limpar(s) { return s.replaceAll(">>>", "").replaceAll("<<<", "").replace(/\s+/g, " ").trim(); }

  function montarPrompt(pergunta, hits) {
    const blocos = hits.map((h, i) => `[${i + 1}] (${h.path}) ${limpar(h.snippet)}`);
    return `INSTRUÇÃO: ${dados.instrucao}\n\nTRECHOS:\n` +
      (blocos.length ? blocos.join("\n") : "(nenhum trecho recuperado)") +
      `\n\nPERGUNTA: ${pergunta}`;
  }

  function resposta(pergunta, hits) {
    if (!hits.length) {
      return `Não encontrei trechos no corpus para «${pergunta}». O fato pode estar ausente da mini-wiki.`;
    }
    return [`Com base em ${hits.map(h => h.path).join(", ")}:`,
      ...hits.map(h => `- (${h.path}) ${limpar(h.snippet)}`)].join("\n");
  }

  // ---------- SVG ----------
  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([a, v]) => e.setAttribute(a, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }
  const texto = (p, x, y, c, attrs = {}) => svg("text", { x, y, fill: ink, "font-size": 13, ...attrs }, p, c);

  function desenharRanking(lista, recuperador, relevantes) {
    const node = $("ranking");
    node.replaceChildren();
    const linhas = lista || [];
    const h = Math.max(120, 50 + linhas.length * 34);
    node.setAttribute("viewBox", `0 0 780 ${h}`);
    if (!linhas.length) {
      texto(node, 20, 60, lista ? "Nenhuma página contém os termos da consulta." :
        "Pré-calculado só para as perguntas prontas. Use BM25 ao vivo para consultas livres.");
      return;
    }
    const x0 = 190, larg = 500;
    const max = Math.max(...linhas.map(l => l.score || 1));
    const termos = recuperador === "bm25"
      ? [...new Set(linhas.flatMap(l => Object.keys(l.termos)))] : [];
    linhas.forEach((l, i) => {
      const y = 30 + i * 34;
      const dentro = i < k();
      const g = svg("g", { opacity: dentro ? 1 : 0.35 }, node);
      const rel = relevantes.includes(l.path);
      texto(g, x0 - 10, y + 17, (rel ? "★ " : "") + l.path, { "text-anchor": "end", "font-weight": rel ? "bold" : "normal" });
      if (recuperador === "bm25") {
        let x = x0;
        termos.forEach((t, j) => {
          const c = l.termos[t];
          if (!c) return;
          const w = c.valor / max * larg;
          svg("rect", { x, y: y + 2, width: w, height: 22, fill: coresTermo[j % coresTermo.length] }, g);
          x += w;
        });
        texto(g, x + 6, y + 18, num(l.score, 2));
      } else if (recuperador === "llmwiki") {
        const w = l.score / max * larg;
        svg("rect", { x: x0, y: y + 2, width: w, height: 22, fill: ink }, g);
        texto(g, x0 + w + 6, y + 18, num(l.score, 2));
      } else {
        const w = (linhas.length - i) / linhas.length * larg;
        svg("rect", { x: x0, y: y + 2, width: w, height: 22, fill: terra }, g);
        texto(g, x0 + w + 6, y + 18, `posição ${i + 1}`);
      }
    });
    const yk = 30 + Math.min(k(), linhas.length) * 34 - 5;
    svg("line", { x1: 20, x2: 760, y1: yk, y2: yk, stroke: teal, "stroke-dasharray": "5 4" }, node);
    texto(node, 760, yk - 4, `corte k = ${k()}`, { "text-anchor": "end", fill: teal, "font-size": 11 });
    if (termos.length) {
      termos.forEach((t, j) => {
        const x = 20 + j * 120;
        svg("rect", { x, y: 6, width: 12, height: 12, fill: coresTermo[j % coresTermo.length] }, node);
        texto(node, x + 16, 17, t, { "font-size": 12 });
      });
    }
  }

  function desenharRecall(linhas) {
    const node = $("recall");
    node.replaceChildren();
    const x0 = 60, base = 250, alt = 200, w = 90;
    [0, 0.5, 1].forEach(v => {
      const y = base - v * alt;
      svg("line", { x1: x0, x2: 760, y1: y, y2: y, stroke: "#d4dfdf" }, node);
      texto(node, x0 - 8, y + 4, num(v, 1), { "text-anchor": "end", "font-size": 11 });
    });
    linhas.forEach((l, i) => {
      const x = x0 + 20 + i * 120;
      if (l.recall === null) {
        texto(node, x + w / 2, base - 20, l.absteve ? "absteve ✓" : "não absteve", {
          "text-anchor": "middle", "font-size": 12, fill: l.absteve ? teal : terra, "font-weight": "bold",
        });
      } else {
        const hgt = Math.max(2, l.recall * alt);
        svg("rect", { x, y: base - hgt, width: w, height: hgt, fill: l.recall < 1 ? terra : teal }, node);
        texto(node, x + w / 2, base - hgt - 6, num(l.recall, 1), { "text-anchor": "middle", "font-weight": "bold" });
      }
      texto(node, x + w / 2, base + 20, l.id, { "text-anchor": "middle", "font-size": 12 });
    });
  }

  // ---------- render ----------
  let linhasRecall = [];

  function render() {
    const consulta = $("consulta").value.trim();
    const rec = $("recuperador").value, est = $("estrategia").value;
    const q = pronta();
    const relevantes = q ? q.relevantes : [];
    const lista = ranking(rec, consulta, est);
    const hits = (lista || []).slice(0, k());

    $("kpi-hits").textContent = String(hits.length);
    const r = q ? recall(hits, relevantes) : null;
    $("kpi-recall").textContent = q && relevantes.length ? num(r, 2) : (q ? (hits.length ? "não absteve" : "absteve") : "—");
    const existentes = hits.filter(h => dados.paginas.some(p => p.path === h.path)).length;
    $("kpi-cit").textContent = `${existentes}/${hits.length}`;

    const nomes = { bm25: "BM25 ao vivo", fts: "FTS5", llmwiki: `llmwiki ${dados.llmwiki_versao || ""}`.trim() };
    $("leitura-ranking").textContent = lista === null
      ? "Sem ranking pré-calculado para esta consulta."
      : `${nomes[rec]} · ${est === "inteira" ? "pergunta inteira" : "subperguntas: " + subperguntas(consulta).join(" | ")} · ` +
        `${lista.length} páginas com algum termo; as ${Math.min(k(), lista.length)} primeiras vão para o prompt.` +
        (relevantes.length ? " ★ = página relevante no conjunto-ouro." : "");
    desenharRanking(lista, rec, relevantes);

    const corpo = $("termos").querySelector("tbody");
    corpo.replaceChildren();
    if (rec === "bm25" && lista) {
      lista.slice(0, k()).forEach(h => Object.entries(h.termos).forEach(([t, c]) => {
        const tr = document.createElement("tr");
        [h.path, t, c.tf, c.df, num(c.idf, 4), num(c.norm, 4), num(c.valor, 4)].forEach(v => {
          const td = document.createElement("td"); td.textContent = String(v); tr.append(td);
        });
        corpo.append(tr);
      }));
    } else {
      const tr = document.createElement("tr"), td = document.createElement("td");
      td.colSpan = 7; td.textContent = "O detalhe por termo existe só para o BM25 ao vivo.";
      tr.append(td); corpo.append(tr);
    }

    $("prompt").textContent = montarPrompt(consulta, hits);
    $("resposta").textContent = lista === null ? "—" : resposta(consulta, hits);

    const checks = $("checagens");
    checks.replaceChildren();
    const item = (txt, ok) => {
      const li = document.createElement("li");
      li.textContent = (ok ? "✓ " : "✗ ") + txt;
      if (!ok) li.className = "falha";
      checks.append(li);
    };
    if (lista !== null) {
      hits.forEach(h => item(`${h.path} existe no corpus`, dados.paginas.some(p => p.path === h.path)));
      relevantes.forEach(p => item(
        hits.some(h => h.path === p)
          ? `${p} está no prompt — o fato dela pode ser citado`
          : `${p} ficou fora do prompt — o fato dela não pode aparecer na resposta`,
        hits.some(h => h.path === p)));
      if (q && !relevantes.length) {
        item(hits.length ? "O corpus não responde a esta pergunta, mas vieram trechos: exija abstenção ou um limiar de score"
          : "Nenhum trecho: a resposta se abstém", !hits.length);
      }
    }

    linhasRecall = dados.perguntas.filter(p => p.id.startsWith("q")).map(p => {
      const l = ranking(rec, p.pergunta, est) || [];
      const topo = l.slice(0, k());
      return {
        id: p.id, pergunta: p.pergunta, relevantes: p.relevantes,
        topo: topo.map(h => h.path), recall: recall(topo, p.relevantes), absteve: topo.length === 0,
      };
    });
    desenharRecall(linhasRecall);
    const comResposta = linhasRecall.filter(l => l.recall !== null);
    const mediaR = comResposta.reduce((s, l) => s + l.recall, 0) / comResposta.length;
    $("leitura-recall").textContent =
      `${nomes[rec]}, ${est === "inteira" ? "pergunta inteira" : "subperguntas"}, k = ${k()}: ` +
      `recall médio ${num(mediaR, 2)} nas cinco perguntas com resposta; q6 ${linhasRecall.find(l => l.id === "q6").absteve ? "absteve" : "não absteve"}.`;
    const tb = $("tabela").querySelector("tbody");
    tb.replaceChildren();
    linhasRecall.forEach(l => {
      const tr = document.createElement("tr");
      [l.id, l.pergunta, l.relevantes.join(", ") || "(nenhuma)", l.topo.join(", ") || "(vazio)",
        l.recall === null ? (l.absteve ? "absteve" : "não absteve") : num(l.recall, 2)].forEach(v => {
        const td = document.createElement("td"); td.textContent = v; tr.append(td);
      });
      tb.append(tr);
    });
  }

  // ---------- exportação ----------
  function baixar(blob, nome) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
    $("export-status").textContent = `Arquivo: ${nome}`;
  }

  function exportCsv() {
    const esc = s => `"${String(s).replaceAll('"', '""')}"`;
    const linhas = ["id,pergunta,relevantes,top_k,recall_k,recuperador,estrategia,k",
      ...linhasRecall.map(l => [l.id, esc(l.pergunta), esc(l.relevantes.join(" ")), esc(l.topo.join(" ")),
        l.recall === null ? (l.absteve ? "absteve" : "nao_absteve") : l.recall.toFixed(4),
        $("recuperador").value, $("estrategia").value, k()].join(","))];
    baixar(new Blob(["﻿" + linhas.join("\n")], { type: "text/csv;charset=utf-8" }),
      `rag-recall-${$("recuperador").value}-k${k()}.csv`);
  }

  function exportSvg(svgId) {
    const node = $(svgId);
    const xml = new XMLSerializer().serializeToString(node);
    const img = new Image();
    img.onload = () => {
      const vb = node.viewBox.baseVal;
      const canvas = document.createElement("canvas");
      canvas.width = vb.width * 2;
      canvas.height = vb.height * 2;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => baixar(b, `rag-${svgId}-${$("recuperador").value}.png`));
    };
    img.src = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  }

  // ---------- início ----------
  function populate() {
    const sel = $("pronta");
    dados.perguntas.forEach(q => {
      const o = document.createElement("option");
      o.value = q.id;
      o.textContent = `${q.id} — ${q.pergunta}`;
      sel.append(o);
    });
  }

  function reset() {
    $("pronta").value = "q1";
    $("consulta").value = dados.perguntas[0].pergunta;
    $("recuperador").value = "fts";
    $("estrategia").value = "inteira";
    $("k").value = 3;
    render();
  }

  populate();
  $("pronta").addEventListener("change", () => {
    $("consulta").value = dados.perguntas.find(q => q.id === $("pronta").value).pergunta;
    render();
  });
  $("consulta").addEventListener("input", render);
  ["recuperador", "estrategia", "k"].forEach(id => $(id).addEventListener("change", render));
  $("k").addEventListener("input", render);
  $("reset").addEventListener("click", reset);
  $("csv").addEventListener("click", exportCsv);
  document.querySelectorAll(".export[data-svg]").forEach(b => b.addEventListener("click", () => exportSvg(b.dataset.svg)));
  window.BI_RAG_API = { rankBm25, tokenizar };
  reset();
})();
