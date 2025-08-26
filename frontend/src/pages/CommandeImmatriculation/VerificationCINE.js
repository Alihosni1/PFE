import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { useStep } from './StepContext';

const VerificationCINE = () => {
  const clientType = localStorage.getItem('clientType'); 
  const clientInfo = JSON.parse(localStorage.getItem('clientInfo')) || {
    nom: '',
    prenom: '',
    cine: '',
    adresse: '',
    dateValidite: '',
    gsm: '',
    email: ''
  };

  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);
  const [isValidated, setIsValidated] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  const handleValidate = () => {
    setShowValidateModal(true);
  };

  const handleConfirmValidate = () => {
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        const fileData = {
          name: file.name,
          type: file.type,
          data: base64String,
        };
        localStorage.setItem('cineDocument', JSON.stringify(fileData));
      };
      reader.readAsDataURL(file);
    }
    setShowValidateModal(false);
    setIsValidated(true);
  };

  const handleCancelValidate = () => {
    setShowValidateModal(false);
  };

  const handleRefuse = () => {
    setShowRefuseModal(true);
  };

  const handleConfirmRefuse = () => {
    setShowRefuseModal(false);
    setFile(null);
    setFilePreview(null);
    setIsValidated(false);
    localStorage.removeItem('cineDocument'); 
  };

  const handleCancelRefuse = () => {
    setShowRefuseModal(false);
  };

  const { markStepComplete } = useStep(); 
  const navigate = useNavigate();
  const handlePrevious = () => {
    navigate('/infoclient');
  };

  const handleContinue = () => {
    if (isValidated) {
      markStepComplete(2);
      navigate('/documents');
    }
  };

  return (
    <div>
      <Form />
      <div className="row">
        <div className="col-lg-12">
          <div className="dotted-border mt-3">
            <div className="card-body">
              <h4 className="text-blue h4 mb-1 text-center">Vérification du CINE</h4>
              <p className="text-muted mb-4 text-center">
                Téléchargez et validez une copie du CINE pour poursuivre le
                processus d’immatriculation
              </p>

              <div className="row">
                <div className="col-md-6">
                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <h5 className="mb-3">Informations Client</h5>
                      <div className="media">
                        <i className="icon-copy fa fa-user-circle" aria-hidden="true"></i>
                        <div className="media-body">
                          <h5 className="mt-0">{clientInfo.prenom} {clientInfo.nom}</h5>
                          <h6 className="mb-1 text-blue">
                            <strong>Client </strong> {clientType || 'Non spécifié'}
                          </h6>
                          <p className="mb-1 ">
                            <strong>CINE :</strong> {clientInfo.cine}
                          </p>
                          <p className="mb-1">
                            <strong>Téléphone :</strong> {clientInfo.gsm}
                          </p>
                          <p className="mb-1">
                            <strong>Adresse :</strong> {clientInfo.adresse}
                          </p>
                          <p className="mb-1">
                            <strong>Email :</strong> {clientInfo.email || 'Non fourni'}
                          </p>
                          <p className="mb-1">
                            <strong>Date de validité :</strong> {clientInfo.dateValidite}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='dotted-border mt-3'>
                    <div className="mt-3">
                      <h6>Processus de validation</h6>
                      <i className="icon-copy fa fa-check-square-o" aria-hidden="true"><strong>Placez le CINE dans le scanner</strong></i> <br />
                      <p className='text-muted'>Assurez-vous que le document est bien positionné</p>
                      <i className="icon-copy fa fa-check-square-o" aria-hidden="true"><strong>Capture automatique</strong></i><br />
                      <p className='text-muted'>le scanner capture l'image du document</p>
                      <i className="icon-copy fa fa-check-square-o" aria-hidden="true"><strong>Extraction des informations</strong></i> <br />
                      <p className='text-muted'> le système affiche le document et extrait les données</p>
                      <i className="icon-copy fa fa-check-square-o" aria-hidden="true"><strong>Validation ou refus</strong></i><br />
                      <p className='text-muted'> vérifier la qualité et la lisibilité du document</p>
                    </div>
                  </div>  
                </div>

                <div className="col-md-6">
                  <div className="card border">
                    <div className="card-body">
                      <h5 className="mb-3">Téléchargement du CINE</h5>
                      <p className="text-muted mb-3">
                        Veuillez télécharger une copie claire et lisible du
                        CINE (recto-verso)
                      </p>
                      <p className="text-muted mb-3">
                        Formats acceptés : JPG, PNG, PDF (max 5MB)
                      </p>
                      <div className="custom-file">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="customFile"
                          onChange={handleFileChange}
                          accept="image/jpeg,image/png,application/pdf"
                        />
                        <label
                          className="custom-file-label"
                          htmlFor="customFile"
                        >
                          {file ? file.name : 'Choisir fichier PDF ou image'}
                        </label>
                      </div>
                      <div className="mt-4">
                        <h6>Aperçu Document</h6>
                        <div className="text-center py-5">
                          {filePreview ? (
                            <div>
                              {file?.type === 'application/pdf' ? (
                                <embed
                                  src={filePreview}
                                  type="application/pdf"
                                  width="100%"
                                  height="300px"
                                />
                              ) : (
                                <img
                                  src={filePreview}
                                  alt="Aperçu du document"
                                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                                />
                              )}
                            </div>
                          ) : (
                            <p className="text-muted">
                              En attente de document
                            </p>
                          )}
                        </div>
                      </div>
                      {filePreview && (
                        <div className="mt-4 d-flex justify-content-between">
                          {isValidated ? (
                            <h5 className="text-success">
                              Document validé
                            </h5>
                          ) : (
                            <>
                              <button
                                className="btn btn-success"
                                onClick={handleValidate}
                              >
                                Valider le Document
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={handleRefuse}
                              >
                                Refuser le Document
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
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
            disabled={!isValidated}
          >
            Continuer
          </button>
        </div>
      </div>

      {showValidateModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la validation</h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCancelValidate}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <p>
                  Vous êtes sur le point de valider ce CINE. Cette action
                  confirmera que le document est authentique, lisible et
                  contient toutes les informations requises. Souhaitez-vous
                  continuer ?
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelValidate}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleConfirmValidate}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRefuseModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">
                  Confirmer le refus
                </h5>
                <button
                  type="button"
                  className="close"
                  onClick={handleCancelRefuse}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body">
                <p className="text-danger">
                  <strong>ATTENTION :</strong> Vous êtes sur le point de
                  refuser ce CINE. Cette action indiquera que le document est
                  invalide, lisible ou incomplet. Le client devra fournir un
                  nouveau document. Cette étape ne pourra pas être annulée
                  qu’un document n’a pas été fourni.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancelRefuse}
                >
                  Annuler
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmRefuse}
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerificationCINE;