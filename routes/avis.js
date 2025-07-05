// avis.routes.js
const express = require("express");
const router = express.Router();
const pool = require("./db");

// ✅ Enregistrer un avis
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Tous les champs sont requis." });
  }

  try {
    const result = await pool.query(
      "INSERT INTO avis (name, email, message, created_at) VALUES ($1, $2, $3, NOW()) RETURNING *",
      [name, email, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Erreur lors de l'enregistrement :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Récupérer tous les avis
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM avis ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Erreur récupération :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Supprimer un avis
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const check = await pool.query("SELECT * FROM avis WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Avis non trouvé." });
    }

    await pool.query("DELETE FROM avis WHERE id = $1", [id]);
    res.json({ message: "Avis supprimé avec succès" });
  } catch (err) {
    console.error("Erreur suppression :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// ✅ Modifier un avis
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, message } = req.body;

  try {
    const result = await pool.query(
      "UPDATE avis SET name = $1, email = $2, message = $3 WHERE id = $4 RETURNING *",
      [name, email, message, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Avis non trouvé." });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Erreur modification :", err.message);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
