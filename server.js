const express = require('express');
const cors = require('cors');
require('dotenv').config();


console.log('🔗 DATABASE_URL =', process.env.DATABASE_URL);


// 1️⃣ Import du client PostgreSQL
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const app = express();
const PORT = process.env.PORT || 4000;

const dashboardRoutes = require('./routes/dashboard');
const authRoutes      = require('./routes/authRoutes');
const avisRoutes      = require('./avis.routes');
const rendezvous      = require('./routes/rendezvous');
const contrat         = require('./routes/contratRoutes');

app.use(cors());
app.use(express.json());

// Routes principales
app.use(dashboardRoutes);
app.use('/auth', authRoutes);
app.use('/avis', avisRoutes);
app.use('/rendezvous', rendezvous);
app.use('/contratRoutes', contrat);

// 2️⃣ Route de test de la base PostgreSQL
app.get('/test-db', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    res.json({ now: rows[0].now });
  } catch (err) {
    console.error('Erreur test-db:', err);
    res.status(500).send('Erreur de connexion à la base de données');
  }
});

// Route racine de vérification
app.get('/', (req, res) => {
  res.send('✅ API real-estate-backend en ligne avec succès 🚀');
});

app.listen(PORT, () => {
  console.log(`✅ Serveur actif sur http://localhost:${PORT}`);
});
