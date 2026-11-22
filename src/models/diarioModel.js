
var database = require("../database/config");

function gravarEtiquetas(idRegistro, etiquetas) {
    var insercoes = etiquetas.map(function (nome) {
        var sqlEtiqueta = `
            INSERT INTO registroEtiqueta (fkDiarioEmocional, fkEtiqueta)
            VALUES (?, (SELECT idEtiqueta FROM etiqueta WHERE nome = ?));
        `;
        return database.executar(sqlEtiqueta, [idRegistro, nome]);
    });

    return Promise.all(insercoes);
}

function registrar(dataRegistro, emocao_idEmocao, intensidade, registro, etiquetas, Cadastro_idCadastro) {
    var instrucaoSql = `
        INSERT INTO diarioEmocional
            (dataRegistro, emocao_idEmocao, intensidade, registro, Cadastro_idCadastro)
        VALUES (?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [
        dataRegistro,
        emocao_idEmocao,
        intensidade,
        registro,
        Cadastro_idCadastro
    ])
        .then(function (resultado) {
            return gravarEtiquetas(resultado.insertId, etiquetas)
                .then(function () {
                    return resultado;
                });
        });
}

function listar(Cadastro_idCadastro) {
    var instrucaoSql = `
        SELECT
            d.idDiarioEmocional,
            DATE_FORMAT(d.dataRegistro, '%Y-%m-%d %H:%i:%s') AS dataRegistro,
            em.nome AS emocao,
            em.cor AS corEmocao,
            d.intensidade,
            d.registro,
            GROUP_CONCAT(e.nome ORDER BY e.nome SEPARATOR ',') AS etiqueta
        FROM diarioEmocional d
        JOIN emocao em ON em.idEmocao = d.emocao_idEmocao
        LEFT JOIN registroEtiqueta re
            ON re.fkDiarioEmocional = d.idDiarioEmocional
        LEFT JOIN etiqueta e
            ON e.idEtiqueta = re.fkEtiqueta
        WHERE d.Cadastro_idCadastro = ?
        GROUP BY
            d.idDiarioEmocional,
            d.dataRegistro,
            em.nome,
            em.cor,
            d.intensidade,
            d.registro
        ORDER BY d.dataRegistro DESC;
    `;

    return database.executar(instrucaoSql, [Cadastro_idCadastro]);
}

function atualizar(Cadastro_idCadastro, idRegistro, dataRegistro, emocao_idEmocao, intensidade, registro, etiquetas) {
    var sqlAtualizar = `
        UPDATE diarioEmocional
        SET dataRegistro = ?,
            emocao_idEmocao = ?,
            intensidade = ?,
            registro = ?
        WHERE idDiarioEmocional = ?
          AND Cadastro_idCadastro = ?;
    `;

    return database.executar(sqlAtualizar, [
        dataRegistro,
        emocao_idEmocao,
        intensidade,
        registro,
        idRegistro,
        Cadastro_idCadastro
    ])
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return resultado;
            }

            var sqlApagar = `
                DELETE FROM registroEtiqueta
                WHERE fkDiarioEmocional = ?;
            `;

            return database.executar(sqlApagar, [idRegistro])
                .then(function () {
                    return gravarEtiquetas(idRegistro, etiquetas);
                })
                .then(function () {
                    return resultado;
                });
        });
}

function excluir(idRegistro, Cadastro_idCadastro) {
    var instrucaoSql = `
        DELETE FROM diarioEmocional
        WHERE idDiarioEmocional = ?
          AND Cadastro_idCadastro = ?;
    `;

    return database.executar(instrucaoSql, [idRegistro, Cadastro_idCadastro]);
}

function buscarIdEmocao(nome) {
    var instrucaoSql = `
        SELECT idEmocao
        FROM emocao
        WHERE nome = ?;
    `;

    return database.executar(instrucaoSql, [nome]);
}

module.exports = {
    registrar,
    listar,
    atualizar,
    excluir,
    buscarIdEmocao
};
