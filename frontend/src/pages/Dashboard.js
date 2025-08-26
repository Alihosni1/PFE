import React, { useState, useEffect } from 'react';
import { getCommandes, getSites } from '../services/api';
import './Dashboard.css';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [commandes, setCommandes] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const commandesData = await getCommandes();
        const sitesData = await getSites();
        setCommandes(commandesData);
        setSites(sitesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur : {error}</div>;

  const totalCommandes = commandes.length;
  const totalSites = sites.length;
  const totalOperateurs = sites.reduce((sum, site) => sum + (site.operateurs ? site.operateurs.length : 0), 0);

  const commandeData = {
    labels: ['Commandes', 'Non affecté'],
    datasets: [{
      data: [totalCommandes, 100 - totalCommandes],
      backgroundColor: ['#007bff', '#e9ecef'],
      borderWidth: 1
    }]
  };

  const siteData = {
    labels: ['Sites', 'Non affecté'],
    datasets: [{
      data: [totalSites, 100 - totalSites],
      backgroundColor: ['#28a745', '#e9ecef'],
      borderWidth: 1
    }]
  };

  const operateurData = {
    labels: ['Opérateurs', 'Non affecté'],
    datasets: [{
      data: [totalOperateurs, 100 - totalOperateurs],
      backgroundColor: ['#dc3545', '#e9ecef'],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += context.parsed.toLocaleString();
            return label;
          }
        }
      }
    }
  };

  return (
    <div className="card-box mb-30 p-3">
      <h2 className="dashboard-title">Tableau de Bord</h2>

      {/* Section Statistiques (Charts) */}
      <div className="stats-container">
        <div className="chart-box">
          <h3>Commandes</h3>
          <div style={{ height: '200px', width: '100%' }}>
            <Doughnut data={commandeData} options={chartOptions} />
          </div>
          <p className="mt-2" style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
            Total : {totalCommandes}
          </p>
        </div>
        <div className="chart-box">
          <h3>Sites</h3>
          <div style={{ height: '200px', width: '100%' }}>
            <Doughnut data={siteData} options={chartOptions} />
          </div>
          <p className="mt-2" style={{ fontSize: '18px', fontWeight: 'bold', color: '#28a745' }}>
            Total : {totalSites}
          </p>
        </div>
        <div className="chart-box">
          <h3>Opérateurs</h3>
          <div style={{ height: '200px', width: '100%' }}>
            <Doughnut data={operateurData} options={chartOptions} />
          </div>
          <p className="mt-2" style={{ fontSize: '18px', fontWeight: 'bold', color: '#dc3545' }}>
            Total : {totalOperateurs}
          </p>
        </div>
      </div>

      {/* Section Commandes */}
      <div className="section">
        <h3>Commandes</h3>
        {commandes.length === 0 ? (
          <p>Aucune commande disponible.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Date</th>
                <th>Agent</th>
                <th>Type Client</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map((commande) => (
                <tr key={commande._id}>
                  <td>{commande.numeroCommande}</td>
                  <td>{new Date(commande.dateValidation).toLocaleDateString()}</td>
                  <td>{commande.agentCode}</td>
                  <td>{commande.clientType}</td>
                  <td>{commande.plaqueInfo.prix} MAD</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Section Sites */}
      <div className="section">
        <h3>Sites</h3>
        {sites.length === 0 ? (
          <p>Aucun site disponible.</p>
        ) : (
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Localisation</th>
                <th>Email Gerant</th>
              </tr>
            </thead>
            <tbody>
              {sites.map((site) => (
                <tr key={site._id}>
                  <td>{site.raisonSociale || 'N/A'}</td>
                  <td>{site.adresseSite || 'N/A'}</td>
                  <td>{site.emailGerant || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;