const express = require("express");
const router = express.Router();

const { getPizzaOptions, getPizzas } = require("../controllers/pizzaController");

router.get("/", getPizzas);
router.get("/options", getPizzaOptions);

module.exports = router;