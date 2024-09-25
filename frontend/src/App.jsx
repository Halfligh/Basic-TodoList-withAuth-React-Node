import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import { checkCookieStatus } from "./services/cookie/cookieService";

import TodoList from "./components/TodoList/TodoList";

// Fonction utilitaire pour vérifier la présence du cookie "token"
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false); // État pour savoir si l'authentification a été vérifiée

  // Surveillance de l'authentification
  useEffect(() => {
    const fetchAuthStatus = async () => {
      const { isAuthenticated } = await checkCookieStatus();
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

  return (
    <div className="App">
      <div className={!isAuthenticated ? "App-intro" : "App-intro-signed"}>
        <img src={logo} className={!isAuthenticated ? "App-logo" : "App-logo-signed"} alt="logo" />
        <p>
          {isAuthenticated
            ? "Bienvenue, vous êtes connecté."
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

      <div className={isAuthenticated ? "App-content-expanded" : "App-content"}>
        <section className="login-section">
          {isAuthenticated ? (
            <div className="profile-logout">
              <p>Voici votre Todo-list.</p>
              <Logout onLogout={handleLogout} />
            </div>
          ) : (
            <Login onLogin={handleLogin} /> // Passe handleLogin en prop
          )}
        </section>
        {isAuthenticated ? (
          <section className="todo-list-section">
            <TodoList />
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default App;
