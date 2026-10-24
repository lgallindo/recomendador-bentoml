window.DEMANDA = {
  "origem": "dados/vendas_semanais.csv",
  "semanas": [
    "2026-06-22",
    "2026-06-29",
    "2026-07-06",
    "2026-07-13",
    "2026-07-20",
    "2026-07-27",
    "2026-08-03",
    "2026-08-10",
    "2026-08-17",
    "2026-08-24",
    "2026-08-31",
    "2026-09-07",
    "2026-09-14",
    "2026-09-21",
    "2026-09-28",
    "2026-10-05"
  ],
  "inicio_teste": "2026-09-14",
  "n_semanas": 16,
  "n_teste": 4,
  "produtos": [
    {
      "id": "p01",
      "nome": "Jarro barro Tracunhaém",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 3,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 3,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 4,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 3,
          "previsao_ma4": 2.75,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 3.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 4,
          "previsao_ma4": 2.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 3,
          "previsao_ma4": 3.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 3,
          "previsao_ma4": 2.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 4,
          "previsao_ma4": 2.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "previsao_ma4": 3.5,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "previsao_ma4": 2.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 4,
          "previsao_ma4": 2.5,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "previsao_ma4": 2.75,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "previsao_ma4": 2.25,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "previsao_ma4": 2.5,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 4,
              "previsao": 2.0,
              "erro_abs": 2.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 4.0,
              "erro_abs": 2.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 1.0,
          "proxima": 2.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 4,
              "previsao": 1.5,
              "erro_abs": 2.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 3.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 3.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 1.125,
          "proxima": 2.0
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 4,
              "previsao": 2.3333333333333335,
              "erro_abs": 1.6666666666666665
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 2.3333333333333335,
              "erro_abs": 0.3333333333333335
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.6666666666666665,
              "erro_abs": 0.6666666666666665
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.6666666666666665,
              "erro_abs": 0.6666666666666665
            }
          ],
          "mae": 0.8333333333333333,
          "proxima": 2.0
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 4,
              "previsao": 2.5,
              "erro_abs": 1.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 2.75,
              "erro_abs": 0.75
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.75,
          "proxima": 2.5
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 4,
              "previsao": 2.6,
              "erro_abs": 1.4
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 2.8,
              "erro_abs": 0.7999999999999998
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.6,
              "erro_abs": 0.6000000000000001
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.2,
              "erro_abs": 0.20000000000000018
            }
          ],
          "mae": 0.75,
          "proxima": 2.4
        }
      }
    },
    {
      "id": "p02",
      "nome": "Prato esmaltado Tracunhaém",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "previsao_ma4": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 2,
          "previsao_ma4": 2.0,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "previsao_ma4": 2.0,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "previsao_ma4": 1.75,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            }
          ],
          "mae": 0.75,
          "proxima": 1.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.5,
          "proxima": 1.5
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.6666666666666667,
              "erro_abs": 0.33333333333333326
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.6666666666666667,
              "erro_abs": 0.6666666666666667
            }
          ],
          "mae": 0.5,
          "proxima": 1.3333333333333333
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.75,
              "erro_abs": 0.75
            }
          ],
          "mae": 0.5,
          "proxima": 1.5
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 1.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.8,
              "erro_abs": 0.8
            }
          ],
          "mae": 0.55,
          "proxima": 1.6
        }
      }
    },
    {
      "id": "p03",
      "nome": "Boneca de barro",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "previsao_ma4": 1.0,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "previsao_ma4": 1.25,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            }
          ],
          "mae": 0.75,
          "proxima": 0.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 1.5,
              "erro_abs": 1.5
            }
          ],
          "mae": 0.75,
          "proxima": 0.5
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 1.3333333333333333,
              "erro_abs": 1.3333333333333333
            }
          ],
          "mae": 0.6666666666666666,
          "proxima": 1.0
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 1.25,
              "erro_abs": 1.25
            }
          ],
          "mae": 0.625,
          "proxima": 1.0
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.2,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 1.2,
              "erro_abs": 1.2
            }
          ],
          "mae": 0.6,
          "proxima": 1.0
        }
      }
    },
    {
      "id": "p04",
      "nome": "Rendeira Alto do Moura",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 4,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 4,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "previsao_ma4": 2.75,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 2,
          "previsao_ma4": 2.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "previsao_ma4": 2.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "previsao_ma4": 2.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 3,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "previsao_ma4": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "previsao_ma4": 2.25,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 3,
          "previsao_ma4": 2.0,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "previsao_ma4": 2.25,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "previsao_ma4": 2.0,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 3,
              "previsao": 1.0,
              "erro_abs": 2.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 3.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 1.0,
          "proxima": 2.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 2.5,
              "erro_abs": 1.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 3,
              "previsao": 1.5,
              "erro_abs": 1.5
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.875,
          "proxima": 2.0
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 2.3333333333333335,
              "erro_abs": 1.3333333333333335
            },
            {
              "week_start": "2026-09-21",
              "observado": 3,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.5833333333333334,
          "proxima": 2.3333333333333335
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 2.25,
              "erro_abs": 1.25
            },
            {
              "week_start": "2026-09-21",
              "observado": 3,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.625,
          "proxima": 2.0
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 3,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.2,
              "erro_abs": 0.20000000000000018
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.2,
              "erro_abs": 0.20000000000000018
            }
          ],
          "mae": 0.6000000000000001,
          "proxima": 2.0
        }
      }
    },
    {
      "id": "p05",
      "nome": "Toalha de renda",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 2,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 2,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "previsao_ma4": 1.25,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.5,
          "proxima": 1.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.625,
          "proxima": 1.0
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.6666666666666667
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            }
          ],
          "mae": 0.41666666666666663,
          "proxima": 1.3333333333333333
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.25,
              "erro_abs": 0.75
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.25,
              "erro_abs": 0.25
            }
          ],
          "mae": 0.4375,
          "proxima": 1.25
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.4,
              "erro_abs": 0.3999999999999999
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.2,
              "erro_abs": 0.8
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.4,
              "erro_abs": 0.3999999999999999
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.4,
              "erro_abs": 0.3999999999999999
            }
          ],
          "mae": 0.49999999999999994,
          "proxima": 1.2
        }
      }
    },
    {
      "id": "p06",
      "nome": "Caminho de mesa renda",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 0,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 0,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 0,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 0,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "previsao_ma4": 0.5,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.5,
          "proxima": 0.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.625,
          "proxima": 0.0
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.33333333333333337
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.33333333333333337
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.6666666666666666
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.6666666666666666
            }
          ],
          "mae": 0.5,
          "proxima": 0.3333333333333333
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.75,
              "erro_abs": 0.75
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.4375,
          "proxima": 0.5
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.8,
              "erro_abs": 0.8
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.6,
              "erro_abs": 0.6
            }
          ],
          "mae": 0.44999999999999996,
          "proxima": 0.4
        }
      }
    },
    {
      "id": "p07",
      "nome": "Xilogravura Pilar",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 3,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 3,
          "previsao_ma4": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 2,
          "previsao_ma4": 2.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "previsao_ma4": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 2,
          "previsao_ma4": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "previsao_ma4": 2.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "previsao_ma4": 2.0,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "previsao_ma4": 2.0,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "previsao_ma4": 1.75,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            }
          ],
          "mae": 0.5,
          "proxima": 2.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 1.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.375,
          "proxima": 1.5
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 1.6666666666666667,
              "erro_abs": 0.33333333333333326
            }
          ],
          "mae": 0.3333333333333333,
          "proxima": 1.6666666666666667
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 1.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 2.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 1.75,
              "erro_abs": 0.25
            }
          ],
          "mae": 0.375,
          "proxima": 1.75
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 1.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 1.8,
              "erro_abs": 0.19999999999999996
            }
          ],
          "mae": 0.39999999999999997,
          "proxima": 1.8
        }
      }
    },
    {
      "id": "p08",
      "nome": "Cordel ilustrado",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 0,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 0,
          "previsao_ma4": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 2,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 0,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            }
          ],
          "mae": 0.75,
          "proxima": 1.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.625,
          "proxima": 1.5
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.33333333333333337
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.33333333333333337
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 0.6666666666666666,
              "erro_abs": 1.3333333333333335
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            }
          ],
          "mae": 0.5833333333333334,
          "proxima": 1.3333333333333333
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 0.75,
              "erro_abs": 1.25
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.4375,
          "proxima": 1.25
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 0.8,
              "erro_abs": 1.2
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.35,
          "proxima": 1.0
        }
      }
    },
    {
      "id": "p09",
      "nome": "Quadro xilo colorido",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 0,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 0,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 0,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 0,
          "previsao_ma4": 0.5,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "previsao_ma4": 0.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "previsao_ma4": 0.25,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 0,
          "previsao_ma4": 0.25,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "previsao_ma4": 0.25,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "previsao_ma4": 0.5,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            }
          ],
          "mae": 0.75,
          "proxima": 0.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.625,
          "proxima": 0.5
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.3333333333333333,
              "erro_abs": 0.3333333333333333
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.3333333333333333,
              "erro_abs": 0.3333333333333333
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.3333333333333333,
              "erro_abs": 0.6666666666666667
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.3333333333333333,
              "erro_abs": 0.3333333333333333
            }
          ],
          "mae": 0.4166666666666667,
          "proxima": 0.3333333333333333
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.25,
              "erro_abs": 0.75
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.4375,
          "proxima": 0.25
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.4,
              "erro_abs": 0.4
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.2,
              "erro_abs": 0.2
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.2,
              "erro_abs": 0.8
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.4,
              "erro_abs": 0.4
            }
          ],
          "mae": 0.45,
          "proxima": 0.4
        }
      }
    },
    {
      "id": "p10",
      "nome": "Cesto de palha",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 2,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "previsao_ma4": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "previsao_ma4": 1.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 2,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "previsao_ma4": 1.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "previsao_ma4": 1.25,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "previsao_ma4": 1.25,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "previsao_ma4": 1.5,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 2.0,
              "erro_abs": 1.0
            }
          ],
          "mae": 0.75,
          "proxima": 1.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.625,
          "proxima": 1.5
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.6666666666666667
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.3333333333333333,
              "erro_abs": 0.33333333333333326
            }
          ],
          "mae": 0.41666666666666663,
          "proxima": 1.3333333333333333
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.25,
              "erro_abs": 0.75
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.5,
              "erro_abs": 0.5
            }
          ],
          "mae": 0.5,
          "proxima": 1.25
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.4,
              "erro_abs": 0.3999999999999999
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.4,
              "erro_abs": 0.3999999999999999
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.2,
              "erro_abs": 0.8
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.4,
              "erro_abs": 0.3999999999999999
            }
          ],
          "mae": 0.49999999999999994,
          "proxima": 1.4
        }
      }
    },
    {
      "id": "p11",
      "nome": "Bolsa de palha",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 0,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "previsao_ma4": 1.0,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.5,
          "proxima": 1.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.5,
          "proxima": 1.0
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.33333333333333337
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.33333333333333337
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 0.6666666666666666,
              "erro_abs": 0.33333333333333337
            }
          ],
          "mae": 0.5,
          "proxima": 1.0
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.75,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 0.75,
              "erro_abs": 0.25
            }
          ],
          "mae": 0.4375,
          "proxima": 0.75
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.8,
              "erro_abs": 0.8
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.8,
              "erro_abs": 0.19999999999999996
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 0.8,
              "erro_abs": 0.19999999999999996
            }
          ],
          "mae": 0.35,
          "proxima": 0.8
        }
      }
    },
    {
      "id": "p12",
      "nome": "Sousplat de palha",
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "previsao_ma4": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 0,
          "previsao_ma4": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 0,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "previsao_ma4": 0.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 0,
          "previsao_ma4": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 0,
          "previsao_ma4": 0.5,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "previsao_ma4": 0.25,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "previsao_ma4": 0.5,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 0,
          "previsao_ma4": 0.25,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 0,
          "previsao_ma4": 0.25,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "previsao_ma4": 0.25,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
          "janela": 1,
          "nome": "Ingênua",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 1.0,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.25,
          "proxima": 0.0
        },
        "ma2": {
          "janela": 2,
          "nome": "MA(2)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.25,
          "proxima": 0.0
        },
        "ma3": {
          "janela": 3,
          "nome": "MA(3)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.3333333333333333,
              "erro_abs": 0.3333333333333333
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.3333333333333333,
              "erro_abs": 0.3333333333333333
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.3333333333333333,
              "erro_abs": 0.3333333333333333
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.25,
          "proxima": 0.0
        },
        "ma4": {
          "janela": 4,
          "nome": "MA(4)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.5,
              "erro_abs": 0.5
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.25,
              "erro_abs": 0.25
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.25,
              "erro_abs": 0.25
            }
          ],
          "mae": 0.3125,
          "proxima": 0.0
        },
        "ma5": {
          "janela": 5,
          "nome": "MA(5)",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.4,
              "erro_abs": 0.4
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.4,
              "erro_abs": 0.4
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.2,
              "erro_abs": 0.2
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.2,
              "erro_abs": 0.2
            }
          ],
          "mae": 0.30000000000000004,
          "proxima": 0.2
        }
      }
    }
  ],
  "mae_agregado": {
    "ingenua": 0.6666666666666666,
    "ma2": 0.625,
    "ma3": 0.5,
    "ma4": 0.4895833333333333,
    "ma5": 0.48333333333333334
  },
  "nomes_janela": {
    "ingenua": "Ingênua",
    "ma2": "MA(2)",
    "ma3": "MA(3)",
    "ma4": "MA(4)",
    "ma5": "MA(5)"
  }
};
