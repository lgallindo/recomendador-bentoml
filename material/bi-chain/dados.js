window.CHAIN_LOJA = {
  "origem": "material/langchain/rastros.json",
  "langchain_core": "1.7.6",
  "sistema": "Você resume um produto do catálogo em JSON.",
  "casos": [
    {
      "pergunta": "Quero uma dica sobre o produto p01",
      "passos": [
        {
          "passo": "entrada",
          "carga": "Quero uma dica sobre o produto p01"
        },
        {
          "passo": "extrair_id",
          "carga": {
            "pid": "p01",
            "achado_no_texto": true
          }
        },
        {
          "passo": "ferramenta_lookup",
          "carga": {
            "id": "p01",
            "nome": "Jarro barro Tracunhaém",
            "tecnica": "ceramica",
            "regiao": "Tracunhaém"
          }
        },
        {
          "passo": "prompt",
          "carga": [
            {
              "papel": "system",
              "conteudo": "Você resume um produto do catálogo em JSON."
            },
            {
              "papel": "human",
              "conteudo": "Quero uma dica sobre o produto p01"
            }
          ]
        },
        {
          "passo": "modelo",
          "carga": "{\"ok\": true, \"produto\": \"p01\", \"resumo\": \"Jarro barro Tracunhaém — técnica ceramica (Tracunhaém)\", \"pergunta\": \"Quero uma dica sobre o produto p01\"}"
        },
        {
          "passo": "parser",
          "carga": {
            "ok": true,
            "produto": "p01",
            "resumo": "Jarro barro Tracunhaém — técnica ceramica (Tracunhaém)",
            "pergunta": "Quero uma dica sobre o produto p01"
          },
          "parse_ok": true
        }
      ],
      "alertas": [],
      "saidas_identicas": true
    },
    {
      "pergunta": "Fala do p04",
      "passos": [
        {
          "passo": "entrada",
          "carga": "Fala do p04"
        },
        {
          "passo": "extrair_id",
          "carga": {
            "pid": "p04",
            "achado_no_texto": true
          }
        },
        {
          "passo": "ferramenta_lookup",
          "carga": {
            "id": "p04",
            "nome": "Rendeira Alto do Moura",
            "tecnica": "renda",
            "regiao": "Alto do Moura"
          }
        },
        {
          "passo": "prompt",
          "carga": [
            {
              "papel": "system",
              "conteudo": "Você resume um produto do catálogo em JSON."
            },
            {
              "papel": "human",
              "conteudo": "Fala do p04"
            }
          ]
        },
        {
          "passo": "modelo",
          "carga": "{\"ok\": true, \"produto\": \"p04\", \"resumo\": \"Rendeira Alto do Moura — técnica renda (Alto do Moura)\", \"pergunta\": \"Fala do p04\"}"
        },
        {
          "passo": "parser",
          "carga": {
            "ok": true,
            "produto": "p04",
            "resumo": "Rendeira Alto do Moura — técnica renda (Alto do Moura)",
            "pergunta": "Fala do p04"
          },
          "parse_ok": true
        }
      ],
      "alertas": [],
      "saidas_identicas": true
    },
    {
      "pergunta": "Me conta da peça P07",
      "passos": [
        {
          "passo": "entrada",
          "carga": "Me conta da peça P07"
        },
        {
          "passo": "extrair_id",
          "carga": {
            "pid": "p07",
            "achado_no_texto": true
          }
        },
        {
          "passo": "ferramenta_lookup",
          "carga": {
            "id": "p07",
            "nome": "Xilogravura Pilar",
            "tecnica": "xilogravura",
            "regiao": "Comunidade do Pilar"
          }
        },
        {
          "passo": "prompt",
          "carga": [
            {
              "papel": "system",
              "conteudo": "Você resume um produto do catálogo em JSON."
            },
            {
              "papel": "human",
              "conteudo": "Me conta da peça P07"
            }
          ]
        },
        {
          "passo": "modelo",
          "carga": "{\"ok\": true, \"produto\": \"p07\", \"resumo\": \"Xilogravura Pilar — técnica xilogravura (Comunidade do Pilar)\", \"pergunta\": \"Me conta da peça P07\"}"
        },
        {
          "passo": "parser",
          "carga": {
            "ok": true,
            "produto": "p07",
            "resumo": "Xilogravura Pilar — técnica xilogravura (Comunidade do Pilar)",
            "pergunta": "Me conta da peça P07"
          },
          "parse_ok": true
        }
      ],
      "alertas": [],
      "saidas_identicas": true
    },
    {
      "pergunta": "Fala do p04 e do p07",
      "passos": [
        {
          "passo": "entrada",
          "carga": "Fala do p04 e do p07"
        },
        {
          "passo": "extrair_id",
          "carga": {
            "pid": "p04",
            "achado_no_texto": true
          }
        },
        {
          "passo": "ferramenta_lookup",
          "carga": {
            "id": "p04",
            "nome": "Rendeira Alto do Moura",
            "tecnica": "renda",
            "regiao": "Alto do Moura"
          }
        },
        {
          "passo": "prompt",
          "carga": [
            {
              "papel": "system",
              "conteudo": "Você resume um produto do catálogo em JSON."
            },
            {
              "papel": "human",
              "conteudo": "Fala do p04 e do p07"
            }
          ]
        },
        {
          "passo": "modelo",
          "carga": "{\"ok\": true, \"produto\": \"p04\", \"resumo\": \"Rendeira Alto do Moura — técnica renda (Alto do Moura)\", \"pergunta\": \"Fala do p04 e do p07\"}"
        },
        {
          "passo": "parser",
          "carga": {
            "ok": true,
            "produto": "p04",
            "resumo": "Rendeira Alto do Moura — técnica renda (Alto do Moura)",
            "pergunta": "Fala do p04 e do p07"
          },
          "parse_ok": true
        }
      ],
      "alertas": [
        "vários ids ['p04', 'p07']: só o primeiro foi usado"
      ],
      "saidas_identicas": true
    },
    {
      "pergunta": "O que é o p13?",
      "passos": [
        {
          "passo": "entrada",
          "carga": "O que é o p13?"
        },
        {
          "passo": "extrair_id",
          "carga": {
            "pid": "p13",
            "achado_no_texto": true
          }
        },
        {
          "passo": "ferramenta_lookup",
          "carga": {
            "id": "p13",
            "erro": "produto_nao_encontrado"
          }
        },
        {
          "passo": "prompt",
          "carga": [
            {
              "papel": "system",
              "conteudo": "Você resume um produto do catálogo em JSON."
            },
            {
              "papel": "human",
              "conteudo": "O que é o p13?"
            }
          ]
        },
        {
          "passo": "modelo",
          "carga": "{\"ok\": false, \"motivo\": \"produto_nao_encontrado\"}"
        },
        {
          "passo": "parser",
          "carga": {
            "ok": false,
            "motivo": "produto_nao_encontrado"
          },
          "parse_ok": true
        }
      ],
      "alertas": [
        "id inexistente no catálogo: ferramenta devolveu erro"
      ],
      "saidas_identicas": true
    },
    {
      "pergunta": "Qual peça combina com renda?",
      "passos": [
        {
          "passo": "entrada",
          "carga": "Qual peça combina com renda?"
        },
        {
          "passo": "extrair_id",
          "carga": {
            "pid": "p01",
            "achado_no_texto": false
          }
        },
        {
          "passo": "ferramenta_lookup",
          "carga": {
            "id": "p01",
            "nome": "Jarro barro Tracunhaém",
            "tecnica": "ceramica",
            "regiao": "Tracunhaém"
          }
        },
        {
          "passo": "prompt",
          "carga": [
            {
              "papel": "system",
              "conteudo": "Você resume um produto do catálogo em JSON."
            },
            {
              "papel": "human",
              "conteudo": "Qual peça combina com renda?"
            }
          ]
        },
        {
          "passo": "modelo",
          "carga": "{\"ok\": true, \"produto\": \"p01\", \"resumo\": \"Jarro barro Tracunhaém — técnica ceramica (Tracunhaém)\", \"pergunta\": \"Qual peça combina com renda?\"}"
        },
        {
          "passo": "parser",
          "carga": {
            "ok": true,
            "produto": "p01",
            "resumo": "Jarro barro Tracunhaém — técnica ceramica (Tracunhaém)",
            "pergunta": "Qual peça combina com renda?"
          },
          "parse_ok": true
        }
      ],
      "alertas": [
        "sem id na pergunta: extrator usou o padrão p01"
      ],
      "saidas_identicas": true
    }
  ]
};
