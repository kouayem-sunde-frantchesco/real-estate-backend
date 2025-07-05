const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.get('/home', authenticate, (req, res) => {
  res.json({ message: "Bienvenue sur le site web Luxis Home Camer !" });
});

module.exports = router;
