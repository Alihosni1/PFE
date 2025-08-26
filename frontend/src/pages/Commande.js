import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActiveSites, getCommandesBySite } from '../services/api';

const CommandList = () => {
  const [sites, setSites] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSiteId, setSelectedSiteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const data = await getActiveSites();
        console.log('Sites actifs récupérés:', data);
        setSites(data);
        if (data.length > 0) {
          setSelectedSiteId(data[0]._id);
          await fetchCommandes(data[0]._id);
        } else {
          setCommandes([]);
        }
      } catch (err) {
        setError(err.message);
        console.error('Erreur lors de la récupération des sites:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSites();
  }, []);

  const fetchCommandes = async (siteId) => {
    try {
      const data = await getCommandesBySite(siteId);
      console.log('Commandes récupérées pour le site', siteId, ':', data);
      setCommandes(data || []);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des commandes:', err);
      setCommandes([]);
    }
  };

  const handleSiteClick = async (e) => {
    const siteId = e.target.value;
    console.log('Site sélectionné:', siteId);
    setSelectedSiteId(siteId);
    await fetchCommandes(siteId);
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="card-box mb-30 p-3">
      <h4 className="text-blue h4 mb-4 text-center">Liste des Commandes</h4>
      {sites.length === 0 ? (
        <p>Aucun site actif trouvé.</p>
      ) : (
        <>
          <div className="mb-3">
            <label>Sélectionner un site : </label>
            <select
              className="form-control"
              value={selectedSiteId || ''}
              onChange={handleSiteClick}
            >
              {sites.map((site) => (
                <option key={site._id} value={site._id}>
                  {site.codeSite} - {site.raisonSociale}
                </option>
              ))}
            </select>
          </div>
          {commandes.length === 0 ? (
            <p>Aucune commande trouvée pour ce site.</p>
          ) : (
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom du Client</th>
                  <th>Date</th>
                  <th>Agent</th>
                </tr>
              </thead>
              <tbody>
                {commandes.map((commande) => (
                  <tr key={commande._id}>
                    <td>{commande.numeroCommande}</td>
                    <td>{commande.clientInfo.nom || 'N/A'}</td>
                    <td>{new Date(commande.dateValidation).toLocaleDateString()}</td>
                    <td>{commande.agentCode || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default CommandList;