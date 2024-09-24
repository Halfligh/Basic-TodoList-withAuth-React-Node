import logo from "./logo.svg";
import "./App.css";

import axios from "axios";
import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";

// Fonction utilitaire pour vérifier la présence du cookie "token"
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // État pour savoir si l'authentification a été vérifiée

  // Fonction pour vérifier l'authentification
  const checkAuthStatus = async () => {
    // Vérifie d'abord si le cookie "token" existe
    const token = getCookie("token");
    if (!token) {
      console.log("Aucun cookie présent, utilisateur non authentifié");
      setIsAuthenticated(false);
      setAuthChecked(true);
      return; // Ne pas exécuter la requête si le cookie est absent
    }
    try {
      const response = await axios.get("http://localhost:3001/api/auth/verifyToken", {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setAuthChecked(true);
      } else {
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Utilisateur non authentifié"); // Affiche le message une seule fois en cas de non-authentification
      } else {
        console.error("Erreur lors de la vérification du token", error);
      }
      setIsAuthenticated(false);
      setAuthChecked(true);
    }
  };

  // Appelé lorsque l'utilisateur se connecte avec succès
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Appelé lorsque l'utilisateur se déconnecte
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="App">
      <div className="App-content">
        <div className="App-intro">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            {isAuthenticated
              ? "Bienvenue, vous êtes connecté. Voici votre Todo-list."
              : "Veuillez vous connecter pour accéder à votre Todo-list."}
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </div>
        <div className="App-components">
          <section className="login-section">
            {isAuthenticated ? (
              <Logout onLogout={handleLogout} /> // Passe handleLogout en prop
            ) : (
              <Login onLogin={handleLogin} /> // Passe handleLogin en prop
            )}
          </section>
          <section className="todo-list-section"></section>
          <section className="admin-view-section"></section>
        </div>
      </div>
    </div>
  );
}

export default App;
