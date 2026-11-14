const $ = (seletor) => document.querySelector(seletor);

const botaoSalvar = $(".salvar-btn");
const form = $("#registro");
const data = $("#data");
const texto = $("#texto");
const contador = $("#contador");
const erro = $("#erro");
const toast = $("#toast");

const pad = (n) => String(n).padStart(2, "0");

/* ---------- Modo edição ---------- */

// diario.html?editar=7  ->  idEdicao = 7 (ou null, se não houver o parâmetro ou se for inválido)
const parametroEdicao = Number(new URLSearchParams(location.search).get("editar"));
let idEdicao = Number.isInteger(parametroEdicao) && parametroEdicao > 0 ? parametroEdicao : null;

// Troca os textos da página conforme o modo
function definirModo(editando) {
    $("#topo-modo").textContent = editando ? "Editar" : "Registrar";
    $("#titulo-formulario").textContent = editando ? "Editando um registro" : "Um momento para se escutar";
    $("#subtitulo-formulario").textContent = editando
        ? "Mude o que quiser e salve. Se desistir, é só voltar ao histórico."
        : "Sem pressa, sem metas e sem página em branco para vencer.";
    $("#salvar-texto").textContent = editando ? "Salvar alterações" : "Salvar";
    $("#limpar").hidden = editando;
}

// Põe os dados do registro nos campos do formulário
function preencherFormulario(item) {
    // "2026-11-14 10:00:00" -> "2026-11-14T10:00" (formato do datetime-local)
    data.value = item.dataRegistro.replace(" ", "T").slice(0, 16);

    document.querySelectorAll("input[name=emocao]").forEach((radio) => {
        radio.checked = radio.value == item.emocao;
    });

    document.querySelectorAll("input[name=intensidade]").forEach((radio) => {
        radio.checked = Number(radio.value) == item.intensidade;
    });

    texto.value = item.registro || "";
    atualizarContador();

    const marcadas = item.etiqueta ? item.etiqueta.split(",") : [];
    document.querySelectorAll("input[name=etiqueta]").forEach((caixa) => {
        caixa.checked = marcadas.includes(caixa.value);
    });
}

// Busca os registros e acha o que está sendo editado
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
            const item = lista.find((registro) => registro.idDiarioEmocional == idEdicao);

            if (!item) {
                // id inexistente ou de outra pessoa: volta a ser um registro novo
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

/* ---------- Formulário ---------- */

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

/* Editar data e hora */
$("#editar-data").addEventListener("click", () => {
    data.disabled = false;
    data.focus();
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

/* Salvar (cria um registro novo ou atualiza o que está sendo editado) */
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

    // A única diferença entre criar e editar: o endereço e o método
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
                    // dá um instante para a pessoa ler o aviso e volta para o histórico
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

/* ---------- Início da página ---------- */

atualizarContador();

if (idEdicao != null) {
    definirModo(true);
    carregarParaEdicao();
} else {
    iniciarData();
}