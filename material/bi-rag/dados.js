window.BI_RAG = {
  "origem": "material/mini-wiki-rag/",
  "llmwiki_versao": "llmwiki 0.2.1",
  "k1": 1.2,
  "b": 0.75,
  "stopwords": [
    "a",
    "ao",
    "as",
    "com",
    "da",
    "das",
    "de",
    "do",
    "dos",
    "e",
    "em",
    "na",
    "nas",
    "no",
    "nos",
    "o",
    "os",
    "ou",
    "para",
    "por",
    "quais",
    "qual",
    "que",
    "se",
    "sem",
    "um",
    "uma",
    "à",
    "é"
  ],
  "instrucao": "Responda em português usando SOMENTE os trechos abaixo. Cite o arquivo de cada fato entre parênteses. Se os trechos não contiverem a resposta, diga que a informação não está no corpus.",
  "paginas": [
    {
      "path": "atendimento.md",
      "title": "Atendimento e canais",
      "description": "Horário do chat e o que o bot pode responder sem humano.",
      "tags": "[atendimento, canais, pt-br]",
      "corpo": "# Atendimento\n\nChat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,\nprazo e devolução a partir deste corpus. Pedidos de troca por defeito sobem\npara humano com foto anexada.",
      "pesquisavel": "Atendimento e canais\nHorário do chat e o que o bot pode responder sem humano.\n\n# Atendimento\n\nChat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,\nprazo e devolução a partir deste corpus. Pedidos de troca por defeito sobem\npara humano com foto anexada.\n"
    },
    {
      "path": "catalogo-p01.md",
      "title": "Peça p01 — Jarro barro Tracunhaém",
      "description": "Ficha curta do jarro de cerâmica usado nos exemplos da API.",
      "tags": "[catalogo, p01, ceramica, pt-br]",
      "corpo": "# p01 — Jarro barro Tracunhaém\n\nTécnica: cerâmica. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula\n(`just curl-exemplo`). Combina bem com pratos da mesma técnica na cesta.",
      "pesquisavel": "Peça p01 — Jarro barro Tracunhaém\nFicha curta do jarro de cerâmica usado nos exemplos da API.\n\n# p01 — Jarro barro Tracunhaém\n\nTécnica: cerâmica. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula\n(`just curl-exemplo`). Combina bem com pratos da mesma técnica na cesta.\n"
    },
    {
      "path": "catalogo-p04.md",
      "title": "Peça p04 — Rendeira Alto do Moura",
      "description": "Ficha curta da peça de renda do catálogo sintético.",
      "tags": "[catalogo, p04, renda, pt-br]",
      "corpo": "# p04 — Rendeira Alto do Moura\n\nTécnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece\nquando a pergunta cita esse id.",
      "pesquisavel": "Peça p04 — Rendeira Alto do Moura\nFicha curta da peça de renda do catálogo sintético.\n\n# p04 — Rendeira Alto do Moura\n\nTécnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece\nquando a pergunta cita esse id.\n"
    },
    {
      "path": "devolucao.md",
      "title": "Política de devolução",
      "description": "Prazo, estado da peça e como abrir o pedido de devolução.",
      "tags": "[devolucao, politica, pt-br]",
      "corpo": "# Devolução\n\nO cliente tem **7 dias corridos** após o recebimento para solicitar devolução\nde peça sem uso, com embalagem original.\n\nCerâmica frágil: foto da caixa na entrega ajuda se houver avaria no transporte.\nAbra o pedido pelo e-mail da loja com o número do pedido e o `product_id`\n(ex.: `p01`).",
      "pesquisavel": "Política de devolução\nPrazo, estado da peça e como abrir o pedido de devolução.\n\n# Devolução\n\nO cliente tem **7 dias corridos** após o recebimento para solicitar devolução\nde peça sem uso, com embalagem original.\n\nCerâmica frágil: foto da caixa na entrega ajuda se houver avaria no transporte.\nAbra o pedido pelo e-mail da loja com o número do pedido e o `product_id`\n(ex.: `p01`).\n"
    },
    {
      "path": "frete.md",
      "title": "Frete — polos de Pernambuco",
      "description": "Regras de frete por polo e CEP; frete grátis acima de limiar.",
      "tags": "[frete, logistica, pt-br]",
      "corpo": "# Frete\n\nTracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido.\nComunidade do Pilar: pedidos acima de R$ 200 têm frete grátis para Recife e\nOlinda.\n\nPrazos estimados (dias úteis): Grande Recife 3–5; interior 5–10.",
      "pesquisavel": "Frete — polos de Pernambuco\nRegras de frete por polo e CEP; frete grátis acima de limiar.\n\n# Frete\n\nTracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido.\nComunidade do Pilar: pedidos acima de R$ 200 têm frete grátis para Recife e\nOlinda.\n\nPrazos estimados (dias úteis): Grande Recife 3–5; interior 5–10.\n"
    },
    {
      "path": "inicio.md",
      "title": "Início — loja de artesanato PE",
      "description": "Página de entrada do corpus didático da feira online.",
      "tags": "[inicio, loja, pt-br]",
      "corpo": "# Loja didática\n\nCatálogo sintético de peças pernambucanas (cerâmica, renda, xilo, palha).\nAs páginas irmãs descrevem frete, devolução, prazos e o papel do recomendador.\nUse busca por palavra-chave ou híbrida depois de indexar esta pasta.",
      "pesquisavel": "Início — loja de artesanato PE\nPágina de entrada do corpus didático da feira online.\n\n# Loja didática\n\nCatálogo sintético de peças pernambucanas (cerâmica, renda, xilo, palha).\nAs páginas irmãs descrevem frete, devolução, prazos e o papel do recomendador.\nUse busca por palavra-chave ou híbrida depois de indexar esta pasta.\n"
    },
    {
      "path": "prazos.md",
      "title": "Prazos de produção artesanal",
      "description": "Tempo de preparo antes do despacho por técnica.",
      "tags": "[prazos, producao, pt-br]",
      "corpo": "# Prazos de produção\n\nPeças de prateleira saem em 1–2 dias úteis. Encomendas de cerâmica podem levar\naté 15 dias úteis. Renda sob medida: combinar prazo no chat antes de pagar.",
      "pesquisavel": "Prazos de produção artesanal\nTempo de preparo antes do despacho por técnica.\n\n# Prazos de produção\n\nPeças de prateleira saem em 1–2 dias úteis. Encomendas de cerâmica podem levar\naté 15 dias úteis. Renda sob medida: combinar prazo no chat antes de pagar.\n"
    },
    {
      "path": "recomendador.md",
      "title": "Como o recomendador sugere peças",
      "description": "Popularidade, co-ocorrência e reason legível na API.",
      "tags": "[recomendador, api, pt-br]",
      "corpo": "# Recomendador\n\nDado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`\ne `reason` (`mesma_tecnica`, `complemento_popularidade`, …).\n\nO treino usa cestas sintéticas e a contagem de `pedidos` do catálogo. Não mistura\npreferências de usuário entre sessões — isso é memória de agente, outra aula.",
      "pesquisavel": "Como o recomendador sugere peças\nPopularidade, co-ocorrência e reason legível na API.\n\n# Recomendador\n\nDado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`\ne `reason` (`mesma_tecnica`, `complemento_popularidade`, …).\n\nO treino usa cestas sintéticas e a contagem de `pedidos` do catálogo. Não mistura\npreferências de usuário entre sessões — isso é memória de agente, outra aula.\n"
    }
  ],
  "perguntas": [
    {
      "id": "q1",
      "pergunta": "Qual o prazo de devolução e o frete para Tracunhaém?",
      "relevantes": [
        "devolucao.md",
        "frete.md"
      ],
      "subperguntas": [
        "prazo de devolução",
        "frete para Tracunhaém"
      ],
      "precalculado": {
        "fts": {
          "inteira": [
            {
              "path": "frete.md",
              "score": null,
              "snippet": "# >>>Frete<<<  >>>Tracunhaém<<< e Alto do Moura: >>>frete<<< calculado por CEP na finalização do pedido. Comunidade do Pilar: pedidos acima de…"
            },
            {
              "path": "catalogo-p01.md",
              "score": null,
              "snippet": "# p01 — Jarro barro >>>Tracunhaém<<<  Técnica: cerâmica. Região: >>>Tracunhaém<<<. É o exemplo padrão dos `curl` da aula (`just curl-exemplo`). Combina…"
            },
            {
              "path": "atendimento.md",
              "score": null,
              "snippet": "…O bot responde >>>frete<<<, >>>prazo<<< e >>>devolução<<< a partir deste corpus. Pedidos de troca por defeito sobem para humano com…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "…As páginas irmãs descrevem >>>frete<<<, >>>devolução<<<, >>>prazos<<< e o papel do recomendador. Use busca por palavra-chave ou híbrida depois…"
            },
            {
              "path": "devolucao.md",
              "score": null,
              "snippet": "# >>>Devolução<<<  O cliente tem **7 dias corridos** após o recebimento para solicitar >>>devolução<<< de peça sem uso, com embalagem original…"
            },
            {
              "path": "prazos.md",
              "score": null,
              "snippet": "…combinar >>>prazo<<< no chat antes de pagar."
            }
          ],
          "subperguntas": [
            {
              "path": "devolucao.md",
              "score": null,
              "snippet": "# >>>Devolução<<<  O cliente tem **7 dias corridos** após o recebimento para solicitar >>>devolução<<< de peça sem uso, com embalagem original…"
            },
            {
              "path": "frete.md",
              "score": null,
              "snippet": "# >>>Frete<<<  >>>Tracunhaém<<< e Alto do Moura: >>>frete<<< calculado por CEP na finalização do pedido. Comunidade do Pilar: pedidos acima de…"
            },
            {
              "path": "atendimento.md",
              "score": null,
              "snippet": "…O bot responde frete, >>>prazo<<< e >>>devolução<<< a partir deste corpus. Pedidos de troca por defeito sobem para humano com…"
            },
            {
              "path": "catalogo-p01.md",
              "score": null,
              "snippet": "# p01 — Jarro barro >>>Tracunhaém<<<  Técnica: cerâmica. Região: >>>Tracunhaém<<<. É o exemplo padrão dos `curl` da aula (`just curl-exemplo`). Combina…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "…As páginas irmãs descrevem frete, >>>devolução<<<, >>>prazos<<< e o papel do recomendador. Use busca por palavra-chave ou híbrida depois…"
            },
            {
              "path": "prazos.md",
              "score": null,
              "snippet": "…combinar >>>prazo<<< no chat antes de pagar."
            }
          ]
        },
        "llmwiki": {
          "inteira": [
            {
              "path": "devolucao.md",
              "score": 13.9,
              "snippet": "O cliente tem **7 dias corridos** após o recebimento para solicitar >>>devolução<<<"
            },
            {
              "path": "atendimento.md",
              "score": 11.93,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde >>>frete<<<,"
            },
            {
              "path": "frete.md",
              "score": 10.17,
              "snippet": ">>>Tracunhaém<<< e Alto do Moura: >>>frete<<< calculado por CEP na finalização do pedido."
            },
            {
              "path": "recomendador.md",
              "score": 5.72,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            },
            {
              "path": "catalogo-p01.md",
              "score": 4.98,
              "snippet": "Técnica: cerâmica. Região: >>>Tracunhaém<<<. É o exemplo padrão dos `curl` da aula"
            },
            {
              "path": "inicio.md",
              "score": 4.5,
              "snippet": "As páginas irmãs descrevem >>>frete<<<, >>>devolução<<<, >>>prazo<<<s e o papel do recomendador."
            },
            {
              "path": "prazos.md",
              "score": 2.75,
              "snippet": "até 15 dias úteis. Renda sob medida: combinar >>>prazo<<< no chat antes de pagar."
            },
            {
              "path": "catalogo-p04.md",
              "score": 0.92,
              "snippet": "Técnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece"
            }
          ],
          "subperguntas": [
            {
              "path": "devolucao.md",
              "score": 7.92,
              "snippet": "O cliente tem **7 dias corridos** após o recebimento para solicitar >>>devolução<<<"
            },
            {
              "path": "frete.md",
              "score": 7.78,
              "snippet": ">>>Tracunhaém<<< e Alto do Moura: >>>frete<<< calculado por CEP na finalização do pedido."
            },
            {
              "path": "prazos.md",
              "score": 2.75,
              "snippet": "até 15 dias úteis. Renda sob medida: combinar >>>prazo<<< no chat antes de pagar."
            },
            {
              "path": "catalogo-p01.md",
              "score": 3.58,
              "snippet": "Técnica: cerâmica. Região: >>>Tracunhaém<<<. É o exemplo padrão dos `curl` da aula"
            },
            {
              "path": "atendimento.md",
              "score": 2.57,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde >>>frete<<<,"
            },
            {
              "path": "inicio.md",
              "score": 2.21,
              "snippet": "As páginas irmãs descrevem >>>frete<<<, >>>devolução<<<, >>>prazo<<<s e o papel do recomendador."
            },
            {
              "path": "catalogo-p04.md",
              "score": 0.55,
              "snippet": "Técnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece"
            },
            {
              "path": "recomendador.md",
              "score": 0.27,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            }
          ]
        }
      },
      "bm25_python": [
        {
          "path": "frete.md",
          "score": 2.9721
        },
        {
          "path": "atendimento.md",
          "score": 2.9682
        },
        {
          "path": "devolucao.md",
          "score": 2.4377
        },
        {
          "path": "catalogo-p01.md",
          "score": 2.0495
        },
        {
          "path": "inicio.md",
          "score": 1.8676
        },
        {
          "path": "prazos.md",
          "score": 1.0014
        }
      ]
    },
    {
      "id": "q2",
      "pergunta": "Tem frete grátis para Olinda?",
      "relevantes": [
        "frete.md"
      ],
      "subperguntas": [
        "Tem frete grátis para Olinda?"
      ],
      "precalculado": {
        "fts": {
          "inteira": [
            {
              "path": "frete.md",
              "score": null,
              "snippet": "…pedidos acima de R$ 200 >>>têm<<< >>>frete<<< >>>grátis<<< para Recife e >>>Olinda<<<.  Prazos estimados (dias úteis): Grande Recife 3–5…"
            },
            {
              "path": "devolucao.md",
              "score": null,
              "snippet": "# Devolução  O cliente >>>tem<<< **7 dias corridos** após o recebimento para solicitar devolução de peça sem uso, com embalagem original…"
            },
            {
              "path": "atendimento.md",
              "score": null,
              "snippet": "…O bot responde >>>frete<<<, prazo e devolução a partir deste corpus. Pedidos de troca por defeito sobem para humano com…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "…As páginas irmãs descrevem >>>frete<<<, devolução, prazos e o papel do recomendador. Use busca por palavra-chave ou híbrida depois…"
            }
          ],
          "subperguntas": [
            {
              "path": "frete.md",
              "score": null,
              "snippet": "…pedidos acima de R$ 200 >>>têm<<< >>>frete<<< >>>grátis<<< para Recife e >>>Olinda<<<.  Prazos estimados (dias úteis): Grande Recife 3–5…"
            },
            {
              "path": "devolucao.md",
              "score": null,
              "snippet": "# Devolução  O cliente >>>tem<<< **7 dias corridos** após o recebimento para solicitar devolução de peça sem uso, com embalagem original…"
            },
            {
              "path": "atendimento.md",
              "score": null,
              "snippet": "…O bot responde >>>frete<<<, prazo e devolução a partir deste corpus. Pedidos de troca por defeito sobem para humano com…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "…As páginas irmãs descrevem >>>frete<<<, devolução, prazos e o papel do recomendador. Use busca por palavra-chave ou híbrida depois…"
            }
          ]
        },
        "llmwiki": {
          "inteira": [
            {
              "path": "frete.md",
              "score": 11.65,
              "snippet": "Tracunhaém e Alto do Moura: >>>frete<<< calculado por CEP na finalização do pedido."
            },
            {
              "path": "devolucao.md",
              "score": 2.33,
              "snippet": "O cliente >>>tem<<< **7 dias corridos** após o recebimento para solicitar devolução"
            },
            {
              "path": "atendimento.md",
              "score": 1.96,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde >>>frete<<<,"
            },
            {
              "path": "inicio.md",
              "score": 0.96,
              "snippet": "As páginas irmãs descrevem >>>frete<<<, devolução, prazos e o papel do recomendador."
            }
          ],
          "subperguntas": [
            {
              "path": "frete.md",
              "score": 11.65,
              "snippet": "Tracunhaém e Alto do Moura: >>>frete<<< calculado por CEP na finalização do pedido."
            },
            {
              "path": "devolucao.md",
              "score": 2.33,
              "snippet": "O cliente >>>tem<<< **7 dias corridos** após o recebimento para solicitar devolução"
            },
            {
              "path": "atendimento.md",
              "score": 1.96,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde >>>frete<<<,"
            },
            {
              "path": "inicio.md",
              "score": 0.96,
              "snippet": "As páginas irmãs descrevem >>>frete<<<, devolução, prazos e o papel do recomendador."
            }
          ]
        }
      },
      "bm25_python": [
        {
          "path": "frete.md",
          "score": 5.8973
        },
        {
          "path": "devolucao.md",
          "score": 1.6774
        },
        {
          "path": "atendimento.md",
          "score": 0.9894
        },
        {
          "path": "inicio.md",
          "score": 0.9338
        }
      ]
    },
    {
      "id": "q3",
      "pergunta": "Quanto tempo leva uma encomenda de cerâmica?",
      "relevantes": [
        "prazos.md"
      ],
      "subperguntas": [
        "Quanto tempo leva uma encomenda de cerâmica?"
      ],
      "precalculado": {
        "fts": {
          "inteira": [
            {
              "path": "prazos.md",
              "score": null,
              "snippet": "…>>>Encomendas<<< de >>>cerâmica<<< podem levar até 15 dias úteis. Renda sob medida: combinar prazo no chat antes de pagar."
            },
            {
              "path": "catalogo-p01.md",
              "score": null,
              "snippet": "# p01 — Jarro barro Tracunhaém  Técnica: >>>cerâmica<<<. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula (`just curl-exemplo`). Combina…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "# Loja didática  Catálogo sintético de peças pernambucanas (>>>cerâmica<<<, renda, xilo, palha). As páginas irmãs descrevem frete, devolução, prazos e o…"
            },
            {
              "path": "devolucao.md",
              "score": null,
              "snippet": "…solicitar devolução de peça sem uso, com embalagem original.  >>>Cerâmica<<< frágil: foto da caixa na entrega ajuda se houver avaria…"
            }
          ],
          "subperguntas": [
            {
              "path": "prazos.md",
              "score": null,
              "snippet": "…>>>Encomendas<<< de >>>cerâmica<<< podem levar até 15 dias úteis. Renda sob medida: combinar prazo no chat antes de pagar."
            },
            {
              "path": "catalogo-p01.md",
              "score": null,
              "snippet": "# p01 — Jarro barro Tracunhaém  Técnica: >>>cerâmica<<<. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula (`just curl-exemplo`). Combina…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "# Loja didática  Catálogo sintético de peças pernambucanas (>>>cerâmica<<<, renda, xilo, palha). As páginas irmãs descrevem frete, devolução, prazos e o…"
            },
            {
              "path": "devolucao.md",
              "score": null,
              "snippet": "…solicitar devolução de peça sem uso, com embalagem original.  >>>Cerâmica<<< frágil: foto da caixa na entrega ajuda se houver avaria…"
            }
          ]
        },
        "llmwiki": {
          "inteira": [
            {
              "path": "prazos.md",
              "score": 4.08,
              "snippet": "Peças de prateleira saem em 1–2 dias úteis. >>>Encomenda<<<s de >>>cerâmica<<< podem >>>leva<<<r"
            },
            {
              "path": "catalogo-p01.md",
              "score": 2.8,
              "snippet": "Técnica: >>>cerâmica<<<. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula"
            },
            {
              "path": "inicio.md",
              "score": 1.95,
              "snippet": "Catálogo sintético de peças pernambucanas (>>>cerâmica<<<, renda, xilo, palha)."
            },
            {
              "path": "devolucao.md",
              "score": 1.85,
              "snippet": ">>>Cerâmica<<< frágil: foto da caixa na entrega ajuda se houver avaria no transporte."
            },
            {
              "path": "frete.md",
              "score": 1.32,
              "snippet": "Tracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido."
            },
            {
              "path": "catalogo-p04.md",
              "score": 0.55,
              "snippet": "Técnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece"
            },
            {
              "path": "recomendador.md",
              "score": 0.27,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            },
            {
              "path": "atendimento.md",
              "score": 0.26,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,"
            }
          ],
          "subperguntas": [
            {
              "path": "prazos.md",
              "score": 4.08,
              "snippet": "Peças de prateleira saem em 1–2 dias úteis. >>>Encomenda<<<s de >>>cerâmica<<< podem >>>leva<<<r"
            },
            {
              "path": "catalogo-p01.md",
              "score": 2.8,
              "snippet": "Técnica: >>>cerâmica<<<. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula"
            },
            {
              "path": "inicio.md",
              "score": 1.95,
              "snippet": "Catálogo sintético de peças pernambucanas (>>>cerâmica<<<, renda, xilo, palha)."
            },
            {
              "path": "devolucao.md",
              "score": 1.85,
              "snippet": ">>>Cerâmica<<< frágil: foto da caixa na entrega ajuda se houver avaria no transporte."
            },
            {
              "path": "frete.md",
              "score": 1.32,
              "snippet": "Tracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido."
            },
            {
              "path": "catalogo-p04.md",
              "score": 0.55,
              "snippet": "Técnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece"
            },
            {
              "path": "recomendador.md",
              "score": 0.27,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            },
            {
              "path": "atendimento.md",
              "score": 0.26,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,"
            }
          ]
        }
      },
      "bm25_python": [
        {
          "path": "prazos.md",
          "score": 2.6346
        },
        {
          "path": "catalogo-p01.md",
          "score": 0.976
        },
        {
          "path": "inicio.md",
          "score": 0.6854
        },
        {
          "path": "devolucao.md",
          "score": 0.6489
        }
      ]
    },
    {
      "id": "q4",
      "pergunta": "Qual o horário do chat?",
      "relevantes": [
        "atendimento.md"
      ],
      "subperguntas": [
        "Qual o horário do chat?"
      ],
      "precalculado": {
        "fts": {
          "inteira": [
            {
              "path": "atendimento.md",
              "score": null,
              "snippet": "# Atendimento  >>>Chat<<< das 9h às 18h (>>>horário<<< de Brasília), dias úteis. O bot responde frete, prazo e devolução a partir…"
            },
            {
              "path": "prazos.md",
              "score": null,
              "snippet": "…combinar prazo no >>>chat<<< antes de pagar."
            }
          ],
          "subperguntas": [
            {
              "path": "atendimento.md",
              "score": null,
              "snippet": "# Atendimento  >>>Chat<<< das 9h às 18h (>>>horário<<< de Brasília), dias úteis. O bot responde frete, prazo e devolução a partir…"
            },
            {
              "path": "prazos.md",
              "score": null,
              "snippet": "…combinar prazo no >>>chat<<< antes de pagar."
            }
          ]
        },
        "llmwiki": {
          "inteira": [
            {
              "path": "atendimento.md",
              "score": 9.14,
              "snippet": ">>>Chat<<< das 9h às 18h (>>>horário<<< de Brasília), dias úteis. O bot responde frete,"
            },
            {
              "path": "catalogo-p04.md",
              "score": 2.81,
              "snippet": "Técnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece"
            },
            {
              "path": "recomendador.md",
              "score": 2.58,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            },
            {
              "path": "devolucao.md",
              "score": 2.47,
              "snippet": "O cliente tem **7 dias corridos** após o recebimento para solicitar devolução"
            },
            {
              "path": "prazos.md",
              "score": 1.9,
              "snippet": "até 15 dias úteis. Renda sob medida: combinar prazo no >>>chat<<< antes de pagar."
            },
            {
              "path": "inicio.md",
              "score": 1.51,
              "snippet": "Catálogo sintético de peças pernambucanas (cerâmica, renda, xilo, palha)."
            },
            {
              "path": "catalogo-p01.md",
              "score": 1.02,
              "snippet": "Técnica: cerâmica. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula"
            },
            {
              "path": "frete.md",
              "score": 0.76,
              "snippet": "Tracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido."
            }
          ],
          "subperguntas": [
            {
              "path": "atendimento.md",
              "score": 9.14,
              "snippet": ">>>Chat<<< das 9h às 18h (>>>horário<<< de Brasília), dias úteis. O bot responde frete,"
            },
            {
              "path": "catalogo-p04.md",
              "score": 2.81,
              "snippet": "Técnica: renda. Região: Alto do Moura. Em demos de chain e lookup, `p04` aparece"
            },
            {
              "path": "recomendador.md",
              "score": 2.58,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            },
            {
              "path": "devolucao.md",
              "score": 2.47,
              "snippet": "O cliente tem **7 dias corridos** após o recebimento para solicitar devolução"
            },
            {
              "path": "prazos.md",
              "score": 1.9,
              "snippet": "até 15 dias úteis. Renda sob medida: combinar prazo no >>>chat<<< antes de pagar."
            },
            {
              "path": "inicio.md",
              "score": 1.51,
              "snippet": "Catálogo sintético de peças pernambucanas (cerâmica, renda, xilo, palha)."
            },
            {
              "path": "catalogo-p01.md",
              "score": 1.02,
              "snippet": "Técnica: cerâmica. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula"
            },
            {
              "path": "frete.md",
              "score": 0.76,
              "snippet": "Tracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido."
            }
          ]
        }
      },
      "bm25_python": [
        {
          "path": "atendimento.md",
          "score": 4.3612
        },
        {
          "path": "prazos.md",
          "score": 1.3581
        }
      ]
    },
    {
      "id": "q5",
      "pergunta": "Como o recomendador escolhe as sugestões?",
      "relevantes": [
        "recomendador.md"
      ],
      "subperguntas": [
        "Como o recomendador escolhe as sugestões?"
      ],
      "precalculado": {
        "fts": {
          "inteira": [
            {
              "path": "recomendador.md",
              "score": null,
              "snippet": "# >>>Recomendador<<<  Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score` e `reason` (`mesma_tecnica`, `complemento…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "…As páginas irmãs descrevem frete, devolução, prazos e o papel do >>>recomendador<<<. Use busca por palavra-chave ou híbrida depois…"
            }
          ],
          "subperguntas": [
            {
              "path": "recomendador.md",
              "score": null,
              "snippet": "# >>>Recomendador<<<  Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score` e `reason` (`mesma_tecnica`, `complemento…"
            },
            {
              "path": "inicio.md",
              "score": null,
              "snippet": "…As páginas irmãs descrevem frete, devolução, prazos e o papel do >>>recomendador<<<. Use busca por palavra-chave ou híbrida depois…"
            }
          ]
        },
        "llmwiki": {
          "inteira": [
            {
              "path": "recomendador.md",
              "score": 6.68,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            },
            {
              "path": "devolucao.md",
              "score": 3.77,
              "snippet": "O cliente tem **7 dias corridos** após o recebimento para solicitar devolução"
            },
            {
              "path": "inicio.md",
              "score": 3.62,
              "snippet": "As páginas irmãs descrevem frete, devolução, prazos e o papel do >>>recomendador<<<."
            },
            {
              "path": "atendimento.md",
              "score": 2.18,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,"
            },
            {
              "path": "catalogo-p01.md",
              "score": 0.54,
              "snippet": "Técnica: cerâmica. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula"
            }
          ],
          "subperguntas": [
            {
              "path": "recomendador.md",
              "score": 6.68,
              "snippet": "Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`"
            },
            {
              "path": "devolucao.md",
              "score": 3.77,
              "snippet": "O cliente tem **7 dias corridos** após o recebimento para solicitar devolução"
            },
            {
              "path": "inicio.md",
              "score": 3.62,
              "snippet": "As páginas irmãs descrevem frete, devolução, prazos e o papel do >>>recomendador<<<."
            },
            {
              "path": "atendimento.md",
              "score": 2.18,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,"
            },
            {
              "path": "catalogo-p01.md",
              "score": 0.54,
              "snippet": "Técnica: cerâmica. Região: Tracunhaém. É o exemplo padrão dos `curl` da aula"
            }
          ]
        }
      },
      "bm25_python": [
        {
          "path": "recomendador.md",
          "score": 2.8077
        },
        {
          "path": "inicio.md",
          "score": 1.2665
        },
        {
          "path": "devolucao.md",
          "score": 1.1992
        }
      ]
    },
    {
      "id": "q6",
      "pergunta": "Vocês aceitam pagamento por Pix?",
      "relevantes": [],
      "subperguntas": [
        "Vocês aceitam pagamento por Pix?"
      ],
      "precalculado": {
        "fts": {
          "inteira": [],
          "subperguntas": []
        },
        "llmwiki": {
          "inteira": [
            {
              "path": "frete.md",
              "score": 2.09,
              "snippet": "Tracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido."
            },
            {
              "path": "prazos.md",
              "score": 1.4,
              "snippet": "Peças de prateleira saem em 1–2 dias úteis. Encomendas de cerâmica podem levar"
            },
            {
              "path": "atendimento.md",
              "score": 0.98,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,"
            },
            {
              "path": "inicio.md",
              "score": 0.96,
              "snippet": "Catálogo sintético de peças pernambucanas (cerâmica, renda, xilo, palha)."
            }
          ],
          "subperguntas": [
            {
              "path": "frete.md",
              "score": 2.09,
              "snippet": "Tracunhaém e Alto do Moura: frete calculado por CEP na finalização do pedido."
            },
            {
              "path": "prazos.md",
              "score": 1.4,
              "snippet": "Peças de prateleira saem em 1–2 dias úteis. Encomendas de cerâmica podem levar"
            },
            {
              "path": "atendimento.md",
              "score": 0.98,
              "snippet": "Chat das 9h às 18h (horário de Brasília), dias úteis. O bot responde frete,"
            },
            {
              "path": "inicio.md",
              "score": 0.96,
              "snippet": "Catálogo sintético de peças pernambucanas (cerâmica, renda, xilo, palha)."
            }
          ]
        }
      },
      "bm25_python": []
    },
    {
      "id": "x1",
      "pergunta": "devolução frete Tracunhaém",
      "relevantes": [
        "devolucao.md",
        "frete.md"
      ],
      "subperguntas": [
        "devolução",
        "frete Tracunhaém"
      ],
      "precalculado": {},
      "bm25_python": [
        {
          "path": "frete.md",
          "score": 2.9721
        },
        {
          "path": "catalogo-p01.md",
          "score": 2.0495
        },
        {
          "path": "atendimento.md",
          "score": 1.9788
        },
        {
          "path": "inicio.md",
          "score": 1.8676
        },
        {
          "path": "devolucao.md",
          "score": 1.5535
        }
      ]
    }
  ],
  "resumo_python": {
    "fts/inteira": {
      "recall@1_medio": 0.9,
      "recall@3_medio": 0.9,
      "abstencoes_corretas@3": 1
    },
    "fts/subperguntas": {
      "recall@1_medio": 0.9,
      "recall@3_medio": 1.0,
      "abstencoes_corretas@3": 1
    },
    "bm25/inteira": {
      "recall@1_medio": 0.9,
      "recall@3_medio": 1.0,
      "abstencoes_corretas@3": 1
    },
    "bm25/subperguntas": {
      "recall@1_medio": 0.9,
      "recall@3_medio": 1.0,
      "abstencoes_corretas@3": 1
    },
    "llmwiki/inteira": {
      "recall@1_medio": 0.9,
      "recall@3_medio": 1.0,
      "abstencoes_corretas@3": 0
    },
    "llmwiki/subperguntas": {
      "recall@1_medio": 0.9,
      "recall@3_medio": 1.0,
      "abstencoes_corretas@3": 0
    }
  }
};
