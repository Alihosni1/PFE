import React, { useState } from 'react';
import './type.css';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { useStep } from './StepContext';
const TypeClient = () => {
  const [selectedClientType, setSelectedClientType] = useState('particulier');

  const handleClientTypeChange = (event) => {
    setSelectedClientType(event.target.value);
  };

  const navigate = useNavigate();
  const { markStepComplete } = useStep(); 
  const handleContinue = () => {
      localStorage.setItem('clientType', selectedClientType);
      markStepComplete(0);
      navigate('/infoclient');
  };

  return (
    <div className="container">
        <Form />
      <div className="client-selection">
        <h2 className='text-blue h4 mb-4 text-center' >Sélection du type de client</h2>
        <p className='text-center'>Sélectionnez le type de client pour cette demande d'immatriculation</p>

        <div className="client-options">
          <div
            className={`client-card ${
              selectedClientType === 'particulier' ? 'selected' : ''
            }`}
          >
            <input
              type="radio"
              id="particulier"
              name="clientType"
              value="particulier"
              checked={selectedClientType === 'particulier'}
              onChange={handleClientTypeChange}
            />
            <label htmlFor="particulier">
                <div className='row'>
                    
                    <i class="icon-copy fa fa-user-circle-o" aria-hidden="true"></i>
                    <h3>Particulier</h3>
                </div>
              <p>Personne demandant une immatriculation en son nom propre</p>
              <div className="documents">
                    <div className='row'>
                        <i class="icon-copy fa fa-file-text" aria-hidden="true"></i>
                        <h4>Documents requis</h4>
                    </div>
                <ul>
                    <i class="icon-copy fa fa-address-card-o" aria-hidden="true"></i>  CINE <br />
                    <i class="icon-copy fa fa-file-o" aria-hidden="true"></i>Carte Grise
                </ul>
              </div>
            </label>
          </div>

          <div
            className={`client-card ${
              selectedClientType === 'societe' ? 'selected' : ''
            }`}
          >
            <input
              type="radio"
              id="societe"
              name="clientType"
              value="societe"
              checked={selectedClientType === 'societe'}
              onChange={handleClientTypeChange}
            />
            <label htmlFor="societe">
               <div className="form-group row "> 
                    <i class="icon-copy fa fa-building" aria-hidden="true"></i> 
                    <h3>Société</h3>
                </div>
                <p>Entreprise ou personne morale requérant une immatriculation</p>
                <div className="documents"> 
                    <div className='row'>
                        <i class="icon-copy fa fa-file-text" aria-hidden="true"></i>
                        <h4>Documents additionnels requis</h4>
                    </div>
                    <ul>
                    <i class="icon-copy fa fa-files-o" aria-hidden="true"></i>Procuration légalisée <br />
                    <i class="icon-copy dw dw-down-arrow-7"></i>  Copie certifiée conforme
                    </ul>
              </div>
            </label>
          </div>
        </div>

        <p className="info-text">
        <i class="icon-copy fi-info"></i> Le type de client détermine les documents requis pour la demande
        </p>
      </div>

      
      <button className="next-button" onClick={handleContinue}>Suivant </button>
    </div>
  );
};

export default TypeClient;