// Middleware pour vérifier le rôle d'un utilisateur
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res.status(403).json({ message: "Accès refusé. Aucune information sur les rôles." });
    }

    // Vérifie si l'utilisateur a l'un des rôles requis
    const hasRole = req.user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      return res
        .status(403)
        .json({ message: "Accès refusé. Vous n'avez pas les permissions requises." });
    }

    next();
  };
};

module.exports = verifyRole;
