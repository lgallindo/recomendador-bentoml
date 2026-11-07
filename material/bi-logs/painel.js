"use strict";

(() => {
  const dados = window.BI_LOGS;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432", line = "#d4dfdf";
  const crit = dados.criterios;
  const FIXA = { antecedente: ["falha_senha"], consequente: ["desafio_mfa"] };
  const num = (n, dig = 2) => n === null || n === undefined || Number.isNaN(n)
    ? "—"
    : n.toLocaleString("pt-BR", { minimumFractionDigits: dig, maximumFractionDigits: dig });
  const pct = n => n === null || n === undefined ? "—" : `${num(n * 100, 1)}%`;
  const nome = ids => ids.map(i => dados.eventos[i]).join(" + ");
  const chave = r => `${r.antecedente.join("+")}→${r.consequente.join("+")}`;

  let selecionada = FIXA;
  let ponto = null; // [suporte, confianca] escolhido na dispersão

  function base() { return dados.cenarios[$("base").value]; }

  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }

  // Reconta uma regra qualquer a partir dos tipos de sessão da base.
  function recontar(regra, c) {
    const tem = (itens, ids) => ids.every(i => itens.includes(i));
    let na = 0, nb = 0, juntos = 0;
    c.padroes.forEach(p => {
      const a = tem(p.itens, regra.antecedente), b = tem(p.itens, regra.consequente);
      if (a) na += p.sessoes;
      if (b) nb += p.sessoes;
      if (a && b) juntos += p.sessoes;
    });
    const N = c.sessoes;
    const confianca = na ? juntos / na : null;
    const lift = na && nb ? confianca / (nb / N) : null;
    const suporte = juntos / N;
    const passa = suporte >= crit.suporte_minimo - 1e-12 && confianca !== null
      && confianca >= crit.confianca_minima - 1e-12 && lift !== null && lift > crit.lift_maior_que + 1e-12;
    return { N, na, nb, juntos, suporte, confianca, lift, passa };
  }

  function regrasVisiveis() {
    const filtro = $("contem").value;
    let regras = base().regras;
    if (filtro) regras = regras.filter(r => r.antecedente.includes(filtro) || r.consequente.includes(filtro));
    if (ponto) regras = regras.filter(r => Math.abs(r.suporte - ponto[0]) < 1e-6 && Math.abs(r.confianca - ponto[1]) < 1e-6);
    return regras;
  }

  // ---------- 02 · sessão ----------
  function renderSessao() {
    const c = base();
    const sid = $("sessao").value;
    const tb = $("linhas").querySelector("tbody");
    tb.replaceChildren();
    const vistos = new Set(), categorias = new Set();
    const linhas = c.amostra_linhas.map((r, i) => ({ ...r, linha: i + 1 })).filter(r => r.session_id === sid);
    const ultima = c.ultima_linha;
    if (ultima.session_id === sid) linhas.push({ ...ultima, linha: c.linhas, reentrega: true });
    linhas.forEach(r => {
      let leitura;
      if (vistos.has(r.event_id)) leitura = "reentrega: mesmo event_id, descartada";
      else if (categorias.has(r.evento)) leitura = "nova ocorrência da mesma categoria; presença já contada";
      else leitura = "categoria entra no conjunto";
      vistos.add(r.event_id);
      categorias.add(r.evento);
      const tr = document.createElement("tr");
      if (leitura.startsWith("reentrega")) tr.className = "descartada";
      [r.linha, r.event_id, r.timestamp, r.evento, leitura].forEach(v => {
        const td = document.createElement("td"); td.textContent = v; tr.append(td);
      });
      tb.append(tr);
    });
    const itens = [...categorias].sort();
    $("cesta").textContent = `{${itens.join(", ")}}`;
    const padrao = c.padroes.find(p => p.itens.join("+") === itens.join("+"));
    const repet = c.sessoes / c.bloco_base;
    $("tipo-sessao").textContent = padrao
      ? `${padrao.sessoes} das ${c.sessoes} sessões (${pct(padrao.sessoes / c.sessoes)}) têm exatamente esse conjunto. O arquivo repete o bloco-base de ${c.bloco_base} sessões ${repet} vezes.`
      : "";
    $("titulo-sessao").textContent = `Das linhas à transação · ${sid}`;
  }

  // ---------- 03 · tipos de sessão ----------
  function renderPadroes() {
    const c = base();
    const el = $("padroes");
    el.replaceChildren();
    const x0 = 440, larg = 250, h = 30;
    c.padroes.forEach((p, i) => {
      const y = 20 + i * (h + 8);
      const fr = p.sessoes / c.sessoes;
      const destaque = p.itens.includes("falha_senha") && p.itens.includes("desafio_mfa");
      svg("text", { x: x0 - 10, y: y + h / 2 + 4, "text-anchor": "end", fill: ink, "font-size": 11 }, el, nome(p.itens));
      svg("rect", { x: x0, y, width: Math.max(2, fr / 0.4 * larg), height: h, fill: destaque ? terra : teal, rx: 3 }, el);
      svg("text", { x: x0 + fr / 0.4 * larg + 6, y: y + h / 2 + 4, fill: ink, "font-size": 12 }, el, `${pct(fr)} · ${p.sessoes}`);
    });
    el.setAttribute("viewBox", `0 0 780 ${30 + c.padroes.length * (h + 8)}`);
  }

  // ---------- 04 · dispersão ----------
  function renderDispersao() {
    const c = base();
    const el = $("dispersao");
    el.replaceChildren();
    const L = 70, R = 740, T = 20, B = 310;
    const sx = s => L + (s - 0.15) / (0.8 - 0.15) * (R - L);
    const sy = v => B - (v - 0.55) / (1.05 - 0.55) * (B - T);
    [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].forEach(s => {
      svg("line", { x1: sx(s), x2: sx(s), y1: T, y2: B, stroke: line }, el);
      svg("text", { x: sx(s), y: B + 18, "text-anchor": "middle", fill: ink, "font-size": 12 }, el, `${Math.round(s * 100)}%`);
    });
    [0.6, 0.7, 0.8, 0.9, 1.0].forEach(v => {
      svg("line", { x1: L, x2: R, y1: sy(v), y2: sy(v), stroke: line }, el);
      svg("text", { x: L - 8, y: sy(v) + 4, "text-anchor": "end", fill: ink, "font-size": 12 }, el, `${Math.round(v * 100)}%`);
    });
    svg("line", { x1: sx(crit.suporte_minimo), x2: sx(crit.suporte_minimo), y1: T, y2: B, stroke: ink, "stroke-dasharray": "5 4" }, el);
    svg("line", { x1: L, x2: R, y1: sy(crit.confianca_minima), y2: sy(crit.confianca_minima), stroke: ink, "stroke-dasharray": "5 4" }, el);
    svg("text", { x: L + 120, y: B + 40, "text-anchor": "middle", fill: ink, "font-size": 13 }, el, "Suporte");
    svg("text", { x: 16, y: (T + B) / 2, "text-anchor": "middle", fill: ink, "font-size": 13, transform: `rotate(-90 16 ${(T + B) / 2})` }, el, "Confiança");
    const grupos = new Map();
    c.regras.forEach(r => {
      const k = `${r.suporte.toFixed(6)}|${r.confianca.toFixed(6)}`;
      const g = grupos.get(k) || { s: r.suporte, c: r.confianca, n: 0, lift: 0, temSel: false };
      g.n += 1; g.lift = Math.max(g.lift, r.lift);
      if (chave(r) === chave(selecionada)) g.temSel = true;
      grupos.set(k, g);
    });
    grupos.forEach(g => {
      const ativo = ponto && Math.abs(ponto[0] - g.s) < 1e-6 && Math.abs(ponto[1] - g.c) < 1e-6;
      const forte = g.lift >= 1.5;
      const grp = svg("g", { class: "ponto", tabindex: 0, role: "button",
        "aria-label": `${g.n} regras com suporte ${pct(g.s)} e confiança ${pct(g.c)}; maior lift ${num(g.lift)}` }, el);
      svg("circle", { cx: sx(g.s), cy: sy(g.c), r: 11 + 3 * g.n, fill: forte ? terra : "#f3e2c7",
        stroke: ativo || g.temSel ? teal : ink, "stroke-width": ativo || g.temSel ? 4 : 1.5 }, grp);
      svg("text", { x: sx(g.s), y: sy(g.c) + 4, "text-anchor": "middle", fill: forte ? "white" : ink,
        "font-size": 12, "font-weight": 700 }, grp, String(g.n));
      const escolher = () => { ponto = ativo ? null : [g.s, g.c]; render(); };
      grp.addEventListener("click", escolher);
      grp.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolher(); } });
    });
    svg("text", { x: R, y: B + 40, "text-anchor": "end", fill: ink, "font-size": 11 }, el, "terra: maior lift ≥ 1,5 · contorno verde: regra selecionada");
  }

  // ---------- 05 · regra ----------
  function renderRegra() {
    const r = selecionada;
    $("titulo-regra").textContent = `${nome(r.antecedente)} → ${nome(r.consequente)}`;
    const atual = recontar(r, base());
    const fixa = chave(r) === chave(FIXA) ? " Esta é a regra fixada antes de consultar a validação." : "";
    $("conta").textContent =
      `Nesta base: suporte = ${atual.juntos}/${atual.N} = ${pct(atual.suporte)}; ` +
      `confiança = ${atual.juntos}/${atual.na} = ${pct(atual.confianca)}; ` +
      `lift = (${atual.juntos}/${atual.na}) / (${atual.nb}/${atual.N}) ≈ ${num(atual.lift)}.` + fixa;
    const tb = $("comparacao").querySelector("tbody");
    tb.replaceChildren();
    [["descoberta", "Descoberta"], ["validacao", "Validação"]].forEach(([k, rot]) => {
      const m = recontar(r, dados.cenarios[k]);
      const tr = document.createElement("tr");
      [rot, m.N, m.na, m.nb, m.juntos, pct(m.suporte), pct(m.confianca), num(m.lift), m.passa ? "Sim" : "Não"].forEach(v => {
        const td = document.createElement("td"); td.textContent = v; tr.append(td);
      });
      tb.append(tr);
    });
  }

  // ---------- 06 · tabela ----------
  function renderTabela() {
    const regras = regrasVisiveis();
    const tb = $("tabela").querySelector("tbody");
    tb.replaceChildren();
    regras.forEach(r => {
      const tr = document.createElement("tr");
      tr.tabIndex = 0;
      if (chave(r) === chave(selecionada)) tr.className = "ativa";
      [nome(r.antecedente), nome(r.consequente), r.n_a, r.n_b, r.juntos, pct(r.suporte), pct(r.confianca), num(r.lift)].forEach(v => {
        const td = document.createElement("td"); td.textContent = v; tr.append(td);
      });
      const escolher = () => { selecionada = r; render(); };
      tr.addEventListener("click", escolher);
      tr.addEventListener("keydown", e => { if (e.key === "Enter") escolher(); });
      tb.append(tr);
    });
    const total = base().regras.length;
    $("estado").textContent = regras.length === total
      ? `${total} regras passam nos filtros nesta base.`
      : `${regras.length} de ${total} regras exibidas (filtro ativo).`;
  }

  function renderResumo() {
    const c = base();
    $("n-sessoes").textContent = c.sessoes.toLocaleString("pt-BR");
    $("n-regras").textContent = c.regras.length;
    $("lift-fixa").textContent = num(c.regra_fixa.lift);
  }

  function render() {
    renderResumo();
    renderSessao();
    renderPadroes();
    renderDispersao();
    renderRegra();
    renderTabela();
  }

  // ---------- exportação ----------
  function baixar(blob, arquivo) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = arquivo;
    a.click();
    $("export-status").textContent = `Arquivo: ${arquivo}`;
  }

  function exportCsv() {
    const cab = "antecedente,consequente,total_sessoes,n_a,n_b,juntos,suporte,confianca,lift";
    const linhas = regrasVisiveis().map(r => [r.antecedente.join(" + "), r.consequente.join(" + "), base().sessoes,
      r.n_a, r.n_b, r.juntos, r.suporte.toFixed(6), r.confianca.toFixed(6), r.lift.toFixed(6)].join(","));
    baixar(new Blob(["﻿" + [cab, ...linhas].join("\n")], { type: "text/csv;charset=utf-8" }),
      `logs-regras-${$("base").value}.csv`);
  }

  function exportSvg(id) {
    const node = $(id);
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
      canvas.toBlob(b => baixar(b, `logs-${id}-${$("base").value}.png`));
    };
    img.src = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
  }

  // ---------- início ----------
  function populateSessoes() {
    const c = base();
    const sel = $("sessao");
    const anterior = sel.value;
    sel.replaceChildren();
    [...new Set(c.amostra_linhas.map(r => r.session_id))].forEach(sid => {
      const o = document.createElement("option");
      o.value = sid; o.textContent = sid; sel.append(o);
    });
    const ids = [...sel.options].map(o => o.value);
    const equivalente = anterior ? `${$("base").value}-${anterior.split("-")[1]}` : "";
    sel.value = ids.includes(equivalente) ? equivalente : ids[0];
  }

  function populate() {
    const sel = $("contem");
    const todas = document.createElement("option");
    todas.value = ""; todas.textContent = "Qualquer evento"; sel.append(todas);
    Object.entries(dados.eventos).forEach(([k, v]) => {
      const o = document.createElement("option"); o.value = k; o.textContent = v; sel.append(o);
    });
    populateSessoes();
  }

  function reset() {
    $("base").value = "descoberta";
    $("contem").value = "";
    selecionada = FIXA;
    ponto = null;
    populateSessoes();
    $("sessao").value = "descoberta-0001";
    render();
  }

  populate();
  $("base").addEventListener("change", () => { ponto = null; populateSessoes(); render(); });
  $("contem").addEventListener("change", () => { ponto = null; render(); });
  $("sessao").addEventListener("change", render);
  $("reset").addEventListener("click", reset);
  $("csv").addEventListener("click", exportCsv);
  document.querySelectorAll(".export[data-svg]").forEach(b => b.addEventListener("click", () => exportSvg(b.dataset.svg)));
  window.BI_LOGS_API = { recontar };
  reset();
})();
