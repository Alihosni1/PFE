const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true }, 
  fileName: { type: String },
  fileType: { type: String }, 
  filePath: { type: String }, 
  status: { type: String, enum: ['pending', 'validated', 'refused'], default: 'validated' },
});

const commandeSchema = new mongoose.Schema({
  numeroCommande: { type: String, required: true, unique: true },
  dateValidation: { type: Date, required: true },
  agentCode: { type: String, required: true },
  clientType: { type: String, enum: ['Particulier', 'Societe'], required: true },
  clientInfo: {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    cine: { type: String, required: true },
    dateValidite: { type: Date },
    gsm: { type: String },
    email: { type: String },
  },
  vehicleOwnerInfo: {
    nom: { type: String },
    prenom: { type: String },
    adresse: { type: String, required: true },
  },
  vehicleData: {
    registrationNumber: { type: String, required: true },
    brand: { type: String, required: true },
    type: { type: String, required: true },
    model: { type: String, required: true },
    chassisNumber: { type: String, required: true },
  },
  plaqueInfo: {
    typeCommande: [{ type: String, enum: ['NOUVELLE PLAQUE', 'DUP', 'REMP'] }],
    typePlaque: { type: String, required: true },
    typeVehicule: { type: String, required: true },
    frontPlate: { type: Boolean, default: false },
    rearPlate: { type: Boolean, default: false },
    quantity: { type: Number, required: true },
    prix: { type: Number, required: true },
  },
  documents: [documentSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Commande', commandeSchema);