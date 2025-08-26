const Site = require('../models/Site');

exports.createSite = async (req, res) => {
  try {
    const site = new Site(req.body);
    await site.save();
    res.status(201).json(site);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getSites = async (req, res) => {
  try {
    const sites = await Site.find();
    res.status(200).json(sites);
  } catch (err) {
    console.error('Erreur lors de la récupération des sites:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getActiveSites = async (req, res) => {
  try {
    const sites = await Site.find({ status: 'active' });
    res.status(200).json(sites);
  } catch (err) {
    console.error('Erreur lors de la récupération des sites actifs:', err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateSite = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSite = await Site.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSite) return res.status(404).json({ message: 'Site non trouvé' });
    res.status(200).json(updatedSite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateSiteStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['active', 'desactive'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide. Utilisez "active" ou "desactive".' });
    }
    const updatedSite = await Site.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedSite) return res.status(404).json({ message: 'Site non trouvé' });
    res.status(200).json(updatedSite);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addOperateur = async (req, res) => {
  try {
    const { siteId } = req.params;
    const site = await Site.findById(siteId);
    if (!site) return res.status(404).json({ message: 'Site non trouvé' });

    const operateurData = req.body;
    site.operateurs.push(operateurData);
    await site.save();
    res.status(201).json({ message: 'Opérateur ajouté avec succès.', site });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};