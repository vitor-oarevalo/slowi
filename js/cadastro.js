// let listaEmpresasCadastradas = [];

function mostrarErro(mensagem) {
    card_erro.classList.add('ativo');
    
    mensagem_erro.innerHTML = `${mensagem}`
    setTimeout(sumirMensagem, 5000);

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
        mostrarErro('Preencha todos os campos para criar sua conta')
        return false;
    }

    if (senhaVar != confirmacaoSenhaVar) {
        mostrarErro('As senhas estão diferentes!')
        return false;
    }

    if (senhaVar.length >= 8 && REGMAIUSCULA.test(senhaVar) && REGNUMERO.test(senhaVar) && REGESPECIAL.test(senhaVar) && senhaVar == confirmacaoSenhaVar) {
        console.log('Tudo certo')
    } else {
        console.log('Errado')
    }

    

    // Enviando o valor da nova input
    fetch("/usuarios/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // crie um atributo que recebe o valor recuperado aqui
        // Agora vá para o arquivo routes/usuario.js
        nomeServer: nomeVar,
        emailServer: emailVar,
        senhaServer: senhaVar,
        idEmpresaVincularServer: idEmpresaVincular
      }),
    })
      .then(function (resposta) {
        console.log("resposta: ", resposta);

        if (resposta.ok) {
          cardErro.style.display = "block";

          mensagem_erro.innerHTML =
            "Cadastro realizado com sucesso! Redirecionando para tela de Login...";

          setTimeout(() => {
            window.location = "login.html";
          }, "2000");

          limparFormulario();
          
        } else {
          throw "Houve um erro ao tentar realizar o cadastro!";
        }
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
        
      });

    return false;
  }

  // Listando empresas cadastradas 
  function listar() {
    fetch("/empresas/listar", {
      method: "GET",
    })
      .then(function (resposta) {
        resposta.json().then((empresas) => {
          empresas.forEach((empresa) => {
            listaEmpresasCadastradas.push(empresa);

            console.log("listaEmpresasCadastradas")
            console.log(listaEmpresasCadastradas[0].codigo_ativacao)
          });
        });
      })
      .catch(function (resposta) {
        console.log(`#ERRO: ${resposta}`);
      });
  }

  function sumirMensagem() {
    card_erro.classList.remove('ativo')
  }