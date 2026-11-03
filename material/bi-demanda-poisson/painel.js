"use strict";

(() => {
  const dados = window.DEMANDA_POISSON;
  const $ = (id) => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b",
    teal = "#157c80",
    terra = "#b65432";

  const num = (n, dig = 3) =>
    n === null || n === undefined
      ? "—"
      : n.toLocaleString("pt-BR", {
          minimumFractionDigits: dig,
          maximumFractionDigits: dig,
        });

  function produto() {
    return dados.produtos.find((p) => p.id === $("produto").value);
  }

  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }

  function populate() {
    const sel = $("produto");
    sel.replaceChildren();
    dados.produtos.forEach((p) => {
      const o = document.createElement("option");
      o.value = p.id;
      o.textContent = `${p.id} — ${p.nome}`;
      sel.append(o);
    });
    sel.value = "p01";
  }

  function renderSummary() {
    const p = produto();
    $("nome-produto").textContent = p.nome;
    $("lambda").textContent = num(p.lambda, 3);
    $("p-gt-2").textContent = (p.p_gt_2 * 100).toLocaleString("pt-BR", {
      maximumFractionDigits: 1,
    }) + "%";
    const [lo, hi] = p.intervalo_95;
    $("intervalo").textContent = `[${lo}, ${hi}]`;
    $("log-perda").textContent = num(p.log_perda_media, 3);
    $("titulo-pmf").textContent = `PMF — ${p.nome}`;
    $("interpretacao").textContent =
      `${p.nome} (${p.id}): λ = ${num(p.lambda, 3)}. ` +
      `P(Y ≤ 2) = ${(p.p_le_2 * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%. ` +
      `Cobertura no teste deste produto: ${(p.cobertura_teste * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%. ` +
      `Cobertura agregada (12×4): ${(dados.cobertura_agregada * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%.`;
  }

  function renderPmf() {
    const plot = $("pmf");
    plot.replaceChildren();
    const p = produto();
    const [lo, hi] = p.intervalo_95;
    const w = 780,
      h = 340,
      padL = 55,
      padR = 30,
      padT = 30,
      padB = 50;
    const maxP = Math.max(...p.pmf) * 1.2;
    const n = p.contagens.length;
    const bw = (w - padL - padR) / n;

    svg("line", { x1: padL, y1: h - padB, x2: w - padR, y2: h - padB, stroke: ink, "stroke-width": 1.2 }, plot);
    svg("line", { x1: padL, y1: padT, x2: padL, y2: h - padB, stroke: ink, "stroke-width": 1.2 }, plot);

    p.contagens.forEach((k, i) => {
      const barH = (p.pmf[i] / maxP) * (h - padT - padB);
      const x = padL + i * bw + bw * 0.12;
      const y = h - padB - barH;
      const inBand = k >= lo && k <= hi;
      svg(
        "rect",
        {
          x,
          y,
          width: bw * 0.76,
          height: Math.max(barH, 0.5),
          fill: inBand ? teal : "#cbd3d9",
        },
        plot,
      );
      svg(
        "text",
        {
          x: x + bw * 0.38,
          y: h - padB + 18,
          fill: ink,
          "font-size": 12,
          "text-anchor": "middle",
        },
        plot,
        String(k),
      );
    });

    const xLam = padL + (p.lambda + 0.5) * bw;
    svg(
      "line",
      {
        x1: xLam,
        y1: padT,
        x2: xLam,
        y2: h - padB,
        stroke: terra,
        "stroke-width": 2,
        "stroke-dasharray": "6 4",
      },
      plot,
    );
    svg(
      "text",
      { x: padL - 8, y: padT + 4, fill: ink, "font-size": 11, "text-anchor": "end" },
      plot,
      num(maxP, 2),
    );
  }

  function renderTabela() {
    const p = produto();
    const body = $("tabela").querySelector("tbody");
    body.replaceChildren();
    p.teste.forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${r.week_start}</td>
        <td>${r.observado}</td>
        <td>${num(r.lambda, 3)}</td>
        <td>[${r.intervalo[0]}, ${r.intervalo[1]}]</td>
        <td>${r.coberto ? "sim" : "não"}</td>
        <td>${num(r.log_perda, 3)}</td>`;
      body.append(tr);
    });
    $("estado").textContent =
      `${p.teste.length} semanas de teste · cobertura deste produto ${(p.cobertura_teste * 100).toLocaleString("pt-BR", { maximumFractionDigits: 0 })}%.`;
  }

  function exportSvg(id) {
    const el = $(id);
    const xml = new XMLSerializer().serializeToString(el);
    const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `poisson-${produto().id}-${id}.svg`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function exportCsv() {
    const p = produto();
    const lines = [
      "week_start,observado,lambda,lo,hi,coberto,log_perda",
      ...p.teste.map(
        (r) =>
          `${r.week_start},${r.observado},${r.lambda},${r.intervalo[0]},${r.intervalo[1]},${r.coberto},${r.log_perda}`,
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `poisson-teste-${p.id}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function render() {
    renderSummary();
    renderPmf();
    renderTabela();
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (!dados) {
      $("estado").textContent = "dados.js ausente — rode scripts/gerar_bi_demanda_poisson.py";
      return;
    }
    populate();
    render();
    $("produto").addEventListener("change", render);
    $("reset").addEventListener("click", () => {
      $("produto").value = "p01";
      render();
    });
    $("csv").addEventListener("click", exportCsv);
    document.querySelectorAll(".export").forEach((btn) => {
      btn.addEventListener("click", () => exportSvg(btn.dataset.svg));
    });
  });
})();
