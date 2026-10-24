"""Verifique contagens, integridade e isolamento da avaliação de crédito."""
from __future__ import annotations

import contextlib
import io
import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import arvore_credito as aula
import gerar_dados_credito as dados


class CreditoTest(unittest.TestCase):
    def test_geracao_reproduzivel_e_proporcoes(self):
        with tempfile.TemporaryDirectory() as pasta:
            raiz = Path(pasta)
            with patch.object(dados, "RAIZ", raiz):
                dados.gerar()
                antes = {p.name: p.read_bytes() for p in (raiz / "dados/credito").glob("*.csv")}
                dados.gerar()
                depois = {p.name: p.read_bytes() for p in (raiz / "dados/credito").glob("*.csv")}
            self.assertEqual(antes, depois)
            ids = set()
            for nome, n in [("cartoes",12),("treino",240),("desenvolvimento",80),("teste",80)]:
                rs = aula.ler(nome, raiz / "dados/credito")
                self.assertEqual(len(rs), n)
                self.assertFalse(ids & {r["id"] for r in rs})
                ids.update(r["id"] for r in rs)
                self.assertEqual({r[aula.ALVO] for r in rs}, {"0", "1"})

    def test_contagens_e_excecoes_da_aula_manual(self):
        rs = aula.ler("cartoes")
        y = aula.respostas(rs)
        primeira = [int(float(r["comprometimento_pct"]) > 35) for r in rs]
        segunda = [int(float(r["comprometimento_pct"]) > 35 or int(r["atrasos_anteriores"]) > 1)
                   for r in rs]
        self.assertEqual(aula.contar(y, [0]*12)["erros"], 5)
        self.assertEqual(aula.contar(y, primeira)["erros"], 3)
        self.assertEqual(aula.contar(y, segunda)["erros"], 2)
        self.assertEqual([r["id"] for r, a, p in zip(rs,y,segunda) if a != p], ["C07","C11"])
        m = aula.contar([0,0,1,1,1], [0,1,0,1,1])
        self.assertEqual([m[k] for k in ["sem_atraso_previsto_sem", "sem_atraso_previsto_com",
                                       "com_atraso_previsto_sem", "com_atraso_previsto_com"]], [1,1,1,2])

    def test_teste_nao_participa_da_escolha(self):
        originais = {g: aula.ler(g) for g in ["treino","desenvolvimento","teste"]}
        with tempfile.TemporaryDirectory() as pasta, contextlib.redirect_stdout(io.StringIO()):
            destino = Path(pasta)
            def sem_teste(nome):
                self.assertNotEqual(nome, "teste", "Execução inicial abriu o teste")
                return originais[nome]
            with patch.object(aula, "ler", side_effect=sem_teste):
                inicial = aula.executar(destino / "inicial")
            final = aula.executar(destino / "final", incluir_teste=True)
            invertidos = [dict(r, **{aula.ALVO:str(1-int(r[aula.ALVO]))})
                          for r in originais["teste"]]
            with patch.object(aula, "ler", side_effect=lambda g: invertidos if g == "teste" else originais[g]):
                alterado = aula.executar(destino / "alterado", incluir_teste=True)
            self.assertEqual(inicial["selecionado"], final["selecionado"])
            self.assertEqual(final["selecionado"], alterado["selecionado"])
            for nome in ["curta", "profunda"]:
                for grupo in ["treino","desenvolvimento"]:
                    self.assertEqual(inicial["modelos"][nome]["medidas"][grupo],
                                     alterado["modelos"][nome]["medidas"][grupo])
                arquivo = f"arvore-{nome}.txt"
                self.assertEqual((destino/"inicial"/arquivo).read_bytes(),
                                 (destino/"alterado"/arquivo).read_bytes())
            self.assertFalse((destino/"inicial"/"previsoes-teste.csv").exists())
            rel = json.loads((destino/"final"/"relatorio.json").read_text())
            selecionado = rel["selecionado"]
            self.assertIn("teste", rel["modelos"][selecionado]["medidas"])
            concorrente = "curta" if selecionado == "profunda" else "profunda"
            self.assertNotIn("teste", rel["modelos"][concorrente]["medidas"])


if __name__ == "__main__":
    unittest.main()
