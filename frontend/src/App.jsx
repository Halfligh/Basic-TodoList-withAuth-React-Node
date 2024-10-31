import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

import Login from "./components/Login/Login";
import Logout from "./components/Logout/Logout";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import { checkCookieStatus } from "./services/cookie/cookieService";
import { getCookie } from "./utils/cookie";
import { decodeToken } from "./utils/decodeToken";
import TodoList from "./components/TodoList/TodoList";

// Fonction utilitaire pour vérifier la présence du cookie "token"
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);

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

  // Récupérer l'id de l'utilisateur actuel via le token stocké dans le cookie
  useEffect(() => {
    const token = getCookie("token"); // Récupère le token dans le cookie
    if (token) {
      const decodedToken = decodeToken(token);
      setCurrentUser(decodedToken.username);
      setUserRoles(decodedToken.roles);
    }
  }, [isAuthenticated]);

  // Appelée lorsque l'utilisateur se déconnecte
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <div className="General-section">
        <div className={!isAuthenticated ? "App-intro" : "App-intro-signed"}>
          <img
            src={logo}
            className={!isAuthenticated ? "App-logo" : "App-logo-signed"}
            alt="logo"
          />
          <p>
            {isAuthenticated
              ? userRoles.includes("admin")
                ? `Bienvenue, vous êtes connecté(e) en tant qu'administrateur 🎉`
                : `Bienvenue, ${currentUser}, vous êtes connecté(e).`
              : "Veuillez vous connecter pour accéder à votre Todo-list."}
          </p>
          <a
            className={!isAuthenticated ? "App-link" : "App-link-signed"}
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </div>
        <div className={isAuthenticated ? "App-content-expanded" : "App-content"}>
          <div className={"General-content"}>
            <section className={!isAuthenticated ? "login-section" : "logout-section"}>
              {isAuthenticated ? (
                <div className="profile-logout">
                  <p>Voici votre Todo-list.</p>
                  <p>Rôle : {userRoles} </p>
                  <Logout onLogout={handleLogout} />
                </div>
              ) : (
                <Login onLogin={handleLogin} />
              )}
            </section>
            {isAuthenticated ? (
              <section className="todo-list-section">
                <TodoList />
              </section>
            ) : null}
          </div>
        </div>
      </div>

      {isAuthenticated && userRoles.includes("admin") ? (
        <div className="Admin-content">
          <AdminDashboard userRoles={userRoles} />
        </div>
      ) : null}
    </div>
  );
}

export default App;
