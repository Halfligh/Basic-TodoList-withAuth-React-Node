import User from "../../models/User.js";

// Obtenir tous les utilisateurs
export const getAllUsers = (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => {
      console.error("Erreur lors de la récupération des utilisateurs", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération des utilisateurs" });
    });
};

// Obtenir un utilisateur spécifique
export const getOneUser = (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      res.status(200).json(user);
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de l'utilisateur", error);
      res.status(500).json({ message: "Erreur serveur lors de la récupération de l'utilisateur" });
    });
};
