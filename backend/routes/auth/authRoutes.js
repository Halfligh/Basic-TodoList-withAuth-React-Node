import express from "express";
import { login, verifyToken, logout } from "../../controllers/auth/authController.js";

const router = express.Router();

// Route pour la connexion d'un utilisateur
router.post("/login", login);

// Route pour vérifier la validité du token
router.get("/verifyToken", verifyToken);

// Route pour la déconnexion
router.post("/logout", logout);

export default router;
