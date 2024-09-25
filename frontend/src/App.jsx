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
      <div className="App-content">
        <div className={!isAuthenticated ? "App-intro" : "App-intro-Signed"}>
          <img
            src={logo}
            className={!isAuthenticated ? "App-logo" : "App-logo-signed"}
            alt="logo"
          />
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
              <>
                <Logout onLogout={handleLogout} />
                <TodoList />
              </>
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
