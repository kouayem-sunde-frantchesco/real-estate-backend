const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const pool = require("../db"); // ← ton fichier de connexion PostgreSQL

const upload = multer();

// ✅ ROUTE POST : Sauvegarder et envoyer un contrat PDF
router.post(
  "/contratRoutes",
  upload.single("pdf"),
  [
    body("email").isEmail().withMessage("Email invalide"),
    body("nom").notEmpty().withMessage("Nom requis"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, nom } = req.body;
    const pdfBuffer = req.file.buffer;
    const filename = `contrat-${Date.now()}.pdf`;
    const filepath = path.join(__dirname, "../uploads/", filename);

    try {
      // 1. Enregistrer le fichier dans /uploads
      fs.writeFileSync(filepath, pdfBuffer);

      // 2. Enregistrer les métadonnées dans PostgreSQL
      await pool.query(
        "INSERT INTO contrats(nom, email, fichier, date_creation) VALUES ($1, $2, $3, NOW())",
        [nom, email, filename]
      );

      // 3. Envoyer par email avec pièce jointe
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "kouayemfrantchesco@gmail.com",
          pass: "ecwmznogzkuvlqlb"
        },
      });

      const mailOptions = {
        from: "kouayemfrantchesco@gmail.com",
        to: email,
        subject: "Votre contrat de vente de terrain",
        text: `Bonjour ${nom}, veuillez trouver ci-joint votre contrat au format PDF.`,
        attachments: [
          {
            filename: filename,
            content: pdfBuffer
          }
        ]
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: "Contrat envoyé et enregistré avec succès." });
    } catch (error) {
      console.error("Erreur:", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  }
);

module.exports = router;
