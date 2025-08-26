const jwt = require('jsonwebtoken');
const Site = require('../models/Site'); 
const SECRET = process.env.JWT_SECRET || 'secretKey';

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (username === 'Admin' && password === 'admin123') {
      const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '1h' });
      return res.json({ token, role: 'admin' });
    }

    const site = await Site.findOne({
      operateurs: {
        $elemMatch: { emailOperateur: username, passwordOperateur: password }
      }
    });

    if (!site) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const operateur = site.operateurs.find(op => op.emailOperateur === username && op.passwordOperateur === password);
    const token = jwt.sign(
      { 
        role: 'operateur', 
        email: username, 
        siteId: site._id,
        nomOperateur: operateur.nomOperateur || 'Inconnu',
        prenomOperateur: operateur.prenomOperateur || 'Inconnu'
      },
      SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: 'operateur', nomOperateur: operateur.nomOperateur || 'Inconnu', prenomOperateur: operateur.prenomOperateur || 'Inconnu' });
  } catch (err) {
    console.error('Erreur de login :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { login };