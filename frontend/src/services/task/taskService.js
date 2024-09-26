import axios from "axios";

// URL de base de l'API
export const API_BASE_URL = "http://localhost:3001";

// Fonction pour récupérer toutes les tâches
export const getAllTasks = () => {
  return axios.get(`${API_BASE_URL}/api/tasks`);
};

// Fonction pour récupérer toutes les tâches d'un utilisateur
export const getUserTasks = (userId) => {
  return axios.get(`${API_BASE_URL}/api/tasks/user/${userId}`);
};

// Fonction pour récupérer une tâche par ID
export const getTaskById = (taskId) => {
  return axios.get(`${API_BASE_URL}/api/tasks/${taskId}`);
};

// Fonction pour créer une nouvelle tâche
export const createTask = (taskData) => {
  return axios.post(`${API_BASE_URL}/api/tasks/create`, taskData);
};

// Fonction pour mettre à jour une tâche existante
export const updateTask = (taskId, updatedData) => {
  return axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, updatedData);
};

// Fonction pour supprimer une tâche
export const deleteTask = (taskId) => {
  return axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`);
};

// Fonction pour récupérer toutes les tâches liées à chaque utilisateur (réservé aux admins)
export const getAllUsersWithTasks = (id) => {
  return axios.get(`${API_BASE_URL}/api/tasks/usersWithTasks/${id}`);
};
