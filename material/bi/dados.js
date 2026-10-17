window.ASSOCIACAO = {
  "produtos": [
    {
      "id": "p01",
      "nome": "Jarro barro Tracunhaém",
      "tecnica": "ceramica",
      "regiao": "Tracunhaém",
      "pedidos": 42
    },
    {
      "id": "p02",
      "nome": "Prato esmaltado Tracunhaém",
      "tecnica": "ceramica",
      "regiao": "Tracunhaém",
      "pedidos": 28
    },
    {
      "id": "p03",
      "nome": "Boneca de barro",
      "tecnica": "ceramica",
      "regiao": "Tracunhaém",
      "pedidos": 19
    },
    {
      "id": "p04",
      "nome": "Rendeira Alto do Moura",
      "tecnica": "renda",
      "regiao": "Alto do Moura",
      "pedidos": 35
    },
    {
      "id": "p05",
      "nome": "Toalha de renda",
      "tecnica": "renda",
      "regiao": "Alto do Moura",
      "pedidos": 22
    },
    {
      "id": "p06",
      "nome": "Caminho de mesa renda",
      "tecnica": "renda",
      "regiao": "Alto do Moura",
      "pedidos": 11
    },
    {
      "id": "p07",
      "nome": "Xilogravura Pilar",
      "tecnica": "xilogravura",
      "regiao": "Comunidade do Pilar",
      "pedidos": 31
    },
    {
      "id": "p08",
      "nome": "Cordel ilustrado",
      "tecnica": "xilogravura",
      "regiao": "Comunidade do Pilar",
      "pedidos": 17
    },
    {
      "id": "p09",
      "nome": "Quadro xilo colorido",
      "tecnica": "xilogravura",
      "regiao": "Comunidade do Pilar",
      "pedidos": 9
    },
    {
      "id": "p10",
      "nome": "Cesto de palha",
      "tecnica": "cestaria",
      "regiao": "Comunidade do Pilar",
      "pedidos": 24
    },
    {
      "id": "p11",
      "nome": "Bolsa de palha",
      "tecnica": "cestaria",
      "regiao": "Comunidade do Pilar",
      "pedidos": 14
    },
    {
      "id": "p12",
      "nome": "Sousplat de palha",
      "tecnica": "cestaria",
      "regiao": "Alto do Moura",
      "pedidos": 8
    }
  ],
  "regras": [
    {
      "id": "p01+p03->p02",
      "a": [
        "p01",
        "p03"
      ],
      "b": [
        "p02"
      ],
      "antecedente": "Jarro barro Tracunhaém + Boneca de barro",
      "consequente": "Prato esmaltado Tracunhaém",
      "descoberta": {
        "total": 10,
        "na": 2,
        "nb": 3,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 1.0,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 1,
        "nb": 3,
        "juntos": 0,
        "suporte": 0.0,
        "confianca": 0.0,
        "lift": 0.0
      }
    },
    {
      "id": "p03->p01+p02",
      "a": [
        "p03"
      ],
      "b": [
        "p01",
        "p02"
      ],
      "antecedente": "Boneca de barro",
      "consequente": "Jarro barro Tracunhaém + Prato esmaltado Tracunhaém",
      "descoberta": {
        "total": 10,
        "na": 2,
        "nb": 3,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 1.0,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 1,
        "nb": 1,
        "juntos": 0,
        "suporte": 0.0,
        "confianca": 0.0,
        "lift": 0.0
      }
    },
    {
      "id": "p03->p02",
      "a": [
        "p03"
      ],
      "b": [
        "p02"
      ],
      "antecedente": "Boneca de barro",
      "consequente": "Prato esmaltado Tracunhaém",
      "descoberta": {
        "total": 10,
        "na": 2,
        "nb": 3,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 1.0,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 1,
        "nb": 3,
        "juntos": 0,
        "suporte": 0.0,
        "confianca": 0.0,
        "lift": 0.0
      }
    },
    {
      "id": "p05->p04",
      "a": [
        "p05"
      ],
      "b": [
        "p04"
      ],
      "antecedente": "Toalha de renda",
      "consequente": "Rendeira Alto do Moura",
      "descoberta": {
        "total": 10,
        "na": 2,
        "nb": 3,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 1.0,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 2,
        "nb": 3,
        "juntos": 1,
        "suporte": 0.1,
        "confianca": 0.5,
        "lift": 1.6666666666666667
      }
    },
    {
      "id": "p08->p07",
      "a": [
        "p08"
      ],
      "b": [
        "p07"
      ],
      "antecedente": "Cordel ilustrado",
      "consequente": "Xilogravura Pilar",
      "descoberta": {
        "total": 10,
        "na": 2,
        "nb": 3,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 1.0,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 1,
        "nb": 2,
        "juntos": 1,
        "suporte": 0.1,
        "confianca": 1.0,
        "lift": 5.0
      }
    },
    {
      "id": "p01+p02->p03",
      "a": [
        "p01",
        "p02"
      ],
      "b": [
        "p03"
      ],
      "antecedente": "Jarro barro Tracunhaém + Prato esmaltado Tracunhaém",
      "consequente": "Boneca de barro",
      "descoberta": {
        "total": 10,
        "na": 3,
        "nb": 2,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 0.6666666666666666,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 1,
        "nb": 1,
        "juntos": 0,
        "suporte": 0.0,
        "confianca": 0.0,
        "lift": 0.0
      }
    },
    {
      "id": "p02->p01+p03",
      "a": [
        "p02"
      ],
      "b": [
        "p01",
        "p03"
      ],
      "antecedente": "Prato esmaltado Tracunhaém",
      "consequente": "Jarro barro Tracunhaém + Boneca de barro",
      "descoberta": {
        "total": 10,
        "na": 3,
        "nb": 2,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 0.6666666666666666,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 3,
        "nb": 1,
        "juntos": 0,
        "suporte": 0.0,
        "confianca": 0.0,
        "lift": 0.0
      }
    },
    {
      "id": "p02->p03",
      "a": [
        "p02"
      ],
      "b": [
        "p03"
      ],
      "antecedente": "Prato esmaltado Tracunhaém",
      "consequente": "Boneca de barro",
      "descoberta": {
        "total": 10,
        "na": 3,
        "nb": 2,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 0.6666666666666666,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 3,
        "nb": 1,
        "juntos": 0,
        "suporte": 0.0,
        "confianca": 0.0,
        "lift": 0.0
      }
    },
    {
      "id": "p04->p05",
      "a": [
        "p04"
      ],
      "b": [
        "p05"
      ],
      "antecedente": "Rendeira Alto do Moura",
      "consequente": "Toalha de renda",
      "descoberta": {
        "total": 10,
        "na": 3,
        "nb": 2,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 0.6666666666666666,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 3,
        "nb": 2,
        "juntos": 1,
        "suporte": 0.1,
        "confianca": 0.3333333333333333,
        "lift": 1.6666666666666667
      }
    },
    {
      "id": "p07->p08",
      "a": [
        "p07"
      ],
      "b": [
        "p08"
      ],
      "antecedente": "Xilogravura Pilar",
      "consequente": "Cordel ilustrado",
      "descoberta": {
        "total": 10,
        "na": 3,
        "nb": 2,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 0.6666666666666666,
        "lift": 3.3333333333333335
      },
      "avaliacao": {
        "total": 10,
        "na": 2,
        "nb": 1,
        "juntos": 1,
        "suporte": 0.1,
        "confianca": 0.5,
        "lift": 5.0
      }
    },
    {
      "id": "p02->p01",
      "a": [
        "p02"
      ],
      "b": [
        "p01"
      ],
      "antecedente": "Prato esmaltado Tracunhaém",
      "consequente": "Jarro barro Tracunhaém",
      "descoberta": {
        "total": 10,
        "na": 3,
        "nb": 4,
        "juntos": 3,
        "suporte": 0.3,
        "confianca": 1.0,
        "lift": 2.5
      },
      "avaliacao": {
        "total": 10,
        "na": 3,
        "nb": 4,
        "juntos": 1,
        "suporte": 0.1,
        "confianca": 0.3333333333333333,
        "lift": 0.8333333333333334
      }
    },
    {
      "id": "p02+p03->p01",
      "a": [
        "p02",
        "p03"
      ],
      "b": [
        "p01"
      ],
      "antecedente": "Prato esmaltado Tracunhaém + Boneca de barro",
      "consequente": "Jarro barro Tracunhaém",
      "descoberta": {
        "total": 10,
        "na": 2,
        "nb": 4,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 1.0,
        "lift": 2.5
      },
      "avaliacao": {
        "total": 10,
        "na": 0,
        "nb": 4,
        "juntos": 0,
        "suporte": 0.0,
        "confianca": null,
        "lift": null
      }
    },
    {
      "id": "p03->p01",
      "a": [
        "p03"
      ],
      "b": [
        "p01"
      ],
      "antecedente": "Boneca de barro",
      "consequente": "Jarro barro Tracunhaém",
      "descoberta": {
        "total": 10,
        "na": 2,
        "nb": 4,
        "juntos": 2,
        "suporte": 0.2,
        "confianca": 1.0,
        "lift": 2.5
      },
      "avaliacao": {
        "total": 10,
        "na": 1,
        "nb": 4,
        "juntos": 1,
        "suporte": 0.1,
        "confianca": 1.0,
        "lift": 2.5
      }
    },
    {
      "id": "p01->p02",
      "a": [
        "p01"
      ],
      "b": [
        "p02"
      ],
      "antecedente": "Jarro barro Tracunhaém",
      "consequente": "Prato esmaltado Tracunhaém",
      "descoberta": {
        "total": 10,
        "na": 4,
        "nb": 3,
        "juntos": 3,
        "suporte": 0.3,
        "confianca": 0.75,
        "lift": 2.5
      },
      "avaliacao": {
        "total": 10,
        "na": 4,
        "nb": 3,
        "juntos": 1,
        "suporte": 0.1,
        "confianca": 0.25,
        "lift": 0.8333333333333334
      }
    }
  ],
  "limites": {
    "suporte": 0.2,
    "confianca": 0.6,
    "lift": 1
  },
  "origem": "dados/catalogo.json → cestas",
  "avaliacao": "material/cestas-validacao-20261017.json → cestas"
};
