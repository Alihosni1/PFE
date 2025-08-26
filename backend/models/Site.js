const mongoose = require('mongoose');

const operateurSchema = new mongoose.Schema({
  codeOperateur: String,
  nomOperateur: String,
  prenomOperateur: String,
  cineOperateur: String,
  adresseOperateur: String,
  gsmOperateur: String,
  machineSerie: String,
  emailOperateur: String,
  passwordOperateur: String
});

const siteSchema = new mongoose.Schema({
  codeSite: String,
  raisonSociale: String,
  adresseSite: String,
  patente: String,
  rc: String,
  ice: String,
  telSite: String,
  status: { type: String, enum: ['active', 'desactive'], default: 'active' },
  gerantNom: String,
  gerantPrenom: String,
  cineGerant: String,
  adresseGerant: String,
  gsmGerant: String,
  emailGerant: String,
  operateurs: [operateurSchema] 
});

module.exports = mongoose.model('Site', siteSchema);