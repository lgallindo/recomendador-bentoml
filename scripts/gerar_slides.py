#!/usr/bin/env python3
"""Gera os 5 slides da aula — só esta pasta (sem importar outras aulas).

    uv run python scripts/gerar_slides.py
"""

from __future__ import annotations

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Emu, Inches, Pt

# Identidade: carvão + verde-água (artesanato + serviço). Sem roxo genérico.
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


def _run(par, texto, tam, *, cor=TINTA, fonte=SANS, negrito=False, italico=False):
    r = par.add_run()
    r.text = texto
    r.font.name = fonte
    r.font.size = Pt(tam)
    r.font.color.rgb = cor
    r.font.bold = negrito
    r.font.italic = italico
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


def rotulo_em(shape, texto, tam, *, cor=CLARO, negrito=True, fonte=SANS):
    tf = shape.text_frame
    tf.word_wrap = True
    tf.auto_size = None
    tf.paragraphs[0].alignment = PP_ALIGN.CENTER
    tf.paragraphs[0].clear()
    # vertical center approx via anchor
    try:
        tf.paragraphs[0].space_before = Pt(6)
    except Exception:
        pass
    _run(tf.paragraphs[0], texto, tam, cor=cor, fonte=fonte, negrito=negrito)
    shape.text_frame.word_wrap = True


def seta_h(slide, x1, x2, y):
    """Linha horizontal com triângulo à direita."""
    linha = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x1, y - Emu(20000), x2 - x1 - Inches(0.12), Emu(40000))
    linha.fill.solid()
    linha.fill.fore_color.rgb = ACENTO
    linha.line.fill.background()
    linha.shadow.inherit = False
    tri = slide.shapes.add_shape(MSO_SHAPE.RIGHT_ARROW, x2 - Inches(0.22), y - Inches(0.12), Inches(0.28), Inches(0.24))
    tri.fill.solid()
    tri.fill.fore_color.rgb = ACENTO
    tri.line.fill.background()
    tri.shadow.inherit = False


def fundo(slide, cor):
    f = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, L, A)
    f.fill.solid()
    f.fill.fore_color.rgb = cor
    f.line.fill.background()
    # send to back
    spTree = slide.shapes._spTree
    sp = f._element
    spTree.remove(sp)
    spTree.insert(2, sp)


def slide1_texto(prs):
    """Único slide predominantemente textual."""
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, ESCURO)
    caixa_texto(
        s, Inches(0.9), Inches(1.4), Inches(11.5), Inches(1.0),
        "Recomendação como serviço",
        40, cor=CLARO, fonte=SERIFA, negrito=True,
    )
    caixa_texto(
        s, Inches(0.9), Inches(2.5), Inches(11.5), Inches(3.8),
        [
            "Hoje subimos um baseline honesto: mesma técnica do produto âncora,",
            "ordenado por popularidade, com fallback pelos mais pedidos.",
            "",
            "Não é filtragem colaborativa. Não há histórico real de navegação.",
            "O contrato HTTP (BentoML) é o que a vitrine vai consumir depois.",
            "",
            "Objetivo da aula: treinar o artefato, servir em localhost:3000,",
            "ler o JSON e saber repetir as contas do score no papel.",
        ],
        22, cor=RGBColor(0xD5, 0xE0, 0xDE), fonte=SANS, espaco=6,
    )
    caixa_texto(
        s, Inches(0.9), Inches(6.7), Inches(11.5), Inches(0.4),
        "1 / 5  ·  texto",
        12, cor=APAGADO, fonte=SANS,
    )


