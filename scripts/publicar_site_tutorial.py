"""Publique o tutorial pré-construído no branch gh-pages, preservando seu histórico."""

from __future__ import annotations

import json
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

from gerar_site_tutorial import gerar

RAIZ = Path(__file__).resolve().parent.parent


def git(*args: str, cwd: Path = RAIZ) -> str:
    return subprocess.run(["git", *args], cwd=cwd, check=True, text=True,
                          stdout=subprocess.PIPE).stdout.strip()


def publicar() -> None:
    remoto = git("remote", "get-url", "origin")
    nome = re.search(r"github\.com[:/]([^/]+/[^/]+)$", remoto)
    if not nome:
        raise ValueError("O origin precisa apontar para um repositório do GitHub.")
    repo = nome.group(1).removesuffix(".git")
    config = json.loads(subprocess.run(["gh", "api", f"repos/{repo}/pages"],
                                      check=True, text=True, capture_output=True).stdout)
    if config.get("build_type") != "legacy" or config.get("source") != {"branch": "gh-pages", "path": "/"}:
        raise ValueError("Configure Pages deste projeto para publicar gh-pages / antes de executar.")
    pasta = RAIZ / ".local/pages-publication" / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    build, checkout = pasta / "build", pasta / "checkout"
    gerar(build)
    git("clone", "--single-branch", "--branch", "gh-pages", remoto, str(checkout))
    for chave in ("user.name", "user.email"):
        git("config", chave, git("config", chave), cwd=checkout)
    arquivos = []
    for origem in sorted(build.rglob("*")):
        if origem.is_file():
            relativo = origem.relative_to(build)
            alvo = checkout / relativo
            alvo.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(origem, alvo)
            arquivos.append(str(relativo))
    sha = git("rev-parse", "HEAD")
    (checkout / "site-build.json").write_text(json.dumps({
        "source_commit": sha,
        "tutorial": "material/tutorial-regras-associacao-20261017.md",
    }, indent=2) + "\n", encoding="utf-8")
    git("add", *arquivos, "site-build.json", cwd=checkout)
    diff = subprocess.run(["git", "diff", "--cached", "--quiet"], cwd=checkout)
    if diff.returncode == 1:
        git("commit", "-m", f"docs: publish prebuilt association tutorial from {sha[:7]}", cwd=checkout)
        git("push", "origin", "HEAD:gh-pages", cwd=checkout)
    elif diff.returncode != 0:
        raise RuntimeError("Não foi possível verificar os arquivos de publicação.")
    subprocess.run(["gh", "api", "--method", "POST", f"repos/{repo}/pages/builds"], check=True)
    print(f"Publicação solicitada: {config['html_url']}")


if __name__ == "__main__":
    try:
        publicar()
    except (ValueError, RuntimeError, subprocess.CalledProcessError) as erro:
        sys.exit(str(erro))
