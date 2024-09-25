// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Connexion d'un utilisateur
// backend/controllers/authController.js
exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Comparer le mot de passe avec le hash stocké
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }

    // Créer un token JWT
    const token = jwt.sign({ userId: user._id }, "votre_secret_jwt", { expiresIn: "1h" });

    // Stocker le token dans un cookie
    res.cookie("token", token, {
      // httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Activer seulement en production
      sameSite: "Strict",
      maxAge: 60 * 60 * 1000, // Expire dans 1 heure
    });

    return res.status(200).json({ success: true, message: "Connexion réussie" });
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
    return res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

exports.verifyToken = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ success: false, message: "Token manquant" });
  }

  try {
    const decoded = jwt.verify(token, "votre_secret_jwt");
    res.status(200).json({ success: true, decoded });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    res.status(500).json({ success: false, message: "Token invalide ou expiré" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token"); // Vide le cookie qui donc se supprime
  res.status(200).json({ success: true, message: "Déconnexion réussie" });
};
