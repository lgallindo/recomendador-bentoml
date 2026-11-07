window.BI_LOGS = {
  "origem": "dados/logs-autenticacao/*.jsonl · material/logs-autenticacao/*.csv",
  "eventos": {
    "falha_senha": "Falha de senha",
    "senha_aceita": "Senha aceita",
    "desafio_mfa": "Desafio MFA",
    "falha_mfa": "Falha MFA",
    "login_sucesso": "Login com sucesso"
  },
  "criterios": {
    "suporte_minimo": 0.2,
    "confianca_minima": 0.6,
    "lift_maior_que": 1.0
  },
  "cenarios": {
    "descoberta": {
      "arquivo": "dados/logs-autenticacao/descoberta-20261017.jsonl",
      "linhas": 5901,
      "eventos_unicos": 5900,
      "reentregas": 1,
      "sessoes": 2000,
      "bloco_base": 20,
      "ultima_linha": {
        "event_id": "descoberta-0001-01",
        "timestamp": "2026-10-01T12:01:01+00:00",
        "session_id": "descoberta-0001",
        "evento": "falha_senha"
      },
      "amostra_linhas": [
        {
          "event_id": "descoberta-0001-01",
          "timestamp": "2026-10-01T12:01:01+00:00",
          "session_id": "descoberta-0001",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0001-02",
          "timestamp": "2026-10-01T12:01:02+00:00",
          "session_id": "descoberta-0001",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0001-03",
          "timestamp": "2026-10-01T12:01:03+00:00",
          "session_id": "descoberta-0001",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0001-04",
          "timestamp": "2026-10-01T12:01:04+00:00",
          "session_id": "descoberta-0001",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0001-05",
          "timestamp": "2026-10-01T12:01:05+00:00",
          "session_id": "descoberta-0001",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0002-01",
          "timestamp": "2026-10-01T12:02:01+00:00",
          "session_id": "descoberta-0002",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0002-02",
          "timestamp": "2026-10-01T12:02:02+00:00",
          "session_id": "descoberta-0002",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0002-03",
          "timestamp": "2026-10-01T12:02:03+00:00",
          "session_id": "descoberta-0002",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0002-04",
          "timestamp": "2026-10-01T12:02:04+00:00",
          "session_id": "descoberta-0002",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0002-05",
          "timestamp": "2026-10-01T12:02:05+00:00",
          "session_id": "descoberta-0002",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0003-01",
          "timestamp": "2026-10-01T12:03:01+00:00",
          "session_id": "descoberta-0003",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0003-02",
          "timestamp": "2026-10-01T12:03:02+00:00",
          "session_id": "descoberta-0003",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0003-03",
          "timestamp": "2026-10-01T12:03:03+00:00",
          "session_id": "descoberta-0003",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0003-04",
          "timestamp": "2026-10-01T12:03:04+00:00",
          "session_id": "descoberta-0003",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0003-05",
          "timestamp": "2026-10-01T12:03:05+00:00",
          "session_id": "descoberta-0003",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0004-01",
          "timestamp": "2026-10-01T12:04:01+00:00",
          "session_id": "descoberta-0004",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0004-02",
          "timestamp": "2026-10-01T12:04:02+00:00",
          "session_id": "descoberta-0004",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0004-03",
          "timestamp": "2026-10-01T12:04:03+00:00",
          "session_id": "descoberta-0004",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0004-04",
          "timestamp": "2026-10-01T12:04:04+00:00",
          "session_id": "descoberta-0004",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0004-05",
          "timestamp": "2026-10-01T12:04:05+00:00",
          "session_id": "descoberta-0004",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0005-01",
          "timestamp": "2026-10-01T12:05:01+00:00",
          "session_id": "descoberta-0005",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0005-02",
          "timestamp": "2026-10-01T12:05:02+00:00",
          "session_id": "descoberta-0005",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0005-03",
          "timestamp": "2026-10-01T12:05:03+00:00",
          "session_id": "descoberta-0005",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0005-04",
          "timestamp": "2026-10-01T12:05:04+00:00",
          "session_id": "descoberta-0005",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0005-05",
          "timestamp": "2026-10-01T12:05:05+00:00",
          "session_id": "descoberta-0005",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0006-01",
          "timestamp": "2026-10-01T12:06:01+00:00",
          "session_id": "descoberta-0006",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0006-02",
          "timestamp": "2026-10-01T12:06:02+00:00",
          "session_id": "descoberta-0006",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0006-03",
          "timestamp": "2026-10-01T12:06:03+00:00",
          "session_id": "descoberta-0006",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0006-04",
          "timestamp": "2026-10-01T12:06:04+00:00",
          "session_id": "descoberta-0006",
          "evento": "falha_mfa"
        },
        {
          "event_id": "descoberta-0007-01",
          "timestamp": "2026-10-01T12:07:01+00:00",
          "session_id": "descoberta-0007",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0007-02",
          "timestamp": "2026-10-01T12:07:02+00:00",
          "session_id": "descoberta-0007",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0007-03",
          "timestamp": "2026-10-01T12:07:03+00:00",
          "session_id": "descoberta-0007",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0008-01",
          "timestamp": "2026-10-01T12:08:01+00:00",
          "session_id": "descoberta-0008",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0008-02",
          "timestamp": "2026-10-01T12:08:02+00:00",
          "session_id": "descoberta-0008",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0009-01",
          "timestamp": "2026-10-01T12:09:01+00:00",
          "session_id": "descoberta-0009",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0009-02",
          "timestamp": "2026-10-01T12:09:02+00:00",
          "session_id": "descoberta-0009",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0009-03",
          "timestamp": "2026-10-01T12:09:03+00:00",
          "session_id": "descoberta-0009",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0010-01",
          "timestamp": "2026-10-01T12:10:01+00:00",
          "session_id": "descoberta-0010",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0010-02",
          "timestamp": "2026-10-01T12:10:02+00:00",
          "session_id": "descoberta-0010",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0010-03",
          "timestamp": "2026-10-01T12:10:03+00:00",
          "session_id": "descoberta-0010",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0011-01",
          "timestamp": "2026-10-01T12:11:01+00:00",
          "session_id": "descoberta-0011",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0011-02",
          "timestamp": "2026-10-01T12:11:02+00:00",
          "session_id": "descoberta-0011",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0012-01",
          "timestamp": "2026-10-01T12:12:01+00:00",
          "session_id": "descoberta-0012",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0012-02",
          "timestamp": "2026-10-01T12:12:02+00:00",
          "session_id": "descoberta-0012",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0013-01",
          "timestamp": "2026-10-01T12:13:01+00:00",
          "session_id": "descoberta-0013",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0013-02",
          "timestamp": "2026-10-01T12:13:02+00:00",
          "session_id": "descoberta-0013",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0014-01",
          "timestamp": "2026-10-01T12:14:01+00:00",
          "session_id": "descoberta-0014",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0014-02",
          "timestamp": "2026-10-01T12:14:02+00:00",
          "session_id": "descoberta-0014",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0015-01",
          "timestamp": "2026-10-01T12:15:01+00:00",
          "session_id": "descoberta-0015",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0015-02",
          "timestamp": "2026-10-01T12:15:02+00:00",
          "session_id": "descoberta-0015",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0016-01",
          "timestamp": "2026-10-01T12:16:01+00:00",
          "session_id": "descoberta-0016",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0016-02",
          "timestamp": "2026-10-01T12:16:02+00:00",
          "session_id": "descoberta-0016",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0017-01",
          "timestamp": "2026-10-01T12:17:01+00:00",
          "session_id": "descoberta-0017",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0017-02",
          "timestamp": "2026-10-01T12:17:02+00:00",
          "session_id": "descoberta-0017",
          "evento": "login_sucesso"
        },
        {
          "event_id": "descoberta-0018-01",
          "timestamp": "2026-10-01T12:18:01+00:00",
          "session_id": "descoberta-0018",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0018-02",
          "timestamp": "2026-10-01T12:18:02+00:00",
          "session_id": "descoberta-0018",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "descoberta-0019-01",
          "timestamp": "2026-10-01T12:19:01+00:00",
          "session_id": "descoberta-0019",
          "evento": "senha_aceita"
        },
        {
          "event_id": "descoberta-0020-01",
          "timestamp": "2026-10-01T12:20:01+00:00",
          "session_id": "descoberta-0020",
          "evento": "falha_senha"
        },
        {
          "event_id": "descoberta-0020-02",
          "timestamp": "2026-10-01T12:20:02+00:00",
          "session_id": "descoberta-0020",
          "evento": "falha_senha"
        }
      ],
      "padroes": [
        {
          "itens": [
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 700
        },
        {
          "itens": [
            "desafio_mfa",
            "falha_senha",
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 500
        },
        {
          "itens": [
            "falha_senha"
          ],
          "sessoes": 200
        },
        {
          "itens": [
            "desafio_mfa",
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 200
        },
        {
          "itens": [
            "desafio_mfa",
            "falha_mfa",
            "falha_senha",
            "senha_aceita"
          ],
          "sessoes": 100
        },
        {
          "itens": [
            "falha_senha",
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 100
        },
        {
          "itens": [
            "desafio_mfa",
            "senha_aceita"
          ],
          "sessoes": 100
        },
        {
          "itens": [
            "senha_aceita"
          ],
          "sessoes": 100
        }
      ],
      "regras": [
        {
          "antecedente": [
            "desafio_mfa",
            "login_sucesso"
          ],
          "consequente": [
            "falha_senha",
            "senha_aceita"
          ],
          "n_a": 700,
          "n_b": 700,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.714286,
          "lift": 2.040816
        },
        {
          "antecedente": [
            "falha_senha",
            "senha_aceita"
          ],
          "consequente": [
            "desafio_mfa",
            "login_sucesso"
          ],
          "n_a": 700,
          "n_b": 700,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.714286,
          "lift": 2.040816
        },
        {
          "antecedente": [
            "falha_senha",
            "senha_aceita"
          ],
          "consequente": [
            "desafio_mfa"
          ],
          "n_a": 700,
          "n_b": 900,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 0.857143,
          "lift": 1.904762
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "falha_senha",
            "senha_aceita"
          ],
          "n_a": 900,
          "n_b": 700,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 0.666667,
          "lift": 1.904762
        },
        {
          "antecedente": [
            "falha_senha",
            "login_sucesso"
          ],
          "consequente": [
            "desafio_mfa"
          ],
          "n_a": 600,
          "n_b": 900,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.833333,
          "lift": 1.851852
        },
        {
          "antecedente": [
            "falha_senha",
            "login_sucesso"
          ],
          "consequente": [
            "desafio_mfa",
            "senha_aceita"
          ],
          "n_a": 600,
          "n_b": 900,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.833333,
          "lift": 1.851852
        },
        {
          "antecedente": [
            "falha_senha",
            "login_sucesso",
            "senha_aceita"
          ],
          "consequente": [
            "desafio_mfa"
          ],
          "n_a": 600,
          "n_b": 900,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.833333,
          "lift": 1.851852
        },
        {
          "antecedente": [
            "desafio_mfa",
            "login_sucesso"
          ],
          "consequente": [
            "falha_senha"
          ],
          "n_a": 700,
          "n_b": 900,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.714286,
          "lift": 1.587302
        },
        {
          "antecedente": [
            "desafio_mfa",
            "login_sucesso",
            "senha_aceita"
          ],
          "consequente": [
            "falha_senha"
          ],
          "n_a": 700,
          "n_b": 900,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.714286,
          "lift": 1.587302
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "falha_senha"
          ],
          "n_a": 900,
          "n_b": 900,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 0.666667,
          "lift": 1.481481
        },
        {
          "antecedente": [
            "desafio_mfa",
            "senha_aceita"
          ],
          "consequente": [
            "falha_senha"
          ],
          "n_a": 900,
          "n_b": 900,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 0.666667,
          "lift": 1.481481
        },
        {
          "antecedente": [
            "falha_senha"
          ],
          "consequente": [
            "desafio_mfa"
          ],
          "n_a": 900,
          "n_b": 900,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 0.666667,
          "lift": 1.481481
        },
        {
          "antecedente": [
            "falha_senha"
          ],
          "consequente": [
            "desafio_mfa",
            "senha_aceita"
          ],
          "n_a": 900,
          "n_b": 900,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 0.666667,
          "lift": 1.481481
        },
        {
          "antecedente": [
            "falha_senha",
            "senha_aceita"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 700,
          "n_b": 1500,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 0.857143,
          "lift": 1.142857
        },
        {
          "antecedente": [
            "login_sucesso"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 1500,
          "n_b": 1800,
          "juntos": 1500,
          "suporte": 0.75,
          "confianca": 1.0,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 900,
          "n_b": 1800,
          "juntos": 900,
          "suporte": 0.45,
          "confianca": 1.0,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa",
            "login_sucesso"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 700,
          "n_b": 1800,
          "juntos": 700,
          "suporte": 0.35,
          "confianca": 1.0,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa",
            "falha_senha"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 600,
          "n_b": 1800,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 1.0,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "falha_senha",
            "login_sucesso"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 600,
          "n_b": 1800,
          "juntos": 600,
          "suporte": 0.3,
          "confianca": 1.0,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa",
            "falha_senha",
            "login_sucesso"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 500,
          "n_b": 1800,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 1.0,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "senha_aceita"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 1800,
          "n_b": 1500,
          "juntos": 1500,
          "suporte": 0.75,
          "confianca": 0.833333,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa",
            "falha_senha"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 600,
          "n_b": 1500,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.833333,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa",
            "falha_senha"
          ],
          "consequente": [
            "login_sucesso",
            "senha_aceita"
          ],
          "n_a": 600,
          "n_b": 1500,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.833333,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa",
            "falha_senha",
            "senha_aceita"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 600,
          "n_b": 1500,
          "juntos": 500,
          "suporte": 0.25,
          "confianca": 0.833333,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 900,
          "n_b": 1500,
          "juntos": 700,
          "suporte": 0.35,
          "confianca": 0.777778,
          "lift": 1.037037
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "login_sucesso",
            "senha_aceita"
          ],
          "n_a": 900,
          "n_b": 1500,
          "juntos": 700,
          "suporte": 0.35,
          "confianca": 0.777778,
          "lift": 1.037037
        },
        {
          "antecedente": [
            "desafio_mfa",
            "senha_aceita"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 900,
          "n_b": 1500,
          "juntos": 700,
          "suporte": 0.35,
          "confianca": 0.777778,
          "lift": 1.037037
        }
      ],
      "regra_fixa": {
        "regra": "falha_senha -> desafio_mfa",
        "total_sessoes": 2000,
        "contagem_antecedente": 900,
        "contagem_consequente": 900,
        "contagem_conjunta": 600,
        "suporte": 0.3,
        "confianca": 0.6666666666666666,
        "lift": 1.4814814814814814
      }
    },
    "validacao": {
      "arquivo": "dados/logs-autenticacao/validacao-20261017.jsonl",
      "linhas": 2401,
      "eventos_unicos": 2400,
      "reentregas": 1,
      "sessoes": 1000,
      "bloco_base": 10,
      "ultima_linha": {
        "event_id": "validacao-0001-01",
        "timestamp": "2026-10-02T12:01:01+00:00",
        "session_id": "validacao-0001",
        "evento": "falha_senha"
      },
      "amostra_linhas": [
        {
          "event_id": "validacao-0001-01",
          "timestamp": "2026-10-02T12:01:01+00:00",
          "session_id": "validacao-0001",
          "evento": "falha_senha"
        },
        {
          "event_id": "validacao-0001-02",
          "timestamp": "2026-10-02T12:01:02+00:00",
          "session_id": "validacao-0001",
          "evento": "falha_senha"
        },
        {
          "event_id": "validacao-0001-03",
          "timestamp": "2026-10-02T12:01:03+00:00",
          "session_id": "validacao-0001",
          "evento": "senha_aceita"
        },
        {
          "event_id": "validacao-0001-04",
          "timestamp": "2026-10-02T12:01:04+00:00",
          "session_id": "validacao-0001",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "validacao-0001-05",
          "timestamp": "2026-10-02T12:01:05+00:00",
          "session_id": "validacao-0001",
          "evento": "login_sucesso"
        },
        {
          "event_id": "validacao-0002-01",
          "timestamp": "2026-10-02T12:02:01+00:00",
          "session_id": "validacao-0002",
          "evento": "falha_senha"
        },
        {
          "event_id": "validacao-0002-02",
          "timestamp": "2026-10-02T12:02:02+00:00",
          "session_id": "validacao-0002",
          "evento": "senha_aceita"
        },
        {
          "event_id": "validacao-0002-03",
          "timestamp": "2026-10-02T12:02:03+00:00",
          "session_id": "validacao-0002",
          "evento": "login_sucesso"
        },
        {
          "event_id": "validacao-0003-01",
          "timestamp": "2026-10-02T12:03:01+00:00",
          "session_id": "validacao-0003",
          "evento": "falha_senha"
        },
        {
          "event_id": "validacao-0003-02",
          "timestamp": "2026-10-02T12:03:02+00:00",
          "session_id": "validacao-0003",
          "evento": "falha_senha"
        },
        {
          "event_id": "validacao-0004-01",
          "timestamp": "2026-10-02T12:04:01+00:00",
          "session_id": "validacao-0004",
          "evento": "falha_senha"
        },
        {
          "event_id": "validacao-0004-02",
          "timestamp": "2026-10-02T12:04:02+00:00",
          "session_id": "validacao-0004",
          "evento": "falha_senha"
        },
        {
          "event_id": "validacao-0005-01",
          "timestamp": "2026-10-02T12:05:01+00:00",
          "session_id": "validacao-0005",
          "evento": "senha_aceita"
        },
        {
          "event_id": "validacao-0005-02",
          "timestamp": "2026-10-02T12:05:02+00:00",
          "session_id": "validacao-0005",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "validacao-0005-03",
          "timestamp": "2026-10-02T12:05:03+00:00",
          "session_id": "validacao-0005",
          "evento": "login_sucesso"
        },
        {
          "event_id": "validacao-0006-01",
          "timestamp": "2026-10-02T12:06:01+00:00",
          "session_id": "validacao-0006",
          "evento": "senha_aceita"
        },
        {
          "event_id": "validacao-0006-02",
          "timestamp": "2026-10-02T12:06:02+00:00",
          "session_id": "validacao-0006",
          "evento": "desafio_mfa"
        },
        {
          "event_id": "validacao-0007-01",
          "timestamp": "2026-10-02T12:07:01+00:00",
          "session_id": "validacao-0007",
          "evento": "senha_aceita"
        },
        {
          "event_id": "validacao-0007-02",
          "timestamp": "2026-10-02T12:07:02+00:00",
          "session_id": "validacao-0007",
          "evento": "login_sucesso"
        },
        {
          "event_id": "validacao-0008-01",
          "timestamp": "2026-10-02T12:08:01+00:00",
          "session_id": "validacao-0008",
          "evento": "senha_aceita"
        },
        {
          "event_id": "validacao-0008-02",
          "timestamp": "2026-10-02T12:08:02+00:00",
          "session_id": "validacao-0008",
          "evento": "login_sucesso"
        },
        {
          "event_id": "validacao-0009-01",
          "timestamp": "2026-10-02T12:09:01+00:00",
          "session_id": "validacao-0009",
          "evento": "senha_aceita"
        },
        {
          "event_id": "validacao-0009-02",
          "timestamp": "2026-10-02T12:09:02+00:00",
          "session_id": "validacao-0009",
          "evento": "login_sucesso"
        },
        {
          "event_id": "validacao-0010-01",
          "timestamp": "2026-10-02T12:10:01+00:00",
          "session_id": "validacao-0010",
          "evento": "senha_aceita"
        }
      ],
      "padroes": [
        {
          "itens": [
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 300
        },
        {
          "itens": [
            "falha_senha"
          ],
          "sessoes": 200
        },
        {
          "itens": [
            "desafio_mfa",
            "falha_senha",
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 100
        },
        {
          "itens": [
            "falha_senha",
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 100
        },
        {
          "itens": [
            "desafio_mfa",
            "login_sucesso",
            "senha_aceita"
          ],
          "sessoes": 100
        },
        {
          "itens": [
            "desafio_mfa",
            "senha_aceita"
          ],
          "sessoes": 100
        },
        {
          "itens": [
            "senha_aceita"
          ],
          "sessoes": 100
        }
      ],
      "regras": [
        {
          "antecedente": [
            "falha_senha",
            "senha_aceita"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 200,
          "n_b": 600,
          "juntos": 200,
          "suporte": 0.2,
          "confianca": 1.0,
          "lift": 1.666667
        },
        {
          "antecedente": [
            "login_sucesso"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 600,
          "n_b": 800,
          "juntos": 600,
          "suporte": 0.6,
          "confianca": 1.0,
          "lift": 1.25
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 300,
          "n_b": 800,
          "juntos": 300,
          "suporte": 0.3,
          "confianca": 1.0,
          "lift": 1.25
        },
        {
          "antecedente": [
            "desafio_mfa",
            "login_sucesso"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 200,
          "n_b": 800,
          "juntos": 200,
          "suporte": 0.2,
          "confianca": 1.0,
          "lift": 1.25
        },
        {
          "antecedente": [
            "falha_senha",
            "login_sucesso"
          ],
          "consequente": [
            "senha_aceita"
          ],
          "n_a": 200,
          "n_b": 800,
          "juntos": 200,
          "suporte": 0.2,
          "confianca": 1.0,
          "lift": 1.25
        },
        {
          "antecedente": [
            "senha_aceita"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 800,
          "n_b": 600,
          "juntos": 600,
          "suporte": 0.6,
          "confianca": 0.75,
          "lift": 1.25
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 300,
          "n_b": 600,
          "juntos": 200,
          "suporte": 0.2,
          "confianca": 0.666667,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa"
          ],
          "consequente": [
            "login_sucesso",
            "senha_aceita"
          ],
          "n_a": 300,
          "n_b": 600,
          "juntos": 200,
          "suporte": 0.2,
          "confianca": 0.666667,
          "lift": 1.111111
        },
        {
          "antecedente": [
            "desafio_mfa",
            "senha_aceita"
          ],
          "consequente": [
            "login_sucesso"
          ],
          "n_a": 300,
          "n_b": 600,
          "juntos": 200,
          "suporte": 0.2,
          "confianca": 0.666667,
          "lift": 1.111111
        }
      ],
      "regra_fixa": {
        "regra": "falha_senha -> desafio_mfa",
        "total_sessoes": 1000,
        "contagem_antecedente": 400,
        "contagem_consequente": 300,
        "contagem_conjunta": 100,
        "suporte": 0.1,
        "confianca": 0.25,
        "lift": 0.8333333333333334
      }
    }
  }
};
