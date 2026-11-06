let timerErro;

function mostrarMensagem(mensagem, tipo) {
    clearTimeout(timerErro);

    card_erro.classList.toggle('sucesso', tipo == 'sucesso')
    titulo_erro.innerHTML = tipo == 'sucesso' ? 'Tudo certo!' : 'Ops!';

    card_erro.classList.add('ativo');

    mensagem_erro.innerHTML = `${mensagem}`
    timerErro = setTimeout(sumirMensagem, 5000);

}

function entrar() {
    var emailVar = ipt_email.value;
    var senhaVar = ipt_senha.value;

    if (emailVar == "" || senhaVar == "") {
        mostrarMensagem("Preencha os campos para acessar sua conta!", "erro")
        return false;
    }

    fetch("/usuarios/autenticar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: emailVar,
            senhaServer: senhaVar
        })
    }).then(function (resposta) {
        if (resposta.ok) {

            resposta.json().then(json => {
                sessionStorage.EMAIL_USUARIO = json.email;
                sessionStorage.NOME_USUARIO = json.nome;
                sessionStorage.ID_USUARIO = json.idCadastro;

                mostrarMensagem("Login realizado! Redirecionando...", "sucesso")
                
                setTimeout(function () {
                    window.location = "index.html";
                }, 1000);

            });

        } else if (resposta.status == 401) {
            mostrarMensagem("E-mail e/ou senha inválido(s)", "erro");
        } else {
            mostrarMensagem("Não foi possível entrar. Tente novamente.", "erro");
        }

    }).catch(function (erro) {
        mostrarMensagem("Não foi possível entrar. Tente novamente.", "erro");
    })

    return false;
}

function sumirMensagem() {
    card_erro.classList.remove('ativo')
}