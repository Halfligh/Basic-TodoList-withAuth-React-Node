import axios from "axios";

// URL de base de l'API
export const API_BASE_URL = "http://localhost:3001";

// Fonction pour connecter l'utilisateur
export const loginUser = (user) => {
  return axios.post(`${API_BASE_URL}/api/auth/login`, user);
};

// Fonction pour déconnecter l'utilisateur
export const logoutUser = (user) => {
  return axios.post(`${API_BASE_URL}/api/auth/logout`, user);
};

// Vérification du token via le cookie
export const verifyToken = () => {
  return axios.get(`${API_BASE_URL}/api/auth/verifyToken`, {
    withCredentials: true, // Inclut les cookies dans la requête
  });
};
