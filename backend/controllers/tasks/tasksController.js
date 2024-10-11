import Task from "../../models/Task.js";
import User from "../../models/User.js";

// Créer une tâche
export const createTask = async (req, res) => {
  try {
    const { text, completed, addByAdmin, ownerId } = req.body;

    // Rechercher l'utilisateur propriétaire de la tâche
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Créer la tâche
    const newTask = new Task({
      text,
      completed: completed || false,
      addByAdmin: addByAdmin || false,
      owner: owner._id,
    });

    // Sauvegarder la tâche dans la base de données
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la création de la tâche", error });
  }
};
// Récupérer toutes les tâches d'un utilisateur
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.params.id; // Récupérer l'ID utilisateur depuis les paramètres de l'URL
    const tasks = await Task.find({ owner: userId }); // Récupérer les tâches de l'utilisateur
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches", error);
    res.status(500).json({ message: "Erreur lors de la récupération des tâches", error });
  }
};
// Récupérer toutes les tâches
export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("owner"); // Optionnel: utiliser populate pour récupérer l'utilisateur
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des tâches", error });
  }
};

// Récupérer une tâche par ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("owner");
    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de la tâche", error });
  }
};

// Mettre à jour une tâche
export const updateTask = async (req, res) => {
  try {
    const { text, completed, addByAdmin } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      {
        text,
        completed,
        addByAdmin,
      },
      { new: true } // Retourner la tâche mise à jour
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la tâche", error });
  }
};

// Supprimer une tâche
export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de la tâche", error });
  }
};

// Récupérer tous les utilisateurs avec leurs tâches respectives (réservé aux administrateurs)
export const getAllUsersWithTasks = async (req, res) => {
  try {
    // Récupérer tous les utilisateurs
    const users = await User.find({});

    // Filtrer les utilisateurs pour exclure les admins
    const nonAdminUsers = users.filter((user) => !user.roles.includes("admin"));

    // Récupérer les tâches pour chaque utilisateur non-admin
    const usersWithTasks = await Promise.all(
      nonAdminUsers.map(async (user) => {
        const tasks = await Task.find({ owner: user._id }); // Récupère les tâches par utilisateur
        return {
          _id: user._id,
          username: user.username,
          tasks,
        };
      })
    );

    res.status(200).json(usersWithTasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs et des tâches", error });
  }
};
