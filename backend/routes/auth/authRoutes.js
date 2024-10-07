const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth/authController");

// Route pour la connexion d'un utilisateur
router.post("/login", authController.login);

// Route pour vérifier la validité du token
router.get("/verifyToken", authController.verifyToken);

// Route pour la déconnexion
router.post("/logout", authController.logout);

module.exports = router;
