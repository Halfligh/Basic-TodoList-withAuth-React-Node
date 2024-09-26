const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

// Créer une nouvelle tâche
router.post("/create", tasksController.createTask);

// Récupérer toutes les tâches
router.get("/", tasksController.getAllTasks);

// Récupérer une tâche par ID
router.get("/:id", tasksController.getTaskById);

// Mettre à jour une tâche
router.put("/:id", tasksController.updateTask);

// Supprimer une tâche
router.delete("/:id", tasksController.deleteTask);

module.exports = router;
