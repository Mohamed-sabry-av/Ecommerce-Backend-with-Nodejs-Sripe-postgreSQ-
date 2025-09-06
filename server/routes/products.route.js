const express = require("express");
const router = express.Router();
const products = require("../controllers/products.controller");
const {authenticate,adminMiddleware} =require('../middlewares/auth.middlesware')

router.post("/", authenticate, adminMiddleware, products.createProduct);
router.get("/:id", products.getProductById);
router.delete("/:id", authenticate, adminMiddleware, products.deleteProduct);
router.put("/:id", authenticate, adminMiddleware, products.updateProduct);
router.get("/", products.getProducts);

module.exports = router;
