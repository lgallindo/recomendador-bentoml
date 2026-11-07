"use strict";

(() => {
  const dados = window.LLM_LOCAL;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432", apagado = "#c3ccd1";
  const W = 140, H = 64;

  function cenario() { return dados.cenarios.find(c => c.id === $("cenario").value); }
  function falhou(s) { return s.status === "recusada" || (typeof s.status === "number" && s.status >= 400); }

  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }

  function populate() {
    const sel = $("cenario");
    sel.replaceChildren();
    dados.cenarios.forEach(c => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.titulo;
      sel.append(o);
    });
    sel.value = "owui";
  }

  function populateSaltos() {
    const sel = $("salto");
    sel.replaceChildren();
    cenario().saltos.forEach((s, i) => {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = `${i + 1} · ${dados.nos[s.de].rotulo} → ${dados.nos[s.para].rotulo}`;
      sel.append(o);
    });
    sel.value = "0";
  }

  function renderSummary() {
    const c = cenario();
    const primeiro = c.saltos[0];
    $("status-final").textContent = String(primeiro.status);
    $("status-final").style.color = falhou(primeiro) ? terra : teal;
    $("n-saltos").textContent = String(c.saltos.length);
    const viaja = c.saltos.some(s => s.credencial.includes("OPENAI_API_KEY"));
    $("chave-provedor").textContent = viaja ? "sim, só no salto do proxy" : "não";
    $("titulo-caminho").textContent = `Caminho — ${c.titulo}`;
    $("resumo").textContent = c.resumo;
    $("licao").textContent = c.licao;
  }

  function renderCaminho() {
    const c = cenario();
    const alvo = $("caminho");
    alvo.replaceChildren();
    const defs = svg("defs", {}, alvo);
    [["ok", teal], ["erro", terra]].forEach(([id, cor]) => {
      const m = svg("marker", { id: `seta-${id}`, viewBox: "0 0 10 10", refX: 9, refY: 5,
        markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" }, defs);
      svg("path", { d: "M0,0 L10,5 L0,10 z", fill: cor }, m);
    });
    svg("rect", { x: 0, y: 0, width: 920, height: 340, fill: "white" }, alvo);
    const usados = new Set(c.saltos.flatMap(s => [s.de, s.para]));
    Object.entries(dados.nos).forEach(([id, no]) => {
      const ativo = usados.has(id);
      svg("rect", { x: no.x - W / 2, y: no.y - H / 2, width: W, height: H, rx: 10,
        fill: ativo ? "#fff1dc" : "#f2f4f5", stroke: ativo ? terra : apagado, "stroke-width": 2 }, alvo);
      svg("text", { x: no.x, y: no.y - 4, "text-anchor": "middle", "font-size": 14, "font-weight": 700,
        fill: ativo ? ink : "#8a9aa3" }, alvo, no.rotulo);
      svg("text", { x: no.x, y: no.y + 16, "text-anchor": "middle", "font-size": 11,
        fill: ativo ? ink : "#8a9aa3" }, alvo, no.sub);
    });
    const foco = Number($("salto").value);
    c.saltos.forEach((s, i) => {
      const a = dados.nos[s.de], b = dados.nos[s.para];
      const ruim = falhou(s);
      const cor = ruim ? terra : teal;
      svg("line", { x1: a.x + W / 2 + 2, y1: a.y, x2: b.x - W / 2 - 4, y2: b.y, stroke: cor,
        "stroke-width": i === foco ? 5 : 3, "stroke-dasharray": ruim ? "7 5" : "none",
        "marker-end": `url(#seta-${ruim ? "erro" : "ok"})` }, alvo);
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
      svg("circle", { cx: mx, cy: my, r: 13, fill: cor, stroke: "white", "stroke-width": 2 }, alvo);
      svg("text", { x: mx, y: my + 5, "text-anchor": "middle", "font-size": 13, "font-weight": 700,
        fill: "white" }, alvo, String(i + 1));
      svg("text", { x: mx + 18, y: my - 10, "text-anchor": "start", "font-size": 11, fill: cor,
        "font-weight": 700 }, alvo, String(s.status));
    });
  }

  function renderSalto() {
    const c = cenario();
    const s = c.saltos[Number($("salto").value)];
    $("titulo-salto").textContent =
      `Salto ${Number($("salto").value) + 1}: ${dados.nos[s.de].rotulo} → ${dados.nos[s.para].rotulo}`;
    $("nota-salto").textContent =
      `${s.rota} · porta ${s.porta} · credencial: ${s.credencial} · status ${s.status} (${s.origem}). ${s.nota}`;
    $("pedido").textContent = formatar(s.pedido);
    $("resposta").textContent = formatar(s.resposta);
  }

  function formatar(texto) {
    try { return JSON.stringify(JSON.parse(texto), null, 2); } catch { return texto; }
  }

  function renderTabela() {
    const corpo = $("tabela").querySelector("tbody");
    corpo.replaceChildren();
    cenario().saltos.forEach((s, i) => {
      const tr = document.createElement("tr");
      [String(i + 1), `${dados.nos[s.de].rotulo} → ${dados.nos[s.para].rotulo}`, s.rota, s.porta,
        s.credencial, String(s.status), s.origem].forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.append(td);
      });
      if (falhou(s)) tr.style.color = terra;
      corpo.append(tr);
    });
  }

  function csvCampo(v) { return `"${String(v).replaceAll('"', '""')}"`; }

  function exportCsv() {
    const c = cenario();
    const linhas = [
      "cenario,salto,de,para,rota,porta,credencial,status,origem",
      ...c.saltos.map((s, i) => [c.id, i + 1, s.de, s.para, s.rota, s.porta, s.credencial, s.status, s.origem]
        .map(csvCampo).join(",")),
    ];
    const blob = new Blob(["﻿" + linhas.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `caminho-${c.id}.csv`;
    a.click();
    $("export-status").textContent = `CSV: ${a.download}`;
  }

  function exportSvg(svgId) {
    const node = $(svgId);
    const xml = new XMLSerializer().serializeToString(node);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const vb = node.viewBox.baseVal;
      canvas.width = vb.width * 2;
      canvas.height = vb.height * 2;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(b => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `caminho-${cenario().id}.png`;
        a.click();
        $("export-status").textContent = `PNG: ${a.download}`;
      });
    };
    img.src = url;
  }

  function render() {
    renderSummary();
    renderCaminho();
    renderSalto();
    renderTabela();
  }

  populate();
  populateSaltos();
  $("cenario").addEventListener("change", () => { populateSaltos(); render(); });
  $("salto").addEventListener("change", () => { renderCaminho(); renderSalto(); });
  $("csv").addEventListener("click", exportCsv);
  $("reset").addEventListener("click", () => {
    $("cenario").value = "owui";
    populateSaltos();
    render();
  });
  document.querySelectorAll(".export[data-svg]").forEach(btn => {
    btn.addEventListener("click", () => exportSvg(btn.dataset.svg));
  });
  render();
})();
