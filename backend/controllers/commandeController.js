const Commande = require('../models/Commande');
const Site = require('../models/Site');

const createCommande = async (req, res) => {
  try {
    const {
      numeroCommande,
      dateValidation,
      agentCode,
      clientType,
      clientInfo,
      vehicleOwnerInfo,
      vehicleData,
      numeroImmatriculation,
      numeroChassis,
      marqueModele,
      motif,
      typePlaque,
      typeVehicule,
      frontPlate,
      rearPlate,
      quantity,
      prix,
      documents,
    } = req.body;

    if (!numeroCommande || !dateValidation || !agentCode || !clientType || !clientInfo || !vehicleOwnerInfo || !vehicleData || !typePlaque || !typeVehicule || !quantity || !prix) {
      return res.status(400).json({ message: 'Données manquantes.' });
    }

    const formattedDocuments = documents.map(doc => ({
      name: doc.name,
      description: doc.description,
      fileName: doc.fileName,
      fileType: doc.fileType,
      filePath: doc.filePath,
      status: 'validated',
    }));

    const newCommande = new Commande({
      numeroCommande,
      dateValidation: new Date(dateValidation),
      agentCode,
      clientType,
      clientInfo: {
        nom: clientInfo.nom,
        prenom: clientInfo.prenom,
        cine: clientInfo.cine,
        dateValidite: clientInfo.dateValidite ? new Date(clientInfo.dateValidite) : null,
        gsm: clientInfo.gsm,
        email: clientInfo.email,
      },
      vehicleOwnerInfo: {
        nom: vehicleOwnerInfo.nom || '',
        prenom: vehicleOwnerInfo.prenom || '',
        adresse: vehicleOwnerInfo.adresse,
      },
      vehicleData: {
        registrationNumber: vehicleData.registrationNumber,
        brand: vehicleData.brand,
        type: vehicleData.type,
        model: vehicleData.model,
        chassisNumber: vehicleData.chassisNumber,
      },
      plaqueInfo: {
        typeCommande: motif,
        typePlaque,
        typeVehicule,
        frontPlate,
        rearPlate,
        quantity,
        prix,
      },
      documents: formattedDocuments,
    });

    await newCommande.save();
    res.status(201).json({ message: 'Commande enregistrée avec succès.', commande: newCommande });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Numéro de commande déjà utilisé.' });
    }
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

const getCommandes = async (req, res) => {
  try {
    const commandes = await Commande.find();
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getCommandesBySite = async (req, res) => {
  try {
    const siteId = req.params.siteId;
    const site = await Site.findById(siteId);
    if (!site) {
      console.log('Site non trouvé pour ID:', siteId);
      return res.status(404).json({ message: 'Site non trouvé' });
    }

    // Construire une liste de "nom prenom" pour les opérateurs
    const operatorNames = site.operateurs.map(op => `${op.nomOperateur} ${op.prenomOperateur}`);
    
    // Vérifier toutes les commandes pour déboguer agentCode
    const allCommandes = await Commande.find({}, { numeroCommande: 1, agentCode: 1 });
    
    // Filtrer les commandes par nom et prénom des opérateurs
    const commandes = await Commande.find({ agentCode: { $in: operatorNames } });
    res.status(200).json(commandes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createCommande, getCommandes, getCommandesBySite };