const express = require("express");
const router = express.Router();
const checkout = require('../controllers/checkout.controller')
const {authenticate} =require('../middlewares/auth.middlesware')
const csrfProtection = require('../middlewares/csurf.middleware');
const webhook = require('../controllers/stripeWebhook.controller')

router.post('/create-checkout-session',authenticate, checkout.createPaymentIntent)
router.post ('/webhook', webhook.connectWebhook)

module.exports = router;
