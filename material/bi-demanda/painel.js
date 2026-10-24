"use strict";

(() => {
  const dados = window.DEMANDA;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432";

  const num = (n, dig = 2) => n === null || n === undefined
    ? "—"
    : n.toLocaleString("pt-BR", { minimumFractionDigits: dig, maximumFractionDigits: dig });

  function produto() {
    return dados.produtos.find(p => p.id === $("produto").value);
  }
  function metodo() {
    return produto().metodos[$("janela").value];
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
    const selJ = $("janela");
    selJ.replaceChildren();
    Object.entries(dados.nomes_janela).forEach(([k, nome]) => {
      const o = document.createElement("option");
      o.value = k;
      o.textContent = nome;
      selJ.append(o);
    });
    selJ.value = "ma4";
  }

  function renderSummary() {
    const p = produto();
    const m = metodo();
    $("nome-produto").textContent = p.nome;
    $("mae-produto").textContent = num(m.mae, 3);
    $("mae-global").textContent = num(dados.mae_agregado[$("janela").value], 3);
    $("proxima").textContent = num(m.proxima, 2);
    $("titulo-serie").textContent = `Série e previsão — ${p.nome}`;
    $("titulo-erros").textContent = `Erros absolutos no teste — ${m.nome}`;
    $("interpretacao").textContent =
      `${p.nome} (${p.id}): MAE ${m.nome} = ${num(m.mae, 3)} nas ${dados.n_teste} semanas de teste. ` +
      `Previsão para a semana seguinte ao histórico: ${num(m.proxima, 2)} linhas. ` +
      `MAE agregado dos 12 produtos com este método: ${num(dados.mae_agregado[$("janela").value], 3)}.`;
  }

  function renderSerie() {
    const plot = $("serie");
    plot.replaceChildren();
    const p = produto();
    const chave = $("janela").value;
    const janela = p.metodos[chave].janela;
    const serie = p.serie;
    const w = 780, h = 340, padL = 55, padR = 30, padT = 30, padB = 50;
    const xs = serie.map((_, i) => i);
    const ys = serie.map(r => r.observado);
    const previsoes = serie.map((_, i) => {
      if (i < janela) return null;
      const hist = serie.slice(i - janela, i).map(r => r.observado);
      return hist.reduce((a, b) => a + b, 0) / janela;
    });
    const prox = p.metodos[chave].proxima;
    const maxY = Math.max(...ys, prox || 0, 1) * 1.25;
    const xScale = i => padL + i * ((w - padL - padR) / (serie.length));
    const yScale = v => padT + (1 - v / maxY) * (h - padT - padB);

    for (let g = 0; g <= 4; g++) {
      const yv = maxY * g / 4;
      const y = yScale(yv);
      svg("line", { x1: padL, y1: y, x2: w - padR, y2: y, stroke: "#e0e7e7" }, plot);
      text(plot, padL - 8, y + 4, num(yv, 1), { "text-anchor": "end", "font-size": 11 });
    }
    // test window background
    const x0 = xScale(dados.n_semanas - dados.n_teste);
    const x1 = xScale(dados.n_semanas - 1);
    svg("rect", {
      x: x0, y: padT, width: x1 - x0 + 8, height: h - padT - padB,
      fill: terra, opacity: 0.08,
    }, plot);

    // observed line
    let dObs = "";
    xs.forEach((i, idx) => {
      const x = xScale(i), y = yScale(ys[idx]);
      dObs += (idx ? "L" : "M") + x + " " + y + " ";
      svg("circle", { cx: x, cy: y, r: 4.5, fill: ink }, plot);
    });
    svg("path", { d: dObs.trim(), fill: "none", stroke: ink, "stroke-width": 2.4 }, plot);

    // forecast line
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
    // next week point
    const xn = xScale(serie.length - 0.15);
    const yn = yScale(prox);
    svg("circle", { cx: xn, cy: yn, r: 7, fill: terra }, plot);
    text(plot, xn, yn - 12, "próxima " + num(prox, 2), {
      "text-anchor": "middle", "font-size": 11, fill: terra, "font-weight": "bold",
    });

    serie.forEach((r, i) => {
      if (i % 3 === 0 || i === serie.length - 1) {
        text(plot, xScale(i), h - 18, r.week_start.slice(5), {
          "text-anchor": "middle", "font-size": 10,
        });
      }
    });
    text(plot, w / 2, 18, "Faixa sombreada = semanas de teste walk-forward", {
      "text-anchor": "middle", "font-size": 12, fill: terra,
    });
  }

  function renderErros() {
    const plot = $("erros");
    plot.replaceChildren();
    const m = metodo();
    const rows = m.teste;
    const w = 780, h = 280, padL = 50, padR = 30, padT = 35, padB = 45;
    const maxE = Math.max(...rows.map(r => r.erro_abs), 0.1) * 1.35;
    const barW = (w - padL - padR) / rows.length * 0.55;
    rows.forEach((r, i) => {
      const x = padL + (i + 0.5) * ((w - padL - padR) / rows.length) - barW / 2;
      const bh = (r.erro_abs / maxE) * (h - padT - padB);
      const y = h - padB - bh;
      svg("rect", { x, y, width: barW, height: bh, fill: teal }, plot);
      text(plot, x + barW / 2, y - 6, num(r.erro_abs, 2), {
        "text-anchor": "middle", "font-size": 12, "font-weight": "bold",
      });
      text(plot, x + barW / 2, h - 18, r.week_start.slice(5), {
        "text-anchor": "middle", "font-size": 11,
      });
    });
    const maeY = h - padB - (m.mae / maxE) * (h - padT - padB);
    svg("line", {
      x1: padL, y1: maeY, x2: w - padR, y2: maeY,
      stroke: terra, "stroke-width": 2, "stroke-dasharray": "5 4",
    }, plot);
    text(plot, w - padR, maeY - 6, "MAE " + num(m.mae, 3), {
      "text-anchor": "end", fill: terra, "font-size": 12, "font-weight": "bold",
    });
  }

  function renderMae() {
    const plot = $("mae");
    plot.replaceChildren();
    const chaves = Object.keys(dados.nomes_janela);
    const maes = chaves.map(k => dados.mae_agregado[k]);
    const w = 780, h = 300, padL = 55, padR = 30, padT = 30, padB = 50;
    const maxM = Math.max(...maes) * 1.35;
    const barW = (w - padL - padR) / chaves.length * 0.5;
    const selecionada = $("janela").value;
    chaves.forEach((k, i) => {
      const x = padL + (i + 0.5) * ((w - padL - padR) / chaves.length) - barW / 2;
      const bh = (maes[i] / maxM) * (h - padT - padB);
      const y = h - padB - bh;
      svg("rect", {
        x, y, width: barW, height: bh,
        fill: k === selecionada ? terra : (k === "ingenua" ? "#c47a5a" : teal),
      }, plot);
      text(plot, x + barW / 2, y - 8, num(maes[i], 3), {
        "text-anchor": "middle", "font-size": 12, "font-weight": "bold",
      });
      text(plot, x + barW / 2, h - 18, dados.nomes_janela[k], {
        "text-anchor": "middle", "font-size": 12,
      });
    });
    text(plot, w / 2, 18, "48 previsões (12 produtos × 4 semanas); menor é melhor", {
      "text-anchor": "middle", "font-size": 12,
    });
  }

  function renderTabela() {
    const body = $("tabela").querySelector("tbody");
    body.replaceChildren();
    const m = metodo();
    m.teste.forEach(r => {
      const tr = document.createElement("tr");
      [r.week_start, String(r.observado), num(r.previsao, 2), num(r.erro_abs, 2)]
        .forEach(v => {
          const td = document.createElement("td");
          td.textContent = v;
          tr.append(td);
        });
      body.append(tr);
    });
    $("estado").textContent =
      `${produto().nome} · ${m.nome} · ${m.teste.length} semanas de teste · MAE ${num(m.mae, 3)}`;
  }

  function exportCsv() {
    const m = metodo();
    const p = produto();
    const lines = [
      "week_start,observado,previsao,erro_abs,produto,metodo",
      ...m.teste.map(r =>
        [r.week_start, r.observado, r.previsao, r.erro_abs, p.id, $("janela").value].join(",")),
    ];
    const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `demanda-${p.id}-${$("janela").value}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    $("export-status").textContent = `CSV exportado: ${a.download}`;
  }

  function exportSvg(svgId) {
    const node = $(svgId);
    const xml = new XMLSerializer().serializeToString(node);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
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
        a.download = `demanda-${svgId}-${produto().id}.png`;
        a.click();
        URL.revokeObjectURL(a.href);
        URL.revokeObjectURL(url);
        $("export-status").textContent = `PNG exportado: ${a.download}`;
      });
    };
    img.src = url;
  }

  function render() {
    renderSummary();
    renderSerie();
    renderErros();
    renderMae();
    renderTabela();
  }

  populate();
  ["produto", "janela"].forEach(id => $(id).addEventListener("change", render));
  $("csv").addEventListener("click", exportCsv);
  $("reset").addEventListener("click", () => {
    $("produto").value = "p01";
    $("janela").value = "ma4";
    render();
  });
  document.querySelectorAll(".export[data-svg]").forEach(btn => {
    btn.addEventListener("click", () => exportSvg(btn.dataset.svg));
  });
  render();
})();
