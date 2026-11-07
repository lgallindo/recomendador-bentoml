"use strict";

(() => {
  const dados = window.CREDITO;
  const $ = id => document.getElementById(id);
  const SVG = "http://www.w3.org/2000/svg";
  const ink = "#18374b", teal = "#157c80", terra = "#b65432", fill = "#e5edf7", cream = "#fff1dc";
  const NOMES = ["Comprometimento", "Atrasos anteriores"];
  const CURTOS = ["Compr. (%)", "Atrasos ant."];
  const PROF_MAX_DESENHO = 4;
  const estado = { fixada: null };

  const num = (n, dig = 1) => n.toLocaleString("pt-BR", { maximumFractionDigits: dig });
  const rotProf = p => (p === null ? "sem limite" : String(p));
  const chave = (p, m) => `${p === null ? "livre" : p}-${m}`;
  const classe = c => (c ? "com atraso" : "sem atraso");

  function svg(tag, attrs, parent, text) {
    const e = document.createElementNS(SVG, tag);
    Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
    if (text !== undefined) e.textContent = text;
    parent.append(e);
    return e;
  }

  function configAtual() {
    const p = $("profundidade").value === "livre" ? null : Number($("profundidade").value);
    return dados.grade[chave(p, Number($("minimo").value))];
  }

  function chaveAtual() {
    const c = configAtual();
    return chave(c.profundidade_max, c.minimo_folha);
  }

  function rotuloConfig(c) {
    return `profundidade ${rotProf(c.profundidade_max)} · mínimo ${c.minimo_folha} por folha`;
  }

  // Percorre a árvore como o scikit-learn: x[f] <= limite vai para a esquerda.
  function caminho(nos, x) {
    let i = 0;
    const passos = [0];
    while (nos[i].f !== null) {
      i = x[nos[i].f] <= nos[i].t ? nos[i].e : nos[i].d;
      passos.push(i);
    }
    return passos;
  }

  function avaliar(cfg, contratos) {
    const linhas = contratos.map(c => {
      const passos = caminho(cfg.nos, c.x);
      const folha = passos[passos.length - 1];
      return { c, passos, folha, pred: cfg.nos[folha].p };
    });
    const m = { tn: 0, fp: 0, fn: 0, tp: 0 };
    linhas.forEach(l => {
      if (l.c.y === 0 && l.pred === 0) m.tn += 1;
      else if (l.c.y === 0) m.fp += 1;
      else if (l.pred === 0) m.fn += 1;
      else m.tp += 1;
    });
    m.acertos = m.tn + m.tp;
    m.n = linhas.length;
    return { linhas, m };
  }

  function melhorPeloCriterio() {
    return Object.values(dados.grade).reduce((a, b) => {
      const ka = [a.dev.acertos, -a.profundidade, -a.folhas];
      const kb = [b.dev.acertos, -b.profundidade, -b.folhas];
      for (let i = 0; i < 3; i += 1) if (ka[i] !== kb[i]) return kb[i] > ka[i] ? b : a;
      return a;
    });
  }

  function populate() {
    dados.profundidades.forEach(p => {
      const o = document.createElement("option");
      o.value = p === null ? "livre" : String(p);
      o.textContent = rotProf(p);
      $("profundidade").append(o);
    });
    dados.minimos.forEach(m => {
      const o = document.createElement("option");
      o.value = String(m);
      o.textContent = String(m);
      $("minimo").append(o);
    });
    dados.dev.forEach(c => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = `${c.id} — ${num(c.x[0], 0)}% · ${c.x[1]} atraso(s) ant.`;
      $("contrato").append(o);
    });
    aplicar(dados.padrao.curta);
    $("contrato").value = dados.dev[0].id;
  }

  function aplicar(k) {
    const c = dados.grade[k];
    $("profundidade").value = c.profundidade_max === null ? "livre" : String(c.profundidade_max);
    $("minimo").value = String(c.minimo_folha);
  }

  function renderResumo(cfg, dev) {
    $("kpi-treino").textContent = `${cfg.treino.acertos}/240`;
    $("kpi-dev").textContent = `${dev.m.acertos}/80`;
    $("kpi-forma").textContent = `${cfg.profundidade} · ${cfg.folhas}`;
    const melhor = melhorPeloCriterio();
    const diff = dev.m.acertos - dados.baseline.dev.acertos;
    $("leitura-grade").textContent =
      `Selecionada: ${rotuloConfig(cfg)}. Desenvolvimento ${dev.m.acertos}/80 ` +
      `(${diff >= 0 ? "+" : ""}${diff} frente à referência que sempre prevê sem atraso); treino ${cfg.treino.acertos}/240. ` +
      `Pelo critério do tutorial (mais acertos no desenvolvimento; empate → menor profundidade, depois menos folhas), ` +
      `a grade escolhe ${rotuloConfig(melhor)}: ${melhor.dev.acertos}/80 com ${melhor.folhas} folhas.`;
  }

  function renderGrade(kSel) {
    const root = $("grade");
    root.replaceChildren();
    const x0 = 180, y0 = 58, w = 112, h = 40;
    svg("text", { x: 10, y: 24, fill: ink, "font-size": 14, "font-weight": 700 }, root,
      "Acertos no desenvolvimento (em 80) · clique para selecionar");
    svg("text", { x: x0, y: y0 - 10, fill: ink, "font-size": 12 }, root, "mínimo de contratos por folha →");
    dados.minimos.forEach((m, j) => svg("text", {
      x: x0 + j * w + w / 2, y: y0 + 12 + dados.profundidades.length * h + 6,
      fill: ink, "font-size": 13, "text-anchor": "middle",
    }, root, String(m)));
    dados.profundidades.forEach((p, i) => {
      svg("text", { x: x0 - 12, y: y0 + i * h + h / 2 + 5, fill: ink, "font-size": 13, "text-anchor": "end" },
        root, `prof. ${rotProf(p)}`);
      dados.minimos.forEach((m, j) => {
        const k = chave(p, m), c = dados.grade[k];
        const t = Math.max(0, Math.min(1, (c.dev.acertos - 50) / 12));
        const g = svg("g", { class: "cell", tabindex: 0, role: "button",
          "aria-label": `profundidade ${rotProf(p)}, mínimo ${m}: ${c.dev.acertos} de 80` }, root);
        svg("rect", {
          x: x0 + j * w, y: y0 + i * h, width: w - 4, height: h - 4, rx: 5,
          fill: `rgba(21,124,128,${0.12 + 0.75 * t})`,
          stroke: k === kSel ? terra : "white", "stroke-width": k === kSel ? 4 : 1,
        }, g);
        svg("text", {
          x: x0 + j * w + (w - 4) / 2, y: y0 + i * h + h / 2 + 3, "text-anchor": "middle",
          "font-size": 13, "font-weight": 700, fill: t > 0.6 ? "white" : ink,
        }, g, `${c.dev.acertos}/80`);
        const escolher = () => { aplicar(k); render(); };
        g.addEventListener("click", escolher);
        g.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); escolher(); } });
      });
    });
    svg("text", { x: 10, y: 372, fill: ink, "font-size": 12 }, root,
      `Referência (sempre sem atraso): ${dados.baseline.dev.acertos}/80. Cor mais escura = mais acertos.`);
  }

  function contarFolhas(nos, i) {
    if (nos[i].f === null) return 1;
    return contarFolhas(nos, nos[i].e) + contarFolhas(nos, nos[i].d);
  }

  function renderArvore(cfg, passos) {
    const root = $("arvore");
    root.replaceChildren();
    const nos = cfg.nos;
    const desenho = [];
    let proxima = 0;
    const W = 132, H = 92, bw = 124, bh = 50;
    function layout(i, nivel) {
      const no = nos[i];
      const recolhido = no.f !== null && nivel >= PROF_MAX_DESENHO;
      let x;
      if (no.f === null || recolhido) {
        x = proxima * W;
        proxima += 1;
      } else {
        const a = layout(no.e, nivel + 1), b = layout(no.d, nivel + 1);
        x = (a.x + b.x) / 2;
        desenho.push({ de: i, para: no.e, lado: "sim" }, { de: i, para: no.d, lado: "não" });
      }
      const item = { i, x, y: nivel * H, recolhido };
      desenho.push({ no: item });
      return item;
    }
    layout(0, 0);
    const pos = {};
    desenho.filter(d => d.no).forEach(d => { pos[d.no.i] = d.no; });
    const largura = Math.max(780, proxima * W + 20);
    const altura = Math.max(...Object.values(pos).map(p => p.y)) + bh + 40;
    root.setAttribute("viewBox", `0 0 ${largura} ${altura}`);
    root.style.width = largura > 780 ? `${largura}px` : "100%";
    const noCaminho = new Set(passos);
    const ox = 10 + (W - bw) / 2, oy = 14;
    desenho.filter(d => d.de !== undefined).forEach(d => {
      const a = pos[d.de], b = pos[d.para];
      const ativo = noCaminho.has(d.de) && noCaminho.has(d.para);
      svg("line", {
        x1: ox + a.x + bw / 2, y1: oy + a.y + bh, x2: ox + b.x + bw / 2, y2: oy + b.y,
        stroke: ativo ? terra : "#9bafb4", "stroke-width": ativo ? 3.5 : 1.4,
      }, root);
      svg("text", {
        x: (ox + a.x + bw / 2 + ox + b.x + bw / 2) / 2 + (d.lado === "sim" ? -10 : 10),
        y: (oy + a.y + bh + oy + b.y) / 2, "font-size": 11, fill: ativo ? terra : ink,
        "text-anchor": d.lado === "sim" ? "end" : "start",
      }, root, d.lado);
    });
    Object.values(pos).forEach(p => {
      const no = nos[p.i];
      const ativo = noCaminho.has(p.i);
      const folha = no.f === null;
      svg("rect", {
        x: ox + p.x, y: oy + p.y, width: bw, height: bh, rx: 7,
        fill: ativo ? cream : folha ? "white" : fill,
        stroke: ativo ? terra : folha ? teal : ink, "stroke-width": ativo ? 3 : 1.5,
      }, root);
      let linha1;
      if (folha) linha1 = `#${p.i} prevê ${no.p ? "COM" : "SEM"}`;
      else if (p.recolhido) linha1 = `continua: ${contarFolhas(nos, p.i)} folhas`;
      else linha1 = `${CURTOS[no.f]} ≤ ${num(no.t, 2)}?`;
      svg("text", { x: ox + p.x + bw / 2, y: oy + p.y + 21, "text-anchor": "middle",
        "font-size": 12, "font-weight": 700, fill: ink }, root, linha1);
      svg("text", { x: ox + p.x + bw / 2, y: oy + p.y + 38, "text-anchor": "middle",
        "font-size": 11, fill: ink }, root, `${no.sem} sem / ${no.com} com`);
    });
    const recolhidos = Object.values(pos).filter(p => p.recolhido).length;
    $("leitura-arvore").textContent =
      `${rotuloConfig(cfg)}: ${cfg.profundidade} níveis e ${cfg.folhas} folhas. ` +
      `Cada caixa mostra contagens de treino. ` +
      (recolhidos
        ? `Para caber na tela, ramos abaixo do nível ${PROF_MAX_DESENHO} aparecem como “continua” (${recolhidos} caixas); o caminho do contrato segue completo na seção 04.`
        : "A árvore inteira está desenhada.");
  }

  function renderCaminho(cfg, contrato, passos) {
    const nos = cfg.nos;
    const ficha = [
      ["Renda mensal", `R$ ${contrato.renda.toLocaleString("pt-BR")}`],
      ["Dívidas + parcela", `R$ ${contrato.dividas.toLocaleString("pt-BR")} + R$ ${contrato.parcela.toLocaleString("pt-BR")}`],
      ["Comprometimento", `${num(contrato.x[0], 0)}%`],
      ["Atrasos anteriores", String(contrato.x[1])],
      ["Resultado observado", classe(contrato.y)],
    ];
    $("ficha").replaceChildren(...ficha.flatMap(([k, v]) => {
      const dt = document.createElement("dt"); dt.textContent = k;
      const dd = document.createElement("dd"); dd.textContent = v;
      return [dt, dd];
    }));
    const lis = passos.slice(0, -1).map(i => {
      const no = nos[i];
      const valor = contrato.x[no.f];
      const li = document.createElement("li");
      li.textContent = `${NOMES[no.f]} ${num(valor, 0)} ≤ ${num(no.t, 2)}? ${valor <= no.t ? "sim" : "não"}`;
      return li;
    });
    $("passos").replaceChildren(...lis);
    const f = nos[passos[passos.length - 1]];
    const apoio = f.sem + f.com;
    const acerto = f.p === contrato.y;
    $("titulo-caminho").textContent = `Caminho de ${contrato.id}: ${passos.length - 1} pergunta(s)`;
    $("folha").textContent =
      `Folha #${passos[passos.length - 1]}: ${f.sem} sem / ${f.com} com atraso (${apoio} casos de treino) → ` +
      `prevê ${classe(f.p)}. Observado: ${classe(contrato.y)} — ${acerto ? "acerto" : "erro"}.`;
    let acao;
    if (apoio < dados.politica_minimo) acao = "Encaminhar para revisão (folha com menos de 5 exemplos de treino)";
    else acao = f.p === 0 ? "Aprovar na simulação" : "Recusar na simulação";
    $("politica").textContent = `Política fictícia da aula: ${acao}. A política é uma regra escrita por pessoas; a árvore só fornece a folha e suas contagens.`;
  }

  function matriz(tabela, lista, m, baseline, rotulo) {
    tabela.replaceChildren();
    const linhas = [
      ["", "Previu sem atraso", "Previu com atraso"],
      ["Sem atraso", m.tn, m.fp],
      ["Com atraso", m.fn, m.tp],
    ];
    linhas.forEach((l, i) => {
      const tr = document.createElement("tr");
      l.forEach((v, j) => {
        const cel = document.createElement(i === 0 || j === 0 ? "th" : "td");
        cel.textContent = String(v);
        if (i > 0 && j > 0) cel.className = (i === j) ? "ok" : "err";
        tr.append(cel);
      });
      tabela.append(tr);
    });
    const itens = [
      `${rotulo}: ${m.acertos} acertos e ${m.n - m.acertos} erros em ${m.n}; referência que sempre prevê sem atraso: ${baseline.acertos}/${m.n}.`,
      `Previu sem, mas houve atraso: ${m.fn} casos.`,
      `Previu com, mas não houve atraso: ${m.fp} casos.`,
    ];
    lista.replaceChildren(...itens.map(t => { const li = document.createElement("li"); li.textContent = t; return li; }));
  }

  function renderTeste() {
    if (!estado.fixada) return;
    const cfg = dados.grade[estado.fixada];
    const t = avaliar(cfg, dados.teste);
    $("teste-bloqueado").classList.add("hidden");
    $("teste-aberto").classList.remove("hidden");
    $("teste-fixada").textContent =
      `Configuração fixada: ${rotuloConfig(cfg)}, escolhida com ${cfg.dev.acertos}/80 no desenvolvimento. ` +
      `A árvore não foi retreinada; a referência mantém a maioria do treino (sem atraso).`;
    matriz($("matriz-teste"), $("erros-teste"), t.m, dados.baseline.teste, "Teste");
    const aviso = $("aviso-teste");
    if (chaveAtual() !== estado.fixada) {
      aviso.classList.remove("hidden");
      aviso.textContent =
        "Você já viu o teste da configuração fixada. O painel não mostra o teste de outra escolha: " +
        "trocar a configuração por causa desse resultado faria o teste participar da seleção, " +
        "e uma avaliação independente exigiria outros contratos.";
    } else {
      aviso.classList.add("hidden");
    }
  }

  function renderTabela(dev, cfg) {
    const tbody = $("tabela").querySelector("tbody");
    tbody.replaceChildren(...dev.linhas.map(l => {
      const tr = document.createElement("tr");
      const f = cfg.nos[l.folha];
      [l.c.id, `${num(l.c.x[0], 0)}%`, l.c.x[1], `#${l.folha}`, `${f.sem}/${f.com}`, classe(l.pred), classe(l.c.y)]
        .forEach(v => { const td = document.createElement("td"); td.textContent = String(v); tr.append(td); });
      return tr;
    }));
    const confere = dev.m.acertos === cfg.dev.acertos;
    $("estado").textContent = confere
      ? `Conferido: o percurso no navegador reproduz os ${cfg.dev.acertos} acertos calculados em Python.`
      : `Atenção: o navegador calculou ${dev.m.acertos} acertos e o Python ${cfg.dev.acertos}.`;
  }

  function baixar(nome, linhas) {
    const blob = new Blob(["﻿" + linhas.join("\n") + "\n"], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    a.click();
    $("export-status").textContent = `CSV: ${nome}`;
  }

  function exportCsv() {
    const cfg = configAtual();
    const dev = avaliar(cfg, dados.dev);
    baixar(`credito-desenvolvimento-${chaveAtual()}.csv`, [
      "id,comprometimento_pct,atrasos_anteriores,folha,apoio_sem,apoio_com,previsto,observado",
      ...dev.linhas.map(l => [l.c.id, l.c.x[0], l.c.x[1], l.folha, cfg.nos[l.folha].sem,
        cfg.nos[l.folha].com, l.pred, l.c.y].join(",")),
    ]);
  }

  function exportCsvTeste() {
    const cfg = dados.grade[estado.fixada];
    const t = avaliar(cfg, dados.teste);
    // Mesmas colunas de material/credito/previsoes-teste.csv.
    baixar(`credito-teste-${estado.fixada}.csv`, [
      "id,observado,previsto,folha,baseline",
      ...t.linhas.map(l => [l.c.id, l.c.y, l.pred, l.folha, dados.classe_baseline].join(",")),
    ]);
  }

  function exportSvg(svgId) {
    const node = $(svgId);
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
      canvas.toBlob(b => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = `credito-${svgId}-${chaveAtual()}.png`;
        a.click();
        $("export-status").textContent = `PNG: ${a.download}`;
      });
    };
    img.src = url;
  }

  function render() {
    const cfg = configAtual();
    const contrato = dados.dev.find(c => c.id === $("contrato").value) || dados.dev[0];
    const dev = avaliar(cfg, dados.dev);
    const passos = caminho(cfg.nos, contrato.x);
    renderResumo(cfg, dev);
    renderGrade(chaveAtual());
    renderArvore(cfg, passos);
    renderCaminho(cfg, contrato, passos);
    matriz($("matriz-dev"), $("erros-dev"), dev.m, dados.baseline.dev, "Desenvolvimento");
    renderTabela(dev, cfg);
    renderTeste();
  }

  populate();
  ["profundidade", "minimo", "contrato"].forEach(id => $(id).addEventListener("change", render));
  $("preset-curta").addEventListener("click", () => { aplicar(dados.padrao.curta); render(); });
  $("preset-profunda").addEventListener("click", () => { aplicar(dados.padrao.profunda); render(); });
  $("revelar").addEventListener("click", () => { estado.fixada = chaveAtual(); render(); });
  $("csv").addEventListener("click", exportCsv);
  $("csv-teste").addEventListener("click", exportCsvTeste);
  document.querySelectorAll("button.export").forEach(b =>
    b.addEventListener("click", () => exportSvg(b.dataset.svg)));
  render();
})();
