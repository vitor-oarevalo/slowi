let graficoLinha;
let graficoRosca;

const PERIODO_KPI = 14;

function carregarGraficos() {
    fetch("/diario/listar/" + Number(sessionStorage.ID_USUARIO))
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (lista) {
                    if (lista.length == 0) {
                        graficos_aviso.textContent = 'Seus gráficos aparecem depois do primeiro registro.';
                        graficos_aviso.hidden = false;
                        limparKpis("Nenhum registro ainda.");
                        return;
                    }

                    graficos_aviso.hidden = true;

                    let dias = contarPorDia(lista);
                    desenharLinha(dias);
                    desenharRosca(contarEmocoes(lista));
                    atualizarKpis(lista);

                    let totalRegistros = dias.reduce(function (soma, d) {
                        return soma + d.quantidade;
                    }, 0);
                    wellbeingSubtitle.textContent = `${totalRegistros} registros em ${dias.length} dias`;
                });
            } else {
                graficos_aviso.textContent = 'Não foi possível carregar seus gráficos. Tente novamente.';
                graficos_aviso.hidden = false;
                limparKpis("Não foi possível carregar os dados.");
            }
        })
        .catch(function (falha) {
            console.log(falha);
            graficos_aviso.textContent = 'Não foi possível carregar seus gráficos. Tente novamente.';
            graficos_aviso.hidden = false;
            limparKpis("Não foi possível carregar os dados.");
        });
}


function desenharLinha(dias) {
    if (graficoLinha) {
        graficoLinha.destroy();
    }

    graficoLinha = new Chart(document.getElementById('wellbeingChart'), {
        type: 'line',
        data: {
            labels: dias.map(d => d.dia),
            datasets: [{
                label: 'Registros',
                data: dias.map(d => d.quantidade),
                borderColor: '#7a66c9',
                backgroundColor: '#7a66c9',
                borderWidth: 2.5,
                pointRadius: 2,
                pointHoverRadius: 5,
                tension: 0
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1,
                        precision: 0,
                        color: '#777386',
                        padding: 8
                    },
                    grid: { color: '#f1f0f5' },
                    border: { display: false }
                },
                x: {
                    ticks: { color: '#777386' },
                    grid: { display: false },
                    border: { display: false }
                }
            }
        }
    });
}

function contarPorDia(lista) {
    let contagem = {};

    lista.forEach(function (item) {
        let dia = item.dataRegistro.slice(0, 10);
        contagem[dia] = (contagem[dia] || 0) + 1;
    });

    let dias = Object.keys(contagem).sort().slice(-14);

    return dias.map(function (d) {
        let partes = d.split("-");
        return { dia: `${partes[2]}/${partes[1]}`, quantidade: contagem[d] };
    });
}



function contarEmocoes(lista) {
    let contagem = {};

    lista.forEach(function (item) {
        if (!contagem[item.emocao]) {
            contagem[item.emocao] = {
                valor: 0,
                cor: "#" + item.corEmocao
            };
        }

        contagem[item.emocao].valor++;
    });

    return Object.keys(contagem).map(function (nome) {
        return {
            nome: nome,
            valor: contagem[nome].valor,
            cor: contagem[nome].cor
        };
    }).sort(function (a, b) {
        return b.valor - a.valor;
    });
}

function desenharRosca(emocoes) {
    if (graficoRosca) {
        graficoRosca.destroy();
    }

    graficoRosca = new Chart(document.getElementById('emotionsChart'), {
        type: 'doughnut',
        data: {
            labels: emocoes.map(e => e.nome),
            datasets: [{
                data: emocoes.map(e => e.valor),
                backgroundColor: emocoes.map(e => e.cor),
                borderColor: '#fff',
                borderWidth: 3,
                hoverOffset: 4
            }]
        },
        options: {
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: {
                legend: { display: false }
            }
        }
    });

    let totalEmocoes = emocoes.reduce(function (soma, e) {
        return soma + e.valor;
    }, 0);
    emotionsTotal.textContent = totalEmocoes;

    emotionsLegend.replaceChildren();

    emocoes.forEach(function (e) {
        let item = document.createElement("li");

        let bolinha = document.createElement("span");
        bolinha.className = "dot";
        bolinha.style.backgroundColor = e.cor;

        let contador = document.createElement("span");
        contador.className = "count";
        contador.textContent = e.valor;

        item.appendChild(bolinha);
        item.appendChild(document.createTextNode(e.nome));
        item.appendChild(contador);

        emotionsLegend.appendChild(item);
    });
}


function porId(id) {
    return document.getElementById(id);
}

