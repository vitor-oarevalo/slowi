const $ = (seletor) => document.querySelector(seletor);

const form = $("#registro");
const data = $("#data");
const texto = $("#texto");
const contador = $("#contador");
const erro = $("#erro");
const toast = $("#toast");

// Por enquanto os registros ficam só na memória da página.
// Para o banco de dados, envie o objeto "registro" ao backend dentro do submit.
const registros = [];

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

abas.forEach((aba, i) => {
    aba.addEventListener("click", () => abrirAba(aba));
    aba.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { abrirAba(abas[(i + 1) % abas.length]); abas[(i + 1) % abas.length].focus(); }
        if (e.key === "ArrowLeft") { abrirAba(abas[(i + abas.length - 1) % abas.length]); abas[(i + abas.length - 1) % abas.length].focus(); }
    });
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
        erro.hidden = false;
        return;
    }
    erro.hidden = true;
    const registro = {
        data: data.value,
        emocao: emocao.value,
        intensidade: Number(document.querySelector("input[name=intensidade]:checked").value),
        texto: texto.value.trim(),
        etiquetas: [...document.querySelectorAll("input[name=etiqueta]:checked")].map((x) => x.value)
    };
    registros.push(registro);
    
    const hora = new Date(registro.data).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
    $("#toast-info").textContent = `${hora} · Emoção: ${registro.emocao}`;
    toast.hidden = false;
    clearTimeout(temporizador);
    temporizador = setTimeout(() => (toast.hidden = true), 5000);
    
    limpar();
});

iniciarData();
atualizarContador();