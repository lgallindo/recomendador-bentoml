"""Verifique dados e interações do explorador com Playwright e Chromium instalados.

Na raiz: uv run --with playwright python -m unittest discover -s scripts -p 'test_bi_associacao.py'
"""

from __future__ import annotations

import csv
import io
import json
import struct
import tempfile
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent


class ExploradorBI(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls) -> None:
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self) -> None:
        self.context = self.browser.new_context(viewport={"width": 1440, "height": 1000},
                                               accept_downloads=True, offline=True)
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda erro: self.errors.append(str(erro)))
        self.page.goto((RAIZ / "material/bi/index.html").as_uri())

    def tearDown(self) -> None:
        self.assertEqual(self.errors, [])
        self.context.close()

    def test_contagens_e_selecao_original(self) -> None:
        rules = self.page.evaluate("window.ASSOCIACAO.regras")
        self.assertEqual(len(rules), 14)
        self.assertEqual(self.page.locator("#n-regras").inner_text(), "14")
        self.assertEqual(self.page.locator("#regras tbody tr").count(), 14)
        self.assertEqual(self.page.locator("#dispersao [role=button]").count(), 4)
        csv_rows = list(csv.DictReader(io.StringIO((RAIZ / "material/regras-associacao-20261017.csv").read_text())))
        expected = {r["antecedente_ids"].replace(" + ", "+") + "->" + r["consequente_ids"].replace(" + ", "+") for r in csv_rows}
        self.assertEqual({r["id"] for r in rules}, expected)
        for base, path in [("descoberta", "dados/catalogo.json"),
                           ("avaliacao", "material/cestas-validacao-20261017.json")]:
            baskets = [set(b) for b in json.loads((RAIZ / path).read_text())["cestas"]]
            for r in rules:
                a, b = set(r["a"]), set(r["b"])
                na = sum(a <= t for t in baskets)
                nb = sum(b <= t for t in baskets)
                joint = sum(a | b <= t for t in baskets)
                m = r[base]
                self.assertEqual((m["total"], m["na"], m["nb"], m["juntos"]), (len(baskets), na, nb, joint))
                self.assertAlmostEqual(m["suporte"], joint / len(baskets))
                if na:
                    self.assertAlmostEqual(m["confianca"], joint / na)
                else:
                    self.assertIsNone(m["confianca"])
                if na and nb:
                    self.assertAlmostEqual(m["lift"], joint * len(baskets) / (na * nb))
                else:
                    self.assertIsNone(m["lift"])

    def test_inversao_filtros_e_base_separada(self) -> None:
        self.page.locator("#inverter").click()
        self.assertEqual(self.page.locator("#ids-regra").inner_text(), "{p02} → {p01}")
        self.assertIn("100%", self.page.locator("#comparacao tbody tr").first.inner_text())
        self.page.locator("#inverter").click()
        self.page.locator("#suporte").fill("30")
        self.assertEqual(self.page.locator("#n-regras").inner_text(), "2")
        self.page.locator("#suporte").fill("31")
        self.assertEqual(self.page.locator("#n-regras").inner_text(), "0")
        self.assertIn("fora dos filtros", self.page.locator("#fora-filtro").inner_text())
        self.page.locator("#reset").click()
        self.page.locator("#base").select_option("avaliacao")
        self.assertIn("0,83", self.page.locator("#comparacao tbody tr").nth(1).inner_text())
        self.assertIn("fora dos filtros", self.page.locator("#fora-filtro").inner_text())
        self.page.locator("#todas").click()
        self.assertEqual(self.page.locator("#n-regras").inner_text(), "14")
        self.assertIn("—", self.page.locator("#regras tbody").inner_text())
        self.page.locator("#busca").fill("não-existe")
        self.assertEqual(self.page.locator("#n-regras").inner_text(), "0")
        self.page.locator("#busca").fill("")
        self.page.locator("#suporte").fill("-1")
        self.assertIn("Informe", self.page.locator("#erro-filtros").inner_text())

    def test_pontos_coincidentes_e_conjuntos_completos(self) -> None:
        point = self.page.locator('#dispersao [role="button"]').filter(has=self.page.locator("title")).all()
        group = next(p for p in point if p.get_attribute("aria-label").startswith("7 regras,"))
        group.focus()
        group.press("Enter")
        self.assertEqual(self.page.locator("#grupo button").count(), 7)
        self.page.locator("#grupo button").first.click()
        composite = self.page.locator('#matriz [role="button"][aria-label^="{p01 + p03} → {p02},"]')
        composite.focus()
        composite.press("Enter")
        self.assertEqual(self.page.locator("#ids-regra").inner_text(), "{p01 + p03} → {p02}")
        edge = self.page.locator('#rede path[role="button"][aria-label^="{p01} → {p02},"]')
        edge.focus()
        edge.press("Enter")
        self.assertEqual(self.page.locator("#ids-regra").inner_text(), "{p01} → {p02}")
        self.page.locator('#rede g[role="button"][aria-label^="Antecedente p01 + p03,"]').click()
        self.assertEqual(self.page.locator("#grupo button").count(), 1)

    def test_exportacoes_e_layout_mobile(self) -> None:
        with self.page.expect_download() as download:
            self.page.locator("#csv").click()
        content = Path(download.value.path()).read_text(encoding="utf-8-sig")
        rows = list(csv.DictReader(io.StringIO(content)))
        self.assertEqual(len(rows), 14)
        self.assertTrue(all(r["base"] == "descoberta" for r in rows))
        self.assertTrue(all(r["filtro_suporte_minimo"] == "0.2" for r in rows))
        self.assertTrue(all(r["universo_regras"] == "14" for r in rows))
        with tempfile.TemporaryDirectory() as tmp:
            for chart in ["validacao", "dispersao", "matriz", "rede"]:
                with self.page.expect_download() as download:
                    self.page.locator(f'button[data-svg="{chart}"]').click()
                file = Path(tmp) / f"{chart}.png"
                download.value.save_as(file)
                binary = file.read_bytes()
                self.assertEqual(binary[:8], b"\x89PNG\r\n\x1a\n")
                width, height = struct.unpack(">II", binary[16:24])
                self.assertGreaterEqual(width, 1000)
                self.assertGreater(height, 300)
        self.page.locator("#base").select_option("avaliacao")
        self.page.locator("#todas").click()
        with self.page.expect_download() as download:
            self.page.locator("#csv").click()
        content = Path(download.value.path()).read_text(encoding="utf-8-sig")
        rows = {r["regra"]: r for r in csv.DictReader(io.StringIO(content))}
        self.assertEqual(len(rows), 14)
        self.assertEqual(rows["p01+p02->p03"]["confianca"], "0")
        self.assertEqual(rows["p02+p03->p01"]["confianca"], "")
        self.assertEqual(rows["p01->p02"]["base"], "avaliacao")
        self.assertEqual(rows["p01->p02"]["filtro_suporte_minimo"], "")
        self.page.set_viewport_size({"width": 390, "height": 844})
        self.assertTrue(self.page.locator("#busca").is_visible())
        overflow = self.page.evaluate("document.documentElement.scrollWidth > innerWidth")
        self.assertFalse(overflow)


if __name__ == "__main__":
    unittest.main()
