// déclaration des routes dans le serveur pour le authRoute
//  vue que c'est la qu'est definie toute les routes api des fonctionnalités du site 

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/authRoutes');
const avisRoutes = require('./avis.routes');
const rendezvous = require('./routes/rendezvous');

app.use(cors());
app.use(express.json());

app.use(dashboardRoutes);
app.use('/auth', authRoutes);
app.use('/avis', avisRoutes);
app.use('/rendezvous', rendezvous);

app.listen(PORT, () => {
  console.log(`✅ Serveur actif sur http://localhost:${PORT}`);
});
