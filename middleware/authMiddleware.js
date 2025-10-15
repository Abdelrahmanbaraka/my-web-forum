// /middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user; // { id, username }
    next();
  });
}

// optional: if token present, set req.user; otherwise continue without error
function optionalAuthenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(); // treat as guest if invalid token
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, optionalAuthenticate };
