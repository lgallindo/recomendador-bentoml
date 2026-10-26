window.DEMANDA_MQ = {
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
      "intercepto": 2.801470588235294,
      "inclinacao": -0.023529411764705865,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "ajustado_mq": 2.801470588235294,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 3,
          "ajustado_mq": 2.777941176470588,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 3,
          "ajustado_mq": 2.7544117647058823,
          "previsao_wf_mq": 4.999999999999999,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 4,
          "ajustado_mq": 2.7308823529411765,
          "previsao_wf_mq": 4.333333333333332,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 3,
          "ajustado_mq": 2.7073529411764703,
          "previsao_wf_mq": 5.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 2.6838235294117645,
          "previsao_wf_mq": 4.3,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 4,
          "ajustado_mq": 2.6602941176470587,
          "previsao_wf_mq": 2.5999999999999996,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 3,
          "ajustado_mq": 2.636764705882353,
          "previsao_wf_mq": 3.428571428571429,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 3,
          "ajustado_mq": 2.613235294117647,
          "previsao_wf_mq": 3.3928571428571432,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 4,
          "ajustado_mq": 2.5897058823529413,
          "previsao_wf_mq": 3.3611111111111107,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "ajustado_mq": 2.5661764705882355,
          "previsao_wf_mq": 3.7333333333333334,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "ajustado_mq": 2.5426470588235293,
          "previsao_wf_mq": 2.8909090909090907,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 4,
          "ajustado_mq": 2.5191176470588235,
          "previsao_wf_mq": 2.621212121212121,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "ajustado_mq": 2.4955882352941177,
          "previsao_wf_mq": 3.0384615384615383,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "ajustado_mq": 2.472058823529412,
          "previsao_wf_mq": 2.7802197802197806,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "ajustado_mq": 2.448529411764706,
          "previsao_wf_mq": 2.580952380952381,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 4,
              "previsao": 2.621212121212121,
              "erro_abs": 1.378787878787879
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 3.0384615384615383,
              "erro_abs": 1.0384615384615383
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 2.7802197802197806,
              "erro_abs": 0.7802197802197806
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 2.580952380952381,
              "erro_abs": 0.5809523809523811
            }
          ],
          "mae": 0.9446053946053947,
          "proxima": 2.4250000000000003
        }
      }
    },
    {
      "id": "p02",
      "nome": "Prato esmaltado Tracunhaém",
      "intercepto": 1.9044117647058822,
      "inclinacao": -0.020588235294117647,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "ajustado_mq": 1.9044117647058822,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "ajustado_mq": 1.8838235294117647,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "ajustado_mq": 1.8632352941176469,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 2,
          "ajustado_mq": 1.8426470588235293,
          "previsao_wf_mq": 0.6666666666666672,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "ajustado_mq": 1.8220588235294117,
          "previsao_wf_mq": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 2,
          "ajustado_mq": 1.801470588235294,
          "previsao_wf_mq": 1.8,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "ajustado_mq": 1.7808823529411764,
          "previsao_wf_mq": 1.9333333333333333,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "ajustado_mq": 1.7602941176470588,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 2,
          "ajustado_mq": 1.739705882352941,
          "previsao_wf_mq": 1.5357142857142856,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 2,
          "ajustado_mq": 1.7191176470588234,
          "previsao_wf_mq": 1.6944444444444444,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 2,
          "ajustado_mq": 1.6985294117647058,
          "previsao_wf_mq": 1.8,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "ajustado_mq": 1.677941176470588,
          "previsao_wf_mq": 1.8727272727272728,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 2,
          "ajustado_mq": 1.6573529411764705,
          "previsao_wf_mq": 1.9242424242424243,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "ajustado_mq": 1.636764705882353,
          "previsao_wf_mq": 1.9615384615384617,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "ajustado_mq": 1.6161764705882353,
          "previsao_wf_mq": 1.7032967032967035,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "ajustado_mq": 1.5955882352941175,
          "previsao_wf_mq": 1.7714285714285714,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 1.9242424242424243,
              "erro_abs": 0.07575757575757569
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.9615384615384617,
              "erro_abs": 0.9615384615384617
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.7032967032967035,
              "erro_abs": 0.29670329670329654
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.7714285714285714,
              "erro_abs": 0.7714285714285714
            }
          ],
          "mae": 0.5263569763569763,
          "proxima": 1.575
        }
      }
    },
    {
      "id": "p03",
      "nome": "Boneca de barro",
      "intercepto": 1.5294117647058822,
      "inclinacao": -0.045588235294117645,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "ajustado_mq": 1.5294117647058822,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "ajustado_mq": 1.4838235294117645,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "ajustado_mq": 1.438235294117647,
          "previsao_wf_mq": 4.440892098500626e-16,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 2,
          "ajustado_mq": 1.3926470588235293,
          "previsao_wf_mq": 0.3333333333333337,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "ajustado_mq": 1.3470588235294116,
          "previsao_wf_mq": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 1.301470588235294,
          "previsao_wf_mq": 1.0999999999999999,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "ajustado_mq": 1.2558823529411764,
          "previsao_wf_mq": 0.9333333333333332,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "ajustado_mq": 1.2102941176470587,
          "previsao_wf_mq": 1.4285714285714286,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "ajustado_mq": 1.164705882352941,
          "previsao_wf_mq": 1.2142857142857142,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "ajustado_mq": 1.1191176470588236,
          "previsao_wf_mq": 1.083333333333333,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "ajustado_mq": 1.0735294117647058,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "ajustado_mq": 1.0279411764705881,
          "previsao_wf_mq": 0.9454545454545452,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "ajustado_mq": 0.9823529411764705,
          "previsao_wf_mq": 0.9090909090909092,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "ajustado_mq": 0.9367647058823528,
          "previsao_wf_mq": 0.8846153846153848,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "ajustado_mq": 0.8911764705882352,
          "previsao_wf_mq": 1.153846153846154,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "ajustado_mq": 0.8455882352941175,
          "previsao_wf_mq": 1.0952380952380953,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.9090909090909092,
              "erro_abs": 0.09090909090909083
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 0.8846153846153848,
              "erro_abs": 1.1153846153846152
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.153846153846154,
              "erro_abs": 0.15384615384615397
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 1.0952380952380953,
              "erro_abs": 1.0952380952380953
            }
          ],
          "mae": 0.6138444888444888,
          "proxima": 0.7999999999999999
        }
      }
    },
    {
      "id": "p04",
      "nome": "Rendeira Alto do Moura",
      "intercepto": 2.4852941176470584,
      "inclinacao": -0.03970588235294114,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 4,
          "ajustado_mq": 2.4852941176470584,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "ajustado_mq": 2.4455882352941174,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "ajustado_mq": 2.4058823529411764,
          "previsao_wf_mq": 0.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 4,
          "ajustado_mq": 2.366176470588235,
          "previsao_wf_mq": 0.3333333333333339,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "ajustado_mq": 2.326470588235294,
          "previsao_wf_mq": 3.0000000000000004,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 2,
          "ajustado_mq": 2.286764705882353,
          "previsao_wf_mq": 2.3,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "ajustado_mq": 2.2470588235294118,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "ajustado_mq": 2.2073529411764703,
          "previsao_wf_mq": 1.8571428571428572,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 2,
          "ajustado_mq": 2.1676470588235293,
          "previsao_wf_mq": 1.2857142857142851,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 2,
          "ajustado_mq": 2.1279411764705882,
          "previsao_wf_mq": 1.3888888888888888,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 3,
          "ajustado_mq": 2.088235294117647,
          "previsao_wf_mq": 1.4666666666666668,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "ajustado_mq": 2.0485294117647057,
          "previsao_wf_mq": 1.890909090909091,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "ajustado_mq": 2.0088235294117647,
          "previsao_wf_mq": 1.8636363636363638,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 3,
          "ajustado_mq": 1.9691176470588236,
          "previsao_wf_mq": 1.5384615384615383,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "ajustado_mq": 1.9294117647058826,
          "previsao_wf_mq": 1.8681318681318682,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "ajustado_mq": 1.8897058823529413,
          "previsao_wf_mq": 1.8571428571428574,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.8636363636363638,
              "erro_abs": 0.8636363636363638
            },
            {
              "week_start": "2026-09-21",
              "observado": 3,
              "previsao": 1.5384615384615383,
              "erro_abs": 1.4615384615384617
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 1.8681318681318682,
              "erro_abs": 0.13186813186813184
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 1.8571428571428574,
              "erro_abs": 0.14285714285714257
            }
          ],
          "mae": 0.6499750249750249,
          "proxima": 1.85
        }
      }
    },
    {
      "id": "p05",
      "nome": "Toalha de renda",
      "intercepto": 1.6397058823529411,
      "inclinacao": -0.0352941176470588,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "ajustado_mq": 1.6397058823529411,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "ajustado_mq": 1.6044117647058824,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "ajustado_mq": 1.5691176470588235,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "ajustado_mq": 1.5338235294117648,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "ajustado_mq": 1.4985294117647059,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 1.4632352941176472,
          "previsao_wf_mq": 0.7000000000000002,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "ajustado_mq": 1.4279411764705883,
          "previsao_wf_mq": 0.6000000000000001,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 2,
          "ajustado_mq": 1.3926470588235296,
          "previsao_wf_mq": 0.5714285714285716,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "ajustado_mq": 1.3573529411764707,
          "previsao_wf_mq": 1.0714285714285712,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "ajustado_mq": 1.322058823529412,
          "previsao_wf_mq": 0.9444444444444444,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 2,
          "ajustado_mq": 1.286764705882353,
          "previsao_wf_mq": 0.8666666666666667,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "ajustado_mq": 1.2514705882352943,
          "previsao_wf_mq": 1.1818181818181817,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "ajustado_mq": 1.2161764705882354,
          "previsao_wf_mq": 1.0757575757575761,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "ajustado_mq": 1.1808823529411767,
          "previsao_wf_mq": 0.9999999999999999,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "ajustado_mq": 1.145588235294118,
          "previsao_wf_mq": 1.2307692307692308,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "ajustado_mq": 1.110294117647059,
          "previsao_wf_mq": 1.1428571428571428,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.0757575757575761,
              "erro_abs": 0.07575757575757613
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 0.9999999999999999,
              "erro_abs": 1.0
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.2307692307692308,
              "erro_abs": 0.23076923076923084
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.1428571428571428,
              "erro_abs": 0.1428571428571428
            }
          ],
          "mae": 0.36234598734598744,
          "proxima": 1.0750000000000002
        }
      }
    },
    {
      "id": "p06",
      "nome": "Caminho de mesa renda",
      "intercepto": 0.8970588235294117,
      "inclinacao": -0.027941176470588223,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "ajustado_mq": 0.8970588235294117,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 0,
          "ajustado_mq": 0.8691176470588234,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "ajustado_mq": 0.8411764705882352,
          "previsao_wf_mq": 0.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "ajustado_mq": 0.8132352941176471,
          "previsao_wf_mq": 0.6666666666666667,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "ajustado_mq": 0.7852941176470588,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 0.7573529411764706,
          "previsao_wf_mq": 1.1,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 0,
          "ajustado_mq": 0.7294117647058823,
          "previsao_wf_mq": 1.1333333333333333,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "ajustado_mq": 0.7014705882352941,
          "previsao_wf_mq": 0.5714285714285714,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "ajustado_mq": 0.6735294117647059,
          "previsao_wf_mq": 0.75,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "ajustado_mq": 0.6455882352941177,
          "previsao_wf_mq": 0.8611111111111112,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "ajustado_mq": 0.6176470588235294,
          "previsao_wf_mq": 0.9333333333333333,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 0,
          "ajustado_mq": 0.5897058823529413,
          "previsao_wf_mq": 0.9818181818181819,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "ajustado_mq": 0.5617647058823529,
          "previsao_wf_mq": 0.6818181818181819,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "ajustado_mq": 0.5338235294117648,
          "previsao_wf_mq": 0.7692307692307694,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 0,
          "ajustado_mq": 0.5058823529411766,
          "previsao_wf_mq": 0.8351648351648351,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "ajustado_mq": 0.47794117647058837,
          "previsao_wf_mq": 0.6190476190476191,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.6818181818181819,
              "erro_abs": 0.3181818181818181
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.7692307692307694,
              "erro_abs": 0.23076923076923062
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.8351648351648351,
              "erro_abs": 0.8351648351648351
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.6190476190476191,
              "erro_abs": 0.6190476190476191
            }
          ],
          "mae": 0.5007908757908757,
          "proxima": 0.4500000000000001
        }
      }
    },
    {
      "id": "p07",
      "nome": "Xilogravura Pilar",
      "intercepto": 2.2132352941176467,
      "inclinacao": -0.03676470588235293,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "ajustado_mq": 2.2132352941176467,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 3,
          "ajustado_mq": 2.176470588235294,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "ajustado_mq": 2.1397058823529407,
          "previsao_wf_mq": 3.9999999999999996,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "ajustado_mq": 2.102941176470588,
          "previsao_wf_mq": 2.3333333333333335,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 3,
          "ajustado_mq": 2.066176470588235,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 2,
          "ajustado_mq": 2.0294117647058822,
          "previsao_wf_mq": 2.2,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 2,
          "ajustado_mq": 1.9926470588235292,
          "previsao_wf_mq": 2.066666666666667,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 2,
          "ajustado_mq": 1.9558823529411762,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "ajustado_mq": 1.9191176470588234,
          "previsao_wf_mq": 1.9642857142857142,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 2,
          "ajustado_mq": 1.8823529411764703,
          "previsao_wf_mq": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 2,
          "ajustado_mq": 1.8455882352941175,
          "previsao_wf_mq": 1.5999999999999996,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "ajustado_mq": 1.8088235294117645,
          "previsao_wf_mq": 1.6727272727272728,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 2,
          "ajustado_mq": 1.7720588235294117,
          "previsao_wf_mq": 1.7272727272727275,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "ajustado_mq": 1.7352941176470587,
          "previsao_wf_mq": 1.7692307692307694,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "ajustado_mq": 1.6985294117647056,
          "previsao_wf_mq": 1.802197802197802,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "ajustado_mq": 1.6617647058823528,
          "previsao_wf_mq": 1.561904761904762,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 2,
              "previsao": 1.7272727272727275,
              "erro_abs": 0.2727272727272725
            },
            {
              "week_start": "2026-09-21",
              "observado": 2,
              "previsao": 1.7692307692307694,
              "erro_abs": 0.23076923076923062
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 1.802197802197802,
              "erro_abs": 0.802197802197802
            },
            {
              "week_start": "2026-10-05",
              "observado": 2,
              "previsao": 1.561904761904762,
              "erro_abs": 0.4380952380952381
            }
          ],
          "mae": 0.4359473859473858,
          "proxima": 1.625
        }
      }
    },
    {
      "id": "p08",
      "nome": "Cordel ilustrado",
      "intercepto": 1.0073529411764706,
      "inclinacao": 0.007352941176470588,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 0,
          "ajustado_mq": 1.0073529411764706,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "ajustado_mq": 1.0147058823529411,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "ajustado_mq": 1.0220588235294117,
          "previsao_wf_mq": 3.999999999999999,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "ajustado_mq": 1.0294117647058822,
          "previsao_wf_mq": 1.9999999999999996,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "ajustado_mq": 1.0367647058823528,
          "previsao_wf_mq": 1.5,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 0,
          "ajustado_mq": 1.0441176470588236,
          "previsao_wf_mq": 2.1000000000000005,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "ajustado_mq": 1.0514705882352942,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 2,
          "ajustado_mq": 1.0588235294117647,
          "previsao_wf_mq": 0.9999999999999999,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "ajustado_mq": 1.0661764705882353,
          "previsao_wf_mq": 1.5000000000000002,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "ajustado_mq": 1.0735294117647058,
          "previsao_wf_mq": 1.361111111111111,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "ajustado_mq": 1.0808823529411764,
          "previsao_wf_mq": 1.2666666666666668,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 0,
          "ajustado_mq": 1.088235294117647,
          "previsao_wf_mq": 1.2,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "ajustado_mq": 1.0955882352941175,
          "previsao_wf_mq": 0.8181818181818182,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "ajustado_mq": 1.1029411764705883,
          "previsao_wf_mq": 0.846153846153846,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "ajustado_mq": 1.1102941176470589,
          "previsao_wf_mq": 0.8681318681318682,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "ajustado_mq": 1.1176470588235294,
          "previsao_wf_mq": 1.1523809523809523,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 0.8181818181818182,
              "erro_abs": 0.18181818181818177
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.846153846153846,
              "erro_abs": 0.15384615384615397
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 0.8681318681318682,
              "erro_abs": 1.1318681318681318
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.1523809523809523,
              "erro_abs": 0.15238095238095228
            }
          ],
          "mae": 0.404978354978355,
          "proxima": 1.125
        }
      }
    },
    {
      "id": "p09",
      "nome": "Quadro xilo colorido",
      "intercepto": 0.9264705882352939,
      "inclinacao": -0.048529411764705856,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "ajustado_mq": 0.9264705882352939,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "ajustado_mq": 0.8779411764705881,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 0,
          "ajustado_mq": 0.8294117647058822,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "ajustado_mq": 0.7808823529411764,
          "previsao_wf_mq": 0.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "ajustado_mq": 0.7323529411764705,
          "previsao_wf_mq": 0.5,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 0.6838235294117647,
          "previsao_wf_mq": 0.8,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "ajustado_mq": 0.6352941176470588,
          "previsao_wf_mq": 0.9333333333333333,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "ajustado_mq": 0.586764705882353,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 0,
          "ajustado_mq": 0.5382352941176471,
          "previsao_wf_mq": 1.0357142857142858,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 0,
          "ajustado_mq": 0.4897058823529412,
          "previsao_wf_mq": 0.6111111111111112,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 0,
          "ajustado_mq": 0.4411764705882354,
          "previsao_wf_mq": 0.33333333333333326,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "ajustado_mq": 0.39264705882352957,
          "previsao_wf_mq": 0.14545454545454528,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "ajustado_mq": 0.34411764705882364,
          "previsao_wf_mq": 0.3484848484848486,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 0,
          "ajustado_mq": 0.2955882352941178,
          "previsao_wf_mq": 0.1923076923076924,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "ajustado_mq": 0.247058823529412,
          "previsao_wf_mq": 0.07692307692307665,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "ajustado_mq": 0.19852941176470607,
          "previsao_wf_mq": 0.25714285714285734,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.3484848484848486,
              "erro_abs": 0.3484848484848486
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.1923076923076924,
              "erro_abs": 0.1923076923076924
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.07692307692307665,
              "erro_abs": 0.9230769230769234
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.25714285714285734,
              "erro_abs": 0.25714285714285734
            }
          ],
          "mae": 0.4302530802530804,
          "proxima": 0.15000000000000024
        }
      }
    },
    {
      "id": "p10",
      "nome": "Cesto de palha",
      "intercepto": 1.875,
      "inclinacao": -0.04999999999999998,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 2,
          "ajustado_mq": 1.875,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 2,
          "ajustado_mq": 1.825,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 2,
          "ajustado_mq": 1.7750000000000001,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 2,
          "ajustado_mq": 1.725,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 2,
          "ajustado_mq": 1.675,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 1.625,
          "previsao_wf_mq": 2.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "ajustado_mq": 1.5750000000000002,
          "previsao_wf_mq": 1.3333333333333335,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 1,
          "ajustado_mq": 1.5250000000000001,
          "previsao_wf_mq": 1.0000000000000002,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 2,
          "ajustado_mq": 1.475,
          "previsao_wf_mq": 0.8214285714285712,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "ajustado_mq": 1.4250000000000003,
          "previsao_wf_mq": 1.1666666666666667,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "ajustado_mq": 1.3750000000000002,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 2,
          "ajustado_mq": 1.3250000000000002,
          "previsao_wf_mq": 0.8909090909090907,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "ajustado_mq": 1.2750000000000004,
          "previsao_wf_mq": 1.1515151515151516,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "ajustado_mq": 1.225,
          "previsao_wf_mq": 1.0384615384615388,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "ajustado_mq": 1.1750000000000003,
          "previsao_wf_mq": 0.956043956043956,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "ajustado_mq": 1.1250000000000002,
          "previsao_wf_mq": 1.161904761904762,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 1,
              "previsao": 1.1515151515151516,
              "erro_abs": 0.1515151515151516
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 1.0384615384615388,
              "erro_abs": 0.03846153846153877
            },
            {
              "week_start": "2026-09-28",
              "observado": 2,
              "previsao": 0.956043956043956,
              "erro_abs": 1.043956043956044
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 1.161904761904762,
              "erro_abs": 0.161904761904762
            }
          ],
          "mae": 0.3489593739593741,
          "proxima": 1.0750000000000002
        }
      }
    },
    {
      "id": "p11",
      "nome": "Bolsa de palha",
      "intercepto": 0.963235294117647,
      "inclinacao": -0.011764705882352936,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "ajustado_mq": 0.963235294117647,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "ajustado_mq": 0.9514705882352941,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "ajustado_mq": 0.9397058823529411,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "ajustado_mq": 0.9279411764705882,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 1,
          "ajustado_mq": 0.9161764705882353,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 0.9044117647058822,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "ajustado_mq": 0.8926470588235293,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 0,
          "ajustado_mq": 0.8808823529411764,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "ajustado_mq": 0.8691176470588234,
          "previsao_wf_mq": 0.4999999999999999,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 1,
          "ajustado_mq": 0.8573529411764705,
          "previsao_wf_mq": 0.6388888888888887,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 1,
          "ajustado_mq": 0.8455882352941176,
          "previsao_wf_mq": 0.7333333333333334,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "ajustado_mq": 0.8338235294117646,
          "previsao_wf_mq": 0.7999999999999999,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "ajustado_mq": 0.8220588235294117,
          "previsao_wf_mq": 0.8484848484848485,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "ajustado_mq": 0.8102941176470588,
          "previsao_wf_mq": 0.5769230769230769,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "ajustado_mq": 0.7985294117647059,
          "previsao_wf_mq": 0.6593406593406592,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "ajustado_mq": 0.7867647058823529,
          "previsao_wf_mq": 0.7238095238095239,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.8484848484848485,
              "erro_abs": 0.8484848484848485
            },
            {
              "week_start": "2026-09-21",
              "observado": 1,
              "previsao": 0.5769230769230769,
              "erro_abs": 0.42307692307692313
            },
            {
              "week_start": "2026-09-28",
              "observado": 1,
              "previsao": 0.6593406593406592,
              "erro_abs": 0.3406593406593408
            },
            {
              "week_start": "2026-10-05",
              "observado": 1,
              "previsao": 0.7238095238095239,
              "erro_abs": 0.2761904761904761
            }
          ],
          "mae": 0.4721028971028971,
          "proxima": 0.775
        }
      }
    },
    {
      "id": "p12",
      "nome": "Sousplat de palha",
      "intercepto": 1.0294117647058822,
      "inclinacao": -0.07058823529411762,
      "serie": [
        {
          "week_start": "2026-06-22",
          "observado": 1,
          "ajustado_mq": 1.0294117647058822,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-06-29",
          "observado": 1,
          "ajustado_mq": 0.9588235294117646,
          "previsao_wf_mq": null,
          "em_teste": false
        },
        {
          "week_start": "2026-07-06",
          "observado": 1,
          "ajustado_mq": 0.888235294117647,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-13",
          "observado": 1,
          "ajustado_mq": 0.8176470588235294,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-20",
          "observado": 0,
          "ajustado_mq": 0.7470588235294118,
          "previsao_wf_mq": 1.0,
          "em_teste": false
        },
        {
          "week_start": "2026-07-27",
          "observado": 1,
          "ajustado_mq": 0.6764705882352942,
          "previsao_wf_mq": 0.20000000000000018,
          "em_teste": false
        },
        {
          "week_start": "2026-08-03",
          "observado": 1,
          "ajustado_mq": 0.6058823529411765,
          "previsao_wf_mq": 0.5333333333333334,
          "em_teste": false
        },
        {
          "week_start": "2026-08-10",
          "observado": 0,
          "ajustado_mq": 0.5352941176470589,
          "previsao_wf_mq": 0.7142857142857142,
          "em_teste": false
        },
        {
          "week_start": "2026-08-17",
          "observado": 1,
          "ajustado_mq": 0.4647058823529413,
          "previsao_wf_mq": 0.3214285714285714,
          "em_teste": false
        },
        {
          "week_start": "2026-08-24",
          "observado": 0,
          "ajustado_mq": 0.3941176470588237,
          "previsao_wf_mq": 0.5277777777777778,
          "em_teste": false
        },
        {
          "week_start": "2026-08-31",
          "observado": 0,
          "ajustado_mq": 0.32352941176470607,
          "previsao_wf_mq": 0.2666666666666666,
          "em_teste": false
        },
        {
          "week_start": "2026-09-07",
          "observado": 1,
          "ajustado_mq": 0.25294117647058845,
          "previsao_wf_mq": 0.0909090909090906,
          "em_teste": false
        },
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "ajustado_mq": 0.18235294117647083,
          "previsao_wf_mq": 0.3030303030303031,
          "em_teste": true
        },
        {
          "week_start": "2026-09-21",
          "observado": 0,
          "ajustado_mq": 0.11176470588235321,
          "previsao_wf_mq": 0.15384615384615374,
          "em_teste": true
        },
        {
          "week_start": "2026-09-28",
          "observado": 0,
          "ajustado_mq": 0.04117647058823559,
          "previsao_wf_mq": 0.04395604395604391,
          "em_teste": true
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "ajustado_mq": 0.0,
          "previsao_wf_mq": 0.0,
          "em_teste": true
        }
      ],
      "metodos": {
        "ingenua": {
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
        "ma4": {
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
        },
        "mq": {
          "nome": "Mín. quadrados",
          "teste": [
            {
              "week_start": "2026-09-14",
              "observado": 0,
              "previsao": 0.3030303030303031,
              "erro_abs": 0.3030303030303031
            },
            {
              "week_start": "2026-09-21",
              "observado": 0,
              "previsao": 0.15384615384615374,
              "erro_abs": 0.15384615384615374
            },
            {
              "week_start": "2026-09-28",
              "observado": 0,
              "previsao": 0.04395604395604391,
              "erro_abs": 0.04395604395604391
            },
            {
              "week_start": "2026-10-05",
              "observado": 0,
              "previsao": 0.0,
              "erro_abs": 0.0
            }
          ],
          "mae": 0.1252081252081252,
          "proxima": 0.0
        }
      }
    }
  ],
  "mae_agregado": {
    "ingenua": 0.6666666666666666,
    "ma4": 0.4895833333333333,
    "ma5": 0.48333333333333334,
    "mq": 0.4846139971139971
  },
  "nomes_metodo": {
    "ingenua": "Ingênua",
    "ma4": "MA(4)",
    "ma5": "MA(5)",
    "mq": "Mín. quadrados"
  }
};
