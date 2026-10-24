"""Gere figuras auditáveis e cartões imprimíveis do tutorial de crédito."""
from __future__ import annotations

import json
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from matplotlib.patches import FancyBboxPatch

from arvore_credito import aprender, entradas, ler, respostas, NOMES

RAIZ = Path(__file__).resolve().parents[1]
IMG = RAIZ / "material/imagens"
SAIDA = RAIZ / "material/credito"
AZUL, VERDE, BARRO = "#18374b", "#157c80", "#b65432"
plt.rcParams.update({"font.family": "DejaVu Sans", "text.color": AZUL,
                     "axes.labelcolor": AZUL, "font.size": 12})


def salvar(fig: plt.Figure, nome: str) -> None:
    fig.savefig(IMG / nome, dpi=170, facecolor="#fffdf8", bbox_inches="tight")
    plt.close(fig)


def caixa(ax, x, y, texto, w=.25, h=.15, cor="#e1efed", tamanho=12):
    ax.add_patch(FancyBboxPatch((x-w/2, y-h/2), w, h,
                               boxstyle="round,pad=0.012", facecolor=cor,
                               edgecolor=AZUL, linewidth=1.2))
    ax.text(x, y, texto, ha="center", va="center", fontsize=tamanho)


def seta(ax, origem, fim, texto=""):
    ax.annotate("", xy=fim, xytext=origem,
                arrowprops={"arrowstyle": "->", "color": AZUL, "lw": 1.5})
    ax.text((origem[0]+fim[0])/2, (origem[1]+fim[1])/2+.025, texto,
            ha="center", fontsize=11)


def linha_tempo():
    fig, ax = plt.subplots(figsize=(13, 4))
    ax.set(xlim=(0, 1), ylim=(0, 1)); ax.axis("off")
    caixa(ax, .16, .58, "SOLICITAÇÃO\nRenda, dívidas, parcela\ne histórico anterior", .27, .28)
    caixa(ax, .50, .58, "DECISÃO\nPrevisão + política\n+ revisão humana", .25, .28)
    caixa(ax, .84, .58, "OBSERVAÇÃO\nSeis meses completos\nHouve atraso > 30 dias?", .28, .28, "#f7e4d7")
    seta(ax, (.31,.58), (.36,.58)); seta(ax, (.64,.58), (.69,.58))
    ax.text(.5,.18,"O resultado futuro é a resposta a aprender; não pode entrar nas perguntas.",ha="center")
    ax.set_title("O que sabemos agora? O que só saberemos depois?", fontsize=20, pad=15)
    salvar(fig,"credito-linha-tempo.png")


def renda():
    fig, ax = plt.subplots(figsize=(11, 4))
    partes = [(400,"Dívidas atuais\nR$400",VERDE), (200,"Parcela\nR$200",BARRO),
              (1400,"Restante: R$1.400\nantes de outras despesas", "#dce4ed")]
    inicio = 0
    for valor, texto, cor in partes:
        ax.barh([0], [valor], left=inicio, color=cor, height=.5, edgecolor="white")
        ax.text(inicio+valor/2, 0, texto, ha="center", va="center", fontsize=10,
                color="white" if cor in [VERDE,BARRO] else AZUL)
        inicio += valor
    ax.set(xlim=(0,2000), ylim=(-.6,.6), yticks=[], xlabel="Renda mensal informada: R$2.000")
    ax.set_title("R$600 comprometidos em R$2.000 = 30 de cada R$100", fontsize=18)
    for spine in ax.spines.values(): spine.set_visible(False)
    fig.subplots_adjust(bottom=.25)
    fig.text(.5,.03,"Exemplo C04. O restante não é renda livre: alimentação e moradia não foram descontadas.",ha="center",fontsize=10)
    salvar(fig,"credito-comprometimento.png")


