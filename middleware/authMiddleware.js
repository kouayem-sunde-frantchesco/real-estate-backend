const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: "Accès refusé. Aucun token fourni." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // tu peux accéder à req.user dans tes routes
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token invalide." });
  }
};

module.exports = authenticate;
