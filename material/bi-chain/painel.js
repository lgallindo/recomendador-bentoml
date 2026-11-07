"use strict";

(() => {
  const dados = window.CHAIN_LOJA;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432", ambar = "#c98a1b";
  const NOMES = {
    entrada: "Entrada",
    extrair_id: "Extrair id",
    ferramenta_lookup: "Ferramenta",
    prompt: "Prompt",
    modelo: "Modelo",
    parser: "Parser",
  };
  let passo = 0;

  const caso = () => dados.casos[Number($("pergunta").value)];

  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }

  function estadoPasso(c, p) {
    if (p.passo === "ferramenta_lookup" && p.carga.erro) return "falha";
    if (p.passo === "parser" && p.carga && p.carga.ok === false) return "falha";
    if (p.passo === "extrair_id" && (!p.carga.achado_no_texto || c.alertas.some(a => a.startsWith("vários")))) return "alerta";
    return "ok";
  }

  function populate() {
    const sel = $("pergunta");
    dados.casos.forEach((c, i) => {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = c.pergunta;
      sel.append(o);
    });
    sel.value = "1";
  }

  function formatar(carga) {
    return typeof carga === "string" ? carga : JSON.stringify(carga, null, 2);
  }

  function renderFluxo() {
    const c = caso();
    const node = $("fluxo");
    node.replaceChildren();
    svg("rect", { x: 0, y: 0, width: 780, height: 150, fill: "white" }, node);
    const w = 104, gap = 24;
    c.passos.forEach((p, i) => {
      const x = 8 + i * (w + gap);
      const est = estadoPasso(c, p);
      const borda = est === "falha" ? terra : est === "alerta" ? ambar : (i === passo ? teal : "#9bafb4");
      svg("rect", {
        x, y: 40, width: w, height: 60, rx: 10,
        fill: i === passo ? "#e5f1f0" : "#f8fbfb", stroke: borda, "stroke-width": i === passo ? 4 : 2,
      }, node);
      svg("text", { x: x + w / 2, y: 75, "text-anchor": "middle", fill: ink, "font-size": 14, "font-weight": 700 }, node, NOMES[p.passo]);
      if (i < c.passos.length - 1) {
        svg("line", { x1: x + w + 2, y1: 70, x2: x + w + gap - 4, y2: 70, stroke: terra, "stroke-width": 3 }, node);
        svg("polygon", { points: `${x + w + gap - 4},64 ${x + w + gap + 2},70 ${x + w + gap - 4},76`, fill: terra }, node);
      }
      if (est !== "ok") {
        svg("text", { x: x + w / 2, y: 122, "text-anchor": "middle", fill: borda, "font-size": 12, "font-weight": 700 }, node,
          est === "falha" ? "falha" : "alerta");
      }
    });
    svg("text", { x: 8, y: 22, fill: ink, "font-size": 13 }, node, `“${c.pergunta}”`);
  }

  function renderPassos() {
    const c = caso();
    const box = $("passos");
    box.replaceChildren();
    c.passos.forEach((p, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "step " + (estadoPasso(c, p) === "ok" ? "" : estadoPasso(c, p));
      b.setAttribute("aria-pressed", String(i === passo));
      const s = document.createElement("strong");
      s.textContent = `${i + 1} · ${NOMES[p.passo]}`;
      b.append(s, document.createTextNode(resumo(p)));
      b.addEventListener("click", () => { passo = i; render(); });
      box.append(b);
    });
    const p = c.passos[passo];
    $("titulo-carga").textContent = `Carga que sai de “${NOMES[p.passo]}”`;
    $("carga").textContent = formatar(p.carga);
    $("posicao").textContent = `Passo ${passo + 1} de ${c.passos.length}`;
    $("anterior").disabled = passo === 0;
    $("proximo").disabled = passo === c.passos.length - 1;
  }

  function resumo(p) {
    const c = p.carga;
    switch (p.passo) {
      case "entrada": return "texto livre";
      case "extrair_id": return `pid = ${c.pid}${c.achado_no_texto ? "" : " (padrão)"}`;
      case "ferramenta_lookup": return c.erro ? c.erro : c.nome;
      case "prompt": return `${c.length} mensagens`;
      case "modelo": return "texto JSON bruto";
      case "parser": return c.ok ? "dict ok=true" : "dict ok=false";
      default: return "";
    }
  }

  function renderResumo() {
    const c = caso();
    const saida = c.passos[c.passos.length - 1].carga;
    $("k-produto").textContent = saida.produto || "—";
    $("k-ok").textContent = String(saida.ok);
    $("k-alertas").textContent = String(c.alertas.length);
    const ul = $("alertas");
    ul.replaceChildren();
    if (!c.alertas.length) {
      const li = document.createElement("li");
      li.textContent = "Nenhum alerta: o id veio do texto e existe no catálogo.";
      li.style.borderColor = teal;
      ul.append(li);
    }
    c.alertas.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a;
      if (a.startsWith("id inexistente")) li.className = "falha";
      ul.append(li);
    });
  }

  function renderTabela() {
    const tb = $("tabela").querySelector("tbody");
    tb.replaceChildren();
    dados.casos.forEach((c, i) => {
      const tr = document.createElement("tr");
      if (i === Number($("pergunta").value)) tr.className = "hit";
      const saida = c.passos[c.passos.length - 1].carga;
      [c.pergunta, c.passos[1].carga.pid, String(saida.ok), c.alertas.join("; ") || "—",
        c.saidas_identicas === null || c.saidas_identicas === undefined ? "não medido" : (c.saidas_identicas ? "sim" : "não")]
        .forEach(v => { const td = document.createElement("td"); td.textContent = v; tr.append(td); });
      tb.append(tr);
    });
  }

  function exportCsv() {
    const q = s => `"${String(s).replaceAll('"', '""')}"`;
    const lines = ["pergunta,pid,ok,produto,alertas,saidas_identicas"];
    dados.casos.forEach(c => {
      const saida = c.passos[c.passos.length - 1].carga;
      lines.push([q(c.pergunta), c.passos[1].carga.pid, saida.ok, saida.produto || "", q(c.alertas.join("; ")), c.saidas_identicas].join(","));
    });
    const blob = new Blob(["﻿" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "chain-loja-rastros.csv";
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
        a.download = `chain-loja-${svgId}-pergunta${Number($("pergunta").value) + 1}.png`;
        a.click();
        $("export-status").textContent = `PNG: ${a.download}`;
      });
    };
    img.src = url;
  }

  function render() {
    renderResumo();
    renderFluxo();
    renderPassos();
    renderTabela();
  }

  populate();
  $("pergunta").addEventListener("change", () => { passo = 0; render(); });
  $("reset").addEventListener("click", () => { $("pergunta").value = "1"; passo = 0; render(); });
  $("anterior").addEventListener("click", () => { if (passo > 0) { passo -= 1; render(); } });
  $("proximo").addEventListener("click", () => { if (passo < caso().passos.length - 1) { passo += 1; render(); } });
  $("csv").addEventListener("click", exportCsv);
  document.querySelectorAll("button.export").forEach(b => b.addEventListener("click", () => exportSvg(b.dataset.svg)));
  render();
})();
