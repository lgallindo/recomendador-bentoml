#!/usr/bin/env python3
"""Gera os 5 slides da aula.

    uv run python scripts/gerar_slides.py
"""

from __future__ import annotations

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Inches, Pt

TINTA = RGBColor(0x1A, 0x1A, 0x1A)
PAPEL = RGBColor(0xF7, 0xF5, 0xF0)
ESCURO = RGBColor(0x1E, 0x2A, 0x2E)
ACENTO = RGBColor(0x0D, 0x7A, 0x6F)
CLARO = RGBColor(0xFF, 0xFF, 0xFF)
APAGADO = RGBColor(0x4A, 0x55, 0x58)
CAIXA = RGBColor(0xE8, 0xF2, 0xF0)
CODIGO_BG = RGBColor(0x24, 0x32, 0x36)

SERIFA = "Georgia"
SANS = "Calibri"
MONO = "Consolas"

L, A = Inches(13.333), Inches(7.5)
SAIDA = Path(__file__).resolve().parent.parent / "slides" / "recomendador-bentoml.pptx"


def _run(par, texto, tam, *, cor=TINTA, fonte=SANS, negrito=False):
    r = par.add_run()
    r.text = texto
    r.font.name = fonte
    r.font.size = Pt(tam)
    r.font.color.rgb = cor
    r.font.bold = negrito
    return r


def caixa_texto(slide, x, y, w, h, linhas, tam, *, cor=TINTA, fonte=SANS,
                negrito=False, alinha=PP_ALIGN.LEFT, espaco=8):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.word_wrap = True
    tf.margin_left = tf.margin_right = Pt(4)
    tf.margin_top = tf.margin_bottom = Pt(2)
    for i, linha in enumerate(linhas if isinstance(linhas, list) else [linhas]):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.alignment = alinha
        p.space_after = Pt(espaco)
        _run(p, linha, tam, cor=cor, fonte=fonte, negrito=negrito)
    return tb


def retangulo(slide, x, y, w, h, preenchimento, *, borda=None):
    sh = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    sh.fill.solid()
    sh.fill.fore_color.rgb = preenchimento
    if borda is None:
        sh.line.fill.background()
    else:
        sh.line.color.rgb = borda
        sh.line.width = Pt(1.25)
    sh.shadow.inherit = False
    return sh


def seta_h(slide, x1, x2, y):
    linha = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, x1, y - Emu(20000), x2 - x1 - Inches(0.12), Emu(40000)
    )
    linha.fill.solid()
    linha.fill.fore_color.rgb = ACENTO
    linha.line.fill.background()
    linha.shadow.inherit = False
    tri = slide.shapes.add_shape(
        MSO_SHAPE.RIGHT_ARROW, x2 - Inches(0.22), y - Inches(0.12), Inches(0.28), Inches(0.24)
    )
    tri.fill.solid()
    tri.fill.fore_color.rgb = ACENTO
    tri.line.fill.background()
    tri.shadow.inherit = False


def fundo(slide, cor):
    f = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, L, A)
    f.fill.solid()
    f.fill.fore_color.rgb = cor
    f.line.fill.background()
    spTree = slide.shapes._spTree
    sp = f._element
    spTree.remove(sp)
    spTree.insert(2, sp)


