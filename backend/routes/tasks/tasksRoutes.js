const express = require("express");
const router = express.Router();
const tasksController = require("../../controllers/tasks/tasksController");

// Créer une nouvelle tâche
router.post("/create", tasksController.createTask);

// Récupérer toutes les tâches
router.get("/", tasksController.getAllTasks);

// Route pour récupérer tous les utilisateurs avec leurs tâches
router.get("/allUsersWithTasks", tasksController.getAllUsersWithTasks);

// Récupérer toutes les tâches d'un utilisateur
router.get("/user/:id", tasksController.getUserTasks);

// Récupérer une tâche par ID
router.get("/:id", tasksController.getTaskById);

// Mettre à jour une tâche
router.put("/:id", tasksController.updateTask);

// Supprimer une tâche
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
