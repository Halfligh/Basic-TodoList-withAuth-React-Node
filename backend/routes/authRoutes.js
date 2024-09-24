const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Route pour la connexion d'un utilisateur
router.post("/login", authController.login);

module.exports = router;
