// backend/initAdminUser.js
import User from "../models/User.js";

async function createUserIfNotExists(username, password, roles) {
  try {
    const userExists = await User.findOne({ username });
    if (!userExists) {
      const newUser = new User({
        username,
        password,
        roles,
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
    await createUserIfNotExists("admin", "admin", "admin");

    // Créer l'utilisateur JohnDoe
    await createUserIfNotExists("JohnDoe", "Doe", "user");

    // Créer l'utilisateur MelanieDoe
    await createUserIfNotExists("MelanieDoe", "Doe", "user");
  } catch (error) {
    console.error("Error initializing users:", error);
  }
}

export default initInitialUsers;
