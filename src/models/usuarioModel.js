// usuarioModel.js

var database = require("../database/config")

function autenticar(email) {
    var instrucaoSql = `
        SELECT idCadastro, nome, email, senha FROM cadastro WHERE email = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [email]);
}

function cadastrar(nome, email, senha,) {
    var instrucaoSql = `
        INSERT INTO cadastro (nome, email, senha) VALUES (?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, email, senha]);
}

module.exports = {
    autenticar,
    cadastrar
};