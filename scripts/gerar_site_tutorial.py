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
    saida_relativa: Path
    bi_dir: Path | None
    pagetitle: str
    embed_titulo: str
    embed_intro: str
    embed_iframe_title: str
    md_nav_label: str
    tutorial_md_href: str


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
        fonte=Path("material/tutorial-regras-associacao-logs-autenticacao-20261017.md"),
        saida_relativa=Path("logs-auth"),
        bi_dir=None,
        pagetitle="Regras de associação a partir de logs de autenticação",
        embed_titulo="",
        embed_intro="",
        embed_iframe_title="",
        md_nav_label="Versão Markdown",
        tutorial_md_href="material/tutorial-regras-associacao-logs-autenticacao-20261017.md",
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
    Tutorial(
        fonte=Path("material/tutorial-regressao-quadrados-minimos-demanda-20261017.md"),
        saida_relativa=Path("demanda-mq"),
        bi_dir=Path("material/bi-demanda-mq"),
        pagetitle="Previsão de demanda com regressão por mínimos quadrados",
        embed_titulo="Experimente a reta neste tutorial",
        embed_intro=(
            "Escolha produto e método abaixo. Compare mínimos quadrados com média móvel "
            "e com a previsão ingênua. As 16 semanas são sintéticas."
        ),
        embed_iframe_title="Explorador interativo de mínimos quadrados",
        md_nav_label="Versão Markdown",
        tutorial_md_href="material/tutorial-regressao-quadrados-minimos-demanda-20261017.md",
    ),
    Tutorial(
        fonte=Path("material/tutorial-perceptron-demanda-20261026.md"),
        saida_relativa=Path("demanda-perc"),
        bi_dir=Path("material/bi-demanda-perceptron"),
        pagetitle="Previsão de demanda com perceptron / LMS",
        embed_titulo="Experimente o LMS neste tutorial",
        embed_intro=(
            "Escolha produto e método. Veja a curva de MSE e compare o MAE com os baselines. "
            "As 16 semanas são sintéticas."
        ),
        embed_iframe_title="Explorador interativo LMS / ADALINE",
        md_nav_label="Versão Markdown",
        tutorial_md_href="material/tutorial-perceptron-demanda-20261026.md",
    ),
    Tutorial(
        fonte=Path("material/tutorial-previsao-probabilistica-demanda-20261017.md"),
        saida_relativa=Path("demanda-poisson"),
        bi_dir=Path("material/bi-demanda-poisson"),
        pagetitle="Previsão probabilística de demanda com regressão de Poisson",
        embed_titulo="Experimente a distribuição neste tutorial",
        embed_intro=(
            "Escolha o produto e leia a PMF, o intervalo de 95% e a cobertura no teste. "
            "As 16 semanas são sintéticas."
        ),
        embed_iframe_title="Explorador interativo de regressão de Poisson",
        md_nav_label="Versão Markdown",
        tutorial_md_href="material/tutorial-previsao-probabilistica-demanda-20261017.md",
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
    assert tutorial.bi_dir is not None
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


def nav_hrefs(saida: Path) -> dict[str, str]:
    """Paths relative to the page being generated."""
    roots = {
        "home": Path("."),
        "assoc": Path("."),
        "logs": Path("logs-auth"),
        "demanda": Path("demanda"),
        "mq": Path("demanda-mq"),
        "perc": Path("demanda-perc"),
        "poisson": Path("demanda-poisson"),
    }

    def rel(target: Path) -> str:
        if saida == Path("."):
            if target == Path("."):
                return "./"
            return target.as_posix() + "/"
        if target == Path("."):
            return "../"
        if target == saida:
            return "./"
        return f"../{target.as_posix()}/"

    return {chave: rel(alvo) for chave, alvo in roots.items()}


def gerar_tutorial(destino: Path, tutorial: Tutorial) -> None:
    assetroot = "" if tutorial.saida_relativa == Path(".") else "../"
    nav = nav_hrefs(tutorial.saida_relativa)
    bi_index = (
        tutorial.bi_dir.as_posix() + "/index.html" if tutorial.bi_dir else None
    )
    bi_md_href = tutorial.bi_dir.name + "/index.html" if tutorial.bi_dir else None

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
                    relativo = Path(
                        posixpath.normpath(str(tutorial.fonte.parent / uri.path))
                    )
                    if relativo.is_absolute() or ".." in relativo.parts:
                        raise ValueError(f"Caminho fora do repositório: {relativo}")
                    if relativo == tutorial.fonte:
                        novo = "index.html"
                    elif no["t"] == "Image" or relativo.suffix in {
                        ".json",
                        ".csv",
                        ".xlsx",
                        ".jsonl",
                    }:
                        arquivos.add(relativo)
                        novo = (
                            (Path(assetroot) / relativo).as_posix()
                            if assetroot
                            else relativo.as_posix()
                        )
                    elif bi_index and relativo.as_posix() == bi_index:
                        novo = (
                            (Path(assetroot) / relativo).as_posix()
                            if assetroot
                            else relativo.as_posix()
                        )
                    else:
                        novo = REPO + relativo.as_posix()
                    alvo[0] = urlunsplit(("", "", novo, uri.query, uri.fragment))
            for valor in no.values():
                ajustar(valor)

    blocos = []
    incorporado = tutorial.bi_dir is None
    for bloco in arvore["blocks"]:
        blocos.append(bloco)
        if (
            tutorial.bi_dir is not None
            and bi_md_href
            and bloco.get("t") == "Para"
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
    bi_meta = ""
    if tutorial.bi_dir is not None:
        bi_meta = (
            (Path(assetroot) / tutorial.bi_dir / "index.html").as_posix()
            if assetroot
            else (tutorial.bi_dir / "index.html").as_posix()
        )
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
            f"--metadata=homehref:{nav['home']}",
            f"--metadata=assoc_href:{nav['assoc']}",
            f"--metadata=logs_href:{nav['logs']}",
            f"--metadata=demanda_href:{nav['demanda']}",
            f"--metadata=demanda_mq_href:{nav['mq']}",
            f"--metadata=demanda_perc_href:{nav['perc']}",
            f"--metadata=demanda_poisson_href:{nav['poisson']}",
            f"--metadata=md_href:{REPO + tutorial.tutorial_md_href}",
            f"--metadata=md_label:{tutorial.md_nav_label}",
            f"--metadata=bi_nova_aba:{bi_meta}",
        ],
        json.dumps(arvore, ensure_ascii=False),
    )
    if tutorial.bi_dir is not None and assetroot:
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

    if tutorial.bi_dir is not None:
        for nome in ["index.html", "painel.css", "painel.js", "dados.js"]:
            relativo = tutorial.bi_dir / nome
            alvo = destino / relativo
            alvo.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(RAIZ / relativo, alvo)

        painel = destino / tutorial.bi_dir / "index.html"
        texto = painel.read_text(encoding="utf-8")
        if tutorial.saida_relativa == Path("."):
            voltar = "../../index.html#explorador-interativo"
        else:
            voltar = (
                f"../../{tutorial.saida_relativa.as_posix()}/index.html"
                "#explorador-interativo"
            )
        md_local = f"../{tutorial.fonte.name}"
        texto = texto.replace(f'href="{md_local}"', f'href="{voltar}" target="_top"')
        texto = texto.replace(
            f'href="../{tutorial.fonte.name}"',
            f'href="{voltar}" target="_top"',
        )
        texto = texto.replace(
            'href="README.md"',
            f'href="{REPO}{tutorial.bi_dir.as_posix()}/README.md" '
            'target="_blank" rel="noopener"',
        )
        texto = texto.replace(
            "Abra este arquivo diretamente no navegador. Os dados e recursos "
            "são locais; nenhuma conexão é necessária.",
            "Este explorador também está disponível para uso offline na cópia "
            "local do repositório.",
        )
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
    print(f"Site com {len(TUTORIAIS)} tutoriais.")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--saida", type=Path, default=RAIZ / ".local/pages-build")
    args = parser.parse_args()
    gerar(args.saida)


if __name__ == "__main__":
    main()
