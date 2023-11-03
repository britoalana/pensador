const express = require("express");
const router = express.Router();

const AuthControlller = require("../controllers/AuthController");

router.get("/login", AuthControlller.login);
router.post("/login", AuthControlller.loginPost);
router.get("/register", AuthControlller.register);
router.post("/register", AuthControlller.registerPost);
router.get("/logout", AuthControlller.logout);

module.exports = router;
