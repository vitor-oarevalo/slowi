// diarioModel.js
var database = require("../database/config")

function registrar(dataRegistro, emocao, intensidade, registro, etiqueta, fkCadastro) {
        var instrucaoSql = `
            INSERT INTO diarioEmocional (dataRegistro, emocao, intensidade, registro, etiqueta, fkCadastro) VALUES (?, ?, ?, ?, ?, ?);
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql, [dataRegistro, emocao, intensidade, registro, etiqueta, fkCadastro]);
}

function listar(fkCadastro) {
    var instrucaoSql = `
        SELECT idDiarioEmocional, DATE_FORMAT(dataRegistro, '%Y-%m-%d %H:%i:%s') AS dataRegistro, emocao, intensidade, registro, etiqueta FROM diarioEmocional WHERE fkCadastro = ? ORDER BY dataRegistro DESC;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [fkCadastro]);

}

module.exports = {
    registrar,
    listar
};