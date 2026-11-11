let graficoLinha;
let graficoRosca;

function carregarGraficos() {
    fetch("/diario/listar/" + Number(sessionStorage.ID_USUARIO))
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (lista) {
                    if (lista.length == 0) {
                        graficos_aviso.textContent = 'Seus gráficos aparecem depois do primeiro registro.';
                        graficos_aviso.hidden = false;
                        return;
                    }

                    graficos_aviso.hidden = true;

                    let dias = contarPorDia(lista);
                    desenharLinha(dias);
                    desenharRosca(contarEmocoes(lista));

                    let totalRegistros = dias.reduce(function (soma, d) {
                        return soma + d.quantidade;
                    }, 0);
                    wellbeingSubtitle.textContent = `${totalRegistros} registros em ${dias.length} dias`;
                });
            } else {
                graficos_aviso.textContent = 'Não foi possível carregar seus gráficos. Tente novamente.';
                graficos_aviso.hidden = false;
            }
        })
        .catch(function (falha) {
            console.log(falha);
            graficos_aviso.textContent = 'Não foi possível carregar seus gráficos. Tente novamente.';
            graficos_aviso.hidden = false;
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

const CORES_ROSCA = {
    "Calma": "#7a66c9",
    "Alegria": "#e9b44c",
    "Cansaço": "#a99bdc",
    "Ansiedade": "#e07a5f",
    "Tristeza": "#5b8def",
    "Raiva": "#d1495b",
    "Sobrecarga": "#43358a"
};


function contarEmocoes(lista) {
    let contagem = {};

    lista.forEach(function (item) {
        contagem[item.emocao] = (contagem[item.emocao] || 0) + 1;
    });

    return Object.keys(contagem).map(function (nome) {
        return { nome: nome, valor: contagem[nome], cor: CORES_ROSCA[nome] };
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