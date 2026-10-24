"""Gere as versões HTML dos tutoriais com exploradores incorporados (Python + Pandoc)."""

from __future__ import annotations

import argparse
import json
import posixpath
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit

RAIZ = Path(__file__).resolve().parent.parent
REPO = "https://github.com/lgallindo/recomendador-bentoml/blob/main/"


@dataclass(frozen=True)
class Tutorial:
    fonte: Path
    saida_relativa: Path  # relativo ao destino de build (ex.: Path(".") ou Path("demanda"))
    bi_dir: Path  # relativo à raiz (ex.: material/bi)
    pagetitle: str
    embed_titulo: str
    embed_intro: str
    embed_iframe_title: str
    md_nav_label: str
    tutorial_md_href: str  # path no GitHub blob


TUTORIAIS = (
    Tutorial(
        fonte=Path("material/tutorial-regras-associacao-20261017.md"),
        saida_relativa=Path("."),
        bi_dir=Path("material/bi"),
        pagetitle="Regras de associação e marketing orientado por dados",
        embed_titulo="Experimente as regras neste tutorial",
        embed_intro=(
            "Use os filtros e gráficos abaixo. O painel tem sua própria rolagem; você também "
            "pode ampliá-lo. Os dois conjuntos de dados são sintéticos."
        ),
        embed_iframe_title="Explorador interativo de regras de associação",
        md_nav_label="Versão Markdown",
        tutorial_md_href="material/tutorial-regras-associacao-20261017.md",
    ),
    Tutorial(
        fonte=Path("material/tutorial-media-movel-demanda-20261017.md"),
        saida_relativa=Path("demanda"),
        bi_dir=Path("material/bi-demanda"),
        pagetitle="Previsão de demanda semanal com média móvel",
        embed_titulo="Experimente a série neste tutorial",
        embed_intro=(
            "Escolha produto e janela abaixo. O painel tem sua própria rolagem; você também "
            "pode ampliá-lo. As 16 semanas são sintéticas."
        ),
        embed_iframe_title="Explorador interativo de previsão de demanda",
        md_nav_label="Versão Markdown",
        tutorial_md_href="material/tutorial-media-movel-demanda-20261017.md",
    ),
)


def pandoc(args: list[str], texto: str) -> str:
    return subprocess.run(
        ["pandoc", *args],
        input=texto,
        text=True,
        capture_output=True,
        check=True,
    ).stdout


def embed_html(tutorial: Tutorial) -> str:
    bi = tutorial.bi_dir.as_posix()
    return f"""<section id="explorador-interativo" class="interactive" aria-labelledby="explorer-heading">
<h3 id="explorer-heading">{tutorial.embed_titulo}</h3>
<p>{tutorial.embed_intro}</p>
<div class="explorer-actions">
<button id="fullscreen-explorer" type="button">Ver explorador em tela cheia</button>
<a href="{bi}/index.html" target="_blank" rel="noopener">Abrir explorador em nova aba</a>
</div>
<p id="explorer-status" role="status"></p>
<iframe id="explorer" src="{bi}/index.html" title="{tutorial.embed_iframe_title}"
loading="lazy" allow="fullscreen" allowfullscreen></iframe>
</section>"""


