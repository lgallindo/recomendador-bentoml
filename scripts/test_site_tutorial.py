"""Verifique a versão HTML e o explorador incorporado com Chromium e Playwright."""

from __future__ import annotations

import subprocess
import unittest
from pathlib import Path

from playwright.sync_api import sync_playwright

RAIZ = Path(__file__).resolve().parent.parent


class TutorialWeb(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        subprocess.run(["python3", "scripts/gerar_site_tutorial.py"], cwd=RAIZ, check=True)
        cls.playwright = sync_playwright().start()
        cls.browser = cls.playwright.chromium.launch(headless=True)

    @classmethod
    def tearDownClass(cls) -> None:
        cls.browser.close()
        cls.playwright.stop()

    def setUp(self) -> None:
        self.context = self.browser.new_context(offline=True, accept_downloads=True,
                                               viewport={"width": 1440, "height": 1000})
        self.page = self.context.new_page()
        self.errors = []
        self.page.on("pageerror", lambda error: self.errors.append(str(error)))
        self.page.goto((RAIZ / ".local/pages-build/index.html").as_uri())
        self.page.locator("#explorer").scroll_into_view_if_needed()
        self.frame = self.page.frame_locator("#explorer")

    def tearDown(self) -> None:
        self.assertEqual(self.errors, [])
        self.context.close()

    def test_tutorial_mathml_e_explorador_incorporado(self) -> None:
        self.assertEqual(self.page.locator("h1").count(), 1)
        self.assertEqual(self.page.locator("math").count(), 3)
        self.assertGreaterEqual(self.page.locator("math mfrac").count(), 4)
        self.assertTrue(self.page.locator("img").evaluate_all("images => images.every(i => i.complete && i.naturalWidth > 0)"))
        self.assertEqual(self.frame.locator("#n-regras").inner_text(), "14")
        self.frame.locator("#inverter").click()
        self.assertEqual(self.frame.locator("#ids-regra").inner_text(), "{p02} → {p01}")
        self.frame.locator("#inverter").click()
        self.frame.locator("#base").select_option("avaliacao")
        self.assertIn("0,83", self.frame.locator("#comparacao tbody tr").nth(1).inner_text())
        self.frame.locator("#todas").click()
        with self.page.expect_download() as download:
            self.frame.locator("#csv").click()
        self.assertEqual(download.value.suggested_filename, "regras-avaliacao.csv")
        with self.page.expect_download() as download:
            self.frame.locator('button[data-svg="dispersao"]').click()
        self.assertTrue(download.value.suggested_filename.endswith(".png"))

    def test_mobile_e_retorno_ao_tutorial(self) -> None:
        self.page.set_viewport_size({"width": 390, "height": 844})
        self.assertFalse(self.page.evaluate("document.documentElement.scrollWidth > innerWidth"))
        self.assertFalse(self.frame.locator("html").evaluate("e => e.scrollWidth > innerWidth"))
        self.frame.get_by_role("link", name="Tutorial completo").click()
        self.page.wait_for_url("**/index.html#explorador-interativo")
        self.assertTrue(self.page.url.endswith("index.html#explorador-interativo"))
        self.assertEqual(self.page.locator("iframe").count(), 1)


if __name__ == "__main__":
    unittest.main()
