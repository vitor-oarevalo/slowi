var express = require("express");
var router = express.Router();

var diarioController = require("../controllers/diarioController");

router.post("/registrar", function (req, res) {
    diarioController.registrar(req, res);
});

module.exports = router;