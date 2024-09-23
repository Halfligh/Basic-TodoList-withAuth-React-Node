// backend/initAdminUser.js
const User = require("./models/User"); // Import du modèle User
const bcrypt = require("bcrypt");

async function initAdminUser() {
  try {
    // Vérifier si l'utilisateur admin existe déjà
    const adminExists = await User.findOne({ username: "admin" });

    if (!adminExists) {
      // Si l'utilisateur admin n'existe pas, le créer
      const passwordHash = await bcrypt.hash("admin", 10); // Hacher le mot de passe

      const adminUser = new User({
        username: "admin",
        password: passwordHash,
      });

      await adminUser.save(); // Sauvegarder l'utilisateur admin dans la base de données
      console.log("Admin user created successfully.");
    } else {
      console.log("Admin user already exists.");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
}

module.exports = initAdminUser;
