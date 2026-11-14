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

function registrar(dataRegistro, emocao, intensidade, registro, etiquetas, fkCadastro) {
    var instrucaoSql = `
        INSERT INTO diarioEmocional (dataRegistro, emocao, intensidade, registro, fkCadastro)
        VALUES (?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [dataRegistro, emocao, intensidade, registro, fkCadastro])
        .then(function (resultado) {
            return gravarEtiquetas(resultado.insertId, etiquetas).then(function () {
                return resultado;
            });
        });
}

function listar(fkCadastro) {
    var instrucaoSql = `
        SELECT d.idDiarioEmocional,
               DATE_FORMAT(d.dataRegistro, '%Y-%m-%d %H:%i:%s') AS dataRegistro,
               d.emocao,
               d.intensidade,
               d.registro,
               GROUP_CONCAT(e.nome ORDER BY e.nome SEPARATOR ',') AS etiqueta
        FROM diarioEmocional d
        LEFT JOIN registroEtiqueta re ON re.fkDiarioEmocional = d.idDiarioEmocional
        LEFT JOIN etiqueta e ON e.idEtiqueta = re.fkEtiqueta
        WHERE d.fkCadastro = ?
        GROUP BY d.idDiarioEmocional
        ORDER BY d.dataRegistro DESC;
    `;
    return database.executar(instrucaoSql, [fkCadastro]);
}

function atualizar(fkCadastro, idRegistro, dataRegistro, emocao, intensidade, registro, etiquetas) {
    var sqlAtualizar = `
        UPDATE diarioEmocional
        SET dataRegistro = ?, emocao = ?, intensidade = ?, registro = ?
        WHERE idDiarioEmocional = ? AND fkCadastro = ?;
    `;

    return database.executar(sqlAtualizar, [dataRegistro, emocao, intensidade, registro, idRegistro, fkCadastro])
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                return resultado;
            }

            var sqlApagar = `DELETE FROM registroEtiqueta WHERE fkDiarioEmocional = ?;`;

            return database.executar(sqlApagar, [idRegistro]).then(function () {
                return gravarEtiquetas(idRegistro, etiquetas);
            }).then(function () {
                return resultado;
            });
        });
}

function excluir(idRegistro, fkCadastro) {
    var instrucaoSql = `
        DELETE FROM diarioEmocional WHERE idDiarioEmocional = ? AND fkCadastro = ?;
    `;
    return database.executar(instrucaoSql, [idRegistro, fkCadastro]);
}

module.exports = {
    registrar,
    listar,
    atualizar,
    excluir
};