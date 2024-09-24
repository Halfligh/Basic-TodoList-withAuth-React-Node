import axios from "axios";

// URL de base de l'API
export const API_BASE_URL = "http://localhost:3001";

// Fonction pour connecter l'utilisateur
export const loginUser = (user) => {
  return axios.post(`${API_BASE_URL}/api/login`, user);
};

// Vérification du token
// export const verifyToken = (token) => {
//   return axios.get(`${API_BASE_URL}/api/auth/verifyToken`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };
