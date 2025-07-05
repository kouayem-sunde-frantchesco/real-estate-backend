const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ✅ Contrôleur d'authentification
const authenticate = require('../middleware/authMiddleware');   // ✅ Middleware d'authentification

// ✅ Route pour s'inscrire
router.post('/signup', authController.registerUser);

// ✅ Route pour se connecter
router.post('/login', authController.loginUser);

// ✅ Route pour mot de passe oublié
router.post('/forgot-password', authController.forgotPassword);

// ✅ Exemple de route protégée : nécessite un token JWT
router.get('/services', authenticate, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé aux services' });
});

module.exports = router;
