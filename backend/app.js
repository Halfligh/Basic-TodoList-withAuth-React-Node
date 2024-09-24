const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const initAdminUser = require("./scripts/initAdminUser");

const app = express();

// Connexion à MongoDB
mongoose
  .connect(
    "mongodb+srv://les54yt:4bCjZyiwPhnEjMmw@cluster0.6w5hv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => {
    console.log("Connexion à MongoDB réussie - Bingo!");
    initAdminUser(); // Appele la fonction pour initialiser l'utilisateur admin
  })
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // URL du frontend d'où proviennent les requêtes
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//Routes

app.use("/api/auth", authRoutes); // Routes d'authentification
app.use("/api/users", userRoutes); // Routes pour la gestion des utilisateurs

// Affichage des erreurs à la console
app.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

module.exports = app;