function dataLocal(diasAtras) {
    const pad = (n) => String(n).padStart(2, "0");
    const d = new Date();
    d.setDate(d.getDate() - diasAtras);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function filtrarPeriodo(lista, inicio, fim) {
    return lista.filter(function (item) {
        const dia = item.dataRegistro.slice(0, 10);
        return dia >= inicio && dia <= fim;
    });
}

function mediaIntensidade(lista) {
    const soma = lista.reduce(function (total, item) {
        return total + item.intensidade;
    }, 0);
    return soma / lista.length;
}

function formatarMedia(numero) {
    return numero.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function montarNota(elemento, antes, destaque, depois) {
    elemento.replaceChildren(document.createTextNode(antes));

    if (destaque != null) {
        const negrito = document.createElement("strong");
        negrito.className = "kpi-destaque";
        negrito.textContent = destaque;
        elemento.appendChild(negrito);
        elemento.appendChild(document.createTextNode(depois));
    }
}

function definirBarra(idBarra, idPreenchimento, valor, maximo, rotulo) {
    const barra = porId(idBarra);
    const percentual = maximo > 0 ? Math.round((valor / maximo) * 100) : 0;

    porId(idPreenchimento).style.width = percentual + "%";
    barra.setAttribute("aria-valuenow", valor);
    barra.setAttribute("aria-valuemax", maximo);
    barra.setAttribute("aria-label", rotulo);
}

function kpiRegistros(atual, anterior) {
    porId("kpi1-valor").textContent = atual.length;

    const nota = porId("kpi1-nota");
    const dias = `${PERIODO_KPI} dias anteriores`;

    if (anterior.length == 0) {
        montarNota(nota, `Sem registros nos ${dias}.`, null, "");
    } else if (anterior.length == 1) {
        montarNota(nota, `Nos ${dias} foi `, "1", ".");
    } else {
        montarNota(nota, `Nos ${dias} foram `, String(anterior.length), ".");
    }
}

function kpiEmocao(atual) {
    const emocoes = contarEmocoes(atual);
    const principal = emocoes[0];
    const total = atual.length;

    porId("kpi2-valor").textContent = principal.nome;

    porId("kpi2").style.setProperty("--kpi-cor", principal.cor || "#7a66c9");

    definirBarra(
        "kpi2-barra", "kpi2-preenchimento",
        principal.valor, total,
        `${principal.nome} em ${principal.valor} de ${total} registros`
    );

    const palavra = principal.valor == 1 ? "registro" : "registros";
    const empate = emocoes[1] && emocoes[1].valor == principal.valor
        ? ` (empate com ${emocoes[1].nome})`
        : "";

    montarNota(
        porId("kpi2-nota"),
        "Apareceu em ",
        `${principal.valor} ${palavra}`,
        ` nos últimos ${PERIODO_KPI} dias${empate}.`
    );
}

function kpiIntensidade(atual, anterior) {
    const media = mediaIntensidade(atual);

    porId("kpi3-valor").textContent = formatarMedia(media);

    definirBarra(
        "kpi3-barra", "kpi3-preenchimento",
        Number(media.toFixed(1)), 5,
        `Intensidade média ${formatarMedia(media)} de 5`
    );

    const nota = porId("kpi3-nota");

    if (anterior.length == 0) {
        montarNota(nota, `Sem registros nos ${PERIODO_KPI} dias anteriores.`, null, "");
    } else {
        montarNota(nota, `Nos ${PERIODO_KPI} dias anteriores foi `, formatarMedia(mediaIntensidade(anterior)), ".");
    }
}

function atualizarKpis(lista) {
    if (!porId("kpi1")) {
        return;
    }

    const atual = filtrarPeriodo(lista, dataLocal(PERIODO_KPI - 1), dataLocal(0));
    const anterior = filtrarPeriodo(lista, dataLocal(PERIODO_KPI * 2 - 1), dataLocal(PERIODO_KPI));

    if (atual.length == 0) {
        limparKpis(`Nenhum registro nos últimos ${PERIODO_KPI} dias.`);
        return;
    }

    kpiRegistros(atual, anterior);
    kpiEmocao(atual);
    kpiIntensidade(atual, anterior);
}

function limparKpis(mensagem) {
    if (!porId("kpi1")) {
        return;
    }

    porId("kpi1-valor").textContent = "—";
    porId("kpi2-valor").textContent = "—";
    porId("kpi3-valor").textContent = "—";

    porId("kpi2").style.removeProperty("--kpi-cor");

    definirBarra("kpi2-barra", "kpi2-preenchimento", 0, 1, "Sem dados");
    definirBarra("kpi3-barra", "kpi3-preenchimento", 0, 5, "Sem dados");

    ["kpi1-nota", "kpi2-nota", "kpi3-nota"].forEach(function (id) {
        montarNota(porId(id), mensagem, null, "");
    });
}