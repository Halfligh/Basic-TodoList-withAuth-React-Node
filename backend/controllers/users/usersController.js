const User = require("../../models/User");

exports.createUser = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    roles: roles || ["user"],
  });

  user
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Obtenir tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

// Obtenir un utilisateur spécifique
exports.getOneUser = (req, res, next) => {
  User.findOne({ _id: req.params.id })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json({ error }));
};
