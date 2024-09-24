// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Vérification que les deux champs sont fournis
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Nom d'utilisateur et mot de passe requis" });
  }

  try {
    // Vérification si l'utilisateur existe
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Vérifier si le mot de passe est correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }

    // Créer un token JWT pour l'utilisateur
    const token = jwt.sign({ userId: user._id }, "votre_secret_jwt", { expiresIn: "1h" });

    // Stocker le token dans un cookie HTTP-only
    res.cookie("token", token, {
      httpOnly: true, // Empêche l'accès par JavaScript
      secure: true, // Utilisé uniquement en HTTPS
      sameSite: "strict", // Renforce la sécurité en limitant le partage intersite
      maxAge: 3600000, // Expire au bout de 1h
    });

    res.status(200).json({ success: true, message: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token"); // Supprime le cookie en le vidant
  res.status(200).json({ success: true, message: "Déconnexion réussie" });
};
