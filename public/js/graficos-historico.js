let graficoLinha;

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
