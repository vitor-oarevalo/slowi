const $ = (seletor) => document.querySelector(seletor);

const botaoSalvar = $(".salvar-btn");
const form = $("#registro");
const data = $("#data");
const texto = $("#texto");
const contador = $("#contador");
const erro = $("#erro");
const toast = $("#toast");

const pad = (n) => String(n).padStart(2, "0");

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

/* Data de hoje na barra do topo */
$("#hoje").textContent = new Date().toLocaleDateString("pt-BR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
});

/* Editar data e hora */
$("#editar-data").addEventListener("click", () => {
    data.disabled = false;
    data.focus();
});

/* Abas */
const abas = document.querySelectorAll(".tab");

function abrirAba(aba) {
    abas.forEach((item) => {
        const ativa = item === aba;
        item.setAttribute("aria-selected", ativa);
        item.tabIndex = ativa ? 0 : -1;
        document.getElementById(item.getAttribute("aria-controls")).hidden = !ativa;
    });
}

abas.forEach((aba) => {
    aba.addEventListener("click", () => abrirAba(aba));
});

/* Perguntas que ajudam a começar: inserem a pergunta no texto */
document.querySelectorAll(".pergunta").forEach((botao) => {
    botao.addEventListener("click", () => {
        const pergunta = botao.firstChild.textContent.trim();
        texto.value += (texto.value && !texto.value.endsWith("\n") ? "\n" : "") + pergunta + "\n";
        texto.focus();
        atualizarContador();
    });
});

texto.addEventListener("input", atualizarContador);

/* Limpar */
function limpar() {
    form.reset();
    iniciarData();
    atualizarContador();
    erro.hidden = true;
}

$("#limpar").addEventListener("click", limpar);

/* Salvar */
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

    botaoSalvar.disabled = true;

    fetch("/diario/registrar", {
        method: "POST",
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

                limpar();
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

iniciarData();
atualizarContador();