def pilhas():
    rs=ler("cartoes")
    fig, axs=plt.subplots(1,3,figsize=(13,5))
    grupos=[rs,[r for r in rs if int(r["comprometimento_pct"])<=35],
            [r for r in rs if int(r["comprometimento_pct"])>35]]
    titulos=["Sem pergunta\n7 sem / 5 com atraso", "Comprometimento ≤ 35%\n5 sem / 1 com atraso", "Comprometimento > 35%\n2 sem / 4 com atraso"]
    for ax, grupo, titulo in zip(axs,grupos,titulos):
        ax.set(xlim=(-.6,2.6),ylim=(-.8,4.6)); ax.axis("off"); ax.set_title(titulo,fontsize=12)
        for i,r in enumerate(grupo):
            com=int(r["atraso_30d_6m"])
            caixa(ax, i%3, 3.6-i//3, f"{r['id']}\n{'COM' if com else 'SEM'}",.75,.65,
                  "#f7e4d7" if com else "#e1efed",10)
    fig.suptitle("Uma pergunta divide os mesmos 12 contratos", fontsize=20, y=1.02)
    fig.subplots_adjust(top=.78)
    fig.text(.5,.01,"Prever a maioria: 5 erros sem pergunta; 1 + 2 = 3 erros depois da divisão.",ha="center")
    salvar(fig,"credito-pilhas.png")


def manual():
    fig,ax=plt.subplots(figsize=(12,7)); ax.set(xlim=(0,1),ylim=(0,1)); ax.axis("off")
    caixa(ax,.5,.86,"Comprometimento ≤ 35%?\n12 casos: 7 sem / 5 com",.4,.15)
    caixa(ax,.28,.56,"Atrasos anteriores ≤ 1?\n6 casos: 5 sem / 1 com",.35,.15)
    caixa(ax,.78,.56,"PREVER COM ATRASO\n6 casos: 2 sem / 4 com\n2 erros conhecidos",.32,.16,"#f7e4d7")
    caixa(ax,.18,.22,"PREVER SEM ATRASO\n5 sem / 0 com",.28,.14)
    caixa(ax,.51,.22,"PREVER COM ATRASO\n0 sem / 1 com",.28,.14,"#f7e4d7")
    for o,f,t in [((.45,.77),(.28,.65),"sim"),((.57,.77),(.78,.66),"não"),
                  ((.24,.47),(.18,.30),"sim"),((.34,.47),(.51,.30),"não")]: seta(ax,o,f,t)
    ax.text(.5,.04,"Árvore construída em sala: 10 acertos de 12. Uma folha com 1 caso oferece pouca evidência.",ha="center",fontsize=11)
    ax.set_title("Cada caminho pode ser lido como uma regra SE–ENTÃO",fontsize=19)
    salvar(fig,"credito-arvore-manual.png")


def desenhar_modelo(ax, modelo, treino):
    arv= modelo.tree_; y=respostas(treino); caminhos=modelo.decision_path(entradas(treino))
    def visitar(no,x,ypos,espaco,nivel):
        ids=caminhos[:,no].nonzero()[0]; sim=sum(y[i] for i in ids); nao=len(ids)-sim
        folha=arv.children_left[no]==-1
        if folha:
            texto=f"PREVER {'COM' if sim>nao else 'SEM'}\n{nao} sem / {sim} com"
        elif nivel==2:
            texto=f"Continua…\n{nao} sem / {sim} com"
        else:
            texto=f"{NOMES[arv.feature[no]]}\n≤ {arv.threshold[no]:g}?\n{nao} sem / {sim} com"
        caixa(ax,x,ypos,texto,.21,.15 if folha or nivel==2 else .19,tamanho=9)
        if not folha and nivel<2:
            for filho,dx,rotulo in [(arv.children_left[no],-espaco,"sim"),
                                    (arv.children_right[no],espaco,"não")]:
                seta(ax,(x,ypos-.10),(x+dx,ypos-.27),rotulo)
                visitar(filho,x+dx,ypos-.37,espaco/2,nivel+1)
    ax.set(xlim=(0,1),ylim=(0,1.05)); ax.axis("off")
    visitar(0,.5,.89,.25,0)


def modelos(rel):
    treino=ler("treino")
    for nome,prof,minimo in [("curta",2,12),("profunda",None,1)]:
        modelo=aprender(treino,prof,minimo)
        fig,ax=plt.subplots(figsize=(13,7))
        desenhar_modelo(ax,modelo,treino)
        ax.set_title(f"Árvore {nome}: {modelo.get_depth()} níveis e {modelo.get_n_leaves()} folhas",fontsize=20)
        fig.text(.5,.01,"Contagens do treino. 'Continua…' indica um ramo omitido nesta visão; consulte o TXT completo.",ha="center",fontsize=11)
        salvar(fig,f"credito-arvore-{nome}.png")
    fig,ax=plt.subplots(figsize=(10,5))
    for i,(nome,cor) in enumerate([("curta",VERDE),("profunda",BARRO)]):
        valores=[rel["modelos"][nome]["medidas"][g]["acuracia"]*100 for g in ["treino","desenvolvimento"]]
        barras=ax.bar([i*.35,1+i*.35],valores,width=.3,label=nome,color=cor)
        ax.bar_label(barras,labels=[f"{v:.1f}%" for v in valores],padding=4)
    ax.set(xticks=[.175,1.175],xticklabels=["Treino (240)","Desenvolvimento (80)"],
           ylim=(0,105),ylabel="Acertos em cada 100 casos (%)")
    ax.legend(); ax.set_title("Mais acertos no treino não garantem o mesmo resultado fora dele",fontsize=15)
    salvar(fig,"credito-comparacao.png")


