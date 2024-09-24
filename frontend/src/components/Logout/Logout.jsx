import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Logout = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { username, password },
        { withCredentials: true } // Cette option inclut les cookies dans la requête
      );

      if (response.data.success) {
        console.log("Connexion réussie, token stocké dans le cookie");
        // Pas besoin de manipuler le token manuellement
      } else {
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

export default Logout;
