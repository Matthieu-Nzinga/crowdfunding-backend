const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  
  if (req.path === '/login') {
    return next(); 
  }

  const token = req.header('Authorization')?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: "Accès non autorisé. Token manquant." });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Token invalide" });
    }

    req.user = user;
    next(); 
  });
};

module.exports = { authenticateToken };

