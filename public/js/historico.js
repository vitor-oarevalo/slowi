const historicoAviso = document.getElementById("historico-aviso");
const historicoLista = document.getElementById("history-lista");

const CORES_EMOCAO = {
    "Calma": "#7a66c9",
    "Alegria": "#e9b44c",
    "Cansaço": "#a99bdc",
    "Ansiedade": "#e07a5f",
    "Tristeza": "#5b8def",
    "Raiva": "#d1495b",
    "Sobrecarga": "#43358a"
};

function criar(tag, classe, conteudo) {
    const el = document.createElement(tag);
    if (classe) el.className = classe;
    if (conteudo) el.textContent = conteudo;
    return el;
}

function formatarDataHistorico(texto) {
    return new Date(texto.replace(" ", "T")).toLocaleString("pt-BR", {
        day: "2-digit", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit"
    });
}

function criarCard(item) {
    const card = criar("article", "history-card");

    const topo = criar("header", "history-topo");
    topo.appendChild(criar("time", "history-data", formatarDataHistorico(item.dataRegistro)));

    const emocao = criar("span", "history-emocao", item.emocao);
    emocao.style.backgroundColor = CORES_EMOCAO[item.emocao] || "#E3DFF5";
    topo.appendChild(emocao);
    card.appendChild(topo);

    const intensidade = criar("div", "history-intensidade");
    intensidade.setAttribute("aria-label", `Intensidade ${item.intensidade} de 5`);
    for (let i = 1; i <= 5; i++) {
        intensidade.appendChild(criar("span", i <= item.intensidade ? "ponto ativo" : "ponto"));
    }
    card.appendChild(intensidade);

    if (item.registro) {
        card.appendChild(criar("p", "history-texto", item.registro));
    }

    if (item.etiqueta) {
        const etiquetas = criar("div", "history-etiquetas");
        item.etiqueta.split(",").forEach((nome) => {
            etiquetas.appendChild(criar("span", "history-etiqueta", nome));
        });
        card.appendChild(etiquetas);
    }

    return card;
}

function mostrarHistorico(lista, limite) {
    historicoLista.replaceChildren();

    if (lista.length == 0) {
        historicoAviso.textContent = "Você ainda não tem registros. Que tal escrever o primeiro?";
        historicoAviso.hidden = false;
        return;
    }

    historicoAviso.hidden = true;

    let itens = limite ? lista.slice(0, limite) : lista;
    itens.forEach((item) => historicoLista.appendChild(criarCard(item)));
}

function carregarHistorico(limite) {
    historicoAviso.textContent = "Carregando seus registros...";
    historicoAviso.hidden = false;
    historicoLista.replaceChildren();

    fetch("/diario/listar/" + Number(sessionStorage.ID_USUARIO))
        .then(function (resposta) {
            if (resposta.ok) {
                resposta.json().then(function (lista) {
                    mostrarHistorico(lista, limite);
                });
            } else {
                historicoAviso.textContent = "Não foi possível carregar seus registros. Tente novamente.";
            }
        })
        .catch(function (falha) {
            console.log(falha);
            historicoAviso.textContent = "Não foi possível carregar seus registros. Tente novamente.";
        });
}