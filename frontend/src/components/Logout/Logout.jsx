import React, { useState } from "react";
import axios from "axios";

const Logout = ({ onLogout }) => {
  const [error, setError] = useState(null); // État pour le message d'erreur

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/logout", {}, { withCredentials: true });
      onLogout(); // Appelle la fonction onLogout pour informer le parent
    } catch (error) {
      setError("Erreur lors de la déconnexion"); // Mettre à jour l'état d'erreur
    }
  };

  return (
    <div>
      <button className="common-button" onClick={handleLogout}>
        Déconnexion
      </button>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Affichage conditionnel du message d'erreur */}
    </div>
  );
};

export default Logout;
