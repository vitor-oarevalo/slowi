var crypto = require("crypto");

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

                        var partes = guardado.split(":");

                        var parteSalt = partes[0];
                        var parteHash = partes[1];

                        let hashDigitado = crypto.scryptSync(senha, parteSalt, 64);

                        let hashBytes = Buffer.from(parteHash, "hex")

                        let autenticacao = crypto.timingSafeEqual(hashDigitado, hashBytes);

                        if (autenticacao) {
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
        
        let salt = crypto.randomBytes(16);
        let saltFormat = salt.toString("hex");

        let hash = crypto.scryptSync(senha, saltFormat, 64);
        let hashFormat = hash.toString("hex");

        senha = saltFormat + ":" + hashFormat;

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