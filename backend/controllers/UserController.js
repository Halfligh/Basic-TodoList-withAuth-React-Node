const User = require("../models/User");
// const jwt = require("jsonwebtoken");

exports.createUser = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  user
    .save()
    .then(() => res.status(201).json({ message: "Utilisateur enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Connexion d'un utilisateur
// exports.login = (req, res, next) => {
//   User.findOne({ email: req.body.email })
//     .then((user) => {
//       if (!user) {
//         return res.status(401).json({ error: "Utilisateur non trouvé !" });
//       }
//       bcrypt
//         .compare(req.body.password, user.password)
//         .then((valid) => {
//           if (!valid) {
//             return res.status(401).json({ error: "Mot de passe incorrect !" });
//           }
//           // Inclure userId et functions dans le token
//           const token = jwt.sign(
//             {
//               userId: user._id,
//               id: user.id,
//               first_name: user.first_name,
//             },
//             "RANDOM_TOKEN_SECRET", // Utiliser une clé sécurisée et unique
//             { expiresIn: "24h" }
//           );
//           // Renvoyer le token avec les informations de l'utilisateur
//           res.status(200).json({
//             userId: user._id,
//             id: user.id,
//             token: token,
//             first_name: user.first_name,
//             profilePicture: user.imageUrl,
//           });
//         })
//         .catch((error) => res.status(500).json({ error }));
//     })
//     .catch((error) => res.status(500).json({ error }));
// };

// Obtenir tous les utilisateurs
exports.getAllUsers = (req, res, next) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((error) => res.status(400).json({ error }));
};

// Obtenir un utilisateur spécifique
exports.getOneUser = (req, res, next) => {
  User.findOne({ id: req.params.id })
    .then((user) => res.status(200).json(user))
    .catch((error) => res.status(500).json({ error }));
};
