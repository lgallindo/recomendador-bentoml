---
title: Como o recomendador sugere peças
description: Popularidade, co-ocorrência e reason legível na API.
tags: [recomendador, api, pt-br]
---

# Recomendador

Dado um `product_id` (ex.: jarro `p01`), a API devolve outros ids com `score`
e `reason` (`mesma_tecnica`, `complemento_popularidade`, …).

O treino usa cestas sintéticas e a contagem de `pedidos` do catálogo. Não mistura
preferências de usuário entre sessões — isso é memória de agente, outra aula.
