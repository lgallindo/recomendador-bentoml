"use strict";

(() => {
  const dados = window.MEMORIA_LOJA;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432", ambar = "#c98a1b";
  const COR = { add: teal, search: ink, update: ambar, delete: terra };
  let atual = 10; // índice 0-based → turno 11

  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }

  // Igual ao script: re.split(r"\W+", query.lower()) com \W Unicode.
  const tokens = q => q.toLowerCase().split(/[^\p{L}\p{N}_]+/u).filter(Boolean);

  function buscar(store, consulta, user, sessao) {
    const ts = tokens(consulta);
    const hits = [];
    store.forEach(m => {
      if (m.user_id !== user) return;
      if ("session_id" in m && m.session_id !== (sessao || null)) return;
      const blob = m.memory.toLowerCase();
      const casaram = ts.filter(t => blob.includes(t));
      if (casaram.length || !ts.length) hits.push({ ...m, score: casaram.length, casaram });
    });
    hits.sort((a, b) => b.score - a.score);
    return hits;
  }

  function visiveis(store, user, sessao) {
    return store.filter(m => m.user_id === user && (!("session_id" in m) || m.session_id === (sessao || null)));
  }

  function populate() {
    dados.usuarios.forEach(u => {
      const o = document.createElement("option");
      o.value = u;
      o.textContent = u;
      $("usuario").append(o);
    });
  }

  function renderLinha() {
    const node = $("linha");
    node.replaceChildren();
    svg("rect", { x: 0, y: 0, width: 780, height: 170, fill: "white" }, node);
    const faixa = { aluno_demo: 60, outra_cliente: 120 };
    Object.entries(faixa).forEach(([u, y]) => {
      svg("line", { x1: 110, y1: y, x2: 770, y2: y, stroke: "#d4dfdf", "stroke-width": 10 }, node);
      svg("text", { x: 6, y: y + 4, fill: ink, "font-size": 12, "font-weight": 700 }, node, u);
    });
    const n = dados.turnos.length;
    dados.turnos.forEach((t, i) => {
      const x = 125 + i * (630 / (n - 1));
      const y = faixa[t.user_id];
      if (i === atual) svg("circle", { cx: x, cy: y, r: 15, fill: "none", stroke: terra, "stroke-width": 3 }, node);
      svg("circle", { cx: x, cy: y, r: 8, fill: COR[t.acao] }, node);
      svg("text", { x, y: 160, "text-anchor": "middle", fill: ink, "font-size": 11, "font-weight": i === atual ? 700 : 400 }, node, String(t.turno));
    });
    let lx = 120;
    Object.entries(COR).forEach(([a, c]) => {
      svg("circle", { cx: lx, cy: 18, r: 6, fill: c }, node);
      svg("text", { x: lx + 10, y: 22, fill: ink, "font-size": 12 }, node, a);
      lx += 90;
    });
  }

  function renderTurno() {
    const t = dados.turnos[atual];
    $("k-turno").textContent = String(t.turno);
    $("k-store").textContent = String(t.store_depois.length);
    const ctx = [t.user_id, t.session_id ? `sessão ${t.session_id}` : "", t.consulta ? `consulta “${t.consulta}”` : ""]
      .filter(Boolean).join(" · ");
    $("titulo-linha").textContent = `Turno ${t.turno} — ${t.acao}`;
    $("descricao").textContent = `${t.descricao} (${ctx})`;
    $("resultado").textContent = JSON.stringify(t.resultado, null, 2);
    $("posicao").textContent = `Turno ${t.turno} de ${dados.turnos.length}`;
    $("anterior").disabled = atual === 0;
    $("proximo").disabled = atual === dados.turnos.length - 1;
    const tb = $("store").querySelector("tbody");
    tb.replaceChildren();
    t.store_depois.forEach(m => {
      const tr = document.createElement("tr");
      [m.id, m.user_id, m.session_id || "—", m.memory, (m.historico || []).join(" | ") || "—"].forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.append(td);
      });
      tb.append(tr);
    });
  }

  function renderBusca() {
    const t = dados.turnos[atual];
    const user = $("usuario").value, sessao = $("sessao").value;
    const consulta = $("consulta").value;
    const hits = buscar(t.store_depois, consulta, user, sessao);
    const vis = visiveis(t.store_depois, user, sessao);
    $("k-hits").textContent = String(hits.length);
    $("explica").textContent =
      `Tokens da consulta: [${tokens(consulta).join(", ")}]. ` +
      `${vis.length} memória(s) visíveis para ${user}${sessao ? " na sessão " + sessao : " sem sessão"}; ` +
      `${hits.length} com score > 0.`;
    const node = $("scores");
    node.replaceChildren();
    const altura = Math.max(80, 30 + vis.length * 38);
    node.setAttribute("viewBox", `0 0 780 ${altura}`);
    svg("rect", { x: 0, y: 0, width: 780, height: altura, fill: "white" }, node);
    const maxT = Math.max(1, tokens(consulta).length);
    const porId = Object.fromEntries(hits.map(h => [h.id, h.score]));
    const lista = vis.length ? vis : [];
    if (!lista.length) svg("text", { x: 20, y: 45, fill: ink, "font-size": 14 }, node, "Nenhuma memória visível neste escopo.");
    lista.forEach((m, i) => {
      const y = 20 + i * 38;
      const s = porId[m.id] || 0;
      svg("text", { x: 10, y: y + 18, fill: ink, "font-size": 13, "font-weight": 700 }, node, m.id);
      svg("rect", { x: 50, y, width: 520, height: 24, fill: "#edf4f3", rx: 4 }, node);
      svg("rect", { x: 50, y, width: 520 * s / maxT, height: 24, fill: s ? teal : "#edf4f3", rx: 4 }, node);
      svg("text", { x: 580, y: y + 17, fill: ink, "font-size": 12 }, node, `score ${s} · ${m.memory.slice(0, 26)}${m.memory.length > 26 ? "…" : ""}`);
    });
    const tb = $("hits").querySelector("tbody");
    tb.replaceChildren();
    hits.forEach(h => {
      const tr = document.createElement("tr");
      [h.id, String(h.score), h.casaram.join(", ") || "—", h.memory].forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.append(td);
      });
      tb.append(tr);
    });
    return hits;
  }

  function exportCsv() {
    const t = dados.turnos[atual];
    const hits = buscar(t.store_depois, $("consulta").value, $("usuario").value, $("sessao").value);
    const q = s => `"${String(s).replaceAll('"', '""')}"`;
    const lines = ["turno,user_id,session_id,consulta,id,score,tokens,memoria",
      ...hits.map(h => [t.turno, $("usuario").value, $("sessao").value, q($("consulta").value), h.id, h.score, q(h.casaram.join(" ")), q(h.memory)].join(","))];
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `memoria-turno${t.turno}-busca.csv`;
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
        a.download = `memoria-${svgId}-turno${dados.turnos[atual].turno}.png`;
        a.click();
        $("export-status").textContent = `PNG: ${a.download}`;
      });
    };
    img.src = url;
  }

  function render() {
    renderLinha();
    renderTurno();
    renderBusca();
  }

  populate();
  ["usuario", "sessao"].forEach(id => $(id).addEventListener("change", renderBusca));
  $("consulta").addEventListener("input", renderBusca);
  $("anterior").addEventListener("click", () => { if (atual > 0) { atual -= 1; render(); } });
  $("proximo").addEventListener("click", () => { if (atual < dados.turnos.length - 1) { atual += 1; render(); } });
  $("reset").addEventListener("click", () => {
    atual = 10;
    $("usuario").value = "aluno_demo";
    $("sessao").value = "";
    $("consulta").value = "frete Recife";
    render();
  });
  $("csv").addEventListener("click", exportCsv);
  document.querySelectorAll("button.export").forEach(b => b.addEventListener("click", () => exportSvg(b.dataset.svg)));
  render();
})();
