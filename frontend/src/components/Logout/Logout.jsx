import React from "react";
import axios from "axios";

const Logout = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/logout", {}, { withCredentials: true });
      onLogout(); // Appelle la fonction onLogout pour informer le parent
    } catch (error) {
      console.error("Erreur lors de la déconnexion", error);
    }
  };

  return (
    <button className="common-button" onClick={handleLogout}>
      Déconnexion
    </button>
  );
};

export default Logout;
