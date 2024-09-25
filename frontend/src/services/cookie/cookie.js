// services/authService.js
import axios from "axios";
import { getCookie } from "../../utils/cookie"; // Import de la fonction utilitaire pour les cookies

export const checkCookieStatus = async () => {
  const token = getCookie("token");
  if (!token) {
    console.log("Aucun cookie présent, utilisateur non authentifié");
    return { isAuthenticated: false };
  }

  try {
    const response = await axios.get("http://localhost:3001/api/auth/verifyToken", {
      withCredentials: true,
    });

    if (response.data.success) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.log("Utilisateur non authentifié");
    } else {
      console.error("Erreur lors de la vérification du token", error);
    }
    return { isAuthenticated: false };
  }
};
