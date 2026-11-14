var diarioModel = require("../models/diarioModel");

const REGDATA = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/
const ARRAYEMOCAO = ['Calma', 'Alegria', 'Cansaço', 'Ansiedade', 'Tristeza', 'Raiva', 'Sobrecarga'];
const ARRAYETIQUETA = ['Estudo', 'Trabalho', 'Família', 'Sono', 'Saúde', 'Relacionamentos'];

function registrar(req, res) {
    var dataRegistro = req.body.dataRegistro;
    var emocao = req.body.emocao;
    var intensidade = req.body.intensidade;
    var registro = req.body.registro;
    var etiqueta = req.body.etiqueta;
    var fkCadastro = req.body.fkCadastro;

    // "Estudo,Sono" (ou null) vira uma lista sem repetidos: ["Estudo", "Sono"]
    var etiquetas = [];
    if (typeof etiqueta == "string") {
        etiquetas = [...new Set(
            etiqueta.split(",").map((nome) => nome.trim()).filter((nome) => nome != "")
        )];
    }

    if (dataRegistro == undefined || emocao == undefined || intensidade == undefined || fkCadastro == undefined) {
        res.status(400).send("Algum valor está vazio");
    } else if (!(intensidade >= 1 && intensidade <= 5) || !(Number.isInteger(intensidade))) {
        res.status(400).send("Intensidade inválida");
    } else if (!(Number.isInteger(fkCadastro))) {
        res.status(400).send("fkCadastro inválida");
    } else if (REGDATA.test(dataRegistro) == false) {
        res.status(400).send("dataRegistro inválida");
    } else if (!(ARRAYEMOCAO.includes(emocao))) {
        res.status(400).send("Emoção inválida");
    } else if (etiqueta != null && typeof etiqueta != "string") {
        res.status(400).send("Etiqueta inválida");
    } else if (!etiquetas.every((nome) => ARRAYETIQUETA.includes(nome))) {
        res.status(400).send("Etiqueta inválida");
    } else {
        diarioModel.registrar(dataRegistro, emocao, intensidade, registro, etiquetas, fkCadastro)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o registro! Erro: ",
                        erro.sqlMessage
                    );
                    if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                        res.status(400).send("Usuário não encontrado.")
                        return;
                    }
                    res.status(500).json("Erro interno do servidor");
                }
            );
    }
}

function listar(req, res) {
    var fkCadastro = Number(req.params.fkCadastro);

    if (!Number.isInteger(fkCadastro)) {
        return res.status(400).send("Ocorreu um erro ao listar: ID inválido");
    }

    diarioModel.listar(fkCadastro)
        .then(function (resultado) {
            return res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            return res.status(500).json("Erro interno do servidor");
        });
}

module.exports = {
    registrar,
    listar
}