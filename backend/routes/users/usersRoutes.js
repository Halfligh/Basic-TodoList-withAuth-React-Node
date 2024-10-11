import express from "express";
import { getAllUsers, getOneUser } from "../../controllers/users/usersController.js";

const router = express.Router();

// Route pour obtenir tous les utilisateurs
router.get("/getAllUsers", getAllUsers);

// Route pour obtenir un utilisateur spécifique
router.get("/getOneUser/:id", getOneUser);

export default router;
