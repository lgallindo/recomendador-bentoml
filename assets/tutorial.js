"use strict";

const fullscreen = document.getElementById("fullscreen-explorer");
if (fullscreen) {
  fullscreen.addEventListener("click", async () => {
    const frame = document.getElementById("explorer");
    const status = document.getElementById("explorer-status");
    if (!frame.requestFullscreen) {
      status.textContent = "Use o link para abrir o explorador em uma nova aba.";
      return;
    }
    try { await frame.requestFullscreen(); }
    catch { status.textContent = "Use o link para abrir o explorador em uma nova aba."; }
  });
}
