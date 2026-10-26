"use strict";

(() => {
  const dados = window.DEMANDA_PERC;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432";
  const num = (n, dig = 2) => n === null || n === undefined
    ? "—"
    : n.toLocaleString("pt-BR", { minimumFractionDigits: dig, maximumFractionDigits: dig });

  function produto() { return dados.produtos.find(p => p.id === $("produto").value); }
  function metodo() { return produto().metodos[$("metodo").value]; }

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

  function populate() {
    const selP = $("produto");
    selP.replaceChildren();
    dados.produtos.forEach(p => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = `${p.id} — ${p.nome}`;
      selP.append(o);
    });
    selP.value = "p01";
    const selM = $("metodo");
    selM.replaceChildren();
    Object.entries(dados.nomes_metodo).forEach(([k, nome]) => {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = nome;
      selM.append(o);
    });
    selM.value = "lms";
  }

  function renderSummary() {
    const p = produto();
    const m = metodo();
    const chave = $("metodo").value;
    $("nome-produto").textContent = p.nome;
    $("mae-produto").textContent = num(m.mae, 3);
    $("mae-global").textContent = num(dados.mae_agregado[chave], 3);
    $("proxima").textContent = num(m.proxima, 2);
    $("titulo-serie").textContent = `Série — ${p.nome}`;
    let extra = "";
    if (chave === "lms") {
      extra = ` Pesos (treino 12 sem.): bias ${num(p.bias, 3)}, inclinação ${num(p.inclinacao, 4)}.`;
    }
    $("interpretacao").textContent =
      `${p.nome}: MAE ${m.nome} = ${num(m.mae, 3)}.` +
      ` Próxima = ${num(m.proxima, 2)}. Agregado = ${num(dados.mae_agregado[chave], 3)}.` + extra;
  }

  function seriePrevisoes(p, chave) {
    const serie = p.serie;
    if (chave === "lms") return serie.map(r => r.ajustado_lms);
    const janela = chave === "ingenua" ? 1 : 4;
    if (chave === "ma4" || chave === "ingenua") {
      return serie.map((_, i) => {
        if (i < janela) return null;
        const hist = serie.slice(i - janela, i).map(r => r.observado);
        return hist.reduce((a, b) => a + b, 0) / janela;
      });
    }
    // mq_batch: show LMS line as visual stand-in is wrong — use null then only observed
    // Better: reuse ajustado from a linear fit approximated by first/last — skip, show only observed + next
    return serie.map(() => null);
  }

  function renderSerie() {
    const plot = $("serie");
    plot.replaceChildren();
    const p = produto();
    const chave = $("metodo").value;
    const serie = p.serie;
    const previsoes = seriePrevisoes(p, chave);
    const prox = p.metodos[chave].proxima;
    const w = 780, h = 340, padL = 55, padR = 30, padT = 30, padB = 50;
    const ys = serie.map(r => r.observado);
    const vals = previsoes.filter(v => v !== null);
    const maxY = Math.max(...ys, ...vals, prox || 0, 1) * 1.25;
    const xScale = i => padL + i * ((w - padL - padR) / serie.length);
    const yScale = v => padT + (1 - v / maxY) * (h - padT - padB);

    for (let g = 0; g <= 4; g++) {
      const yv = maxY * g / 4;
      const y = yScale(yv);
      svg("line", { x1: padL, y1: y, x2: w - padR, y2: y, stroke: "#e0e7e7" }, plot);
      text(plot, padL - 8, y + 4, num(yv, 1), { "text-anchor": "end", "font-size": 11 });
    }
    const x0 = xScale(dados.n_semanas - dados.n_teste);
    svg("rect", {
      x: x0, y: padT, width: xScale(dados.n_semanas - 1) - x0 + 8, height: h - padT - padB,
      fill: terra, opacity: 0.08,
    }, plot);

    let dObs = "";
    ys.forEach((v, idx) => {
      const x = xScale(idx), y = yScale(v);
      dObs += (idx ? "L" : "M") + x + " " + y + " ";
      svg("circle", { cx: x, cy: y, r: 4.5, fill: ink }, plot);
    });
    svg("path", { d: dObs.trim(), fill: "none", stroke: ink, "stroke-width": 2.4 }, plot);

    let dPrev = "", started = false;
    previsoes.forEach((v, idx) => {
      if (v === null) return;
      const x = xScale(idx), y = yScale(v);
      dPrev += (started ? "L" : "M") + x + " " + y + " ";
      started = true;
      svg("circle", { cx: x, cy: y, r: 3.5, fill: teal }, plot);
    });
    if (dPrev) {
      svg("path", {
        d: dPrev.trim(), fill: "none", stroke: teal, "stroke-width": 2,
        "stroke-dasharray": "6 4",
      }, plot);
    }
    const xn = xScale(serie.length - 0.15), yn = yScale(prox);
    svg("circle", { cx: xn, cy: yn, r: 7, fill: terra }, plot);
    text(plot, xn, yn - 12, "próxima " + num(prox, 2), {
      "text-anchor": "middle", "font-size": 11, fill: terra, "font-weight": "bold",
    });
    serie.forEach((r, i) => {
      if (i % 3 === 0 || i === serie.length - 1) {
        text(plot, xScale(i), h - 18, r.week_start.slice(5), { "text-anchor": "middle", "font-size": 10 });
      }
    });
  }

  function renderMse() {
    const plot = $("mse");
    plot.replaceChildren();
    const mse = produto().mse_epocas;
    const w = 780, h = 280, padL = 55, padR = 30, padT = 30, padB = 45;
    const maxM = Math.max(...mse) * 1.15;
    const xScale = i => padL + i * ((w - padL - padR) / Math.max(mse.length - 1, 1));
    const yScale = v => padT + (1 - v / maxM) * (h - padT - padB);
    let d = "";
    mse.forEach((v, i) => {
      const x = xScale(i), y = yScale(v);
      d += (i ? "L" : "M") + x + " " + y + " ";
    });
    svg("path", { d: d.trim(), fill: "none", stroke: teal, "stroke-width": 2.2 }, plot);
    text(plot, w / 2, 18, `${mse.length} épocas · lr=${dados.lr}`, {
      "text-anchor": "middle", "font-size": 12,
    });
    text(plot, padL, h - 12, "1", { "font-size": 11 });
    text(plot, w - padR, h - 12, String(mse.length), { "text-anchor": "end", "font-size": 11 });
  }

  function renderMae() {
    const plot = $("mae");
    plot.replaceChildren();
    const chaves = Object.keys(dados.nomes_metodo);
    const maes = chaves.map(k => dados.mae_agregado[k]);
    const w = 780, h = 300, padL = 55, padR = 30, padT = 30, padB = 50;
    const maxM = Math.max(...maes) * 1.35;
    const barW = (w - padL - padR) / chaves.length * 0.5;
    const sel = $("metodo").value;
    chaves.forEach((k, i) => {
      const x = padL + (i + 0.5) * ((w - padL - padR) / chaves.length) - barW / 2;
      const bh = (maes[i] / maxM) * (h - padT - padB);
      const y = h - padB - bh;
      svg("rect", {
        x, y, width: barW, height: bh,
        fill: k === sel ? terra : (k === "lms" ? ink : teal),
      }, plot);
      text(plot, x + barW / 2, y - 8, num(maes[i], 3), {
        "text-anchor": "middle", "font-size": 12, "font-weight": "bold",
      });
      text(plot, x + barW / 2, h - 18, dados.nomes_metodo[k], {
        "text-anchor": "middle", "font-size": 10,
      });
    });
  }

  function renderTabela() {
    const body = $("tabela").querySelector("tbody");
    body.replaceChildren();
    const m = metodo();
    m.teste.forEach(r => {
      const tr = document.createElement("tr");
      [r.week_start, String(r.observado), num(r.previsao, 2), num(r.erro_abs, 2)].forEach(v => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.append(td);
      });
      body.append(tr);
    });
    $("estado").textContent =
      `${produto().nome} · ${m.nome} · MAE ${num(m.mae, 3)}`;
  }

  function exportCsv() {
    const m = metodo(), p = produto();
    const lines = [
      "week_start,observado,previsao,erro_abs,produto,metodo",
      ...m.teste.map(r =>
        [r.week_start, r.observado, r.previsao, r.erro_abs, p.id, $("metodo").value].join(",")),
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `demanda-perc-${p.id}-${$("metodo").value}.csv`;
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
        a.download = `demanda-perc-${svgId}-${produto().id}.png`;
        a.click();
        $("export-status").textContent = `PNG: ${a.download}`;
      });
    };
    img.src = url;
  }

  function render() {
    renderSummary();
    renderSerie();
    renderMse();
    renderMae();
    renderTabela();
  }

  populate();
  ["produto", "metodo"].forEach(id => $(id).addEventListener("change", render));
  $("csv").addEventListener("click", exportCsv);
  $("reset").addEventListener("click", () => {
    $("produto").value = "p01";
    $("metodo").value = "lms";
    render();
  });
  document.querySelectorAll(".export[data-svg]").forEach(btn => {
    btn.addEventListener("click", () => exportSvg(btn.dataset.svg));
  });
  render();
})();
