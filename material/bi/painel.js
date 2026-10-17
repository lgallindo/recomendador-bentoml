"use strict";

(() => {
  const dados = window.ASSOCIACAO;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432";
  const state = { selected: "p01->p02", group: [], all: false };
  const pct = n => n === null ? "—" : (100 * n).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";
  const num = n => n === null ? "—" : n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const setLabel = ids => "{" + ids.join(" + ") + "}";
  const label = r => setLabel(r.a) + " → " + setLabel(r.b);
  const fullLabel = r => r.antecedente + " → " + r.consequente;
  const baseName = b => b === "descoberta" ? "Descoberta" : "Avaliação separada";
  const metric = r => r[$("base").value];
  const selected = () => dados.regras.find(r => r.id === state.selected);
  const color = v => v === null ? "#e7ebed" : v < 1 ? "#f3c8b6" : v < 2 ? "#a8d6d0" : v < 3 ? "#337d86" : "#183f67";
  const passes = m => m.suporte >= .2 && m.confianca !== null && m.confianca >= .6 && m.lift !== null && m.lift > 1;

  function element(tag, text, parent, attrs = {}) {
    const e = document.createElement(tag);
    if (text !== null) e.textContent = text;
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (parent) parent.append(e);
    return e;
  }
  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }
  function text(parent, x, y, content, attrs = {}) {
    return svg("text", { x, y, fill: ink, "font-size": 13, ...attrs }, parent, content);
  }
  function interactive(node, name, action) {
    node.setAttribute("role", "button");
    node.setAttribute("tabindex", "0");
    node.setAttribute("aria-label", name);
    svg("title", {}, node, name);
    node.addEventListener("click", action);
    node.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); action(); }
    });
  }
  function choose(r) { state.selected = r.id; render(); }
  function groups(ids) { state.group = ids; renderGroup(); }

  function filters() {
    const s = $("suporte"), c = $("confianca"), l = $("lift");
    const valid = [s, c, l].every(e => e.value !== "" && e.checkValidity());
    $("erro-filtros").textContent = valid ? "" : "Informe proporções entre 0 e 100% e um limite de lift não negativo.";
    return { valid, s: Number(s.value) / 100, c: Number(c.value) / 100, l: Number(l.value) };
  }
  function visible() {
    const f = filters();
    if (!f.valid) return [];
    const query = $("busca").value.trim().toLocaleLowerCase("pt-BR");
    const rows = dados.regras.filter(r => {
      const m = metric(r);
      const match = (fullLabel(r) + " " + label(r)).toLocaleLowerCase("pt-BR").includes(query);
      return match && (state.all || (m.suporte >= f.s && m.confianca !== null && m.confianca >= f.c && m.lift !== null && m.lift > f.l));
    });
    const order = $("ordem").value;
    rows.sort((a, b) => order === "nome" ? fullLabel(a).localeCompare(fullLabel(b), "pt-BR") :
      ((metric(b)[order] ?? -Infinity) - (metric(a)[order] ?? -Infinity)) || a.id.localeCompare(b.id));
    return rows;
  }

  function renderDetail(rows) {
    const r = selected();
    $("titulo-regra").textContent = fullLabel(r);
    $("ids-regra").textContent = label(r);
    $("fora-filtro").textContent = rows.some(x => x.id === r.id) ? "" : "Regra selecionada fora dos filtros atuais; mantida para comparação.";
    const inverse = dados.regras.find(x => x.a.join("+") === r.b.join("+") && x.b.join("+") === r.a.join("+"));
    $("inverter").disabled = !inverse;
    $("inverter").textContent = inverse ? "Ver regra inversa" : "Regra inversa ausente da seleção original";
    $("inverter").onclick = () => inverse && choose(inverse);
    const body = $("comparacao").querySelector("tbody"); body.replaceChildren();
    for (const b of ["descoberta", "avaliacao"]) {
      const m = r[b], tr = element("tr", null, body);
      [baseName(b), m.total, m.na, m.nb, m.juntos, pct(m.suporte), pct(m.confianca), num(m.lift), passes(m) ? "Atende" : "Não atende"].forEach(v => element("td", String(v), tr));
    }
    const m = metric(r);
    $("formulas").textContent = `Na base exibida: suporte = ${m.juntos}/${m.total} = ${pct(m.suporte)}; confiança = ${m.juntos}/${m.na} = ${pct(m.confianca)}; lift = confiança ÷ (${m.nb}/${m.total}) = ${num(m.lift)}. “—” indica denominador zero; não significa valor zero.`;
    $("interpretacao").textContent = `${baseName($("base").value)}: ${m.juntos} de ${m.total} cestas contêm todos os itens dos dois lados. Entre ${m.na} cestas com o antecedente, ${m.juntos} incluem o consequente. Associação não demonstra o efeito de uma oferta.`;
    const plot = $("validacao"); plot.replaceChildren();
    const titles = ["Suporte", "Confiança", "Lift"];
    ["suporte", "confianca", "lift"].forEach((key, i) => {
      const x = 20 + i * 255, max = key === "lift" ? Math.max(1.2, (r.descoberta[key] ?? 0) * 1.2, (r.avaliacao[key] ?? 0) * 1.2) : 1;
      text(plot, x + 100, 25, titles[i], { "text-anchor": "middle", "font-weight": "bold" });
      svg("line", { x1: x, y1: 185, x2: x + 210, y2: 185, stroke: ink }, plot);
      if (key === "lift") {
        const y = 185 - 115 / max;
        svg("line", { x1: x, y1: y, x2: x + 210, y2: y, stroke: ink, "stroke-dasharray": "4 4" }, plot);
        text(plot, x + 210, y - 5, "Referência 1", { "text-anchor": "end", "font-size": 10 });
      }
      ["descoberta", "avaliacao"].forEach((b, j) => {
        const value = r[b][key], height = value === null ? 0 : value * 115 / max;
        svg("rect", { x: x + 15 + j * 100, y: 185 - height, width: 65, height, fill: j ? terra : teal }, plot);
        text(plot, x + 47 + j * 100, 176 - height, key === "lift" ? num(value) : pct(value), { "text-anchor": "middle", "font-weight": "bold" });
        text(plot, x + 47 + j * 100, 210, j ? "Avaliação" : "Descoberta", { "text-anchor": "middle", "font-size": 11 });
      });
    });
    text(plot, 390, 243, "Mesma regra em dois cenários sintéticos; não são resultados comerciais.", { "text-anchor": "middle", "font-size": 12 });
  }

  function renderScatter(rows) {
    const plot = $("dispersao"); plot.replaceChildren();
    const grouped = new Map();
    rows.filter(r => metric(r).confianca !== null).forEach(r => {
      const m = metric(r), key = `${m.suporte}|${m.confianca}`;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(r);
    });
    for (let i = 0; i <= 5; i++) {
      const x = 75 + i * 125, y = 325 - i * 56;
      svg("line", { x1: x, y1: 45, x2: x, y2: 325, stroke: "#e0e7e7" }, plot);
      svg("line", { x1: 75, y1: y, x2: 700, y2: y, stroke: "#e0e7e7" }, plot);
      text(plot, x, 350, `${i * 20}%`, { "text-anchor": "middle" });
      text(plot, 60, y + 5, `${i * 20}%`, { "text-anchor": "end" });
    }
    text(plot, 390, 380, "Suporte", { "text-anchor": "middle" });
    text(plot, 15, 30, "Confiança");
    grouped.forEach(rs => {
      const m = metric(rs[0]), values = rs.map(r => metric(r).lift).filter(x => x !== null);
      const max = values.length ? Math.max(...values) : null;
      const g = svg("g", {}, plot);
      const x = 75 + 625 * m.suporte, y = 325 - 280 * m.confianca;
      svg("circle", { cx: x, cy: y, r: 21, fill: color(max), stroke: rs.some(r => r.id === state.selected) ? terra : ink, "stroke-width": 3 }, g);
      text(g, x, y + 6, String(rs.length), { fill: max !== null && max >= 2 ? "white" : ink, "text-anchor": "middle", "font-size": 17, "font-weight": "bold" });
      interactive(g, `${rs.length} regras, suporte ${pct(m.suporte)}, confiança ${pct(m.confianca)}, maior lift ${num(max)}: ${rs.map(label).join("; ")}`, () => groups(rs.map(r => r.id)));
    });
    [["#f3c8b6", "< 1"], ["#a8d6d0", "1 a < 2"], ["#337d86", "2 a < 3"], ["#183f67", "≥ 3"]].forEach(([fill, name], i) => {
      svg("rect", { x: 220 + i * 115, y: 8, width: 14, height: 14, fill }, plot);
      text(plot, 240 + i * 115, 20, name, { "font-size": 11 });
    });
    if (!grouped.size) text(plot, 390, 180, "Sem regras com confiança definida nos filtros atuais.", { "text-anchor": "middle" });
  }

  function renderGroup() {
    const container = $("grupo"); container.replaceChildren();
    const rows = visible();
    const group = rows.filter(r => state.group.includes(r.id));
    element("p", group.length ? `${group.length} regras nesta seleção — escolha uma:` : "Selecione um ponto ou conjunto para listar suas regras.", container);
    group.forEach(r => {
      const m = metric(r), button = element("button", `${label(r)} · lift ${num(m.lift)}`, container, { type: "button" });
      button.onclick = () => choose(r);
    });
  }

  function renderMatrix(rows) {
    const plot = $("matriz"); plot.replaceChildren();
    const aa = [...new Set(rows.map(r => r.a.join(" + ")))].sort();
    const bb = [...new Set(rows.map(r => r.b.join(" + ")))].sort();
    const width = Math.max(650, 190 + bb.length * 85), height = Math.max(190, 100 + aa.length * 46);
    plot.setAttribute("viewBox", `0 0 ${width} ${height}`);
    text(plot, 20, 22, "A ↓ / B → · Lift", { "font-weight": "bold" });
    bb.forEach((b, j) => text(plot, 190 + j * 85, 48, b.replaceAll(" + ", "+"), { "text-anchor": "middle", "font-size": 12 }));
    aa.forEach((a, i) => {
      text(plot, 135, 85 + i * 46, a, { "text-anchor": "end", "font-size": 12 });
      bb.forEach((b, j) => {
        const r = rows.find(r => r.a.join(" + ") === a && r.b.join(" + ") === b);
        const value = r ? metric(r).lift : null, x = 155 + j * 85, y = 58 + i * 46;
        const g = svg("g", {}, plot);
        svg("rect", { x, y, width: 74, height: 40, rx: 4, fill: r ? color(value) : "#f0f2f4", stroke: r?.id === state.selected ? terra : "#d4dfdf", "stroke-width": r?.id === state.selected ? 3 : 1 }, g);
        text(g, x + 37, y + 26, r ? (value === null ? "n/d" : num(value)) : "—", { "text-anchor": "middle", fill: value !== null && value >= 2 ? "white" : ink });
        if (r) interactive(g, `${label(r)}, lift ${num(value)}`, () => choose(r));
      });
    });
    if (!rows.length) text(plot, 325, 100, "Nenhuma regra visível.", { "text-anchor": "middle" });
  }

  function renderNetwork(rows) {
    const plot = $("rede"); plot.replaceChildren();
    const aa = [...new Set(rows.map(r => r.a.join(" + ")))].sort();
    const bb = [...new Set(rows.map(r => r.b.join(" + ")))].sort();
    const height = Math.max(240, 90 + Math.max(aa.length, bb.length) * 56);
    plot.setAttribute("viewBox", `0 0 780 ${height}`);
    const defs = svg("defs", {}, plot);
    const marker = svg("marker", { id: "arrow", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" }, defs);
    svg("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: teal }, marker);
    text(plot, 115, 25, "Antecedentes", { "text-anchor": "middle", "font-weight": "bold" });
    text(plot, 660, 25, "Consequentes", { "text-anchor": "middle", "font-weight": "bold" });
    const y = (items, key) => 60 + items.indexOf(key) * (height - 100) / Math.max(1, items.length - 1);
    rows.forEach(r => {
      const a = r.a.join(" + "), b = r.b.join(" + "), m = metric(r);
      const edge = svg("path", { d: `M 192 ${y(aa, a)} C 365 ${y(aa, a)}, 415 ${y(bb, b)}, 578 ${y(bb, b)}`, fill: "none", stroke: r.id === state.selected ? terra : teal,
        "stroke-width": r.id === state.selected ? 5 : m.confianca === null ? 1 : 1.5 + 3 * m.confianca,
        "stroke-dasharray": m.confianca === null ? "4 4" : "none", opacity: r.id === state.selected ? 1 : .5, "marker-end": "url(#arrow)" }, plot);
      interactive(edge, `${label(r)}, confiança ${pct(m.confianca)}`, () => choose(r));
    });
    [[aa, 30, "a"], [bb, 585, "b"]].forEach(([items, x, side]) => items.forEach(key => {
      const cy = y(items, key), g = svg("g", {}, plot);
      svg("rect", { x, y: cy - 17, width: 160, height: 34, rx: 7, fill: "#e2efed", stroke: teal }, g);
      text(g, x + 80, cy + 5, `{${key}}`, { "text-anchor": "middle", "font-size": 12 });
      const related = rows.filter(r => r[side].join(" + ") === key);
      interactive(g, `${side === "a" ? "Antecedente" : "Consequente"} ${key}, ${related.length} regras`, () => {
        groups(related.map(r => r.id));
        $("grupo").scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }));
    if (!rows.length) text(plot, 390, 120, "Nenhuma regra visível.", { "text-anchor": "middle" });
  }

  function renderTable(rows) {
    const body = $("regras").querySelector("tbody"); body.replaceChildren();
    rows.forEach(r => {
      const m = metric(r), tr = element("tr", null, body);
      if (r.id === state.selected) tr.classList.add("selected");
      const td = element("td", null, tr), b = element("button", fullLabel(r), td, { type: "button" });
      b.onclick = () => choose(r);
      element("small", " " + label(r), td);
      [m.na, m.nb, m.juntos, pct(m.suporte), pct(m.confianca), num(m.lift)].forEach(v => element("td", String(v), tr));
    });
    $("estado").textContent = `${rows.length} regras visíveis de 14. Base: ${baseName($("base").value)}. ${state.all ? "Filtros métricos desativados; a busca continua ativa." : "Limites aplicados às métricas da base exibida."} “—” em uma métrica indica denominador zero.`;
  }

  function render() {
    const rows = visible();
    $("n-regras").textContent = rows.length;
    $("nome-base").textContent = baseName($("base").value);
    renderDetail(rows); renderScatter(rows); renderMatrix(rows); renderNetwork(rows); renderTable(rows); renderGroup();
  }
  function download(blob, name) {
    const url = URL.createObjectURL(blob), a = document.createElement("a");
    a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  $("csv").onclick = () => {
    const header = ["regra", "antecedente", "consequente", "base", "total_cestas", "contagem_antecedente", "contagem_consequente", "contagem_conjunta", "suporte", "confianca", "lift", "universo_regras", "filtro_suporte_minimo", "filtro_confianca_minima", "filtro_lift_maior_que", "busca"];
    const f = filters();
    const records = visible().map(r => {
      const m = metric(r);
      return [r.id, r.antecedente, r.consequente, $("base").value, m.total, m.na, m.nb, m.juntos, m.suporte, m.confianca, m.lift,
        14, state.all ? null : f.s, state.all ? null : f.c, state.all ? null : f.l, $("busca").value];
    });
    const lines = [header, ...records].map(row => row.map(v => `"${String(v ?? "").replaceAll('"', '""')}"`).join(",")).join("\r\n");
    download(new Blob(["\ufeff", lines], { type: "text/csv;charset=utf-8" }), `regras-${$("base").value}.csv`);
    $("export-status").textContent = "CSV exportado. Proporções usam ponto decimal; métricas indefinidas ficam vazias.";
  };
  document.querySelectorAll(".export").forEach(button => button.onclick = () => {
    const original = $(button.dataset.svg), copy = original.cloneNode(true);
    copy.setAttribute("xmlns", SVG);
    const box = original.viewBox.baseVal;
    copy.setAttribute("width", box.width); copy.setAttribute("height", box.height);
    copy.setAttribute("font-family", "Arial, sans-serif");
    const title = document.createElementNS(SVG, "text");
    title.setAttribute("x", "10"); title.setAttribute("y", "18");
    title.setAttribute("fill", ink); title.setAttribute("font-size", "12");
    title.textContent = `${baseName($("base").value)} · dados sintéticos`;
    // A identificação da base acompanha a figura exportada.
    copy.setAttribute("height", box.height + 30); copy.setAttribute("viewBox", `0 0 ${box.width} ${box.height + 30}`);
    title.setAttribute("y", box.height + 22); copy.append(title);
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml;charset=utf-8" }));
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas"); canvas.width = box.width * 2; canvas.height = (box.height + 30) * 2;
      const ctx = canvas.getContext("2d"); ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height); URL.revokeObjectURL(url);
      canvas.toBlob(blob => {
        if (blob) { download(blob, `${button.dataset.svg}-${$("base").value}.png`); $("export-status").textContent = "Figura PNG exportada com identificação da base sintética."; }
      }, "image/png");
    };
    image.onerror = () => { URL.revokeObjectURL(url); $("export-status").textContent = "Não foi possível exportar. Use as figuras PNG reproduzíveis indicadas no tutorial."; };
    image.src = url;
  });
  ["base", "busca", "suporte", "confianca", "lift", "ordem"].forEach(id => $(id).addEventListener("input", () => {
    if (["suporte", "confianca", "lift"].includes(id)) state.all = false;
    state.group = []; render();
  }));
  $("reset").onclick = () => {
    $("suporte").value = 20; $("confianca").value = 60; $("lift").value = 1; $("busca").value = "";
    state.all = false; state.group = []; render();
  };
  $("todas").onclick = () => { state.all = true; state.group = []; render(); };
  dados.produtos.forEach(p => { element("dt", p.id, $("produtos")); element("dd", p.nome, $("produtos")); });
  render();
})();
