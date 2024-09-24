import React, { useState } from "react";
import axios from "axios";
import "./Login.css";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        { username, password },
        { withCredentials: true } // inclure les cookies
      );

      if (response.data.success) {
        onLogin(); // Appelle de la fonction onLogin pour informer le parent
      } else {
        setErrorMessage("Identifiant ou mot de passe incorrect");
      }
    } catch (error) {
      setErrorMessage("Une erreur est survenue lors de la connexion.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Identifiant:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input
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
