"""ADALINE / LMS (mínimos quadrados online) para a série semanal de demanda."""

from __future__ import annotations

import numpy as np

INICIO_TESTE = 12


def _escala(n: int) -> float:
    return float(max(n - 1, 1))


def prever(w: np.ndarray, t: float, escala: float) -> float:
    return float(w[0] + w[1] * (t / escala))


def treinar_lms(
    valores: list[int] | np.ndarray,
    *,
    epocas: int = 200,
    lr: float = 0.05,
    ate: int | None = None,
) -> tuple[np.ndarray, list[float], float]:
    """Ajusta w=[bias, peso_do_tempo_normalizado]. Devolve pesos, MSE/época e escala."""
    y = np.asarray(valores[: ate if ate is not None else len(valores)], dtype=float)
    n = len(y)
    if n < 2:
        raise ValueError("preciso de pelo menos 2 pontos")
    escala = _escala(n)
    w = np.zeros(2, dtype=float)
    historico_mse: list[float] = []
    for _ in range(epocas):
        erros = []
        for t in range(n):
            x = np.array([1.0, float(t) / escala])
            yhat = float(w @ x)
            err = y[t] - yhat
            w = w + lr * err * x
            erros.append(err * err)
        historico_mse.append(float(np.mean(erros)))
    return w, historico_mse, escala


def previsao_nao_negativa(w: np.ndarray, t: float, escala: float) -> float:
    return max(0.0, prever(w, t, escala))


def walk_forward_lms(
    valores: list[int],
    *,
    epocas: int = 200,
    lr: float = 0.05,
    inicio_teste: int = INICIO_TESTE,
) -> list[dict]:
    linhas = []
    for posicao in range(inicio_teste, len(valores)):
        w, _, escala = treinar_lms(valores, epocas=epocas, lr=lr, ate=posicao)
        # extrapola com a mesma escala do treino (n_treino = posicao)
        prev = previsao_nao_negativa(w, float(posicao), escala)
        obs = float(valores[posicao])
        linhas.append({
            "posicao": posicao,
            "observado": obs,
            "previsao": prev,
            "erro_abs": abs(obs - prev),
            "bias": float(w[0]),
            "inclinacao": float(w[1]),
            "escala": escala,
        })
    return linhas
