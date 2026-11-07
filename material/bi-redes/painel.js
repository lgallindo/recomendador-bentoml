"use strict";

(() => {
  const dados = window.REDES;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432", cinza = "#8a9aa5";
  const corKnob = { base: ink, mais_epocas: teal, lr_maior: terra, mais_larga: "#7a5aa6" };
  const corRef = { media_treino: cinza, ingenua: "#c49a3a", ma4: teal, lms: "#7a5aa6" };
  const num = (n, dig = 2) => n === null || n === undefined || Number.isNaN(n)
    ? "—"
    : n.toLocaleString("pt-BR", { minimumFractionDigits: dig, maximumFractionDigits: dig });
  const media = xs => xs.reduce((a, b) => a + b, 0) / xs.length;

  function svg(tag, attrs, parent, content) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (content !== undefined) e.textContent = content;
    parent.append(e);
    return e;
  }
  function text(parent, x, y, content, attrs = {}) {
    return svg("text", { x, y, fill: ink, "font-size": 13, ...attrs }, parent, content);
  }
  function grade(plot, { w, h, padL, padR, padT, padB, maxY, minY = 0, ticks = 4, dig = 1 }) {
    const yScale = v => padT + (1 - (v - minY) / (maxY - minY)) * (h - padT - padB);
    for (let g = 0; g <= ticks; g++) {
      const yv = minY + (maxY - minY) * g / ticks;
      const y = yScale(yv);
      svg("line", { x1: padL, y1: y, x2: w - padR, y2: y, stroke: "#e0e7e7" }, plot);
      text(plot, padL - 8, y + 4, num(yv, dig), { "text-anchor": "end", "font-size": 11 });
    }
    return yScale;
  }
  function caminho(pts) {
    return pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  }

  const corrida = () => $("corrida").value;
  const knob = () => dados.knobs[corrida()];
  const refsMarcadas = () => [...document.querySelectorAll("#refs input:checked")].map(i => i.value);
  const observadoTeste = () => dados.observado.slice(dados.inicio_teste);

  function populate() {
    const sel = $("corrida");
    sel.replaceChildren();
    Object.keys(dados.knobs).forEach(k => {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = dados.nomes_knob[k];
      sel.append(o);
    });
    sel.value = "base";
    const refs = $("refs");
    refs.replaceChildren();
    Object.keys(dados.baselines).forEach(k => {
      const lab = document.createElement("label");
      lab.className = "check";
      const inp = document.createElement("input");
      inp.type = "checkbox";
      inp.value = k;
      inp.checked = k === "ma4";
      inp.addEventListener("change", render);
      lab.append(inp, " " + dados.nomes_baseline[k]);
      refs.append(lab);
    });
    const sem = $("semente");
    sem.replaceChildren();
    const om = document.createElement("option");
    om.value = "media";
    om.textContent = "Média das 5 sementes";
    sem.append(om);
    dados.profundidade.sementes.forEach((s, i) => {
      const o = document.createElement("option");
      o.value = String(i);
      o.textContent = `Semente ${s}`;
      sem.append(o);
    });
    sem.value = "media";
  }

  function renderSummary() {
    const k = knob();
    const marcadas = refsMarcadas();
    const chaves = marcadas.length ? marcadas : Object.keys(dados.baselines);
    const melhor = chaves.reduce((a, b) =>
      dados.baselines[a].mae_teste <= dados.baselines[b].mae_teste ? a : b);
    const ref = dados.baselines[melhor].mae_teste;
    $("mae-corrida").textContent = num(k.mae_teste, 3);
    $("mae-ref").textContent = `${num(ref, 3)} · ${dados.nomes_baseline[melhor]}`;
    const dif = k.mae_teste - ref;
    $("diferenca").textContent = (dif > 0 ? "+" : "") + num(dif, 3);
    $("leitura-perda").textContent =
      `${dados.nomes_knob[corrida()]}: perda inicial ${num(k.perda_epocas[0], 2)}, final ` +
      `${num(k.perda_epocas[k.perda_epocas.length - 1], 2)} após ${k.n_iter} épocas. ` +
      `A curva mede ${dados.nota_perda}; ela não mostra o teste.`;
    $("leitura-serie").textContent =
      `No teste, a corrida erra em média ${num(k.mae_teste, 2)} linha(s) de pedido por semana; ` +
      `${dados.nomes_baseline[melhor]} erra ${num(ref, 2)}. ` +
      (dif > 0 ? "A referência simples vence neste recorte." : "A corrida vence neste recorte de quatro semanas.");
  }

  function renderPerda() {
    const plot = $("perda");
    plot.replaceChildren();
    const w = 780, h = 320, padL = 55, padR = 150, padT = 25, padB = 45;
    const todas = Object.values(dados.knobs).flatMap(k => k.perda_epocas);
    const maxE = Math.max(...Object.values(dados.knobs).map(k => k.perda_epocas.length));
    const yScale = grade(plot, { w, h, padL, padR, padT, padB, maxY: Math.ceil(Math.max(...todas)) });
    const xScale = i => padL + (i / (maxE - 1)) * (w - padL - padR);
    Object.entries(dados.knobs).forEach(([nome, k], idx) => {
      const sel = nome === corrida();
      svg("path", {
        d: caminho(k.perda_epocas.map((v, i) => [xScale(i), yScale(v)])),
        fill: "none", stroke: corKnob[nome], "stroke-width": sel ? 3.4 : 1.6, opacity: sel ? 1 : 0.45,
      }, plot);
      text(plot, w - padR + 10, padT + 18 + idx * 20, dados.nomes_knob[nome].split(" (")[0], {
        fill: corKnob[nome], "font-size": 12, "font-weight": sel ? "bold" : "normal",
      });
    });
    text(plot, padL, h - 12, "época 1", { "font-size": 11 });
    text(plot, w - padR, h - 12, `época ${maxE}`, { "text-anchor": "end", "font-size": 11 });
  }

  function renderSerie() {
    const plot = $("serie");
    plot.replaceChildren();
    const w = 780, h = 340, padL = 55, padR = 30, padT = 30, padB = 50;
    const obs = dados.observado, n = obs.length, ini = dados.inicio_teste;
    const k = knob();
    const refs = refsMarcadas();
    const valores = [...obs, ...k.pred_teste, ...refs.flatMap(r => dados.baselines[r].pred_teste)];
    const yScale = grade(plot, { w, h, padL, padR, padT, padB, maxY: Math.ceil(Math.max(...valores) + 0.5) });
    const xScale = i => padL + (i + 0.5) * ((w - padL - padR) / n);
    const x0 = xScale(ini - 0.5);
    svg("rect", { x: x0, y: padT, width: w - padR - x0, height: h - padT - padB, fill: terra, opacity: 0.08 }, plot);
    text(plot, x0 + 6, padT + 14, "teste", { fill: terra, "font-size": 12, "font-weight": "bold" });
    text(plot, padL + 6, padT + 14, "treino (0–11)", { fill: teal, "font-size": 12, "font-weight": "bold" });
    svg("path", { d: caminho(obs.map((v, i) => [xScale(i), yScale(v)])), fill: "none", stroke: ink, "stroke-width": 2.4 }, plot);
    obs.forEach((v, i) => svg("circle", { cx: xScale(i), cy: yScale(v), r: 4.2, fill: ink }, plot));
    refs.forEach(r => {
      const pts = dados.baselines[r].pred_teste.map((v, j) => [xScale(ini + j), yScale(v)]);
      svg("path", { d: caminho(pts), fill: "none", stroke: corRef[r], "stroke-width": 2, "stroke-dasharray": "6 4" }, plot);
      pts.forEach(p => svg("circle", { cx: p[0], cy: p[1], r: 3.4, fill: corRef[r] }, plot));
    });
    const pts = k.pred_teste.map((v, j) => [xScale(ini + j), yScale(v)]);
    svg("path", { d: caminho(pts), fill: "none", stroke: corKnob[corrida()], "stroke-width": 3 }, plot);
    pts.forEach(p => svg("rect", { x: p[0] - 5, y: p[1] - 5, width: 10, height: 10, fill: corKnob[corrida()] }, plot));
    dados.semanas.forEach((s, i) => {
      if (i % 3 === 0 || i === n - 1) text(plot, xScale(i), h - 18, s.slice(5), { "text-anchor": "middle", "font-size": 10 });
    });
    let lx = padL + 120;
    [["observado", ink], [dados.nomes_knob[corrida()].split(" (")[0], corKnob[corrida()]],
     ...refs.map(r => [dados.nomes_baseline[r], corRef[r]])].forEach(([rot, cor]) => {
      svg("rect", { x: lx, y: padT + 4, width: 12, height: 12, fill: cor }, plot);
      text(plot, lx + 16, padT + 14, rot, { "font-size": 11 });
      lx += 26 + rot.length * 6.5;
    });
  }

  function barras(plot, itens, { w, h, padL = 55, padR = 30, padT = 30, padB = 55, linha }) {
    const maxV = Math.max(...itens.map(i => i.v)) * 1.25;
    const yScale = grade(plot, { w, h, padL, padR, padT, padB, maxY: maxV, dig: 2 });
    const passo = (w - padL - padR) / itens.length;
    itens.forEach((it, i) => {
      const x = padL + i * passo + passo * 0.18, bw = passo * 0.64, y = yScale(it.v);
      svg("rect", { x, y, width: bw, height: h - padB - y, fill: it.cor, opacity: it.fraco ? 0.45 : 1 }, plot);
      text(plot, x + bw / 2, y - 6, num(it.v, 2), { "text-anchor": "middle", "font-size": 12, "font-weight": "bold" });
      text(plot, x + bw / 2, h - padB + 18, it.rot, { "text-anchor": "middle", "font-size": 10.5 });
      if (it.sub) text(plot, x + bw / 2, h - padB + 32, it.sub, { "text-anchor": "middle", "font-size": 9.5, fill: cinza });
    });
    if (linha !== undefined) {
      svg("line", { x1: padL, y1: yScale(linha), x2: w - padR, y2: yScale(linha), stroke: ink, "stroke-dasharray": "5 4" }, plot);
    }
  }

  function renderMae() {
    const plot = $("mae");
    plot.replaceChildren();
    const itens = [
      ...Object.entries(dados.knobs).map(([nome, k]) => ({
        rot: dados.nomes_knob[nome].split(" (")[0], v: k.mae_teste, cor: corKnob[nome],
        fraco: nome !== corrida(), sub: "MLP",
      })),
      ...Object.entries(dados.baselines).map(([nome, b]) => ({
        rot: dados.nomes_baseline[nome], v: b.mae_teste, cor: cinza, fraco: !refsMarcadas().includes(nome), sub: "referência",
      })),
    ];
    barras(plot, itens, { w: 780, h: 320, linha: dados.baselines.ma4.mae_teste });
  }

  function renderProf() {
    const plot = $("prof");
    plot.replaceChildren();
    const w = 780, h = 340, padL = 55, padR = 40, padT = 30, padB = 50;
    const prof = dados.profundidade.profundidades;
    const sem = $("semente").value;
    const todos = prof.flatMap(p => [...p.mae_teste_sementes, p.mae_treino]);
    const minY = Math.floor(Math.min(...todos, 0.7) * 10) / 10, maxY = Math.ceil(Math.max(...todos) * 10) / 10;
    const yScale = grade(plot, { w, h, padL, padR, padT, padB, maxY, minY, dig: 2 });
    const maxP = 280;
    const xScale = p => padL + (p / maxP) * (w - padL - padR);
    [[dados.profundidade.mae_baseline_media, cinza, "média do treino"], [dados.baselines.ma4.mae_teste, teal, "MA(4)"]]
      .forEach(([v, cor, rot]) => {
        svg("line", { x1: padL, y1: yScale(v), x2: w - padR, y2: yScale(v), stroke: cor, "stroke-dasharray": "6 4" }, plot);
        text(plot, w - padR - 4, yScale(v) - 5, `${rot} ${num(v, 2)}`, { "text-anchor": "end", fill: cor, "font-size": 11 });
      });
    const linhaTreino = [];
    prof.forEach(p => {
      const x = xScale(p.n_params);
      p.mae_teste_sementes.forEach((v, i) => {
        const destaque = sem !== "media" && Number(sem) === i;
        svg("circle", { cx: x, cy: yScale(v), r: destaque ? 7 : 4.5, fill: terra, opacity: destaque ? 1 : 0.4 }, plot);
      });
      const yv = sem === "media" ? p.mae_teste_media : p.mae_teste_sementes[Number(sem)];
      svg("rect", { x: x - 6, y: yScale(yv) - 6, width: 12, height: 12, fill: ink, transform: `rotate(45 ${x} ${yScale(yv)})` }, plot);
      text(plot, x + 12, yScale(yv) + 4, num(yv, 2), { "font-size": 11, "font-weight": "bold" });
      linhaTreino.push([x, yScale(p.mae_treino)]);
      text(plot, x, h - 18, `${p.camadas} cam. · ${p.n_params} par.`, { "text-anchor": "middle", "font-size": 10.5 });
    });
    svg("path", { d: caminho(linhaTreino), fill: "none", stroke: teal, "stroke-width": 2 }, plot);
    text(plot, padL + 6, padT + 2, "◆ teste (escolha)  ● teste por semente  — treino (semente 0)", { "font-size": 11 });
    const ex = prof.map(p => `${p.camadas}: ${num(p.mae_teste_min, 2)}–${num(p.mae_teste_max, 2)}`).join("; ");
    $("leitura-prof").textContent =
      `Faixa de MAE de teste entre as 5 sementes, por número de camadas — ${ex}. ` +
      "As faixas se sobrepõem: com quatro semanas de teste, a semente pesa tanto quanto a profundidade.";
  }

  function renderFt() {
    const plot = $("ft");
    plot.replaceChildren();
    const ft = dados.fine_tune;
    const w = 780, h = 340, padT = 40, padB = 55;
    const g1 = svg("g", {}, plot);
    text(g1, 30, 20, "MAE no teste de p01", { "font-weight": "bold" });
    const itens = [
      { rot: "Pré-treino", v: ft.pretreino.mae_teste_p01_antes_ft, cor: cinza },
      { rot: "Fine-tune", v: ft.fine_tune.mae_teste_depois, cor: terra },
      { rot: "Do zero", v: ft.do_zero_so_p01.mae_teste, cor: teal },
    ];
    const sub = svg("svg", { x: 0, y: 0, width: 260, height: h, viewBox: `0 0 260 ${h}` }, plot);
    barras(sub, itens, { w: 260, h, padL: 45, padR: 10, padT, padB });
    const esq = ft.esquecimento;
    const pids = Object.keys(esq.mae_teste_outros_antes_ft);
    const x0 = 300, larg = w - x0 - 20;
    const maxV = Math.max(...pids.flatMap(p => [esq.mae_teste_outros_antes_ft[p], esq.mae_teste_outros_depois_ft[p]])) * 1.2;
    const yScale = v => padT + (1 - v / maxV) * (h - padT - padB);
    text(plot, x0, 20, "Esquecimento: MAE de teste dos outros 11 produtos", { "font-weight": "bold" });
    const passo = larg / pids.length;
    pids.forEach((p, i) => {
      const xa = x0 + i * passo + passo * 0.1, bw = passo * 0.38;
      [[esq.mae_teste_outros_antes_ft[p], cinza, 0], [esq.mae_teste_outros_depois_ft[p], terra, bw]].forEach(([v, cor, dx]) => {
        svg("rect", { x: xa + dx, y: yScale(v), width: bw, height: h - padB - yScale(v), fill: cor }, plot);
      });
      text(plot, xa + bw, h - padB + 16, p, { "text-anchor": "middle", "font-size": 10 });
    });
    svg("line", { x1: x0, y1: h - padB, x2: w - 20, y2: h - padB, stroke: ink }, plot);
    svg("rect", { x: x0, y: h - 22, width: 12, height: 12, fill: cinza }, plot);
    text(plot, x0 + 16, h - 12, `antes do fine-tune (média ${num(esq.media_antes, 2)})`, { "font-size": 11 });
    svg("rect", { x: x0 + 250, y: h - 22, width: 12, height: 12, fill: terra }, plot);
    text(plot, x0 + 266, h - 12, `depois (média ${num(esq.media_depois, 2)})`, { "font-size": 11 });
    $("leitura-ft").textContent =
      `Em p01, o fine-tune melhora o pré-treino (${num(itens[0].v, 2)} → ${num(itens[1].v, 2)}), ` +
      `mas o modelo treinado do zero só com p01 erra menos (${num(itens[2].v, 2)}). ` +
      `Treinável no fine-tune: ${ft.parametros.cabeca} de ${ft.parametros.total} parâmetros. ` +
      `Nos outros produtos, o MAE médio sobe de ${num(esq.media_antes, 2)} para ${num(esq.media_depois, 2)}: a cabeça compartilhada esqueceu.`;
  }

  function linhasTabela() {
    const k = knob(), obs = observadoTeste(), b = dados.baselines;
    return obs.map((y, j) => ({
      semana: dados.semanas[dados.inicio_teste + j],
      observado: y,
      corrida: k.pred_teste[j],
      erro: Math.abs(y - k.pred_teste[j]),
      media: b.media_treino.pred_teste[j],
      ma4: b.ma4.pred_teste[j],
      lms: b.lms.pred_teste[j],
    }));
  }

  function renderTabela() {
    const body = $("tabela").querySelector("tbody");
    body.replaceChildren();
    linhasTabela().forEach(r => {
      const tr = document.createElement("tr");
      [r.semana, num(r.observado, 0), num(r.corrida, 2), num(r.erro, 2), num(r.media, 2), num(r.ma4, 2), num(r.lms, 2)]
        .forEach(v => { const td = document.createElement("td"); td.textContent = v; tr.append(td); });
      body.append(tr);
    });
    $("estado").textContent = `p01 · ${dados.nomes_knob[corrida()]} · MAE ${num(knob().mae_teste, 3)}`;
  }

  function baixar(blob, nome, rotulo) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
    $("export-status").textContent = `${rotulo}: ${nome}`;
  }

  function exportCsv() {
    const linhas = [
      "week_start,observado,previsao_corrida,erro_abs,media_treino,ma4,lms,corrida",
      ...linhasTabela().map(r => [r.semana, r.observado, r.corrida, r.erro, r.media, r.ma4, r.lms, corrida()].join(",")),
    ];
    baixar(new Blob(["﻿" + linhas.join("\n")], { type: "text/csv;charset=utf-8" }),
      `redes-p01-${corrida()}.csv`, "CSV");
  }

  function exportPng(id) {
    const node = $(id);
    const xml = new XMLSerializer().serializeToString(node);
    const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
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
      canvas.toBlob(b => baixar(b, `redes-${id}-${corrida()}.png`, "PNG"));
    };
    img.src = url;
  }

  function render() {
    renderSummary();
    renderPerda();
    renderSerie();
    renderMae();
    renderProf();
    renderFt();
    renderTabela();
  }

  populate();
  ["corrida", "semente"].forEach(id => $(id).addEventListener("change", render));
  $("csv").addEventListener("click", exportCsv);
  $("reset").addEventListener("click", () => {
    $("corrida").value = "base";
    $("semente").value = "media";
    document.querySelectorAll("#refs input").forEach(i => { i.checked = i.value === "ma4"; });
    render();
  });
  document.querySelectorAll(".export[data-svg]").forEach(btn => btn.addEventListener("click", () => exportPng(btn.dataset.svg)));
  render();
})();
