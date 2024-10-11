import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth/authRoutes.js";
import usersRoutes from "./routes/users/usersRoutes.js";
import tasksRoutes from "./routes/tasks/tasksRoutes.js";
import initInitialUsers from "./scripts/initInitialUsers.js";

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

export default app;
