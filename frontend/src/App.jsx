import logo from "./logo.svg";
import "./App.css";

import Login from "./components/Login/Login";

function App() {
  return (
    <div className="App">
      <div className="App-content">
        <div className="App-intro">
          <img src={logo} className="App-logo" alt="logo" />
          <p>Veuillez vous conencter pour accéder à votre Todo-list.</p>
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
            <Login />
          </section>
          <section className="todo-list-section"></section>
          <section className="admin-view-section"></section>
        </div>
      </div>
    </div>
  );
}

export default App;
