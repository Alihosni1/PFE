import React from 'react';
import { useNavigate } from 'react-router-dom';

const Operateur = () => {
  const navigate = useNavigate();

  const handleAddCommand = () => {
    navigate('/typeclient');
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token d'authentification
    navigate('/'); // Redirige vers la page de connexion
  };

  return (
    <div className="mb-30 p-3 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div>
        <h4 className="text-blue h4 mb-4 text-center">Bienvenue</h4>
        <div
          className="card p-4 text-center cursor-pointer bg-light"
          style={{ border: '2px solid #007bff', borderRadius: '10px', maxWidth: '300px', width: '100%' }}
          onClick={handleAddCommand}
        >
          <i className="bi bi-plus-circle-fill" style={{ fontSize: '2rem', color: '#007bff' }}></i>
          <h5 className="mt-2">Ajouter une commande</h5>
        </div>
        <div className="mt-4 text-center">
          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i> Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
};

export default Operateur;