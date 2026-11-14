var database = require("../database/config")

function registrar(dataRegistro, emocao, intensidade, registro, etiquetas, fkCadastro) {
    var instrucaoSql = `
        INSERT INTO diarioEmocional (dataRegistro, emocao, intensidade, registro, fkCadastro)
        VALUES (?, ?, ?, ?, ?);
    `;

    return database.executar(instrucaoSql, [dataRegistro, emocao, intensidade, registro, fkCadastro])
        .then(function (resultado) {
            var idRegistro = resultado.insertId;

            var insercoes = etiquetas.map(function (nome) {
                var sqlEtiqueta = `
                    INSERT INTO registroEtiqueta (fkDiarioEmocional, fkEtiqueta)
                    VALUES (?, (SELECT idEtiqueta FROM etiqueta WHERE nome = ?));
                `;
                return database.executar(sqlEtiqueta, [idRegistro, nome]);
            });

            return Promise.all(insercoes).then(function () {
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

module.exports = {
    registrar,
    listar
};