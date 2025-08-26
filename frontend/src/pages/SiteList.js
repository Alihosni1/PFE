import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSites, updateSiteStatus } from '../services/api';

const SiteList = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
  }, []);

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

  const handleEdit = (id) => {
    navigate(`/sites?edit=${id}`);
  };

  const handleAdd = () => {
    navigate('/sites');
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'desactive' : 'active';
    try {
      await updateSiteStatus(id, newStatus);
      setSites(sites.map(site => 
        site._id === id ? { ...site, status: newStatus } : site
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div className="card-box mb-30 p-3">
      <h4 className="text-blue h4 mb-4 text-center">Liste des Sites</h4>
      <div className='pull-right'>
        <button className="btn btn-primary mb-3" onClick={handleAdd}>Ajouter</button>
      </div>  
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Code Site</th>
            <th>Raison Sociale</th>
            <th>Adresse</th>
            <th>Statut </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sites.map((site) => (
            <tr key={site._id}>
              <td>{site.codeSite || 'N/A'}</td>
              <td>{site.raisonSociale || 'N/A'}</td>
              <td>{site.adresseSite || 'N/A'}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={site.status === 'active'}
                    onChange={() => handleStatusChange(site._id, site.status)}
                  />
                  <span className={`slider round ${site.status === 'active' ? 'active' : ''}`}></span>
                </label>
                <span style={{ marginLeft: '10px', color: site.status === 'active' ? 'green' : 'red' }}>
                  {site.status === 'active' ? 'Actif' : 'Désactivé'}
                </span>
              </td>
              <td>
                <button className="btn btn-warning btn-sm" onClick={() => handleEdit(site._id)}>Modifier</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SiteList;