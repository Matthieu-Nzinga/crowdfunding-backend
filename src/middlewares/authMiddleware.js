const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  // Ne pas appliquer ce middleware sur la route /login
  if (req.path === '/login') {
    return next(); // Passe à la prochaine fonction sans vérifier le token
  }

  const token = req.header('Authorization')?.split(' ')[1]; // Récupère le token du header

  if (!token) {
    return res.status(401).json({ error: "Accès non autorisé. Token manquant." });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }

    req.user = user; // Ajoute l'utilisateur à la requête
    next(); // Passe à la prochaine fonction
  });
};

module.exports = { authenticateToken };

