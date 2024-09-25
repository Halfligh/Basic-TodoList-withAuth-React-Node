import axios from "axios";

// URL de base de l'API (à ajuster en fonction de votre environnement)
export const API_BASE_URL = "http://localhost:3001";

// Fonction pour récupérer toutes les tâches
export const getAllTasks = () => {
  return axios.get(`${API_BASE_URL}/api/tasks`);
};

// Fonction pour récupérer une tâche par ID
export const getTaskById = (taskId) => {
  return axios.get(`${API_BASE_URL}/api/tasks/${taskId}`);
};

// Fonction pour créer une nouvelle tâche
export const createTask = (taskData) => {
  return axios.post(`${API_BASE_URL}/api/tasks`, taskData, { withCredentials: true });
};

// Fonction pour mettre à jour une tâche existante
export const updateTask = (taskId, updatedData) => {
  return axios.put(`${API_BASE_URL}/api/tasks/${taskId}`, updatedData);
};

// Fonction pour supprimer une tâche
export const deleteTask = (taskId) => {
  return axios.delete(`${API_BASE_URL}/api/tasks/${taskId}`);
};
