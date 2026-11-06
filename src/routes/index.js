var express = require("express");
var router = express.Router();

router.get("/", function (req, res) {
    res.redirect("/pages/landing-page.html");
});

module.exports = router;