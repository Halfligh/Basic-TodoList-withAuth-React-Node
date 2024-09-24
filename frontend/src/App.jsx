import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import { checkAuthStatus } from "./services/authService";

// Fonction utilitaire pour vérifier la présence du cookie "token"
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // État pour savoir si l'authentification a été vérifiée

  // Surveillance de l'authentification
  useEffect(() => {
    const fetchAuthStatus = async () => {
      const { isAuthenticated } = await checkAuthStatus();
      setIsAuthenticated(isAuthenticated);
      setAuthChecked(true);
    };

    fetchAuthStatus();
  }, []);

  // Appelée lorsque l'utilisateur se connecte avec succès
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Appelée lorsque l'utilisateur se déconnecte
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
