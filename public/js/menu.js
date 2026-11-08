const menu = document.getElementById("menu-lateral");
const btnAbrir = document.getElementById("open-btn");
const btnFechar = document.getElementById("close-btn");
const overlay = document.getElementById("menu-overlay");

const telaPequena = window.matchMedia("(max-width: 768px)");

function menuEstaAberto() {
    return !document.body.classList.contains("menu-fechado");
}

function definirMenu(aberto, moverFoco = true) {
    document.body.classList.toggle("menu-fechado", !aberto);
    btnAbrir.setAttribute("aria-expanded", String(aberto));

    if (moverFoco) {
        (aberto ? btnFechar : btnAbrir).focus();
    }
}

function abrirMenu() {
    definirMenu(true);
}

function fecharMenu() {
    definirMenu(false);
}

definirMenu(!telaPequena.matches, false);

telaPequena.addEventListener("change", (e) => definirMenu(!e.matches, false));

btnAbrir.addEventListener("click", abrirMenu);
btnFechar.addEventListener("click", fecharMenu);
overlay.addEventListener("click", fecharMenu);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuEstaAberto()) {
        fecharMenu();
    }
});

menu.querySelectorAll(".menu-link").forEach((link) => {
    link.addEventListener("click", () => {
        if (telaPequena.matches) {
            definirMenu(false, false);
        }
    });
});


function reatribuirNome() {
    let username = document.querySelector("#username_tag");
    username.innerHTML = `${sessionStorage.NOME_USUARIO}`

    let stringNome = username.innerHTML;

    let avatar = document.querySelector("#avatar");
    avatar.innerHTML = stringNome.charAt(0);
}

reatribuirNome()