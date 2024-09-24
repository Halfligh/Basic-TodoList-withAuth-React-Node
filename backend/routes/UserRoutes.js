const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/UserController");

// Route pour créer un utilisateur
router.post("/createUser", userCtrl.createUser);

// Route pour obtenir tous les utilisateurs
router.get("/getAllUsers", userCtrl.getAllUsers);

// Route pour obtenir un utilisateur spécifique
router.get("/getOneUser/:id", userCtrl.getOneUser);

module.exports = router;
