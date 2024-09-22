// src/components/Login.js
import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = () => {
  // États pour stocker l'identifiant et le mot de passe
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault(); // Empêche la soumission par défaut du formulaire
    try {
      // Requête POST vers l'API Node.js pour l'authentification
      const response = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });

      if (response.data.success) {
        // Gestion du succès : redirection, stockage du token, etc.
        console.log("Connexion réussie");
      } else {
        // Affiche un message d'erreur si la connexion échoue
        setErrorMessage("Identifiant ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion", error);
      setErrorMessage("Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Identifiant:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="common-button" type="submit">
          Connexion
        </button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
