const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// ✅ Inscription
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: "Utilisateur enregistré avec succès", user: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Connexion
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ✅ Mot de passe oublié
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email requis" });
  }

  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "Aucun utilisateur trouvé avec cet email" });
    }

    // 👉 Ici tu peux générer un token de reset + envoyer un email (à implémenter plus tard)
    res.status(200).json({ message: "Si cet email existe, un lien de réinitialisation a été envoyé." });

  } catch (error) {
    console.error("Erreur forgotPassword :", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};
