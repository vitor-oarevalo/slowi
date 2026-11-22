
var diarioModel = require("../models/diarioModel");

const REGDATA = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]) ([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

const ARRAYEMOCAO = [
    'Calma', 'Alegria', 'Cansaço', 'Ansiedade',
    'Tristeza', 'Raiva', 'Sobrecarga'
];

const ARRAYETIQUETA = [
    'Estudo', 'Trabalho', 'Família',
    'Sono', 'Saúde', 'Relacionamentos'
];

function separarEtiquetas(etiqueta) {
    if (typeof etiqueta != "string") {
        return [];
    }

    return [...new Set(
        etiqueta.split(",")
            .map((nome) => nome.trim())
            .filter((nome) => nome != "")
    )];
}

function validarRegistro(dataRegistro, emocao, intensidade, registro, etiqueta, etiquetas) {
    if (dataRegistro == undefined || emocao == undefined || intensidade == undefined) {
        return "Algum valor está vazio";
    }

    if (!Number.isInteger(intensidade) || intensidade < 1 || intensidade > 5) {
        return "Intensidade inválida";
    }

    if (!REGDATA.test(dataRegistro)) {
        return "dataRegistro inválida";
    }

    if (!ARRAYEMOCAO.includes(emocao)) {
        return "Emoção inválida";
    }

    if (registro != null && typeof registro != "string") {
        return "Registro inválido";
    }

    if (etiqueta != null && typeof etiqueta != "string") {
        return "Etiqueta inválida";
    }

    if (!etiquetas.every((nome) => ARRAYETIQUETA.includes(nome))) {
        return "Etiqueta inválida";
    }

    return null;
}

function registrar(req, res) {
    var dataRegistro = req.body.dataRegistro;
    var emocao = req.body.emocao;
    var intensidade = req.body.intensidade;
    var registro = req.body.registro ?? null;
    var etiqueta = req.body.etiqueta ?? null;
    var Cadastro_idCadastro = Number(req.body.fkCadastro);
    var etiquetas = separarEtiquetas(etiqueta);

    var mensagem = validarRegistro(
        dataRegistro, emocao, intensidade,
        registro, etiqueta, etiquetas
    );

    if (mensagem) {
        return res.status(400).send(mensagem);
    }

    if (!Number.isInteger(Cadastro_idCadastro) || Cadastro_idCadastro <= 0) {
        return res.status(400).send("Cadastro_idCadastro inválido");
    }

    diarioModel.buscarIdEmocao(emocao)
        .then(function (resultadoEmocao) {
            if (resultadoEmocao.length == 0) {
                return res.status(400).send("Emoção não encontrada");
            }

            var emocao_idEmocao = resultadoEmocao[0].idEmocao;

            return diarioModel.registrar(
                dataRegistro,
                emocao_idEmocao,
                intensidade,
                registro,
                etiquetas,
                Cadastro_idCadastro
            );
        })
        .then(function (resultado) {
            if (res.headersSent) {
                return;
            }

            return res.status(201).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);

            if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).send("Usuário não encontrado.");
            }

            res.status(500).json("Erro interno do servidor");
        });
}

function listar(req, res) {
    var Cadastro_idCadastro = Number(req.params.fkCadastro);

    if (!Number.isInteger(Cadastro_idCadastro) || Cadastro_idCadastro <= 0) {
        return res.status(400).send("Ocorreu um erro ao listar: ID inválido");
    }

    diarioModel.listar(Cadastro_idCadastro)
        .then(function (resultado) {
            return res.status(200).json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            return res.status(500).json("Erro interno do servidor");
        });
}

function atualizar(req, res) {
    var Cadastro_idCadastro = Number(req.params.fkCadastro);
    var idRegistro = Number(req.params.idRegistro);

    var dataRegistro = req.body.dataRegistro;
    var emocao = req.body.emocao;
    var intensidade = req.body.intensidade;
    var registro = req.body.registro ?? null;
    var etiqueta = req.body.etiqueta ?? null;
    var etiquetas = separarEtiquetas(etiqueta);

    if (!Number.isInteger(Cadastro_idCadastro) || Cadastro_idCadastro <= 0 ||
        !Number.isInteger(idRegistro) || idRegistro <= 0) {
        return res.status(400).send("ID inválido");
    }

    var mensagem = validarRegistro(
        dataRegistro, emocao, intensidade,
        registro, etiqueta, etiquetas
    );

    if (mensagem) {
        return res.status(400).send(mensagem);
    }

    diarioModel.buscarIdEmocao(emocao)
        .then(function (resultadoEmocao) {
            if (resultadoEmocao.length == 0) {
                return res.status(400).send("Emoção não encontrada");
            }

            var emocao_idEmocao = resultadoEmocao[0].idEmocao;

            return diarioModel.atualizar(
                Cadastro_idCadastro,
                idRegistro,
                dataRegistro,
                emocao_idEmocao,
                intensidade,
                registro,
                etiquetas
            );
        })
        .then(function (resultado) {
            if (res.headersSent) {
                return;
            }

            if (resultado.affectedRows == 0) {
                return res.status(404).send("Registro não encontrado");
            }

            return res.status(200).json("Registro atualizado");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json("Erro interno do servidor");
        });
}

function excluir(req, res) {
    var Cadastro_idCadastro = Number(req.params.fkCadastro);
    var idRegistro = Number(req.params.idRegistro);

    if (!Number.isInteger(Cadastro_idCadastro) || Cadastro_idCadastro <= 0 ||
        !Number.isInteger(idRegistro) || idRegistro <= 0) {
        return res.status(400).send("ID inválido");
    }

    diarioModel.excluir(idRegistro, Cadastro_idCadastro)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return res.status(404).send("Registro não encontrado");
            }

            return res.status(200).json("Registro excluído");
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json("Erro interno do servidor");
        });
}

module.exports = {
    registrar,
    listar,
    atualizar,
    excluir
};
