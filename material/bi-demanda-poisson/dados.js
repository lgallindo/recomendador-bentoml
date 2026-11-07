window.DEMANDA_POISSON = {
  "origem": "dados/vendas_semanais.csv",
  "modelo": "PoissonRegressor(alpha=0.1) + OneHot produto + t/10",
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
      "lambda": 1.7679,
      "intervalo_95": [
        0,
        5
      ],
      "p_gt_2": 0.2608,
      "p_le_2": 0.7392,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.170691,
        0.301765,
        0.266745,
        0.157193,
        0.069475,
        0.024565,
        0.007238,
        0.001828
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 4,
          "lambda": 1.9301,
          "intervalo": [
            0,
            5
          ],
          "coberto": true,
          "log_perda": 2.4779
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "lambda": 1.9424,
          "intervalo": [
            0,
            5
          ],
          "coberto": true,
          "log_perda": 1.3077
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "lambda": 1.9185,
          "intervalo": [
            0,
            5
          ],
          "coberto": true,
          "log_perda": 1.3086
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "lambda": 1.8789,
          "intervalo": [
            0,
            5
          ],
          "coberto": true,
          "log_perda": 1.3107
        }
      ],
      "log_perda_media": 1.6012,
      "cobertura_teste": 1.0
    },
    {
      "id": "p02",
      "nome": "Prato esmaltado Tracunhaém",
      "lambda": 1.3206,
      "intervalo_95": [
        0,
        4
      ],
      "p_gt_2": 0.1477,
      "p_le_2": 0.8523,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.266967,
        0.352565,
        0.232804,
        0.102483,
        0.033835,
        0.008937,
        0.001967,
        0.000371
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 2,
          "lambda": 1.472,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.3919
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "lambda": 1.442,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.076
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "lambda": 1.4162,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.4134
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "lambda": 1.4133,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0674
        }
      ],
      "log_perda_media": 1.2372,
      "cobertura_teste": 1.0
    },
    {
      "id": "p03",
      "nome": "Boneca de barro",
      "lambda": 1.0631,
      "intervalo_95": [
        0,
        3
      ],
      "p_gt_2": 0.0923,
      "p_le_2": 0.9077,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.34537,
        0.367176,
        0.19518,
        0.069168,
        0.018384,
        0.003909,
        0.000693,
        0.000105
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "lambda": 1.1828,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0149
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "lambda": 1.1432,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.5687
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "lambda": 1.1726,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0134
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "lambda": 1.1552,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.1552
        }
      ],
      "log_perda_media": 1.1881,
      "cobertura_teste": 1.0
    },
    {
      "id": "p04",
      "nome": "Rendeira Alto do Moura",
      "lambda": 1.5377,
      "intervalo_95": [
        0,
        4
      ],
      "p_gt_2": 0.2007,
      "p_le_2": 0.7993,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.214871,
        0.330411,
        0.254039,
        0.130213,
        0.050058,
        0.015395,
        0.003946,
        0.000867
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "lambda": 1.6951,
          "intervalo": [
            0,
            5
          ],
          "coberto": true,
          "log_perda": 1.1674
        },
        {
          "week_start": "2026-09-21",
          "observado": 3,
          "lambda": 1.6026,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.9795
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "lambda": 1.6408,
          "intervalo": [
            0,
            5
          ],
          "coberto": true,
          "log_perda": 1.3436
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "lambda": 1.6218,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.3479
        }
      ],
      "log_perda_media": 1.4596,
      "cobertura_teste": 1.0
    },
    {
      "id": "p05",
      "nome": "Toalha de renda",
      "lambda": 1.1461,
      "intervalo_95": [
        0,
        4
      ],
      "p_gt_2": 0.109,
      "p_le_2": 0.891,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.317879,
        0.364316,
        0.208769,
        0.079756,
        0.022852,
        0.005238,
        0.001001,
        0.000164
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "lambda": 1.2625,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0294
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "lambda": 1.2149,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.5187
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "lambda": 1.24,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0249
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "lambda": 1.2175,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0207
        }
      ],
      "log_perda_media": 1.1484,
      "cobertura_teste": 1.0
    },
    {
      "id": "p06",
      "nome": "Caminho de mesa renda",
      "lambda": 0.8572,
      "intervalo_95": [
        0,
        3
      ],
      "p_gt_2": 0.056,
      "p_le_2": 0.944,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.424336,
        0.363753,
        0.15591,
        0.04455,
        0.009547,
        0.001637,
        0.000234,
        2.9e-05
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "lambda": 0.9584,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0009
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "lambda": 0.9411,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0018
        },
        {
          "week_start": "2026-09-28",
          "observado": 0,
          "lambda": 0.951,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.951
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "lambda": 0.922,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.922
        }
      ],
      "log_perda_media": 0.9689,
      "cobertura_teste": 1.0
    },
    {
      "id": "p07",
      "nome": "Xilogravura Pilar",
      "lambda": 1.412,
      "intervalo_95": [
        0,
        4
      ],
      "p_gt_2": 0.1694,
      "p_le_2": 0.8306,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.243662,
        0.344044,
        0.242891,
        0.114318,
        0.040354,
        0.011396,
        0.002682,
        0.000541
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 2,
          "lambda": 1.5597,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.3639
        },
        {
          "week_start": "2026-09-21",
          "observado": 2,
          "lambda": 1.5215,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.3753
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "lambda": 1.5268,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.1036
        },
        {
          "week_start": "2026-10-05",
          "observado": 2,
          "lambda": 1.4814,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.3886
        }
      ],
      "log_perda_media": 1.3078,
      "cobertura_teste": 1.0
    },
    {
      "id": "p08",
      "nome": "Cordel ilustrado",
      "lambda": 1.0095,
      "intervalo_95": [
        0,
        3
      ],
      "p_gt_2": 0.0821,
      "p_le_2": 0.9179,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.364389,
        0.367863,
        0.185685,
        0.062485,
        0.01577,
        0.003184,
        0.000536,
        7.7e-05
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "lambda": 1.0677,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0022
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "lambda": 1.0396,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0008
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "lambda": 1.0431,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.6518
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "lambda": 1.0647,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.002
        }
      ],
      "log_perda_media": 1.1642,
      "cobertura_teste": 1.0
    },
    {
      "id": "p09",
      "nome": "Quadro xilo colorido",
      "lambda": 0.8094,
      "intervalo_95": [
        0,
        3
      ],
      "p_gt_2": 0.0488,
      "p_le_2": 0.9512,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.445119,
        0.360285,
        0.14581,
        0.03934,
        0.007961,
        0.001289,
        0.000174,
        2e-05
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "lambda": 0.9232,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.9232
        },
        {
          "week_start": "2026-09-21",
          "observado": 0,
          "lambda": 0.8782,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.8782
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "lambda": 0.8633,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0103
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "lambda": 0.8679,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.8679
        }
      ],
      "log_perda_media": 0.9199,
      "cobertura_teste": 1.0
    },
    {
      "id": "p10",
      "nome": "Cesto de palha",
      "lambda": 1.203,
      "intervalo_95": [
        0,
        4
      ],
      "p_gt_2": 0.1212,
      "p_le_2": 0.8788,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.300287,
        0.36125,
        0.217295,
        0.087137,
        0.026207,
        0.006305,
        0.001264,
        0.000217
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 1,
          "lambda": 1.3446,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0485
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "lambda": 1.2886,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.035
        },
        {
          "week_start": "2026-09-28",
          "observado": 2,
          "lambda": 1.2744,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.4826
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "lambda": 1.2813,
          "intervalo": [
            0,
            4
          ],
          "coberto": true,
          "log_perda": 1.0334
        }
      ],
      "log_perda_media": 1.1499,
      "cobertura_teste": 1.0
    },
    {
      "id": "p11",
      "nome": "Bolsa de palha",
      "lambda": 0.9318,
      "intervalo_95": [
        0,
        3
      ],
      "p_gt_2": 0.0682,
      "p_le_2": 0.9318,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.393863,
        0.366983,
        0.170968,
        0.0531,
        0.012369,
        0.002305,
        0.000358,
        4.8e-05
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "lambda": 1.0306,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0306
        },
        {
          "week_start": "2026-09-21",
          "observado": 1,
          "lambda": 0.9733,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0004
        },
        {
          "week_start": "2026-09-28",
          "observado": 1,
          "lambda": 0.9812,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0002
        },
        {
          "week_start": "2026-10-05",
          "observado": 1,
          "lambda": 0.9779,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 1.0002
        }
      ],
      "log_perda_media": 1.0078,
      "cobertura_teste": 1.0
    },
    {
      "id": "p12",
      "nome": "Sousplat de palha",
      "lambda": 0.7861,
      "intervalo_95": [
        0,
        3
      ],
      "p_gt_2": 0.0454,
      "p_le_2": 0.9546,
      "contagens": [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7
      ],
      "pmf": [
        0.455629,
        0.358159,
        0.14077,
        0.036885,
        0.007249,
        0.00114,
        0.000149,
        1.7e-05
      ],
      "teste": [
        {
          "week_start": "2026-09-14",
          "observado": 0,
          "lambda": 0.9232,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.9232
        },
        {
          "week_start": "2026-09-21",
          "observado": 0,
          "lambda": 0.8782,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.8782
        },
        {
          "week_start": "2026-09-28",
          "observado": 0,
          "lambda": 0.8633,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.8633
        },
        {
          "week_start": "2026-10-05",
          "observado": 0,
          "lambda": 0.8414,
          "intervalo": [
            0,
            3
          ],
          "coberto": true,
          "log_perda": 0.8414
        }
      ],
      "log_perda_media": 0.8765,
      "cobertura_teste": 1.0
    }
  ],
  "log_perda_agregada": 1.1691,
  "cobertura_agregada": 1.0
};
