const express = require("express");
const router = express.Router();
const cart = require("../controllers/cart.controller");
const {authenticate} =require('../middlewares/auth.middlesware')

router.post("/",authenticate, cart.createCart);
router.get("/",authenticate, cart.getCart);
router.delete("/clear",authenticate, cart.clearCart);
router.delete("/:id",authenticate, cart.removeFromCart);
router.put("/:id",authenticate, cart.editCartItem);

module.exports = router;
