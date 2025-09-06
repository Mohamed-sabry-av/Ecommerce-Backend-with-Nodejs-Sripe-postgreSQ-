const express = require("express");
const router = express.Router();
const USERS = require("../controllers/users.controller");

const {login} = require("../controllers/auth.controller");

router.post("/", USERS.createUser);
router.get("/", USERS.getUsers);

router.post('/login',login)

module.exports = router;
