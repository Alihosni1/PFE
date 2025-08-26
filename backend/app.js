const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const siteRoutes = require('./routes/siteRoutes');
const commandeRoutes = require('./routes/commandeRoutes');

require('dotenv').config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Tester la route racine (facultatif)
/*app.get('/', (req, res) => {
  res.send('API Sites/Commandes/Proprietaires opérationnelle');
});*/

app.use('/api', authRoutes);
app.use('/api', siteRoutes);
app.use('/api', commandeRoutes);

module.exports = app;