def confusao(rel):
    nome=rel["selecionado"]; m=rel["modelos"][nome]["medidas"]["teste"]
    fig,ax=plt.subplots(figsize=(10,5)); ax.axis("off")
    dados=[[m["sem_atraso_previsto_sem"],m["sem_atraso_previsto_com"]],
           [m["com_atraso_previsto_sem"],m["com_atraso_previsto_com"]]]
    tabela=ax.table(cellText=dados,rowLabels=["Observado: SEM atraso","Observado: COM atraso"],
                    colLabels=["Previsto: SEM atraso","Previsto: COM atraso"],
                    cellLoc="center",loc="center",bbox=[.28,.2,.68,.6])
    tabela.auto_set_font_size(False); tabela.set_fontsize(12)
    for (r,c),celula in tabela.get_celld().items():
        celula.set_edgecolor(AZUL)
        if r>0 and c>=0: celula.set_facecolor("#e1efed" if r-1==c else "#f7e4d7")
    ax.set_title(f"Teste final: árvore {nome} — {m['acertos']} acertos e {m['erros']} erros",fontsize=18)
    fig.text(.5,.02,"Linhas mostram o que aconteceu; colunas mostram o que o modelo previu.",ha="center")
    salvar(fig,"credito-matriz-teste.png")


def cartoes():
    rs=ler("cartoes")
    with PdfPages(SAIDA / "cartoes-impressao.pdf") as pdf:
        for pagina in range(2):
            fig,ax=plt.subplots(figsize=(8.27,11.69)); ax.set(xlim=(0,1),ylim=(0,1)); ax.axis("off")
            ax.set_title("Crédito: cartões de contratos fictícios",fontsize=16,pad=20)
            for i,r in enumerate(rs[pagina*6:pagina*6+6]):
                x=.25+(i%2)*.5; y=.83-(i//2)*.30
                texto=(f"{r['id']}\n\nRenda: R${r['renda_mensal']}\nDívidas/mês: R${r['dividas_mensais']}\n"
                       f"Parcela proposta: R${r['parcela_proposta']}\nComprometimento: {r['comprometimento_pct']}%\n"
                       f"Atrasos anteriores: {r['atrasos_anteriores']}")
                caixa(ax,x,y,texto,.44,.26,tamanho=11)
            ax.text(.5,.03,"Recorte. Use os rótulos da página 3 para construir; esconda-os para prever.",ha="center",fontsize=9)
            pdf.savefig(fig); plt.close(fig)
        fig,ax=plt.subplots(figsize=(8.27,11.69)); ax.set(xlim=(0,1),ylim=(0,1)); ax.axis("off")
        ax.set_title("Rótulos: o que aconteceu nos seis meses seguintes",fontsize=14,pad=20)
        for i,r in enumerate(rs):
            texto=f"{r['id']}: {'COM' if int(r['atraso_30d_6m']) else 'SEM'} atraso > 30 dias"
            caixa(ax,.5,.94-i*.075,texto,.8,.05,tamanho=12)
        pdf.savefig(fig); plt.close(fig)


def main():
    rel=json.loads((SAIDA/"relatorio.json").read_text())
    if "teste" not in rel["modelos"][rel["selecionado"]]["medidas"]:
        raise SystemExit("Gere primeiro o relatório de referência com --avaliar-teste.")
    if rel["parametros"] != {"profundidade_curta":2,"minimo_folha":12}:
        raise SystemExit("As figuras publicadas usam profundidade 2 e mínimo 12; use o relatório padrão.")
    linha_tempo(); renda(); pilhas(); manual(); modelos(rel); confusao(rel); cartoes()
    print("Oito figuras e PDF de três páginas gerados.")


if __name__=="__main__": main()
