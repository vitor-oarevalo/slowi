// cadastro.js

let timerErro;

function mostrarMensagem(mensagem, tipo) {
  clearTimeout(timerErro);

  card_erro.classList.toggle('sucesso', tipo == 'sucesso')
  titulo_erro.innerHTML = tipo == 'sucesso' ? 'Tudo certo!' : 'Ops!';
  
  card_erro.classList.add('ativo');

  mensagem_erro.innerHTML = `${mensagem}`
  timerErro = setTimeout(sumirMensagem, 5000);

}

const REGMAIUSCULA = /[A-Z]/;
const REGNUMERO = /\d/;
const REGESPECIAL = /[@$!%*?&]/

function validarSenha() {
  var senhaValidacao = ipt_senha.value;
  criterios_senha.classList.add('ativo');

  crit_tamanho.classList.toggle('ok', senhaValidacao.length >= 8);
  crit_maiuscula.classList.toggle('ok', REGMAIUSCULA.test(senhaValidacao));
  crit_numero.classList.toggle('ok', REGNUMERO.test(senhaValidacao));
  crit_especial.classList.toggle('ok', REGESPECIAL.test(senhaValidacao));

}

function checarSenhas() {
  var senhaValidacao = ipt_senha.value;
  var senhaConfirmada = ipt_confirmar_senha.value;

  criterios_senha2.classList.add('ativo');


  crit_senhas.classList.toggle('ok', senhaValidacao == senhaConfirmada);

  if (crit_senhas.classList.contains('ok')) {
    crit_senhas.innerHTML = `As senhas coincidem`;
  } else {
    crit_senhas.innerHTML = `As senhas não coincidem`;
  }
}

function removerRegras() {
  criterios_senha.classList.remove('ativo');
  criterios_senha2.classList.remove('ativo');

}

function cadastrar() {
  var nomeVar = ipt_nome.value;
  var emailVar = ipt_email.value;
  var senhaVar = ipt_senha.value;
  var confirmacaoSenhaVar = ipt_confirmar_senha.value;

  if (nomeVar == "" || emailVar == "" || senhaVar == "" || confirmacaoSenhaVar == "") {
    mostrarMensagem('Preencha todos os campos para criar sua conta!')
    return false;
  }

  if (senhaVar != confirmacaoSenhaVar) {
    mostrarMensagem('As senhas estão diferentes!')
    return false;
  }

  if (!(senhaVar.length >= 8 && REGMAIUSCULA.test(senhaVar) && REGNUMERO.test(senhaVar) && REGESPECIAL.test(senhaVar))) {
    mostrarMensagem('Sua senha não atende a todos os critérios de segurança')
    return false;
  }

  fetch("/usuarios/cadastrar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nomeServer: nomeVar,
      emailServer: emailVar,
      senhaServer: senhaVar
    }),
  })
    .then(function (resposta) {
      console.log("resposta: ", resposta);

      if (resposta.ok) {
        mostrarMensagem("Cadastro realizado com sucesso! Redirecionando...", "sucesso")

        setTimeout(() => {
          window.location = "login.html";
        }, "2000");

      } else if (resposta.status == 409) {
        mostrarMensagem("Este e-mail já está cadastrado", "erro");
      } else {
        mostrarMensagem("Houve um erro ao tentar realizar o cadastro!", "erro");
      }
    })
    .catch(function (resposta) {
      console.log(resposta);
      mostrarMensagem("Não foi possível criar a conta. Tente novamente.")
    });

  return false;
}

function sumirMensagem() {
  card_erro.classList.remove('ativo')
}