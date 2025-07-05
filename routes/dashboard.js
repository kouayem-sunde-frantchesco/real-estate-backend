const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.get('/dashboard', authenticate, (req, res) => {
  const user = req.user; // ID + email depuis le middleware

  res.status(200).json({
    user: {
      id: user.userId,
      name: user.name || "Utilisateur",
      email: user.email,
      annonces: ['Maison à vendre à Douala', 'Appartement à Yaoundé'],
      favoris: ['Studio Bonabéri', 'Villa Bastos'],
      notifications: ['Nouvelle annonce publiée', 'Votre annonce a été aimée'],
    }
  });
});

module.exports = router;
