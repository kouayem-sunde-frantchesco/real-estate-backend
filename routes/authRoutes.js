const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController'); // ✅ Contrôleur d'authentification
const authenticate = require('../middleware/authMiddleware');   // ✅ Middleware d'authentification
const multer = require('multer');
const upload = multer(); // pour parser le multipart/form-data en mémoire


// cette route permet de /auth/login en GET est pour vérifier que le routeur fonctionne,
router.get('/login', (req, res) => {
  res.send('Route GET /auth/login fonctionne, mais utilise POST pour t’authentifier');
});


// ✅ Route pour s'inscrire
router.post('/signup', authController.registerUser);

// ✅ Route pour se connecter
router.post('/login', authController.loginUser);

// ✅ Route pour mot de passe oublié
router.post('/forgot-password', authController.forgotPassword);

// ✅ Route protégée : nécessite un token JWT
router.get('/services', authenticate, (req, res) => {
  res.status(200).json({ message: 'Accès autorisé aux services' });
});

router.post("contrat", upload.single("pdf"), async (req, res) => {
  
});

module.exports = router;
