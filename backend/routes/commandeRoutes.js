const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/commandes', verifyToken, (req, res) => {
  if (req.user.role !== 'operateur' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux admins et opérateurs' });
  }
  commandeController.createCommande(req, res);
});

router.get('/commandes', verifyToken, (req, res) => {
  if (req.user.role !== 'operateur' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux admins et opérateurs' });
  }
  commandeController.getCommandes(req, res);
});

router.get('/commandes/site/:siteId', verifyToken, (req, res) => {
  if (req.user.role !== 'operateur' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Accès réservé aux admins et opérateurs' });
  }
  commandeController.getCommandesBySite(req, res);
});

module.exports = router;