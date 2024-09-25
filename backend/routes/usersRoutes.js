const express = require("express");
const router = express.Router();
const usersCtrl = require("../controllers/UsersController");

// Route pour créer un utilisateur
router.post("/createUser", usersCtrl.createUser);

// Route pour obtenir tous les utilisateurs
router.get("/getAllUsers", usersCtrl.getAllUsers);

// Route pour obtenir un utilisateur spécifique
router.get("/getOneUser/:id", usersCtrl.getOneUser);

module.exports = router;
