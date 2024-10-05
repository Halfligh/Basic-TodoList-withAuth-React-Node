import axios from "axios";
import { getCookie } from "../../utils/cookie"; // Import de la fonction utilitaire pour les cookies

export const checkCookieStatus = async () => {
  const token = getCookie("token");
  if (!token) {
    return { isAuthenticated: false };
  }

  try {
    const response = await axios.get("http://localhost:3001/api/auth/verifyToken", {
      withCredentials: true,
    });

    return { isAuthenticated: response.data.success };
  } catch (error) {
    // Si c'est une erreur 401, renvoyer une erreur d'authentification
    if (error.response && error.response.status === 401) {
      return { isAuthenticated: false, error: "User not authenticated" };
    }

    // Pour toute autre erreur, simplement retourner isAuthenticated: false
    return { isAuthenticated: false, error: "An error occurred" };
  }
};