def slide2_diagrama(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, PAPEL)
    caixa_texto(s, Inches(0.7), Inches(0.35), Inches(12), Inches(0.6),
                "Do catálogo ao HTTP", 32, fonte=SERIFA, negrito=True)
    caixa_texto(s, Inches(0.7), Inches(0.95), Inches(12), Inches(0.4),
                "Fluxo desta pasta — nada de outro repositório", 16, cor=APAGADO)

    etapas = [
        ("dados/\ncatalogo.json", CAIXA, TINTA),
        ("treino.py\nartefato", ACENTO, CLARO),
        ("model store\nBentoML", ESCURO, CLARO),
        ("service.py\nPOST /recomendar", ACENTO, CLARO),
        ("JSON\nitems[]", CAIXA, TINTA),
    ]
    y = Inches(2.6)
    w, h = Inches(2.0), Inches(1.35)
    gap = Inches(0.35)
    x0 = Inches(0.55)
    for i, (rotulo, fill, cor_txt) in enumerate(etapas):
        x = x0 + i * (w + gap)
        sh = retangulo(s, x, y, w, h, fill)
        tf = sh.text_frame
        tf.word_wrap = True
        tf.clear()
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        for j, linha in enumerate(rotulo.split("\n")):
            par = p if j == 0 else tf.add_paragraph()
            par.alignment = PP_ALIGN.CENTER
            _run(par, linha, 14, cor=cor_txt, fonte=SANS, negrito=True)
        if i < len(etapas) - 1:
            seta_h(s, x + w, x + w + gap, y + h / 2)

    caixa_texto(
        s, Inches(0.7), Inches(4.5), Inches(12), Inches(2.0),
        [
            "Regra em linguagem natural",
            "1. Filtrar mesma técnica · 2. Ordenar por pedidos (+ co-ocorrência) ·",
            "3. Se faltar vaga, completar com os mais pedidos do catálogo.",
        ],
        18, cor=TINTA, espaco=4,
    )
    caixa_texto(s, Inches(0.7), Inches(6.7), Inches(12), Inches(0.4),
                "2 / 5  ·  diagrama", 12, cor=APAGADO)


def slide3_exemplo(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, PAPEL)
    caixa_texto(s, Inches(0.7), Inches(0.3), Inches(12), Inches(0.55),
                "Conta trabalhada — âncora p01 (cerâmica)", 28, fonte=SERIFA, negrito=True)

    # left: formulas
    retangulo(s, Inches(0.55), Inches(1.1), Inches(6.0), Inches(5.2), CAIXA, borda=ACENTO)
    caixa_texto(
        s, Inches(0.75), Inches(1.25), Inches(5.6), Inches(4.9),
        [
            "pop_norm = pedidos / 42",
            "p02: 28/42 ≈ 0,6667",
            "p03: 19/42 ≈ 0,4524",
            "",
            "sim(p01,p02)=1,00  sim(p01,p03)≈0,67",
            "",
            "mesma técnica:",
            "score = 0,7·pop_norm + 0,3·sim",
            "",
            "p02: 0,7·0,6667 + 0,3·1 = 0,7667",
            "p03: 0,7·0,4524 + 0,3·0,67 ≈ 0,5167",
            "",
            "Só 2 cerâmicas → fallback",
            "p04, p07 com score = 0,5·pop_norm",
        ],
        16, fonte=MONO, espaco=3,
    )

    # right: ranked list
    retangulo(s, Inches(6.9), Inches(1.1), Inches(5.8), Inches(5.2), ESCURO)
    caixa_texto(
        s, Inches(7.1), Inches(1.3), Inches(5.4), Inches(4.8),
        [
            "Resposta (ordem)",
            "",
            "1  p02  mesma_tecnica   0,7667",
            "2  p03  mesma_tecnica   0,5167",
            "3  p04  fallback        0,4167",
            "4  p07  fallback        0,3690",
            "",
            "fallback_used = true",
            "",
            "Detalhe: material/",
            "calculos-trabalhados.md",
        ],
        17, cor=CLARO, fonte=MONO, espaco=4,
    )
    caixa_texto(s, Inches(0.7), Inches(6.7), Inches(12), Inches(0.4),
                "3 / 5  ·  exemplo numérico", 12, cor=APAGADO)


