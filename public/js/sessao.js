function validarSessao() {
    if (sessionStorage.ID_USUARIO == undefined) {
        window.location.replace("landing-page.html")
    }
}

validarSessao()

function sair() {
    sessionStorage.clear()
    window.location.replace("landing-page.html")
}