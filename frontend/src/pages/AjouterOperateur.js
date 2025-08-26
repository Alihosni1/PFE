import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveSites, addOperateur } from '../services/api';

const AjouterOperateur = () => {
  const [sites, setSites] = useState([]);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    codeOperateur: '',
    nomOperateur: '',
    prenomOperateur: '',
    cineOperateur: '',
    adresseOperateur: '',
    gsmOperateur: '',
    machineSerie: '',
    emailOperateur: '',
    passwordOperateur: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const data = await getActiveSites();
        setSites(data);
        if (data.length > 0) {
          setSelectedSiteId(data[0]._id); 
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSiteId) {
      setError('Veuillez sélectionner un site.');
      return;
    }
    try {
      await addOperateur(selectedSiteId, formData);
      setFormData({
        codeOperateur: '',
        nomOperateur: '',
        prenomOperateur: '',
        cineOperateur: '',
        adresseOperateur: '',
        gsmOperateur: '',
        machineSerie: '',
        emailOperateur: '',
        passwordOperateur: '',
      });
      alert('Opérateur ajouté avec succès.');
      navigate('/addOp'); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="card-box mb-30 p-3">
      <h4 className="text-blue h4 mb-4 text-center">Ajouter un Opérateur</h4>
      <div className="mb-3">
        <label>Sélectionner un site : </label>
        <select
          className="form-control"
          value={selectedSiteId || ''}
          onChange={(e) => setSelectedSiteId(e.target.value)}
        >
          {sites.map((site) => (
            <option key={site._id} value={site._id}>
              {site.codeSite} - {site.raisonSociale}
            </option>
          ))}
        </select>
      </div>
      {selectedSiteId && (
        <form onSubmit={handleSubmit}>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">Code Opérateur :</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="codeOperateur"
                value={formData.codeOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">Nom :</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="nomOperateur"
                value={formData.nomOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">Prénom :</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="prenomOperateur"
                value={formData.prenomOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">CINE :</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="cineOperateur"
                value={formData.cineOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">Adresse :</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="adresseOperateur"
                value={formData.adresseOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">GSM :</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="gsmOperateur"
                value={formData.gsmOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">Numéro de Série Machine :</label>
            <div className="col-sm-9">
              <input
                type="text"
                className="form-control"
                name="machineSerie"
                value={formData.machineSerie}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">Email :</label>
            <div className="col-sm-9">
              <input
                type="email"
                className="form-control"
                name="emailOperateur"
                value={formData.emailOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-group row mb-3">
            <label className="col-sm-3 col-form-label">Mot de passe :</label>
            <div className="col-sm-9">
              <input
                type="password"
                className="form-control"
                name="passwordOperateur"
                value={formData.passwordOperateur}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Ajouter Opérateur
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AjouterOperateur;