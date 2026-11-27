const botaoSalvar = document.querySelector(".salvar-btn");
const form = document.querySelector("#registro");
const data = document.querySelector("#data");
const texto = document.querySelector("#texto");
const contador = document.querySelector("#contador");
const erro = document.querySelector("#erro");
const toast = document.querySelector("#toast");

function pad(n) {
    var numero = String(n);
    return numero.padStart(2, "0");
}

const parametros = new URLSearchParams(location.search);
const valorEdicao = parametros.get("editar");
const parametroEdicao = Number(valorEdicao);

let idEdicao = null;

if (Number.isInteger(parametroEdicao) && parametroEdicao > 0) {
    idEdicao = parametroEdicao;
}

let topo_modo = document.querySelector("#topo-modo")
let titulo_formulario = document.querySelector("#titulo-formulario")
let subtitulo_formulario = document.querySelector("#subtitulo-formulario")
let salvar_texto = document.querySelector("#salvar-texto")

let botaoLimpar = document.querySelector("#limpar");

function definirModo(editando) {
    if (editando) {
        topo_modo.textContent = "Editar";
        titulo_formulario.textContent = "Editando um registro";
        subtitulo_formulario.textContent = "Mude o que quiser e salve. Se desistir, é só voltar ao histórico.";
        salvar_texto.textContent = "Salvar alterações";
        botaoLimpar.hidden = true;
    } else {
        topo_modo.textContent.textContent = "Registrar";
        titulo_formulario.textContent.textContent = "Um momento para se escutar";
        subtitulo_formulario.textContent.textContent = "Sem pressa, sem metas e sem página em branco para vencer.";
        salvar_texto.textContent.textContent = "Salvar";
        botaoLimpar.hidden = false;
    }
}

function preencherFormulario(item) {
    let dataFormatada = item.dataRegistro.replace(" ", "T").slice(0, 16);
    dataFormatada = dataFormatada.slice(0, 16);
    data.value = dataFormatada;

    let emocoes = document.querySelectorAll("input[name=emocao]");

    emocoes.forEach(function(radio) {
        if (radio.value == item.emocao) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    });

    let intensidades = document.querySelectorAll("input[name=intensidade]");

    intensidades.forEach(function(radio) {
        let valorRadio = Number(radio.value);

        if (valorRadio == item.intensidade) {
            radio.checked = true;
        } else {
            radio.checked = false;
        }
    });

    if (item.registro) {
        texto.value = item.registro;
    } else {
        texto.value = "";
    }

    atualizarContador();

    let marcadas = [];

    if (item.etiqueta) {
        marcadas = item.etiqueta.split(",");
    }

    let etiquetas = document.querySelectorAll("input[name=etiqueta]");

    etiquetas.forEach(function(caixa) {
        if (marcadas.includes(caixa.value)) {
            caixa.checked = true;
        } else {
            caixa.checked = false;
        }
    });
}

function carregarParaEdicao() {
    botaoSalvar.disabled = true;

    fetch("/diario/listar/" + Number(sessionStorage.ID_USUARIO))
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error("Falha ao carregar");
            }
            return resposta.json();
        })
        .then(function (lista) {
            const item = lista.find(function(registro) {
                if (registro.idDiarioEmocional == idEdicao) {
                    return true;
                } else {
                    return false;
                }
            });

            if (!item) {
                idEdicao = null;
                definirModo(false);
                iniciarData();
                erro.textContent = "Não encontramos esse registro. Você pode escrever um novo.";
                erro.hidden = false;
                return;
            }

            preencherFormulario(item);
        })
        .catch(function (falha) {
            console.log(falha);
            erro.textContent = "Não foi possível carregar o registro. Tente novamente.";
            erro.hidden = false;
        })
        .finally(function () {
            botaoSalvar.disabled = false;
        });
}


function agoraLocal() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function iniciarData() {
    data.value = agoraLocal();
    data.disabled = true;
}

function atualizarContador() {
    contador.textContent = `${texto.value.length} caracteres`;
}

const botaoEditarData = document.querySelector("#editar-data");

botaoEditarData.addEventListener("click", () => {
    data.disabled = false;
    data.focus();
});

const botoesPergunta = document.querySelectorAll(".pergunta");

botoesPergunta.forEach((botao) => {
    botao.addEventListener("click", () => {
        const pergunta = botao.firstChild.textContent.trim();
        var textoAtual = texto.value;
        var precisaPularLinha = false;

        if (textoAtual != "" && !textoAtual.endsWith("\n")) {
            precisaPularLinha = true;
        }

        if (precisaPularLinha) {
            texto.value = textoAtual + "\n" + pergunta + "\n";
        } else {
            texto.value = textoAtual + pergunta + "\n";
        }

        texto.focus();
        atualizarContador();
    });
});

texto.addEventListener("input", atualizarContador);

function limpar() {
    form.reset();
    iniciarData();
    atualizarContador();
    erro.hidden = true;
}

botaoLimpar.addEventListener("click", limpar);

let temporizador;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const emocao = document.querySelector("input[name=emocao]:checked");
    if (!emocao) {
        erro.textContent = "Escolha uma emoção principal para salvar.";
        erro.hidden = false;
        return;
    }

    if (data.value == "") {
        erro.textContent = "Escolha a data e a hora do registro.";
        erro.hidden = false;
        return;
    }

    erro.hidden = true;

    const registro = {
        dataRegistro: data.value.replace("T", " ") + ":00",
        emocao: emocao.value,
        intensidade: Number(document.querySelector("input[name=intensidade]:checked").value),
        registro: texto.value.trim(),
        etiqueta: [...document.querySelectorAll("input[name=etiqueta]:checked")].map((x) => x.value).join(","),
        fkCadastro: Number(sessionStorage.ID_USUARIO)
    };

    if (registro.registro == "") {
        registro.registro = null;
    }

    if (registro.etiqueta == "") {
        registro.etiqueta = null;
    }

    const hora = new Date(data.value).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

    const editando = idEdicao != null;
    const url = editando
        ? "/diario/atualizar/" + Number(sessionStorage.ID_USUARIO) + "/" + idEdicao
        : "/diario/registrar";

    botaoSalvar.disabled = true;

    fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registro),
    })
        .then(function (resposta) {
            if (resposta.ok) {
                $("#toast-info").textContent = `${hora} · Emoção: ${registro.emocao}`;
                toast.hidden = false;
                clearTimeout(temporizador);
                temporizador = setTimeout(() => (toast.hidden = true), 5000);

                if (editando) {
                    setTimeout(() => { location.href = "historico.html"; }, 1500);
                } else {
                    limpar();
                }
            } else if (resposta.status == 404 && editando) {
                erro.textContent = "Esse registro não existe mais. Volte ao histórico e tente de novo.";
                erro.hidden = false;
            } else {
                erro.textContent = "Não foi possível salvar seu registro. Tente novamente.";
                erro.hidden = false;
            }
        })
        .catch(function (falha) {
            console.log(falha);
            erro.textContent = "Não foi possível salvar seu registro. Tente novamente.";
            erro.hidden = false;
        })
        .finally(function () {
            botaoSalvar.disabled = false;
        });
});

atualizarContador();

if (idEdicao != null) {
    definirModo(true);
    carregarParaEdicao();
} else {
    iniciarData();
}