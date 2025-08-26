const express = require('express');
const router = express.Router();
const { createSite, getSites, updateSite, updateSiteStatus, getActiveSites, addOperateur } = require('../controllers/siteController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/sites', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  getSites(req, res);
});

router.get('/active-sites', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  getActiveSites(req, res);
});

router.post('/sites', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  createSite(req, res);
});

router.put('/sites/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  updateSite(req, res);
});

router.put('/sites/:id/status', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  updateSiteStatus(req, res);
});

router.post('/sites/:siteId/operateurs', verifyToken, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Accès réservé aux admins' });
  addOperateur(req, res);
});

module.exports = router;