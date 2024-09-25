const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

// Créer une nouvelle tâche
router.post("/tasks", tasksController.createTask);

// Récupérer toutes les tâches
router.get("/tasks", tasksController.getAllTasks);

// Récupérer une tâche par ID
router.get("/tasks/:id", tasksController.getTaskById);

// Mettre à jour une tâche
router.put("/tasks/:id", tasksController.updateTask);

// Supprimer une tâche
router.delete("/tasks/:id", tasksController.deleteTask);

module.exports = router;
