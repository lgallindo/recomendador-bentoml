"""Gere a versão HTML do tutorial com seu explorador incorporado (Python + Pandoc)."""

from __future__ import annotations

import argparse
import json
import posixpath
import shutil
import subprocess
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

RAIZ = Path(__file__).resolve().parent.parent
FONTE = Path("material/tutorial-regras-associacao-20261017.md")
REPO = "https://github.com/lgallindo/recomendador-bentoml/blob/main/"
EMBED = """<section id="explorador-interativo" class="interactive" aria-labelledby="explorer-heading">
<h3 id="explorer-heading">Experimente as regras neste tutorial</h3>
<p>Use os filtros e gráficos abaixo. O painel tem sua própria rolagem; você também
pode ampliá-lo. Os dois conjuntos de dados são sintéticos.</p>
<div class="explorer-actions">
<button id="fullscreen-explorer" type="button">Ver explorador em tela cheia</button>
<a href="material/bi/index.html" target="_blank" rel="noopener">Abrir explorador em nova aba</a>
</div>
<p id="explorer-status" role="status"></p>
<iframe id="explorer" src="material/bi/index.html" title="Explorador interativo de regras de associação"
loading="lazy" allow="fullscreen" allowfullscreen></iframe>
</section>"""


def pandoc(args: list[str], texto: str) -> str:
    return subprocess.run(["pandoc", *args], input=texto, text=True,
                          capture_output=True, check=True).stdout


def gerar(destino: Path) -> None:
    destino = destino.resolve()
    if destino == RAIZ or RAIZ not in destino.parents:
        raise ValueError("Use uma pasta de saída dentro do repositório, como .local/pages-build.")
    destino.mkdir(parents=True, exist_ok=True)
    arvore = json.loads(pandoc(["--from=gfm+tex_math_dollars", "--to=json"],
                              (RAIZ / FONTE).read_text(encoding="utf-8")))
    arquivos: set[Path] = set()

    def ajustar(no: object) -> None:
        if isinstance(no, list):
            for item in no:
                ajustar(item)
        elif isinstance(no, dict):
            if no.get("t") in {"Link", "Image"}:
                alvo = no["c"][2]
                uri = urlsplit(alvo[0])
                if uri.path and not uri.scheme and not uri.netloc:
                    relativo = Path(posixpath.normpath(str(FONTE.parent / uri.path)))
                    if relativo.is_absolute() or ".." in relativo.parts:
                        raise ValueError(f"Caminho fora do repositório: {relativo}")
                    if relativo == FONTE:
                        novo = "index.html"
                    elif no["t"] == "Image" or relativo.suffix in {".json", ".csv"}:
                        arquivos.add(relativo)
                        novo = relativo.as_posix()
                    elif relativo.as_posix() == "material/bi/index.html":
                        novo = relativo.as_posix()
                    else:
                        novo = REPO + relativo.as_posix()
                    alvo[0] = urlunsplit(("", "", novo, uri.query, uri.fragment))
            for valor in no.values():
                ajustar(valor)

    ajustar(arvore)
    blocos = []
    incorporado = False
    for bloco in arvore["blocks"]:
        blocos.append(bloco)
        if bloco.get("t") == "Para" and '"material/bi/index.html"' in json.dumps(bloco, ensure_ascii=False):
            if not incorporado:
                blocos.append({"t": "RawBlock", "c": ["html", EMBED]})
                incorporado = True
    if not incorporado:
        raise ValueError("Não foi encontrada a apresentação do explorador no tutorial.")
    arvore["blocks"] = blocos
    html = pandoc([
        "--from=json", "--to=html5", "--standalone", "--mathml", "--toc", "--toc-depth=2",
        "--template=" + str(RAIZ / "pages/template.html"),
        "--metadata=pagetitle:Regras de associação e marketing orientado por dados",
    ], json.dumps(arvore, ensure_ascii=False))
    (destino / "index.html").write_text(html, encoding="utf-8")
    for relativo in arquivos:
        alvo = destino / relativo
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(RAIZ / relativo, alvo)
    for nome in ["index.html", "painel.css", "painel.js", "dados.js"]:
        relativo = Path("material/bi") / nome
        alvo = destino / relativo
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(RAIZ / relativo, alvo)
    painel = destino / "material/bi/index.html"
    texto = painel.read_text(encoding="utf-8")
    texto = texto.replace('href="../tutorial-regras-associacao-20261017.md"',
                          'href="../../index.html#explorador-interativo" target="_top"')
    texto = texto.replace('href="README.md"', 'href="' + REPO + 'material/bi/README.md" target="_blank" rel="noopener"')
    texto = texto.replace("Abra este arquivo diretamente no navegador. Os dados e recursos são locais; nenhuma conexão é necessária.",
                          "Este explorador também está disponível para uso offline na cópia local do repositório.")
    painel.write_text(texto, encoding="utf-8")
    for nome in ["tutorial.css", "tutorial.js"]:
        alvo = destino / "assets" / nome
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(RAIZ / "pages" / nome, alvo)
    (destino / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Tutorial com MathML, {len(arquivos)} recursos e explorador incorporado: {destino}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--saida", type=Path, default=RAIZ / ".local/pages-build")
    args = parser.parse_args()
    gerar(args.saida)


if __name__ == "__main__":
    main()