def slide1_objetivo(prs):
    """Único slide textual: objetivo, entrada, saída."""
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, ESCURO)
    caixa_texto(
        s, Inches(0.8), Inches(0.55), Inches(11.7), Inches(0.7),
        "Objetivo desta aula", 36, cor=CLARO, fonte=SERIFA, negrito=True,
    )
    caixa_texto(
        s, Inches(0.8), Inches(1.45), Inches(11.7), Inches(1.2),
        [
            "Fazer o computador sugerir outros produtos quando o cliente",
            "abre a página de um produto — e publicar isso como serviço HTTP.",
        ],
        22, cor=RGBColor(0xD5, 0xE0, 0xDE), fonte=SANS, espaco=4,
    )

    # three boxes: goal already said; input; output
    retangulo(s, Inches(0.8), Inches(3.0), Inches(5.5), Inches(2.8), CODIGO_BG)
    caixa_texto(
        s, Inches(1.0), Inches(3.15), Inches(5.1), Inches(2.5),
        [
            "ENTRADA",
            "",
            "• produto_na_pagina  (ex.: p01)",
            "• limite  (ex.: 4)",
            "• excluir  (lista de ids)",
        ],
        18, cor=CLARO, fonte=SANS, espaco=4,
    )
    retangulo(s, Inches(6.9), Inches(3.0), Inches(5.5), Inches(2.8), ACENTO)
    caixa_texto(
        s, Inches(7.1), Inches(3.15), Inches(5.1), Inches(2.5),
        [
            "SAÍDA",
            "",
            "• lista de produtos",
            "• cada um com nome, nota",
            "  e posição na lista",
        ],
        18, cor=CLARO, fonte=SANS, espaco=4,
    )
    caixa_texto(s, Inches(0.8), Inches(6.7), Inches(12), Inches(0.35),
                "1 / 6", 12, cor=APAGADO)


def slide2_fluxo_codigo(prs):
    """Diagrama: workflow paired with code files."""
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, PAPEL)
    caixa_texto(
        s, Inches(0.6), Inches(0.3), Inches(12), Inches(0.55),
        "Fluxo e onde está no código", 30, fonte=SERIFA, negrito=True,
    )

    pares = [
        ("1. Ler catálogo\ne cestas", "dados/\ncatalogo.json"),
        ("2. Calcular notas\ne gravar", "treino.py"),
        ("3. Guardar\nartefato", "model store\nBentoML"),
        ("4. Receber HTTP\ne montar lista", "service.py\nrecomendar()"),
        ("5. Devolver\nJSON", "resposta\nitems[]"),
    ]
    y_top, y_bot = Inches(1.5), Inches(4.0)
    w, h = Inches(2.15), Inches(1.45)
    gap = Inches(0.28)
    x0 = Inches(0.45)
    for i, (fluxo, codigo) in enumerate(pares):
        x = x0 + i * (w + gap)
        sh1 = retangulo(s, x, y_top, w, h, ACENTO if i % 2 == 0 else ESCURO)
        tf = sh1.text_frame
        tf.clear()
        for j, linha in enumerate(fluxo.split("\n")):
            p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
            p.alignment = PP_ALIGN.CENTER
            _run(p, linha, 13, cor=CLARO, fonte=SANS, negrito=True)
        sh2 = retangulo(s, x, y_bot, w, h, CAIXA, borda=ACENTO)
        tf2 = sh2.text_frame
        tf2.clear()
        for j, linha in enumerate(codigo.split("\n")):
            p = tf2.paragraphs[0] if j == 0 else tf2.add_paragraph()
            p.alignment = PP_ALIGN.CENTER
            _run(p, linha, 13, cor=TINTA, fonte=MONO, negrito=True)
        # vertical connector
        conn = s.shapes.add_shape(
            MSO_SHAPE.RECTANGLE, x + w / 2 - Emu(15000), y_top + h,
            Emu(30000), y_bot - (y_top + h),
        )
        conn.fill.solid()
        conn.fill.fore_color.rgb = ACENTO
        conn.line.fill.background()
        conn.shadow.inherit = False
        if i < len(pares) - 1:
            seta_h(s, x + w, x + w + gap, y_top + h / 2)

    caixa_texto(
        s, Inches(0.6), Inches(5.8), Inches(12), Inches(0.7),
        "Linha de cima = o que acontece · linha de baixo = arquivo ou peça do sistema",
        16, cor=APAGADO,
    )
    caixa_texto(s, Inches(0.6), Inches(6.7), Inches(12), Inches(0.35),
                "2 / 6", 12, cor=APAGADO)


