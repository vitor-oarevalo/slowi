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

function criarIconeLapis() {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");

    const caminho = document.createElementNS(ns, "path");
    caminho.setAttribute("d", "M4 20h4L19 9l-4-4L4 16z");
    svg.appendChild(caminho);

    return svg;
}

function criarBotaoExcluir(card, item) {
    const botao = criar("button", "botao-excluir");
    botao.type = "button";
    botao.setAttribute("aria-label", "Excluir este registro");

    const icone = criar("img", "delete-btn");
    icone.src = "../assets/icon/trash.png";
    icone.alt = "";
    botao.appendChild(icone);

    botao.addEventListener("click", function () {
        if (!confirm("Excluir este registro? Não dá para desfazer.")) {
            return;
        }

        botao.disabled = true;

        fetch("/diario/excluir/" + Number(sessionStorage.ID_USUARIO) + "/" + item.idDiarioEmocional, {
            method: "DELETE"
        })
            .then(function (resposta) {
                if (resposta.ok) {
                    card.remove();
                    historicoAviso.hidden = true;

                    if (historicoLista.children.length == 0) {
                        historicoAviso.textContent = "Você ainda não tem registros. Que tal escrever o primeiro?";
                        historicoAviso.hidden = false;
                    }
                } else {
                    historicoAviso.textContent = "Não foi possível excluir o registro. Tente novamente.";
                    historicoAviso.hidden = false;
                    botao.disabled = false;
                }
            })
            .catch(function (falha) {
                console.log(falha);
                historicoAviso.textContent = "Não foi possível excluir o registro. Tente novamente.";
                historicoAviso.hidden = false;
                botao.disabled = false;
            });
    });

    return botao;
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

    if (historicoLista.dataset.excluir == "true") {
        const acoes = criar("div", "history-acoes");

        const linkEditar = criar("a", "link-editar");
        linkEditar.href = "diario.html?editar=" + item.idDiarioEmocional;
        linkEditar.setAttribute("aria-label", "Editar este registro");
        linkEditar.appendChild(criarIconeLapis());

        acoes.appendChild(linkEditar);
        acoes.appendChild(criarBotaoExcluir(card, item));
        card.appendChild(acoes);
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