const express = require('express');
const router = express.Router();
const pool = require('./db');
const nodemailer = require('nodemailer');
require('dotenv').config();

// ✅ Transporteur mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  
});

// ✅ Vérifie la connexion SMTP (utile au démarrage)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Erreur SMTP :', error);
  } else {
    console.log('📬 Serveur SMTP prêt à envoyer les emails');
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // 🔒 Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // 💾 Enregistrement dans PostgreSQL
    const newAvis = await pool.query(
      'INSERT INTO avis (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    // 📧 Préparation email
    const mailOptions = {
      from: `"Luxis Home Camer" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // ✅ Adresse de l'administrateur
      subject: `📩 Nouvel avis de ${name}`,
      html: `
        <h2>📬 Vous avez reçu un nouvel avis</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `,
    };

    // 🚀 Envoi de l'email
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé à ${process.env.ADMIN_EMAIL}`);

    // ✅ Réponse
    res.status(201).json({
      message: 'Avis enregistré et email envoyé',
      data: newAvis.rows[0],
    });
  } catch (error) {
    console.error('❌ Erreur avis/email :', error.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
