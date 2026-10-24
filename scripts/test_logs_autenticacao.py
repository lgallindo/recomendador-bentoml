"""Verifica reconstrução, coerência dos fixtures e métricas independentes."""

from __future__ import annotations

import json
import tempfile
import unittest
from fractions import Fraction
from pathlib import Path

from minerar_logs_autenticacao import EVENTOS, RAIZ, avaliar, ler_eventos, montar_sessoes
from minerar_regras_associacao import minerar


class LogsTest(unittest.TestCase):
    def test_fixtures_e_fluxos(self):
        for cenario, total, quantidade, esperadas, contagens in [
            ("descoberta", 2000, 5900, 27, (900, 900, 600)),
            ("validacao", 1000, 2400, 9, (400, 300, 100)),
        ]:
            with self.subTest(cenario=cenario):
                eventos, duplicatas = ler_eventos(
                    RAIZ / f"dados/logs-autenticacao/{cenario}-20261017.jsonl")
                sessoes = montar_sessoes(eventos)
                self.assertEqual((len(sessoes), len(eventos), duplicatas), (total, quantidade, 1))
                self.assertEqual(sessoes, montar_sessoes(list(reversed(eventos))))
                for sessao in sessoes:
                    caminho = sorted((e for e in eventos if e["session_id"] == sessao),
                                     key=lambda e: e["timestamp"])
                    anteriores = set()
                    for evento in caminho:
                        atual = evento["evento"]
                        if atual in {"desafio_mfa", "login_sucesso"}:
                            self.assertIn("senha_aceita", anteriores)
                        if atual == "falha_mfa":
                            self.assertIn("desafio_mfa", anteriores)
                        anteriores.add(atual)
                resultado = avaliar(sessoes)
                self.assertEqual(tuple(resultado[c] for c in (
                    "contagem_antecedente", "contagem_consequente", "contagem_conjunta")), contagens)
                na, nb, juntos = contagens
                self.assertAlmostEqual(resultado["lift"], total * juntos / (na * nb))
                regras = minerar({"produtos": [{"id": e, "nome": n} for e, n in EVENTOS.items()],
                                  "cestas": list(sessoes.values())},
                                 Fraction(1, 5), Fraction(3, 5), Fraction(1))
                self.assertEqual(len(regras), esperadas)

    def test_reentrega_e_repeticao(self):
        registro = {"event_id": "e1", "timestamp": "2026-10-01T00:00:00+00:00",
                    "session_id": "s1", "evento": "falha_senha"}
        with tempfile.TemporaryDirectory() as pasta:
            caminho = Path(pasta) / "teste.jsonl"
            registros = [registro, registro, dict(registro, event_id="e2"),
                         dict(registro, event_id="e3", session_id="s2")]
            caminho.write_text("\n".join(json.dumps(r) for r in registros), encoding="utf-8")
            eventos, duplicatas = ler_eventos(caminho)
            self.assertEqual((len(eventos), duplicatas), (3, 1))
            self.assertEqual(montar_sessoes(eventos), {"s1": ["falha_senha"], "s2": ["falha_senha"]})

    def test_diagnosticos(self):
        registro = {"event_id": "e1", "timestamp": "2026-10-01T00:00:00+00:00",
                    "session_id": "s1", "evento": "falha_senha"}
        casos = ["{", "[]", json.dumps(dict(registro, evento="desconhecido")),
                 json.dumps(dict(registro, timestamp="2026-10-01")),
                 json.dumps(dict(registro, session_id="")),
                 json.dumps(registro) + "\n" + json.dumps(dict(registro, evento="senha_aceita"))]
        with tempfile.TemporaryDirectory() as pasta:
            caminho = Path(pasta) / "invalido.jsonl"
            for texto in casos:
                with self.subTest(texto=texto):
                    caminho.write_text(texto, encoding="utf-8")
                    with self.assertRaisesRegex(ValueError, r"invalido.jsonl:\d+:"):
                        ler_eventos(caminho)
            caminho.write_text("", encoding="utf-8")
            with self.assertRaisesRegex(ValueError, "log vazio"):
                ler_eventos(caminho)

    def test_ausencia_de_antecedente(self):
        resultado = avaliar({"s1": ["senha_aceita"]})
        self.assertIsNone(resultado["confianca"])
        self.assertIsNone(resultado["lift"])


if __name__ == "__main__":
    unittest.main()