def slide3_treino(prs):
    """O que treino.py faz — entre o fluxo e o exemplo numérico."""
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, PAPEL)
    caixa_texto(
        s, Inches(0.55), Inches(0.25), Inches(12.2), Inches(0.5),
        "O que treino.py faz", 30, fonte=SERIFA, negrito=True,
    )
    caixa_texto(
        s, Inches(0.55), Inches(0.85), Inches(12.2), Inches(0.4),
        "Roda uma vez antes de servir. Prepara números que o service.py só consulta.",
        16, cor=APAGADO,
    )

    passos = [
        ("Lê", "dados/catalogo.json\nprodutos + cestas"),
        ("Calcula", "pedidos ÷ máximo\ne “juntos” nas cestas"),
        ("Empacota", "um dicionário\nPython"),
        ("Grava", "no store BentoML\n(recomendador:…)"),
    ]
    y, w, h = Inches(1.55), Inches(2.85), Inches(2.0)
    gap = Inches(0.25)
    x0 = Inches(0.55)
    for i, (titulo, detalhe) in enumerate(passos):
        x = x0 + i * (w + gap)
        sh = retangulo(s, x, y, w, h, ACENTO if i % 2 == 0 else ESCURO)
        tf = sh.text_frame
        tf.clear()
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        _run(p, titulo, 20, cor=CLARO, fonte=SANS, negrito=True)
        for linha in detalhe.split("\n"):
            p2 = tf.add_paragraph()
            p2.alignment = PP_ALIGN.CENTER
            _run(p2, linha, 13, cor=CLARO, fonte=SANS)
        if i < len(passos) - 1:
            seta_h(s, x + w, x + w + gap, y + h / 2)

    retangulo(s, Inches(0.55), Inches(4.0), Inches(12.2), Inches(2.2), CAIXA, borda=ACENTO)
    caixa_texto(
        s, Inches(0.75), Inches(4.2), Inches(11.8), Inches(1.9),
        [
            "Entrada do treino: o JSON do catálogo.",
            "Saída do treino: arquivo no model store (pedidos_brutos, pop, cooc, nomes).",
            "Na aula: just treino  →  depois  just serve.",
            "O cliente HTTP nunca chama treino.py; só o endpoint recomendar.",
        ],
        16, fonte=SANS, espaco=4,
    )
    caixa_texto(s, Inches(0.55), Inches(6.7), Inches(12), Inches(0.35),
                "3 / 6", 12, cor=APAGADO)


def slide4_exemplo(prs):
    """Worked example with product names, not jargon."""
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, PAPEL)
    caixa_texto(
        s, Inches(0.55), Inches(0.25), Inches(12.2), Inches(0.5),
        "Exemplo: cliente abriu o Jarro de barro", 26, fonte=SERIFA, negrito=True,
    )
    caixa_texto(
        s, Inches(0.55), Inches(0.8), Inches(12.2), Inches(0.4),
        "produto_na_pagina = p01 · técnica = cerâmica · pedimos 4 sugestões",
        15, cor=APAGADO,
    )

    # left narrative steps
    retangulo(s, Inches(0.5), Inches(1.35), Inches(6.2), Inches(4.9), CAIXA, borda=ACENTO)
    caixa_texto(
        s, Inches(0.7), Inches(1.5), Inches(5.8), Inches(4.6),
        [
            "1. Outros de cerâmica: Prato, Boneca",
            "   (só 2 — ainda faltam vagas)",
            "",
            "2. Nota = 0,7×popularidade + 0,3×juntos",
            "   Prato ≈ 0,77 · Boneca ≈ 0,52",
            "",
            "3. Completar com os mais pedidos:",
            "   Rendeira ≈ 0,42 · Xilogravura ≈ 0,37",
            "",
            "Detalhe das contas:",
            "material/calculos-trabalhados.md",
        ],
        15, fonte=SANS, espaco=3,
    )

    retangulo(s, Inches(7.0), Inches(1.35), Inches(5.7), Inches(4.9), ESCURO)
    caixa_texto(
        s, Inches(7.2), Inches(1.55), Inches(5.3), Inches(4.5),
        [
            "Lista devolvida",
            "",
            "1  Prato esmaltado",
            "2  Boneca de barro",
            "3  Rendeira Alto do Moura",
            "4  Xilogravura Pilar",
            "",
            "just curl-exemplo",
        ],
        17, cor=CLARO, fonte=SANS, espaco=5,
    )
    caixa_texto(s, Inches(0.55), Inches(6.7), Inches(12), Inches(0.35),
                "4 / 6", 12, cor=APAGADO)