def gerar_tutorial(destino: Path, tutorial: Tutorial) -> None:
    assetroot = "" if tutorial.saida_relativa == Path(".") else "../"
    homehref = "./" if tutorial.saida_relativa == Path(".") else "../"
    demanda_href = "demanda/" if tutorial.saida_relativa == Path(".") else "./"
    assoc_href = "./" if tutorial.saida_relativa == Path(".") else "../"
    bi_index = tutorial.bi_dir.as_posix() + "/index.html"
    # Marcador no Markdown fonte (caminho relativo à pasta material/)
    bi_md_href = tutorial.bi_dir.name + "/index.html"

    arvore = json.loads(
        pandoc(
            ["--from=gfm+tex_math_dollars", "--to=json"],
            (RAIZ / tutorial.fonte).read_text(encoding="utf-8"),
        )
    )
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
                    relativo = Path(posixpath.normpath(str(tutorial.fonte.parent / uri.path)))
                    if relativo.is_absolute() or ".." in relativo.parts:
                        raise ValueError(f"Caminho fora do repositório: {relativo}")
                    if relativo == tutorial.fonte:
                        novo = "index.html"
                    elif no["t"] == "Image" or relativo.suffix in {".json", ".csv", ".xlsx"}:
                        arquivos.add(relativo)
                        # páginas em demanda/ precisam subir um nível até a raiz do build
                        novo = (Path(assetroot) / relativo).as_posix() if assetroot else relativo.as_posix()
                    elif relativo.as_posix() == bi_index:
                        novo = (Path(assetroot) / relativo).as_posix() if assetroot else relativo.as_posix()
                    else:
                        novo = REPO + relativo.as_posix()
                    alvo[0] = urlunsplit(("", "", novo, uri.query, uri.fragment))
            for valor in no.values():
                ajustar(valor)

    # Inserir o iframe antes de reescrever URLs, usando o href do Markdown.
    blocos = []
    incorporado = False
    for bloco in arvore["blocks"]:
        blocos.append(bloco)
        if (
            bloco.get("t") == "Para"
            and bi_md_href in json.dumps(bloco, ensure_ascii=False)
            and not incorporado
        ):
            blocos.append({"t": "RawBlock", "c": ["html", embed_html(tutorial)]})
            incorporado = True
    if not incorporado:
        raise ValueError(
            f"Não foi encontrada a apresentação do explorador em {tutorial.fonte}."
        )
    arvore["blocks"] = blocos
    ajustar(arvore)

    pasta = destino / tutorial.saida_relativa
    pasta.mkdir(parents=True, exist_ok=True)
    html = pandoc(
        [
            "--from=json",
            "--to=html5",
            "--standalone",
            "--mathml",
            "--toc",
            "--toc-depth=2",
            "--template=" + str(RAIZ / "pages/template.html"),
            f"--metadata=pagetitle:{tutorial.pagetitle}",
            f"--metadata=assetroot:{assetroot}",
            f"--metadata=homehref:{homehref}",
            f"--metadata=assoc_href:{assoc_href}",
            f"--metadata=demanda_href:{demanda_href}",
            f"--metadata=md_href:{REPO + tutorial.tutorial_md_href}",
            f"--metadata=md_label:{tutorial.md_nav_label}",
            f"--metadata=bi_nova_aba:{(Path(assetroot) / tutorial.bi_dir / 'index.html').as_posix() if assetroot else (tutorial.bi_dir / 'index.html').as_posix()}",
        ],
        json.dumps(arvore, ensure_ascii=False),
    )
    # Corrige caminhos do embed (iframe/link) quando a página está em /demanda/
    if assetroot:
        html = html.replace(
            f'src="{tutorial.bi_dir.as_posix()}/index.html"',
            f'src="{assetroot}{tutorial.bi_dir.as_posix()}/index.html"',
        )
        html = html.replace(
            f'href="{tutorial.bi_dir.as_posix()}/index.html"',
            f'href="{assetroot}{tutorial.bi_dir.as_posix()}/index.html"',
        )
    (pasta / "index.html").write_text(html, encoding="utf-8")

    for relativo in arquivos:
        alvo = destino / relativo
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(RAIZ / relativo, alvo)

    for nome in ["index.html", "painel.css", "painel.js", "dados.js"]:
        relativo = tutorial.bi_dir / nome
        alvo = destino / relativo
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(RAIZ / relativo, alvo)

    painel = destino / tutorial.bi_dir / "index.html"
    texto = painel.read_text(encoding="utf-8")
    # Do explorador (material/bi*/index.html no build) até a página do tutorial
    if tutorial.saida_relativa == Path("."):
        voltar = "../../index.html#explorador-interativo"
        md_local = f"../{tutorial.fonte.name}"
    else:
        voltar = f"../../{tutorial.saida_relativa.as_posix()}/index.html#explorador-interativo"
        md_local = f"../{tutorial.fonte.name}"
    texto = texto.replace(f'href="{md_local}"', f'href="{voltar}" target="_top"')
    texto = texto.replace(
        f'href="../{tutorial.fonte.name}"',
        f'href="{voltar}" target="_top"',
    )
    texto = texto.replace(
        'href="README.md"',
        f'href="{REPO}{tutorial.bi_dir.as_posix()}/README.md" target="_blank" rel="noopener"',
    )
    texto = texto.replace(
        "Abra este arquivo diretamente no navegador. Os dados e recursos são locais; nenhuma conexão é necessária.",
        "Este explorador também está disponível para uso offline na cópia local do repositório.",
    )
    # Imagens do hero no build: caminho relativo ao bi dir
    painel.write_text(texto, encoding="utf-8")
    print(f"  · {tutorial.fonte} → {pasta / 'index.html'} ({len(arquivos)} recursos)")


def gerar(destino: Path) -> None:
    destino = destino.resolve()
    if destino == RAIZ or RAIZ not in destino.parents:
        raise ValueError(
            "Use uma pasta de saída dentro do repositório, como .local/pages-build."
        )
    if destino.exists():
        shutil.rmtree(destino)
    destino.mkdir(parents=True, exist_ok=True)
    print(f"Gerando site em {destino}")
    for tutorial in TUTORIAIS:
        gerar_tutorial(destino, tutorial)
    for nome in ["tutorial.css", "tutorial.js"]:
        alvo = destino / "assets" / nome
        alvo.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(RAIZ / "pages" / nome, alvo)
    (destino / ".nojekyll").write_text("", encoding="utf-8")
    print(f"Site com {len(TUTORIAIS)} tutoriais e exploradores incorporados.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--saida", type=Path, default=RAIZ / ".local/pages-build")
    args = parser.parse_args()
    gerar(args.saida)


if __name__ == "__main__":
    main()
