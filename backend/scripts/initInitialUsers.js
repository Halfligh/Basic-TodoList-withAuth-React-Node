// backend/initAdminUser.js
const User = require("../models/User");

async function createUserIfNotExists(username, password) {
  try {
    const userExists = await User.findOne({ username });
    if (!userExists) {
      const newUser = new User({
        username,
        password,
      });
      await newUser.save();
      console.log(`L'utilisateur ${username} a bien été créé.`);
    } else {
      console.log(`L'utilisateur ${username} existe déjà.`);
    }
  } catch (error) {
    console.error(`Erreur en voulant créer l'utilisateur${username}:`, error);
  }
}

async function initInitialUsers() {
  try {
    // Créer l'utilisateur admin
    await createUserIfNotExists("admin", "admin");

    // Créer l'utilisateur JohnDoe
    await createUserIfNotExists("JohnDoe", "Doe");

    // Créer l'utilisateur MelanieDoe
    await createUserIfNotExists("MelanieDoe", "Doe");
  } catch (error) {
    console.error("Error initializing users:", error);
  }
}

module.exports = initInitialUsers;
