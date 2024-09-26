const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const tasksRoutes = require("./routes/tasksRoutes");
const initInitialUsers = require("./scripts/initInitialUsers");

const app = express();

// Capture des logs des appels réalisés à l'api
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://les54yt:4bCjZyiwPhnEjMmw@cluster0.6w5hv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connexion à MongoDB réussie - Bingo!");
    initInitialUsers(); // Appele la fonction qui fait office de CommandLineRunner
  })
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Remplace par l'origine de ton frontend (par exemple, localhost:3000)
    methods: ["GET", "POST", "PUT", "DELETE"], // Autoriser les méthodes HTTP que tu utilises
    allowedHeaders: ["Content-Type", "Authorization"], // Autoriser les en-têtes spécifiques
    credentials: true, // Si tu veux autoriser l'envoi de cookies ou d'identifiants
  })
);

app.use(express.json());
app.use(cookieParser());

//Routes

app.use("/api/auth", authRoutes); // Utilisation des routes d'authentification
app.use("/api/users", usersRoutes); // Utilisation des routes pour la gestion des utilisateurs
app.use("/api/tasks", tasksRoutes); // Utilisation des routes pour la gestion des utilisateurs

// Affichage des erreurs à la console
app.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

module.exports = app;
