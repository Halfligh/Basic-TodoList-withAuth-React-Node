import express from "express";
import {
  createTask,
  getAllTasks,
  getAllUsersWithTasks,
  getUserTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../../controllers/tasks/tasksController.js";

const router = express.Router();

// Créer une nouvelle tâche
router.post("/create", createTask);

// Récupérer toutes les tâches
router.get("/", getAllTasks);

// Route pour récupérer tous les utilisateurs avec leurs tâches
router.get("/allUsersWithTasks", getAllUsersWithTasks);

// Récupérer toutes les tâches d'un utilisateur
router.get("/user/:id", getUserTasks);

// Récupérer une tâche par ID
router.get("/:id", getTaskById);

// Mettre à jour une tâche
router.put("/:id", updateTask);

// Supprimer une tâche
router.delete("/:id", deleteTask);

export default router;
