const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
// const winstonLog = require("./middlewares/winston-config");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");

const initAdminUser = require("./scripts/initAdminUser");

const path = require("path");

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

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Ajouter le type MIME pour les fichiers .gltf
express.static.mime.define({ "model/gltf+json": ["gltf"] });

// Configuration du middleware CORS pour autoriser les requêtes depuis localhost:3000
app.use(
  cors({
    origin: "http://localhost:3000", // URL du frontend d'où proviennent les requêtes
    credentials: true,
  })
);

// Activer bodyParser pour traiter les requêtes JSON
app.use(bodyParser.json());

//ajoute plusieurs en-têtes HTTP pour augmenter la sécurité : empêche XSS, assure que req faîtes sur https, frameguard aide à lutter contre clickjacking etc
// app.use(
//   helmet.contentSecurityPolicy({
//     directives: {
//       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//       "img-src": ["'self'", "data:", "blob:", "https://*.tile.openstreetmap.org/"],
//     },
//   })
// );

app.use("/api/auth", authRoutes); // Routes d'authentification
app.use("/api/users", userRoutes); // Routes pour la gestion des utilisateurs

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.use((req, res, next) => {
  console.log(`Received request: ${req.method} ${req.originalUrl}`);
  next();
});

//Seulement pour le développement - Tester fonctionnement de winston - http://localhost:3000/test-error
// app.get("/test-error", (req, res, next) => {
//   next(new Error("Test error in dev mode"));
// });

// Journalisation avec Winston
// app.use((err, req, res, next) => {
//   winstonLog.error(
//     `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`
//   );
//   next(err);
// });

// Affichage des erreurs à la console
app.use((err, req, res, next) => {
  console.error(err);
  next(err);
});

// Envoi de la réponse d'erreur
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: "Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.",
  });
});

module.exports = app;
