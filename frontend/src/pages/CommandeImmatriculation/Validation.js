import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStep } from './StepContext';
import Form from './Form';

const Validation = () => {
  const navigate = useNavigate();
  const clientType = localStorage.getItem('clientType');
  const clientInfo = JSON.parse(localStorage.getItem('clientInfo')) || {
    nom: '',
    prenom: '',
    adresse: '',
    cine: '',
    dateValidite: '',
    gsm: '',
    email: '',
  };
  const vehicleOwnerInfo = JSON.parse(localStorage.getItem('vehicleOwnerInfo')) || {
    nom: '',
    prenom: '',
    adresse: '',
  };
  const vehicleData = JSON.parse(localStorage.getItem('vehicleData')) || {
    registrationNumber: '',
    brand: '',
    type: '',
    model: '',
    chassisNumber: '',
  };
  const cineDocument = JSON.parse(localStorage.getItem('cineDocument')) || null;
  const carteGriseDocument = JSON.parse(localStorage.getItem('carteGriseDocument')) || null;
  const procurationDocument = JSON.parse(localStorage.getItem('procurationDocument')) || null;
  const rcCopyDocument = JSON.parse(localStorage.getItem('rcCopyDocument')) || null;

  const initialDocumentsStatus = {
    cine: 'pending',
    carteGrise: 'pending',
    ...(clientType === 'societe' && { procuration: 'pending', rcCopy: 'pending' }),
  };

  const [clientData, setClientData] = useState({
    type: clientType || 'Particulier',
    lastName: clientInfo.nom,
    firstName: clientInfo.prenom,
    cine: clientInfo.cine,
    validityDate: clientInfo.dateValidite,
    phone: clientInfo.gsm,
    address: vehicleOwnerInfo.adresse,
    email: clientInfo.email,
  });
  const [vehicleState, setVehicleState] = useState({
    registrationNumber: vehicleData.registrationNumber,
    brand: vehicleData.brand,
    type: vehicleData.type,
    model: vehicleData.model,
    chassisNumber: vehicleData.chassisNumber,
  });
  const [documentsStatus, setDocumentsStatus] = useState(initialDocumentsStatus);
  const [tempClientData, setTempClientData] = useState(clientData);
  const [tempVehicleData, setTempVehicleData] = useState(vehicleState);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);

  const handleValidate = (document) => {
    setDocumentsStatus((prev) => ({
      ...prev,
      [document]: 'validated',
    }));
  };

  const handleRefuse = (document) => {
    setDocumentsStatus((prev) => ({
      ...prev,
      [document]: 'refused',
    }));
  };

  const { markStepComplete } = useStep();

  const handlePrevious = () => {
    navigate('/documents');
  };

  const handleContinue = () => {
    const allValidated = Object.values(documentsStatus).every(
      (status) => status === 'validated'
    );
    if (allValidated) {
      markStepComplete(4);
      navigate('/PlaqueInfo');
    } else {
      alert('Veuillez valider tous les documents avant de continuer.');
    }
  };

  const handleClientInputChange = (e) => {
    const { name, value } = e.target;
    setTempClientData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setTempVehicleData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveClientChanges = () => {
    setClientData(tempClientData);
    // Update localStorage
    localStorage.setItem(
      'clientInfo',
      JSON.stringify({
        ...clientInfo,
        nom: tempClientData.lastName,
        prenom: tempClientData.firstName,
        cine: tempClientData.cine,
        dateValidite: tempClientData.validityDate,
        gsm: tempClientData.phone,
        email: tempClientData.email,
      })
    );
    localStorage.setItem(
      'vehicleOwnerInfo',
      JSON.stringify({
        ...vehicleOwnerInfo,
        adresse: tempClientData.address,
      })
    );
    setShowClientModal(false);
  };

  const handleSaveVehicleChanges = () => {
    setVehicleState(tempVehicleData);
    // Update localStorage
    localStorage.setItem('vehicleData', JSON.stringify(tempVehicleData));
    setShowVehicleModal(false);
  };

  const handleVisualize = (document) => {
    let doc;
    switch (document) {
      case 'cine':
        doc = cineDocument;
        break;
      case 'carteGrise':
        doc = carteGriseDocument;
        break;
      case 'procuration':
        doc = procurationDocument;
        break;
      case 'rcCopy':
        doc = rcCopyDocument;
        break;
      default:
        return;
    }
    if (doc) {
      setPreviewDocument(doc);
      setShowImageModal(true);
    } else {
      alert('Document non disponible.');
    }
  };

  return (
    <div>
      <Form />
      <div className="row">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-body">
              <h4 className="text-blue h4 mb-1 text-center">Vérification des Documents</h4>
              <p className="text-muted mb-4 text-center">
                Validez les documents téléchargés avant de finaliser la commande
              </p>
              <div className="row">
                <div className="col-md-6">
                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <h5 className="mb-3">Résumé de la demande</h5>
                      <div className="mb-3">
                        <h6>Informations du client</h6>
                        <button
                          className="btn btn-outline-primary btn-sm mb-2"
                          onClick={() => {
                            setTempClientData(clientData);
                            setShowClientModal(true);
                          }}
                        >
                          <i className="mdi mdi-pencil me-1"></i> Modifier
                        </button>
                        <p className="mb-1">
                          <strong>Type de client :</strong> {clientData.type}
                        </p>
                        <p className="mb-1">
                          <strong>Nom :</strong> {clientData.lastName}
                        </p>
                        <p className="mb-1">
                          <strong>Prénom :</strong> {clientData.firstName}
                        </p>
                        <p className="mb-1">
                          <strong>CINE :</strong> {clientData.cine}
                        </p>
                        <p className="mb-1">
                          <strong>Date de validité :</strong> {clientData.validityDate}
                        </p>
                        <p className="mb-1">
                          <strong>Téléphone :</strong> {clientData.phone}
                        </p>
                        <p className="mb-1">
                          <strong>Adresse :</strong> {clientData.address}
                        </p>
                        <p className="mb-1">
                          <strong>Email :</strong> {clientData.email || 'Non fourni'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <h6>Informations du véhicule</h6>
                      <button
                        className="btn btn-outline-primary btn-sm mb-2"
                        onClick={() => {
                          setTempVehicleData(vehicleState);
                          setShowVehicleModal(true);
                        }}
                      >
                        <i className="mdi mdi-pencil me-1"></i> Modifier
                      </button>
                      <p className="mb-1">
                        <strong>N° d’immatriculation :</strong> {vehicleState.registrationNumber}
                      </p>
                      <p className="mb-1">
                        <strong>Marque :</strong> {vehicleState.brand}
                      </p>
                      <p className="mb-1">
                        <strong>Type :</strong> {vehicleState.type}
                      </p>
                      <p className="mb-1">
                        <strong>Modèle :</strong> {vehicleState.model}
                      </p>
                      <p className="mb-1">
                        <strong>N° du châssis :</strong> {vehicleState.chassisNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <h5 className="mb-3">Documents à Valider</h5>
                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <h6>CINE</h6>
                      <p>Document d’identité nationale (CINE)</p>
                      <p>Ce document est en attente de validation. Veuillez le vérifier et le valider.</p>
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleVisualize('cine')}
                        >
                          Visualiser
                        </button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleRefuse('cine')}
                          disabled={documentsStatus.cine === 'validated'}
                        >
                          Refuser
                        </button>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleValidate('cine')}
                          disabled={documentsStatus.cine === 'validated'}
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <h6>Carte Grise</h6>
                      <p>Document d’immatriculation du véhicule</p>
                      <p>Ce document est en attente de validation. Veuillez le vérifier et le valider.</p>
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => handleVisualize('carteGrise')}
                        >
                          Visualiser
                        </button>
                        <button
                          className="btn btn-danger btn-sm me-2"
                          onClick={() => handleRefuse('carteGrise')}
                          disabled={documentsStatus.carteGrise === 'validated'}
                        >
                          Refuser
                        </button>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleValidate('carteGrise')}
                          disabled={documentsStatus.carteGrise === 'validated'}
                        >
                          Valider
                        </button>
                      </div>
                    </div>
                  </div>
                  {clientType === 'societe' && (
                    <>
                      <div className="dotted-border mt-3">
                        <div className="card-body">
                          <h6>Procuration Légalisée</h6>
                          <p>Autorisation d'immatriculation au nom de la société</p>
                          <p>Ce document est en attente de validation. Veuillez le vérifier et le valider.</p>
                          <div className="d-flex justify-content-end">
                            <button
                              className="btn btn-info btn-sm me-2"
                              onClick={() => handleVisualize('procuration')}
                            >
                              Visualiser
                            </button>
                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() => handleRefuse('procuration')}
                              disabled={documentsStatus.procuration === 'validated'}
                            >
                              Refuser
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleValidate('procuration')}
                              disabled={documentsStatus.procuration === 'validated'}
                            >
                              Valider
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="dotted-border mt-3">
                        <div className="card-body">
                          <h6>Copie RC Certifiée Conforme</h6>
                          <p>Registre de Commerce certifié conforme à l’original</p>
                          <p>Ce document est en attente de validation. Veuillez le vérifier et le valider.</p>
                          <div className="d-flex justify-content-end">
                            <button
                              className="btn btn-info btn-sm me-2"
                              onClick={() => handleVisualize('rcCopy')}
                            >
                              Visualiser
                            </button>
                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() => handleRefuse('rcCopy')}
                              disabled={documentsStatus.rcCopy === 'validated'}
                            >
                              Refuser
                            </button>
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleValidate('rcCopy')}
                              disabled={documentsStatus.rcCopy === 'validated'}
                            >
                              Valider
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 d-flex justify-content-between">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
          >
            Précédent
          </button>
          <button
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={!Object.values(documentsStatus).every((status) => status === 'validated')}
          >
            Continuer
          </button>
        </div>
      </div>

      <div className={`modal fade ${showClientModal ? 'show' : ''}`} style={{ display: showClientModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modifier les Informations du Client</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowClientModal(false)}
              >×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">Nom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={tempClientData.lastName}
                      onChange={handleClientInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">Prénom</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={tempClientData.firstName}
                      onChange={handleClientInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cine" className="form-label">CINE</label>
                    <input
                      type="text"
                      className="form-control"
                      id="cine"
                      name="cine"
                      value={tempClientData.cine}
                      onChange={handleClientInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="validityDate" className="form-label">Date de validité</label>
                    <input
                      type="date"
                      className="form-control"
                      id="validityDate"
                      name="validityDate"
                      value={tempClientData.validityDate}
                      onChange={handleClientInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Téléphone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={tempClientData.phone}
                      onChange={handleClientInputChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={tempClientData.email}
                      onChange={handleClientInputChange}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">Adresse</label>
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    name="address"
                    value={tempClientData.address}
                    onChange={handleClientInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowClientModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveClientChanges}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal fade ${showVehicleModal ? 'show' : ''}`} style={{ display: showVehicleModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modifier les Informations du Véhicule</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowVehicleModal(false)}
              >×</button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="registrationNumber" className="form-label">N° d’immatriculation</label>
                  <input
                    type="text"
                    className="form-control"
                    id="registrationNumber"
                    name="registrationNumber"
                    value={tempVehicleData.registrationNumber}
                    onChange={handleVehicleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="brand" className="form-label">Marque</label>
                  <input
                    type="text"
                    className="form-control"
                    id="brand"
                    name="brand"
                    value={tempVehicleData.brand}
                    onChange={handleVehicleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Type</label>
                  <input
                    type="text"
                    className="form-control"
                    id="type"
                    name="type"
                    value={tempVehicleData.type}
                    onChange={handleVehicleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="model" className="form-label">Modèle</label>
                  <input
                    type="text"
                    className="form-control"
                    id="model"
                    name="model"
                    value={tempVehicleData.model}
                    onChange={handleVehicleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="chassisNumber" className="form-label">N° du châssis</label>
                  <input
                    type="text"
                    className="form-control"
                    id="chassisNumber"
                    name="chassisNumber"
                    value={tempVehicleData.chassisNumber}
                    onChange={handleVehicleInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowVehicleModal(false)}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveVehicleChanges}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal fade ${showImageModal ? 'show' : ''}`} style={{ display: showImageModal ? 'block' : 'none', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Visualisation du Document</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowImageModal(false)}
              >×</button>
            </div>
            <div className="modal-body text-center">
              {previewDocument && (
                previewDocument.type === 'application/pdf' ? (
                  <embed
                    src={previewDocument.data}
                    type="application/pdf"
                    width="100%"
                    height="500px"
                  />
                ) : (
                  <img
                    src={previewDocument.data}
                    alt="Aperçu du document"
                    className="img-fluid"
                    style={{ maxHeight: '500px' }}
                  />
                )
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowImageModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Validation;