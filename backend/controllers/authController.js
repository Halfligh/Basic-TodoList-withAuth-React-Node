// backend/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Vérifie si l'utilisateur existe dans la base de données
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ success: false, message: "Utilisateur non trouvé" });
    }

    // Vérifie si le mot de passe est correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Mot de passe incorrect" });
    }

    // Crée un token JWT pour l'utilisateur
    const token = jwt.sign({ userId: user._id }, "votre_secret_jwt", { expiresIn: "1h" });

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: "Erreur serveur" });
  }
};
