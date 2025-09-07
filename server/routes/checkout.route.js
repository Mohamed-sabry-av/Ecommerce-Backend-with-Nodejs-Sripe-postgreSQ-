const express = require("express");
const router = express.Router();
const checkout = require('../controllers/checkout.controller')
const {authenticate} =require('../middlewares/auth.middlesware')

router.post('/create-checkout-session', checkout.createCheckout)

module.exports = router;