def slide5_codigo(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, ESCURO)
    caixa_texto(
        s, Inches(0.6), Inches(0.3), Inches(12), Inches(0.5),
        "Mesmos passos no código", 28, cor=CLARO, fonte=SERIFA, negrito=True,
    )
    retangulo(s, Inches(0.6), Inches(1.0), Inches(12.1), Inches(5.2), CODIGO_BG)
    caixa_texto(
        s, Inches(0.85), Inches(1.2), Inches(11.6), Inches(4.8),
        [
            "# service.py — função recomendar",
            "",
            "# passo 1  candidatos = mesma técnica do produto_na_pagina",
            "# passo 2  ordenar por pedidos (+ “juntos” nas cestas)",
            "# passo 3  se ainda faltar vaga → pegar os mais pedidos",
            "# passo 4  montar items[] com nome, score, reason, rank",
            "",
            "# treino.py — roda antes, uma vez",
            "# lê catalogo.json  →  grava pedidos_brutos, pop e cooc",
        ],
        17, cor=RGBColor(0xB8, 0xE0, 0xD8), fonte=MONO, espaco=5,
    )
    caixa_texto(s, Inches(0.6), Inches(6.7), Inches(12), Inches(0.35),
                "5 / 6", 12, cor=APAGADO)


def slide6_mapa(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, PAPEL)
    caixa_texto(
        s, Inches(0.6), Inches(0.25), Inches(12), Inches(0.5),
        "Onde isso fica no mapa da Inteligência Artificial", 24, fonte=SERIFA, negrito=True,
    )

    blocos = [
        (Inches(0.5), "Regras\nexplícitas",
         "Hoje: mesma técnica\n+ mais pedidos", ACENTO),
        (Inches(4.7), "Aprendizado\nde máquina",
         "O computador ajusta\nparâmetros com dados\ne métricas", ESCURO),
        (Inches(8.9), "IA generativa",
         "Texto, imagens,\nagentes conversando", CAIXA),
    ]
    for x, titulo, sub, fill in blocos:
        cor = CLARO if fill != CAIXA else TINTA
        sh = retangulo(s, x, Inches(1.1), Inches(3.7), Inches(2.7), fill, borda=ACENTO if fill == CAIXA else None)
        tf = sh.text_frame
        tf.clear()
        for j, linha in enumerate(titulo.split("\n")):
            p = tf.paragraphs[0] if j == 0 else tf.add_paragraph()
            p.alignment = PP_ALIGN.CENTER
            _run(p, linha, 18, cor=cor, fonte=SANS, negrito=True)
        for linha in sub.split("\n"):
            p = tf.add_paragraph()
            p.alignment = PP_ALIGN.CENTER
            _run(p, linha, 13, cor=cor, fonte=SANS)

    caixa_texto(
        s, Inches(0.6), Inches(4.2), Inches(12.1), Inches(2.2),
        [
            "Os três campos se misturam em produtos reais. Nesta aula ficamos no",
            "primeiro: uma regra clara, testável, servida por HTTP.",
            "",
            "Depois: (1) ligar à vitrine do marketplace · (2) estudar fundamentos",
            "de aprendizado de máquina (Microsoft Learn, pt-BR) para trocar a regra",
            "por um modelo treinado — sem mudar o contrato da API.",
        ],
        16, cor=TINTA, espaco=3,
    )
    caixa_texto(s, Inches(0.6), Inches(6.7), Inches(12), Inches(0.35),
                "6 / 6", 12, cor=APAGADO)


def main() -> None:
    prs = Presentation()
    prs.slide_width = L
    prs.slide_height = A
    slide1_objetivo(prs)
    slide2_fluxo_codigo(prs)
    slide3_treino(prs)
    slide4_exemplo(prs)
    slide5_codigo(prs)
    slide6_mapa(prs)
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    prs.save(SAIDA)
    print(f"escrito {SAIDA}  ({SAIDA.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