def slide4_codigo(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, ESCURO)
    caixa_texto(s, Inches(0.7), Inches(0.3), Inches(12), Inches(0.5),
                "Código comentado — o miolo do serviço", 28, cor=CLARO, fonte=SERIFA, negrito=True)

    codigo = [
        "@bentoml.api",
        "def recomendar(self, produto_ancora, limite=4, excluir=None):",
        "    # 1) candidatos = mesma técnica, sem âncora/excluir",
        "    # 2) ordena por (pedidos, similaridade)",
        "    # 3) se len < limite → completa com populares",
        "    # 4) score = 0.7*pop_n + 0.3*sim   (ou 0.5*pop_n)",
        "    return {\"items\": [...], \"fallback_used\": ...}",
    ]
    retangulo(s, Inches(0.7), Inches(1.1), Inches(12.0), Inches(3.6), CODIGO_BG)
    caixa_texto(
        s, Inches(0.95), Inches(1.3), Inches(11.5), Inches(3.3),
        codigo, 18, cor=RGBColor(0xB8, 0xE0, 0xD8), fonte=MONO, espaco=6,
    )
    caixa_texto(
        s, Inches(0.7), Inches(5.0), Inches(12), Inches(1.4),
        [
            "treino.py grava o dicionário (produtos, popularidade, similaridade) no store.",
            "service.py só carrega o pickle e aplica a regra — fácil de trocar depois",
            "por um modelo treinado sem mudar o contrato HTTP.",
        ],
        16, cor=RGBColor(0xC5, 0xD0, 0xCE), espaco=4,
    )
    caixa_texto(s, Inches(0.7), Inches(6.7), Inches(12), Inches(0.4),
                "4 / 5  ·  código", 12, cor=APAGADO)


def slide5_mapa_ia(prs):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    fundo(s, PAPEL)
    caixa_texto(s, Inches(0.7), Inches(0.25), Inches(12), Inches(0.5),
                "Onde isso entra no mapa da IA", 28, fonte=SERIFA, negrito=True)

    blocos = [
        (Inches(0.55), "IA simbólica\n/ regras",
         "Nosso baseline\nvive aqui hoje", ACENTO, CLARO),
        (Inches(4.7), "Aprendizado\nde máquina",
         "Supervisionado,\nnão supervisionado,\npor reforço", ESCURO, CLARO),
        (Inches(8.85), "IA generativa\n/ LLMs",
         "Texto, código,\nagentes — outro\ncanto do mapa", CAIXA, TINTA),
    ]
    for x, titulo, sub, fill, cor in blocos:
        sh = retangulo(s, x, Inches(1.15), Inches(3.7), Inches(2.6), fill)
        tf = sh.text_frame
        tf.clear()
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        for j, linha in enumerate(titulo.split("\n")):
            par = p if j == 0 else tf.add_paragraph()
            par.alignment = PP_ALIGN.CENTER
            _run(par, linha, 18, cor=cor, fonte=SANS, negrito=True)
        for linha in sub.split("\n"):
            par = tf.add_paragraph()
            par.alignment = PP_ALIGN.CENTER
            _run(par, linha, 13, cor=cor, fonte=SANS)

    caixa_texto(
        s, Inches(0.7), Inches(4.1), Inches(12), Inches(2.3),
        [
            "Recomendação “de verdade” no AM costuma ser: conteúdo, colaborativa,",
            "ou híbrida — com dados de interação e métricas (precisão@k, recall@k).",
            "",
            "Próximo passo de estudo (módulo Microsoft Learn, pt-BR): fundamentos",
            "de AM para evoluir esta regra até um modelo treinado — mantendo o BentoML.",
            "Antes disso: ligar esta API à vitrine do marketplace da primeira aula.",
        ],
        16, cor=TINTA, espaco=3,
    )
    caixa_texto(s, Inches(0.7), Inches(6.7), Inches(12), Inches(0.4),
                "5 / 5  ·  mapa IA / AM", 12, cor=APAGADO)


def main() -> None:
    prs = Presentation()
    prs.slide_width = L
    prs.slide_height = A
    slide1_texto(prs)
    slide2_diagrama(prs)
    slide3_exemplo(prs)
    slide4_codigo(prs)
    slide5_mapa_ia(prs)
    SAIDA.parent.mkdir(parents=True, exist_ok=True)
    prs.save(SAIDA)
    print(f"escrito {SAIDA}  ({SAIDA.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
