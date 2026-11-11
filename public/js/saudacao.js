function reatribuirNomeSaudacao() {
    let nomeUsuario = sessionStorage.NOME_USUARIO;

    if (nomeUsuario) {
        let primeiroNome = nomeUsuario.split(' ')[0];

        document.querySelector("#greeting_name").innerHTML = primeiroNome;
    }
}

reatribuirNomeSaudacao();