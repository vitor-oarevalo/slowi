const menu = document.getElementById("menu-lateral");
const btnAbrir = document.getElementById("open-btn");
const btnFechar = document.getElementById("close-btn");
const overlay = document.getElementById("menu-overlay");


function menuEstaAberto() {
    return !document.body.classList.contains("menu-fechado");
}

function definirMenu(aberto) {
    document.body.classList.toggle("menu-fechado", !aberto);
}

function abrirMenu() {
    definirMenu(true);
}

function fecharMenu() {
    definirMenu(false);
}

btnAbrir.addEventListener("click", abrirMenu);
btnFechar.addEventListener("click", fecharMenu);
overlay.addEventListener("click", fecharMenu);


function reatribuirNome() {
    let username = document.querySelector("#username_tag");
    username.innerHTML = `${sessionStorage.NOME_USUARIO}`

    let stringNome = username.innerHTML;

    let avatar = document.querySelector("#avatar");
    avatar.innerHTML = stringNome.charAt(0);
}

reatribuirNome()