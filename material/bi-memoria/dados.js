window.MEMORIA_LOJA = {
  "pontuacao": "score = número de tokens da consulta contidos no texto da memória",
  "usuarios": [
    "aluno_demo",
    "outra_cliente"
  ],
  "turnos": [
    {
      "turno": 1,
      "acao": "add",
      "descricao": "Cliente conta onde recebe as compras.",
      "user_id": "aluno_demo",
      "resultado": {
        "id": "m1",
        "user_id": "aluno_demo",
        "memory": "Cliente prefere frete para Recife.",
        "created_at": "2026-11-07T11:57:55Z"
      },
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        }
      ]
    },
    {
      "turno": 2,
      "acao": "add",
      "descricao": "Cliente diz o que não quer ver.",
      "user_id": "aluno_demo",
      "resultado": {
        "id": "m2",
        "user_id": "aluno_demo",
        "memory": "Não gosta de peças de palha.",
        "created_at": "2026-11-07T11:57:55Z"
      },
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        }
      ]
    },
    {
      "turno": 3,
      "acao": "add",
      "descricao": "Limite de gasto.",
      "user_id": "aluno_demo",
      "resultado": {
        "id": "m3",
        "user_id": "aluno_demo",
        "memory": "Orçamento máximo cerca de R$ 150.",
        "created_at": "2026-11-07T11:57:55Z"
      },
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        }
      ]
    },
    {
      "turno": 4,
      "acao": "add",
      "descricao": "Fato que só vale nesta conversa (escopo de sessão).",
      "user_id": "aluno_demo",
      "session_id": "s1",
      "resultado": {
        "id": "m4",
        "user_id": "aluno_demo",
        "memory": "Hoje procura presente para a mãe.",
        "created_at": "2026-11-07T11:57:55Z",
        "session_id": "s1"
      },
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        }
      ]
    },
    {
      "turno": 5,
      "acao": "add",
      "descricao": "Outra pessoa, outro escopo de usuário.",
      "user_id": "outra_cliente",
      "resultado": {
        "id": "m5",
        "user_id": "outra_cliente",
        "memory": "Cliente prefere frete para Caruaru.",
        "created_at": "2026-11-07T11:57:55Z"
      },
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 6,
      "acao": "search",
      "descricao": "Busca da primeira cliente.",
      "user_id": "aluno_demo",
      "consulta": "frete Recife",
      "resultado": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife.",
          "created_at": "2026-11-07T11:57:55Z",
          "score": 2
        }
      ],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 7,
      "acao": "search",
      "descricao": "Mesma palavra, outro usuário: só vê o que é dele.",
      "user_id": "outra_cliente",
      "consulta": "frete",
      "resultado": [
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru.",
          "created_at": "2026-11-07T11:57:55Z",
          "score": 1
        }
      ],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 8,
      "acao": "search",
      "descricao": "Nova sessão s2: a memória de sessão s1 fica de fora.",
      "user_id": "aluno_demo",
      "session_id": "s2",
      "consulta": "presente mãe",
      "resultado": [],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 9,
      "acao": "search",
      "descricao": "Na sessão s1 ela aparece.",
      "user_id": "aluno_demo",
      "session_id": "s1",
      "consulta": "presente mãe",
      "resultado": [
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "created_at": "2026-11-07T11:57:55Z",
          "session_id": "s1",
          "score": 2
        }
      ],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Recife."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 10,
      "acao": "update",
      "descricao": "Cliente se mudou; o texto novo ainda cita Recife.",
      "user_id": "aluno_demo",
      "resultado": {
        "id": "m1",
        "user_id": "aluno_demo",
        "memory": "Cliente prefere frete para Olinda (mudou de Recife).",
        "created_at": "2026-11-07T11:57:55Z",
        "updated_at": "2026-11-07T11:57:55Z"
      },
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda (mudou de Recife)."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 11,
      "acao": "search",
      "descricao": "O token antigo continua casando: score 2.",
      "user_id": "aluno_demo",
      "consulta": "frete Recife",
      "resultado": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda (mudou de Recife).",
          "created_at": "2026-11-07T11:57:55Z",
          "updated_at": "2026-11-07T11:57:55Z",
          "score": 2
        }
      ],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda (mudou de Recife)."
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 12,
      "acao": "update",
      "descricao": "Política melhor: texto limpo e valor antigo no histórico.",
      "user_id": "aluno_demo",
      "resultado": {
        "id": "m1",
        "user_id": "aluno_demo",
        "memory": "Cliente prefere frete para Olinda.",
        "created_at": "2026-11-07T11:57:55Z",
        "updated_at": "2026-11-07T11:57:55Z",
        "historico": [
          "Cliente prefere frete para Olinda (mudou de Recife)."
        ]
      },
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda.",
          "historico": [
            "Cliente prefere frete para Olinda (mudou de Recife)."
          ]
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 13,
      "acao": "search",
      "descricao": "Agora só 'frete' casa: score 1.",
      "user_id": "aluno_demo",
      "consulta": "frete Recife",
      "resultado": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda.",
          "created_at": "2026-11-07T11:57:55Z",
          "updated_at": "2026-11-07T11:57:55Z",
          "historico": [
            "Cliente prefere frete para Olinda (mudou de Recife)."
          ],
          "score": 1
        }
      ],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda.",
          "historico": [
            "Cliente prefere frete para Olinda (mudou de Recife)."
          ]
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 14,
      "acao": "search",
      "descricao": "A preferência atual vence com score 2.",
      "user_id": "aluno_demo",
      "consulta": "frete Olinda",
      "resultado": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda.",
          "created_at": "2026-11-07T11:57:55Z",
          "updated_at": "2026-11-07T11:57:55Z",
          "historico": [
            "Cliente prefere frete para Olinda (mudou de Recife)."
          ],
          "score": 2
        }
      ],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda.",
          "historico": [
            "Cliente prefere frete para Olinda (mudou de Recife)."
          ]
        },
        {
          "id": "m2",
          "user_id": "aluno_demo",
          "memory": "Não gosta de peças de palha."
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 15,
      "acao": "delete",
      "descricao": "Cliente pede para esquecer a preferência sobre palha.",
      "user_id": "aluno_demo",
      "resultado": true,
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda.",
          "historico": [
            "Cliente prefere frete para Olinda (mudou de Recife)."
          ]
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    },
    {
      "turno": 16,
      "acao": "search",
      "descricao": "Depois do delete, nada sobre palha.",
      "user_id": "aluno_demo",
      "consulta": "palha",
      "resultado": [],
      "store_depois": [
        {
          "id": "m1",
          "user_id": "aluno_demo",
          "memory": "Cliente prefere frete para Olinda.",
          "historico": [
            "Cliente prefere frete para Olinda (mudou de Recife)."
          ]
        },
        {
          "id": "m3",
          "user_id": "aluno_demo",
          "memory": "Orçamento máximo cerca de R$ 150."
        },
        {
          "id": "m4",
          "user_id": "aluno_demo",
          "memory": "Hoje procura presente para a mãe.",
          "session_id": "s1"
        },
        {
          "id": "m5",
          "user_id": "outra_cliente",
          "memory": "Cliente prefere frete para Caruaru."
        }
      ]
    }
  ],
  "origem": "material/memoria/linha-do-tempo.json"
};
