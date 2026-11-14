var express = require("express");
var router = express.Router();

var diarioController = require("../controllers/diarioController");

router.post("/registrar", function (req, res) {
    diarioController.registrar(req, res);
});

router.get("/listar/:fkCadastro", function (req, res) {
    diarioController.listar(req, res);
});

router.put("/atualizar/:fkCadastro/:idRegistro", function (req, res) {
    diarioController.atualizar(req, res);
});

router.delete("/excluir/:fkCadastro/:idRegistro", function (req, res) {
    diarioController.excluir(req, res);
});

module.exports = router;