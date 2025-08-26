import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSites, createSite, updateSite } from '../services/api';

const SiteManagement = () => {
  const [step, setStep] = useState(1);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Infos du site
  const [codeSite, setCodeSite] = useState('');
  const [raisonSociale, setRaisonSociale] = useState('');
  const [adresseSite, setAdresseSite] = useState('');
  const [patente, setPatente] = useState('');
  const [rc, setRC] = useState('');
  const [ice, setICE] = useState('');
  const [telSite, setTelSite] = useState('');

  // Infos du gérant
  const [gerantNom, setGerantNom] = useState('');
  const [gerantPrenom, setGerantPrenom] = useState('');
  const [cineGerant, setCineGerant] = useState('');
  const [adresseGerant, setAdresseGerant] = useState('');
  const [gsmGerant, setGsmGerant] = useState('');
  const [emailGerant, setEmailGerant] = useState('');

  // Liste des opérateurs
  const [operateurs, setOperateurs] = useState([{
    codeOperateur: '',
    nomOperateur: '',
    prenomOperateur: '',
    cineOperateur: '',
    adresseOperateur: '',
    gsmOperateur: '',
    machineSerie: '',
    emailOperateur: '',
    passwordOperateur: ''
  }]);
  const [editSiteId, setEditSiteId] = useState(null);

  useEffect(() => {
    fetchSites();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const editId = searchParams.get('edit');
    if (editId && sites.length > 0 && !editSiteId) {
      const siteToEdit = sites.find(site => site._id === editId);
      if (siteToEdit) {
        handleEdit(siteToEdit);
      }
    }
  }, [location.search, sites, editSiteId]);

  const fetchSites = async () => {
    try {
      setLoading(true);
      const data = await getSites();
      setSites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOperateurChange = (index, field, value) => {
    const updated = [...operateurs];
    updated[index][field] = value;
    setOperateurs(updated);
  };

  const addOperateur = () => {
    setOperateurs([
      ...operateurs,
      {
        codeOperateur: '',
        nomOperateur: '',
        prenomOperateur: '',
        cineOperateur: '',
        adresseOperateur: '',
        gsmOperateur: '',
        machineSerie: '',
        emailOperateur: '',
        passwordOperateur: ''
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting data:', { codeSite, raisonSociale, adresseSite, patente, rc, ice, telSite, gerantNom, gerantPrenom, cineGerant, adresseGerant, gsmGerant, emailGerant, operateurs });
    const data = {
      codeSite,
      raisonSociale,
      adresseSite,
      patente,
      rc,
      ice,
      telSite,
      gerantNom,
      gerantPrenom,
      cineGerant,
      adresseGerant,
      gsmGerant,
      emailGerant,
      operateurs
    };

    try {
      if (editSiteId) {
        const response = await updateSite(editSiteId, data);
        alert(response.message || 'Site modifié avec succès !');
      } else {
        const response = await createSite(data);
        alert(response.message || 'Site créé avec succès !');
      }
      setStep(1);
      setCodeSite('');
      setRaisonSociale('');
      setAdresseSite('');
      setPatente('');
      setRC('');
      setICE('');
      setTelSite('');
      setGerantNom('');
      setGerantPrenom('');
      setCineGerant('');
      setAdresseGerant('');
      setGsmGerant('');
      setEmailGerant('');
      setOperateurs([{
        codeOperateur: '',
        nomOperateur: '',
        prenomOperateur: '',
        cineOperateur: '',
        adresseOperateur: '',
        gsmOperateur: '',
        machineSerie: '',
        emailOperateur: '',
        passwordOperateur: ''
      }]);
      setEditSiteId(null);
      navigate('/sites/list');
    } catch (err) {
      alert(`Erreur : ${err.message}`);
    }
  };

  const handleEdit = (site) => {
    setEditSiteId(site._id);
    setStep(1);
    setCodeSite(site.codeSite || '');
    setRaisonSociale(site.raisonSociale || '');
    setAdresseSite(site.adresseSite || '');
    setPatente(site.patente || '');
    setRC(site.rc || '');
    setICE(site.ice || '');
    setTelSite(site.telSite || '');
    setGerantNom(site.gerantNom || '');
    setGerantPrenom(site.gerantPrenom || '');
    setCineGerant(site.cineGerant || '');
    setAdresseGerant(site.adresseGerant || '');
    setGsmGerant(site.gsmGerant || '');
    setEmailGerant(site.emailGerant || '');
    setOperateurs(site.operateurs || [{
      codeOperateur: '',
      nomOperateur: '',
      prenomOperateur: '',
      cineOperateur: '',
      adresseOperateur: '',
      gsmOperateur: '',
      machineSerie: '',
      emailOperateur: '',
      passwordOperateur: ''
    }]);
  };

  const nextStep = () => {
    console.log('Next step triggered, current step:', step);
    if (step === 2 && (!gerantNom || !gerantPrenom || !cineGerant || !adresseGerant || !gsmGerant || !emailGerant)) {
      alert('Veuillez remplir tous les champs du gérant.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="card-box mb-30 p-3">
      <form onSubmit={handleSubmit} id="siteForm">
        <h4 className="text-blue h4 mb-4 text-center">
          {step === 1 && "INFORMATION DU SITE"}
          {step === 2 && "INFORMATION DU GERANT DU SITE"}
          {step === 3 && "INFORMATION D'OPERATEUR DE SAISI"}
        </h4>

        {step === 1 && (
          <>
            <div className="form-group row">
              <label className="col-md-3 col-form-label">CODE D’IDENTIFICATION DU SITE N°</label>
              <div className="col-md-6">
                <input className="form-control" type="text" value={codeSite} onChange={(e) => setCodeSite(e.target.value)} />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-3 col-form-label">RAISON SOCIALE DU SITE</label>
              <div className="col-md-6">
                <input className="form-control" type="text" value={raisonSociale} onChange={(e) => setRaisonSociale(e.target.value)} />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-3 col-form-label">ADRESSE DU SITE</label>
              <div className="col-md-6">
                <input className="form-control" type="text" value={adresseSite} onChange={(e) => setAdresseSite(e.target.value)} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 form-group">
                <label>PATENTE N°</label>
                <input type="text" className="form-control" value={patente} onChange={(e) => setPatente(e.target.value)} />
              </div>
              <div className="col-md-3 form-group">
                <label>RC N°</label>
                <input type="text" className="form-control" value={rc} onChange={(e) => setRC(e.target.value)} />
              </div>
              <div className="col-md-3 form-group">
                <label>ICE N°</label>
                <input type="text" className="form-control" value={ice} onChange={(e) => setICE(e.target.value)} />
              </div>
              <div className="col-md-3 form-group">
                <label>TEL</label>
                <input type="text" className="form-control" value={telSite} onChange={(e) => setTelSite(e.target.value)} />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="form-group row">
              <label className="col-md-4 col-form-label">NOM ET PRENOM DU GERANT DU SITE</label>
              <div className="row col-md-8">
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Nom" value={gerantNom} onChange={(e) => setGerantNom(e.target.value)} />
                </div>
                <div className="col-md-6">
                  <input type="text" className="form-control" placeholder="Prenom" value={gerantPrenom} onChange={(e) => setGerantPrenom(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-3 col-form-label">N° CINE DU GERANT</label>
              <div className="col-md-9">
                <input className="form-control" type="text" value={cineGerant} onChange={(e) => setCineGerant(e.target.value)} />
              </div>
            </div>
            <div className="form-group row">
              <label className="col-md-3 col-form-label">ADRESSE DU GERANT</label>
              <div className="col-md-9">
                <input className="form-control" type="text" value={adresseGerant} onChange={(e) => setAdresseGerant(e.target.value)} />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <label>GSM DU GERANT</label>
                <input type="tel" className="form-control" value={gsmGerant} onChange={(e) => setGsmGerant(e.target.value)} />
              </div>
              <div className="col-md-6">
                <label>EMAIL</label>
                <input type="email" className="form-control" value={emailGerant} onChange={(e) => setEmailGerant(e.target.value)} />
              </div>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            {operateurs.map((operateur, index) => (
              <div key={index} className="border rounded p-3 mb-3 bg-light">
                <h6 className="text-primary">Opérateur #{index + 1}</h6>
                <div className="form-group row">
                  <label className="col-md-3 col-form-label">CODE OPERATEUR</label>
                  <div className="col-md-6">
                    <input className="form-control" type="text" value={operateur.codeOperateur} onChange={(e) => handleOperateurChange(index, 'codeOperateur', e.target.value)} />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label">NOM ET PRENOM</label>
                  <div className="row col-md-8">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Nom" value={operateur.nomOperateur} onChange={(e) => handleOperateurChange(index, 'nomOperateur', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="Prenom" value={operateur.prenomOperateur} onChange={(e) => handleOperateurChange(index, 'prenomOperateur', e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-3 col-form-label">CINE</label>
                  <div className="col-md-6">
                    <input className="form-control" type="text" value={operateur.cineOperateur} onChange={(e) => handleOperateurChange(index, 'cineOperateur', e.target.value)} />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-3 col-form-label">ADRESSE</label>
                  <div className="col-md-8">
                    <input className="form-control" type="text" value={operateur.adresseOperateur} onChange={(e) => handleOperateurChange(index, 'adresseOperateur', e.target.value)} />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label">GSM</label>
                  <div className="col-md-6">
                    <input className="form-control" type="text" value={operateur.gsmOperateur} onChange={(e) => handleOperateurChange(index, 'gsmOperateur', e.target.value)} />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label">EMAIL</label>
                  <div className="col-md-6">
                    <input className="form-control" type="email" value={operateur.emailOperateur} onChange={(e) => handleOperateurChange(index, 'emailOperateur', e.target.value)} />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label">MOT DE PASSE</label>
                  <div className="col-md-6">
                    <input className="form-control" type="password" value={operateur.passwordOperateur} onChange={(e) => handleOperateurChange(index, 'passwordOperateur', e.target.value)} />
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-4 col-form-label">SÉRIE MACHINE</label>
                  <div className="col-md-6">
                    <input className="form-control" type="text" value={operateur.machineSerie} onChange={(e) => handleOperateurChange(index, 'machineSerie', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" className="btn btn-outline-primary mb-3" onClick={addOperateur}>+ Ajouter un opérateur</button>
          </>
        )}

        <div className="d-flex justify-content-end mt-4">
          {step > 1 && (
            <button type="button" className="btn btn-secondary me-2" onClick={prevStep}>Précédent</button>
          )}
          {step < 3 ? (
            <button type="button" className="btn btn-primary" onClick={nextStep}>Suivant</button>
          ) : (
            <button type="submit" className="btn btn-success" form="siteForm">Terminer</button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SiteManagement;