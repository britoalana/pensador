const express = require("express");
const router = express.Router();

//controller
const ToughtController = require("../controllers/ToughtController");

//importar middleware de verificação de usuário
const checkAuth = require("../helpers/auth").checkAuth;

router.get("/dashboard", ToughtController.dashboard);
router.get("/add", checkAuth, ToughtController.createTought)
router.post("/add", checkAuth, ToughtController.createToughtSave)
router.get('/edit/:id', checkAuth, ToughtController.editTought)
router.post('/edit', checkAuth, ToughtController.editToughtSave)
router.post("/delete", checkAuth, ToughtController.deleteToughts)
router.get("/", ToughtController.showToughts);

module.exports = router;
