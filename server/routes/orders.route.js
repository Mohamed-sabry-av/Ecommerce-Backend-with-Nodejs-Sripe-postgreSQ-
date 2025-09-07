const express = require("express");
const router = express.Router();
const order = require("../controllers/orders.controller");
const {authenticate,adminMiddleware} =require('../middlewares/auth.middlesware')
const csrfProtection = require('../middlewares/csurf.middleware');

router.post("/",csrfProtection,authenticate, order.createOrder);
router.get("/",csrfProtection,authenticate,adminMiddleware, order.getOrders);
router.get("/:id",csrfProtection, authenticate, order.getOrderById);
router.put("/edit/:id",csrfProtection,authenticate, order.updateOrderStatus);



module.exports = router;
