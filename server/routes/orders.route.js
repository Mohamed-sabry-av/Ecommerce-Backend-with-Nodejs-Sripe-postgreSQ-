const express = require("express");
const router = express.Router();
const order = require("../controllers/orders.controller");
const {authenticate,adminMiddleware} =require('../middlewares/auth.middlesware')
const csrfProtection = require('../middlewares/csurf.middleware');

router.post("/",authenticate, order.createOrder);
router.get("/",csrfProtection,authenticate,adminMiddleware, order.getOrders);
router.get("/:id",csrfProtection, authenticate, order.getOrderById);
router.put("/edit/:id",csrfProtection,authenticate, order.updateOrderStatus);
router.post("/webhook", express.raw({ type: "application/json" }), order.handleStripeWebhook); 


module.exports = router;
