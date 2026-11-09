// diarioModel.js
var database = require("../database/config")

function registrar(dataRegistro, emocao, intensidade, registro, etiqueta, fkCadastro) {
        var instrucaoSql = `
            INSERT INTO diarioEmocional (dataRegistro, emocao, intensidade, registro, etiqueta, fkCadastro) VALUES (?, ?, ?, ?, ?, ?);
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql, [dataRegistro, emocao, intensidade, registro, etiqueta, fkCadastro]);
}

module.exports = {
    registrar,
};