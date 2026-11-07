"use strict";

const fullscreen = document.getElementById("fullscreen-explorer");
if (fullscreen) {
  fullscreen.addEventListener("click", async () => {
    const frame = document.getElementById("explorer");
    const status = document.getElementById("explorer-status");
    if (!frame.requestFullscreen) {
      status.textContent = "Abra o explorador em nova aba pelo vínculo desta página.";
      return;
    }
    try { await frame.requestFullscreen(); }
    catch { status.textContent = "Abra o explorador em nova aba pelo vínculo desta página."; }
  });
}
