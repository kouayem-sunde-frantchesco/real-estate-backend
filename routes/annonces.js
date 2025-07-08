router.get('/annonces-consultees/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
        //  consultation est une table qui stocke chaque consultation avec user_id, biens_id, date_consultation, etc.
      'SELECT titre, ville, prix, date_consultation FROM consultations WHERE user_id = $1 ORDER BY date_consultation DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
