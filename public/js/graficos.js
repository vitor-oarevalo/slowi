function reatribuirNomeSaudacao() {
    let nomeUsuario = sessionStorage.NOME_USUARIO;

    if (nomeUsuario) {
        let primeiroNome = nomeUsuario.split(' ')[0];

        document.querySelector("#greeting_name").innerHTML = primeiroNome;
    }
}

reatribuirNomeSaudacao();

const registros = [
    { data: '08/10', nivel: 2 },
    { data: '09/10', nivel: 3 },
    { data: '10/10', nivel: 4 },
    { data: '11/10', nivel: 3 },
    { data: '12/10', nivel: 2 },
    { data: '13/10', nivel: 4 },
    { data: '14/10', nivel: 4 }
];

// subtítulo gerado a partir dos dados
document.getElementById('wellbeingSubtitle').textContent =
    `${registros.length} registros • Um relato por dia neste período`;

new Chart(document.getElementById('wellbeingChart'), {
    type: 'line',
    data: {
        labels: registros.map(r => r.data),
        datasets: [{
            label: 'Seu autorrelato',
            data: registros.map(r => r.nivel),
            borderColor: '#7a66c9',
            backgroundColor: '#7a66c9',
            borderWidth: 2.5,
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0          // linhas retas entre os pontos
        }]
    },
    options: {
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }   // usamos a legenda em HTML
        },
        scales: {
            y: {
                min: 1,
                max: 5,
                ticks: {
                    stepSize: 1,
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

  const emocoes = [
    { nome: 'Calma',     valor: 3, cor: '#7a66c9' },
    { nome: 'Ansiedade', valor: 2, cor: '#43358a' },
    { nome: 'Alegria',   valor: 1, cor: '#a99bdc' },
    { nome: 'Tristeza',  valor: 1, cor: '#dcd7f0' }
];

const total = emocoes.reduce((soma, e) => soma + e.valor, 0);

// número no centro
document.getElementById('emotionsTotal').textContent = total;

// legenda gerada a partir dos dados
const legenda = document.getElementById('emotionsLegend');
legenda.innerHTML = emocoes.map(e => `
    <li>
        <span class="dot" style="background-color: ${e.cor}"></span>
        ${e.nome}
        <span class="count">${e.valor}</span>
    </li>
`).join('');

// gráfico
new Chart(document.getElementById('emotionsChart'), {
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
        cutout: '68%',          // espessura do anel
        plugins: {
            legend: { display: false }  // usamos a legenda em HTML
        }
    }
});