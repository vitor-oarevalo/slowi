var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {
        usuarioModel.autenticar(email)
            .then(
                function (resultadoAutenticar) {
                    if (resultadoAutenticar.length == 1) {
                        var guardado = resultadoAutenticar[0].senha;

                        if (senha == guardado) {
                            res.json({
                                idCadastro: resultadoAutenticar[0].idCadastro,
                                nome: resultadoAutenticar[0].nome,
                                email: resultadoAutenticar[0].email
                            });
                        } else {
                            res.status(401).send("Email e/ou senha inválido(s)")
                        }

                    } else {
                        res.status(401).send("Email e/ou senha inválido(s)");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json("Houve um erro ao realizar o login!");
                }
            );
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else {        
        usuarioModel.cadastrar(nome, email, senha)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    if (erro.code == "ER_DUP_ENTRY") {
                        res.status(409).send("Esse email já está cadastrado.")
                        return;    
                    }
                    res.status(500).json("Erro interno do servidor");
                }
            );
    }
}

module.exports = {
    autenticar,
    cadastrar
}