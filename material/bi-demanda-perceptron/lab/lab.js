/* Laboratório geométrico do Perceptron — canvas próprio do Caderno.
   Pedagogia alinhada a demos didáticas de fronteira/PLA; implementação original. */
(function () {
  "use strict";

  const POS = "#157c80";
  const NEG = "#b65432";
  const INK = "#18374b";
  const GRID = "#d4dfdf";

  function $(id) {
    return document.getElementById(id);
  }

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function setup(canvas) {
    const dpr = window.devicePixelRatio || 1;
    const css = canvas.clientWidth || 360;
    const side = Math.max(280, css);
    canvas.width = Math.round(side * dpr);
    canvas.height = Math.round(side * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: side, h: side };
  }

  function setupWide(canvas, aspect) {
    const dpr = window.devicePixelRatio || 1;
    const css = canvas.clientWidth || 360;
    const w = Math.max(280, css);
    const h = Math.max(160, Math.round(w * (aspect || 0.45)));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w, h };
  }

  function frame(ctx, w, h, xmin, xmax, ymin, ymax) {
    const pad = { l: 36, r: 12, t: 12, b: 32 };
    const iw = w - pad.l - pad.r;
    const ih = h - pad.t - pad.b;
    return {
      xmin,
      xmax,
      ymin,
      ymax,
      iw,
      ih,
      X: (x) => pad.l + ((x - xmin) / (xmax - xmin)) * iw,
      Y: (y) => pad.t + ((ymax - y) / (ymax - ymin)) * ih,
      pad,
    };
  }

  function clear(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fafaf8";
    ctx.fillRect(0, 0, w, h);
  }

  function axes(ctx, fr) {
    ctx.strokeStyle = GRID;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fr.X(fr.xmin), fr.Y(0));
    ctx.lineTo(fr.X(fr.xmax), fr.Y(0));
    ctx.moveTo(fr.X(0), fr.Y(fr.ymin));
    ctx.lineTo(fr.X(0), fr.Y(fr.ymax));
    ctx.stroke();
    ctx.fillStyle = "#6a7f8a";
    ctx.font = "11px system-ui,sans-serif";
    ctx.fillText("x₁", fr.X(fr.xmax) - 18, fr.Y(0) + 14);
    ctx.fillText("x₂", fr.X(0) + 6, fr.Y(fr.ymax) + 12);
  }

  function heatmap(ctx, fr, fn, nx, ny) {
    const dx = (fr.xmax - fr.xmin) / nx;
    const dy = (fr.ymax - fr.ymin) / ny;
    for (let i = 0; i < nx; i++) {
      for (let j = 0; j < ny; j++) {
        const x = fr.xmin + (i + 0.5) * dx;
        const y = fr.ymin + (j + 0.5) * dy;
        const v = fn(x, y);
        ctx.fillStyle = v >= 0 ? "rgba(21,124,128,0.14)" : "rgba(182,84,50,0.14)";
        const x0 = fr.X(fr.xmin + i * dx);
        const y0 = fr.Y(fr.ymin + (j + 1) * dy);
        const x1 = fr.X(fr.xmin + (i + 1) * dx);
        const y1 = fr.Y(fr.ymin + j * dy);
        ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      }
    }
  }

  function scatter(ctx, fr, pts, color) {
    ctx.fillStyle = color;
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(fr.X(p[0]), fr.Y(p[1]), 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function lineBoundary(ctx, fr, t0, t1, t2) {
    const n2 = t1 * t1 + t2 * t2;
    if (n2 < 1e-8) return null;
    const fx = (-t0 * t1) / n2;
    const fy = (-t0 * t2) / n2;
    const nrm = Math.sqrt(n2);
    const ux = t1 / nrm;
    const uy = t2 / nrm;
    const vx = -uy;
    const vy = ux;
    const L = 8;
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(fr.X(fx - L * vx), fr.Y(fy - L * vy));
    ctx.lineTo(fr.X(fx + L * vx), fr.Y(fy + L * vy));
    ctx.stroke();
    /* vetor normal */
    const ax = fx + 1.3 * ux;
    const ay = fy + 1.3 * uy;
    ctx.strokeStyle = POS;
    ctx.fillStyle = POS;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(fr.X(fx), fr.Y(fy));
    ctx.lineTo(fr.X(ax), fr.Y(ay));
    ctx.stroke();
    const ang = Math.atan2(fr.Y(ay) - fr.Y(fy), fr.X(ax) - fr.X(fx));
    const px = fr.X(ax);
    const py = fr.Y(ay);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px - 8 * Math.cos(ang - 0.4), py - 8 * Math.sin(ang - 0.4));
    ctx.lineTo(px - 8 * Math.cos(ang + 0.4), py - 8 * Math.sin(ang + 0.4));
    ctx.closePath();
    ctx.fill();
    return { fx, fy, ux, uy };
  }

  function fmt(v) {
    const a = Math.abs(v).toFixed(1);
    return (v < 0 ? "−" : "") + a;
  }

  /* ——— Seção 1: fronteira ——— */
  function initFrontier() {
    const cv = $("s1-plane");
    const sl = { t0: $("s1-t0"), t1: $("s1-t1"), t2: $("s1-t2") };
    let seed = 42;
    let pts = [];

    function regen() {
      const rng = mulberry32(seed);
      pts = [];
      for (let i = 0; i < 30; i++) {
        pts.push([(rng() * 2 - 1) * 3, (rng() * 2 - 1) * 3]);
      }
    }

    function draw() {
      const t0 = +sl.t0.value;
      const t1 = +sl.t1.value;
      const t2 = +sl.t2.value;
      $("s1-t0-val").textContent = fmt(t0);
      $("s1-t1-val").textContent = fmt(t1);
      $("s1-t2-val").textContent = fmt(t2);
      $("s1-eq").textContent =
        "ŷ = sinal(" +
        fmt(t0) +
        (t1 < 0 ? " − " : " + ") +
        Math.abs(t1).toFixed(1) +
        "·x₁" +
        (t2 < 0 ? " − " : " + ") +
        Math.abs(t2).toFixed(1) +
        "·x₂)";

      const { ctx, w, h } = setup(cv);
      clear(ctx, w, h);
      const fr = frame(ctx, w, h, -3.5, 3.5, -3.5, 3.5);
      heatmap(ctx, fr, (x, y) => t0 + t1 * x + t2 * y, 50, 50);
      axes(ctx, fr);
      ctx.save();
      ctx.beginPath();
      ctx.rect(fr.X(fr.xmin), fr.Y(fr.ymax), fr.iw, fr.ih);
      ctx.clip();
      lineBoundary(ctx, fr, t0, t1, t2);
      ctx.restore();
      const pos = pts.filter((p) => t0 + t1 * p[0] + t2 * p[1] >= 0);
      const neg = pts.filter((p) => t0 + t1 * p[0] + t2 * p[1] < 0);
      scatter(ctx, fr, pos, POS);
      scatter(ctx, fr, neg, NEG);
    }

    regen();
    ["t0", "t1", "t2"].forEach((k) => sl[k].addEventListener("input", draw));
    $("s1-resample").addEventListener("click", () => {
      seed += 1;
      regen();
      draw();
    });
    window.addEventListener("resize", draw);
    draw();
  }

  /* ——— Seção 2: portas ——— */
  function initGates() {
    const cv = $("s2-plane");
    const sl = { t0: $("s2-t0"), t1: $("s2-t1"), t2: $("s2-t2") };
    const corners = [
      [-1, -1],
      [-1, 1],
      [1, -1],
      [1, 1],
    ];
    const targets = {
      and: [-1, -1, -1, 1],
      or: [-1, 1, 1, 1],
      xor: [-1, 1, 1, -1],
    };
    let gate = "and";

    function predict(t0, t1, t2, x1, x2) {
      return t0 + t1 * x1 + t2 * x2 >= 0 ? 1 : -1;
    }

    function setActive() {
      ["and", "or", "xor"].forEach((g) => {
        $("s2-tab-" + g).classList.toggle("active", g === gate);
      });
    }

    function draw() {
      const t0 = +sl.t0.value;
      const t1 = +sl.t1.value;
      const t2 = +sl.t2.value;
      $("s2-t0-val").textContent = fmt(t0);
      $("s2-t1-val").textContent = fmt(t1);
      $("s2-t2-val").textContent = fmt(t2);
      const tgt = targets[gate];
      const { ctx, w, h } = setup(cv);
      clear(ctx, w, h);
      const fr = frame(ctx, w, h, -1.8, 1.8, -1.8, 1.8);
      heatmap(ctx, fr, (x, y) => t0 + t1 * x + t2 * y, 40, 40);
      axes(ctx, fr);
      ctx.save();
      ctx.beginPath();
      ctx.rect(fr.X(fr.xmin), fr.Y(fr.ymax), fr.iw, fr.ih);
      ctx.clip();
      lineBoundary(ctx, fr, t0, t1, t2);
      ctx.restore();

      const tbody = $("s2-truth").querySelector("tbody");
      tbody.innerHTML = "";
      let ok = 0;
      corners.forEach((c, i) => {
        const yhat = predict(t0, t1, t2, c[0], c[1]);
        const good = yhat === tgt[i];
        if (good) ok += 1;
        ctx.beginPath();
        ctx.arc(fr.X(c[0]), fr.Y(c[1]), 7, 0, Math.PI * 2);
        ctx.fillStyle = tgt[i] > 0 ? POS : NEG;
        ctx.fill();
        if (!good) {
          ctx.strokeStyle = "#c0392b";
          ctx.lineWidth = 2.5;
          ctx.stroke();
        }
        const tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" +
          c[0] +
          "</td><td>" +
          c[1] +
          "</td><td>" +
          tgt[i] +
          "</td><td class='" +
          (good ? "ok" : "bad") +
          "'>" +
          yhat +
          "</td>";
        tbody.appendChild(tr);
      });
      $("s2-score").textContent = ok + " de 4 linhas corretas";
      if (gate === "xor" && ok < 4) {
        $("s2-xor-note").hidden = false;
      } else {
        $("s2-xor-note").hidden = ok === 4 && gate === "xor" ? false : gate !== "xor";
        if (gate !== "xor") $("s2-xor-note").hidden = true;
      }
    }

    ["and", "or", "xor"].forEach((g) => {
      $("s2-tab-" + g).addEventListener("click", () => {
        gate = g;
        setActive();
        draw();
      });
    });
    $("s2-preset-and").addEventListener("click", () => {
      sl.t0.value = -1;
      sl.t1.value = 1;
      sl.t2.value = 1;
      gate = "and";
      setActive();
      draw();
    });
    $("s2-preset-or").addEventListener("click", () => {
      sl.t0.value = 1;
      sl.t1.value = 1;
      sl.t2.value = 1;
      gate = "or";
      setActive();
      draw();
    });
    ["t0", "t1", "t2"].forEach((k) => sl[k].addEventListener("input", draw));
    window.addEventListener("resize", draw);
    setActive();
    draw();
  }

  /* ——— Seção 3: PLA ——— */
  function initPla() {
    const cvP = $("s3-plane");
    const cvE = $("s3-errors");
    let mode = "sep";
    let seed = 7;
    let data = [];
    let ys = [];
    let theta = [0, 0, 0];
    let theta0 = [0, 0, 0];
    let cursor = 0;
    let updates = 0;
    let errHist = [];
    let converged = false;
    let training = false;
    let raf = 0;

    function predict(th, p) {
      return th[0] + th[1] * p[0] + th[2] * p[1] >= 0 ? 1 : -1;
    }

    function countErr() {
      let e = 0;
      for (let i = 0; i < data.length; i++) {
        if (predict(theta, data[i]) !== ys[i]) e += 1;
      }
      return e;
    }

    function sample() {
      const rng = mulberry32(seed);
      const n = 60;
      const dist = mode === "sep" ? 2.8 : 0.9;
      const noise = mode === "sep" ? 0.55 : 0.85;
      data = [];
      ys = [];
      for (let i = 0; i < n; i++) {
        const cls = i < n / 2 ? -1 : 1;
        const cx = cls * dist * 0.5;
        data.push([
          cx + (rng() * 2 - 1) * noise,
          (rng() * 2 - 1) * noise + cls * 0.15,
        ]);
        ys.push(cls);
      }
      theta0 = [
        (rng() - 0.5) * 0.8,
        (rng() - 0.5) * 0.8,
        (rng() - 0.5) * 0.8,
      ];
      resetTrain();
    }

    function resetTrain() {
      stop();
      theta = theta0.slice();
      cursor = 0;
      updates = 0;
      converged = false;
      errHist = [countErr()];
      status();
      drawPlane();
      drawErr();
    }

    function eta() {
      return +$("s3-eta").value;
    }

    function stepOnce() {
      if (converged) return false;
      const n = data.length;
      let idx = -1;
      for (let k = 0; k < n; k++) {
        const i = (cursor + k) % n;
        if (predict(theta, data[i]) !== ys[i]) {
          idx = i;
          break;
        }
      }
      if (idx < 0) {
        converged = true;
        return false;
      }
      cursor = (idx + 1) % n;
      const e = eta();
      const x = [1, data[idx][0], data[idx][1]];
      for (let j = 0; j < 3; j++) theta[j] += e * ys[idx] * x[j];
      updates += 1;
      errHist.push(countErr());
      if (errHist.length > 250) errHist.shift();
      return true;
    }

    function status() {
      $("s3-status").textContent =
        "atualizações: " +
        updates +
        " · mal classificados: " +
        errHist[errHist.length - 1] +
        " / " +
        data.length +
        (converged ? " · convergiu" : "");
      $("s3-eta-val").textContent = eta().toFixed(2);
    }

    function drawPlane() {
      const R = mode === "sep" ? 4 : 3.2;
      const { ctx, w, h } = setup(cvP);
      clear(ctx, w, h);
      const fr = frame(ctx, w, h, -R, R, -R, R);
      heatmap(ctx, fr, (x, y) => theta[0] + theta[1] * x + theta[2] * y, 45, 45);
      axes(ctx, fr);
      ctx.save();
      ctx.beginPath();
      ctx.rect(fr.X(fr.xmin), fr.Y(fr.ymax), fr.iw, fr.ih);
      ctx.clip();
      lineBoundary(ctx, fr, theta[0], theta[1], theta[2]);
      ctx.restore();
      const pos = [];
      const neg = [];
      for (let i = 0; i < data.length; i++) {
        (ys[i] > 0 ? pos : neg).push(data[i]);
      }
      scatter(ctx, fr, pos, POS);
      scatter(ctx, fr, neg, NEG);
    }

    function drawErr() {
      const { ctx, w, h } = setupWide(cvE, 0.42);
      clear(ctx, w, h);
      const maxE = Math.max(1, ...errHist);
      const fr = frame(ctx, w, h, 0, Math.max(1, errHist.length - 1), 0, maxE * 1.1);
      ctx.strokeStyle = GRID;
      ctx.strokeRect(fr.X(fr.xmin), fr.Y(fr.ymax), fr.iw, fr.ih);
      ctx.strokeStyle = NEG;
      ctx.lineWidth = 2;
      ctx.beginPath();
      errHist.forEach((e, i) => {
        const x = fr.X(i);
        const y = fr.Y(e);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.fillStyle = "#6a7f8a";
      ctx.font = "11px system-ui,sans-serif";
      ctx.fillText("atualizações", fr.X(fr.xmax) - 70, fr.Y(0) + 14);
      ctx.fillText("erros", fr.X(0) + 4, fr.Y(fr.ymax) + 12);
    }

    function stop() {
      training = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      $("s3-train").textContent = "Treinar";
    }

    function tick() {
      if (!training) return;
      for (let i = 0; i < 4; i++) {
        if (!stepOnce()) {
          stop();
          break;
        }
      }
      status();
      drawPlane();
      drawErr();
      if (training) raf = requestAnimationFrame(tick);
    }

    $("s3-tab-sep").addEventListener("click", () => {
      mode = "sep";
      $("s3-tab-sep").classList.add("active");
      $("s3-tab-nonsep").classList.remove("active");
      sample();
    });
    $("s3-tab-nonsep").addEventListener("click", () => {
      mode = "nonsep";
      $("s3-tab-nonsep").classList.add("active");
      $("s3-tab-sep").classList.remove("active");
      sample();
    });
    $("s3-eta").addEventListener("input", () => {
      $("s3-eta-val").textContent = eta().toFixed(2);
    });
    $("s3-step").addEventListener("click", () => {
      stepOnce();
      status();
      drawPlane();
      drawErr();
    });
    $("s3-train").addEventListener("click", () => {
      if (training) {
        stop();
        return;
      }
      training = true;
      $("s3-train").textContent = "Pausar";
      tick();
    });
    $("s3-reset").addEventListener("click", resetTrain);
    $("s3-resample").addEventListener("click", () => {
      seed += 1;
      sample();
    });
    window.addEventListener("resize", () => {
      drawPlane();
      drawErr();
    });
    sample();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initFrontier();
    initGates();
    initPla();
  });
})();
