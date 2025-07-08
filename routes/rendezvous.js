const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');
require('dotenv').config();

// Connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


// ✅ Route GET : liste tous les rendez-vous
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rendezvous ORDER BY date_enregistrement DESC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erreur GET rendezvous :', err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des rendez-vous.' });
  }
});


// ✅ Route POST : prise de rendez-vous avec validation
router.post(
  '/',
  [
    body('nom').notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('telephone').notEmpty().withMessage('Téléphone requis'),
    body('date').isDate().withMessage('Date invalide'),
    body('heure').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Heure invalide'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nom, email, telephone, date, heure } = req.body;

    try {
      // 1. Insertion en base
      await pool.query(
        `INSERT INTO rendezvous (nom, email, telephone, date_rdv, heure_rdv)
         VALUES ($1, $2, $3, $4, $5)`,
        [nom, email, telephone, date, heure]
      );

      // 2. Envoi email à l’admin
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const mailOptions = {
        from: email,
        to: process.env.SMTP_USER,
        subject: 'Nouveau rendez-vous reçu',
        text: `
Nouvelle demande de rendez-vous :

Nom : ${nom}
Email : ${email}
Téléphone : ${telephone}
Date : ${date}
Heure : ${heure}
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Rendez-vous enregistré avec succès.' });
        } catch (err) {
        console.error('Erreur POST rendezvous :', err); // ← ici
        res.status(500).json({ message: "Erreur lors de l'enregistrement du rendez-vous." });
        }
  }
);

module.exports = router;
