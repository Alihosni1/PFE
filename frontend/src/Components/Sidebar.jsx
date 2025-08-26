import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Supprime le token d'authentification
    window.location.href = '/'; // Redirige vers la page de connexion
  };

  return (
    <div className="left-side-bar">
      <div className="brand-logo">
        <Link to="/">
          <img src="" alt="Logo" className="dark-logo" />
          <span className="ml-2 text-white">Plaques App</span>
        </Link>
      </div>
      <div className="menu-block customscroll">
        <div className="sidebar-menu">
          <ul id="accordion-menu">
            <li>
              <Link to="/dashboard" className="dropdown-toggle no-arrow">
                <span className="micon bi bi-speedometer2"></span>
                <span className="mtext">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="/sites/list" className="dropdown-toggle no-arrow">
                <span className="micon bi bi-building"></span>
                <span className="mtext">Sites</span>
              </Link>
            </li>
            <li>
              <Link to="/addOp" className="dropdown-toggle no-arrow">
                <span className="micon bi bi-people"></span>
                <span className="mtext">AjouterOperateur</span>
              </Link>
            </li>
            <li>
              <Link to="/commandes" className="dropdown-toggle no-arrow">
                <span className="micon bi bi-receipt"></span>
                <span className="mtext">commandes</span>
              </Link>
            </li>
            <li>
              <a href="#" className="dropdown-toggle no-arrow" onClick={handleLogout}>
                <span className="micon bi bi-box-arrow-right"></span> {/* Icône de déconnexion */}
                <span className="mtext">Déconnexion</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;