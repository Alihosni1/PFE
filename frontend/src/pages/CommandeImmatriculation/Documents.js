import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStep } from './StepContext';
import Form from './Form';

const Documents = () => {
  const clientType = localStorage.getItem('clientType');

  const [vehicleOwnerInfo, setVehicleOwnerInfo] = useState({
    nom: '',
    prenom: '',
    adresse: '',
  });

  const [vehicleData, setVehicleData] = useState({
    registrationNumber: '',
    brand: '',
    type: '',
    model: '',
    chassisNumber: '',
  });

  const [files, setFiles] = useState({
    carteGrise: null,
    procuration: null,
    rcCopy: null,
  });

  const [filePreviews, setFilePreviews] = useState({
    carteGrise: null,
    procuration: null,
    rcCopy: null,
  });

  const [isFormComplete, setIsFormComplete] = useState(false);
  const [isCarteGriseValidated, setIsCarteGriseValidated] = useState(false);
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showRefuseModal, setShowRefuseModal] = useState(false);

  useEffect(() => {
    const requiredFiles = clientType === 'societe'
      ? ['carteGrise', 'procuration', 'rcCopy']
      : ['carteGrise'];
    const allFilesProvided = requiredFiles.every((key) => files[key]);
    const allFieldsFilled =
      Object.values(vehicleData).every((field) => field.trim() !== '') &&
      Object.values(vehicleOwnerInfo).every((field) => field.trim() !== '') &&
      allFilesProvided && isCarteGriseValidated;
    setIsFormComplete(allFieldsFilled);
  }, [vehicleData, vehicleOwnerInfo, files, isCarteGriseValidated, clientType]);

  const handleOwnerInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleOwnerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleInputChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('Le fichier dépasse la limite de 5MB.');
        return;
      }
      const updatedFiles = { ...files, [fileType]: selectedFile };
      setFiles(updatedFiles);
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreviews((prev) => ({ ...prev, [fileType]: previewUrl }));

      if (fileType === 'carteGrise') {
        setIsCarteGriseValidated(false);
      }
    }
  };

  const handleValidateCarteGrise = () => {
    setShowValidateModal(true);
  };

  const handleConfirmValidate = () => {
    if (files.carteGrise) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result;
        const fileData = {
          name: files.carteGrise.name,
          type: files.carteGrise.type,
          data: base64String,
        };
        localStorage.setItem('carteGriseDocument', JSON.stringify(fileData));
      };
      reader.readAsDataURL(files.carteGrise);
    }
    setShowValidateModal(false);
    setIsCarteGriseValidated(true);
  };

  const handleCancelValidate = () => {
    setShowValidateModal(false);
  };

  const handleRefuseCarteGrise = () => {
    setShowRefuseModal(true);
  };

  const handleConfirmRefuse = () => {
    setShowRefuseModal(false);
    setFiles((prev) => ({ ...prev, carteGrise: null }));
    setFilePreviews((prev) => ({ ...prev, carteGrise: null }));
    setIsCarteGriseValidated(false);
    localStorage.removeItem('carteGriseDocument');
  };

  const handleCancelRefuse = () => {
    setShowRefuseModal(false);
  };

  const { markStepComplete } = useStep();
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate('/VerificationCINE');
  };

  const handleContinue = () => {
    if (isFormComplete) {
      // Save vehicle owner info
      localStorage.setItem('vehicleOwnerInfo', JSON.stringify(vehicleOwnerInfo));
      // Save vehicle data
      localStorage.setItem('vehicleData', JSON.stringify(vehicleData));
      // Save procuration and rcCopy if applicable
      const saveFileToLocalStorage = (file, key) => {
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const fileData = {
              name: file.name,
              type: file.type,
              data: reader.result,
            };
            localStorage.setItem(key, JSON.stringify(fileData));
          };
          reader.readAsDataURL(file);
        }
      };
      saveFileToLocalStorage(files.procuration, 'procurationDocument');
      saveFileToLocalStorage(files.rcCopy, 'rcCopyDocument');

      markStepComplete(3);
      navigate('/validation');
    }
  };

  return (
    <div>
      <Form />
      <div className="row">
        <div className="col-lg-12">
          <div className="dotted-border mt-3">
            <div className="card-body">
              <h4 className="text-blue h4 mb-1 text-center">Informations du Véhicule</h4>
              <p className="text-muted mb-4 text-center">
                Téléchargez les documents nécessaires et saisissez les informations du véhicule
              </p>

              <div className="row">
                <div className="col-md-6">
                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <h5 className="mb-3">Informations du Propriétaire</h5>
                      <form>
                        <div className="form-group mb-3">
                          <label htmlFor="nom">Nom *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="nom"
                            name="nom"
                            value={vehicleOwnerInfo.nom}
                            onChange={handleOwnerInputChange}
                            required
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="prenom">Prénom *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="prenom"
                            name="prenom"
                            value={vehicleOwnerInfo.prenom}
                            onChange={handleOwnerInputChange}
                            required
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="adresse">Adresse *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="adresse"
                            name="adresse"
                            value={vehicleOwnerInfo.adresse}
                            onChange={handleOwnerInputChange}
                            required
                          />
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <h5 className="mb-3">Informations sur le Véhicule</h5>
                      <form>
                        <div className="form-group mb-3">
                          <label htmlFor="registrationNumber">Numéro d’immatriculation *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="registrationNumber"
                            name="registrationNumber"
                            value={vehicleData.registrationNumber}
                            onChange={handleVehicleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="brand">Marque *</label>
                          <select
                            className="form-control"
                            id="brand"
                            name="brand"
                            value={vehicleData.brand}
                            onChange={handleVehicleInputChange}
                            required
                          >
                            <option value="">Sélectionnez une marque</option>
                            <option value="Dodge">Dodge</option>
                            <option value="Toyota">Toyota</option>
                            <option value="Renault">Renault</option>
                            <option value="Peugeot">Peugeot</option>
                            <option value="Ford">Ford</option>
                            <option value="Honda">Honda</option>
                          </select>
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="type">Type *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="type"
                            name="type"
                            value={vehicleData.type}
                            onChange={handleVehicleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="model">Modèle *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="model"
                            name="model"
                            value={vehicleData.model}
                            onChange={handleVehicleInputChange}
                            required
                          />
                        </div>
                        <div className="form-group mb-3">
                          <label htmlFor="chassisNumber">N° du châssis *</label>
                          <input
                            type="text"
                            className="form-control"
                            id="chassisNumber"
                            name="chassisNumber"
                            value={vehicleData.chassisNumber}
                            onChange={handleVehicleInputChange}
                            required
                          />
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  {clientType === 'societe' && (
                    <>
                      <div className="dotted-border mt-3">
                        <div className="card-body">
                          <div className="pull-right">
                            <a href="###" className="btn btn-danger btn-sm scroll-click">Obligatoire</a>
                          </div>
                          <h5 className="mb-3">Procuration Légalisée</h5>
                          <p className="text-muted mb-3">Autorisation d'immatriculation au nom de la société.</p>
                          <div className="custom-file mb-3">
                            <input
                              type="file"
                              className="custom-file-input"
                              id="procurationFile"
                              onChange={(e) => handleFileChange(e, 'procuration')}
                              accept="image/jpeg,image/png,application/pdf"
                            />
                            <label className="custom-file-label" htmlFor="procurationFile">
                              {files.procuration ? files.procuration.name : 'Choisir un fichier'}
                            </label>
                          </div>
                          {filePreviews.procuration && (
                            <div className="text-center py-3">
                              {files.procuration.type === 'application/pdf' ? (
                                <embed src={filePreviews.procuration} type="application/pdf" width="100%" height="300px" />
                              ) : (
                                <img src={filePreviews.procuration} alt="Aperçu Procuration" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="dotted-border mt-3">
                        <div className="card-body">
                          <div className="pull-right">
                            <a href="###" className="btn btn-danger btn-sm scroll-click">Obligatoire</a>
                          </div>
                          <h5 className="mb-3">Copie RC Certifiée Conforme</h5>
                          <p className="text-muted mb-3">Registre de Commerce certifié conforme à l’original.</p>
                          <div className="custom-file mb-3">
                            <input
                              type="file"
                              className="custom-file-input"
                              id="rcCopyFile"
                              onChange={(e) => handleFileChange(e, 'rcCopy')}
                              accept="image/jpeg,image/png,application/pdf"
                            />
                            <label className="custom-file-label" htmlFor="rcCopyFile">
                              {files.rcCopy ? files.rcCopy.name : 'Choisir un fichier'}
                            </label>
                          </div>
                          {filePreviews.rcCopy && (
                            <div className="text-center py-3">
                              {files.rcCopy.type === 'application/pdf' ? (
                                <embed src={filePreviews.rcCopy} type="application/pdf" width="100%" height="300px" />
                              ) : (
                                <img src={filePreviews.rcCopy} alt="Aperçu RC" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  <div className="dotted-border mt-3">
                    <div className="card-body">
                      <div className="pull-right">
                        <a href="###" className="btn btn-danger btn-sm scroll-click">Obligatoire</a>
                      </div>
                      <h5 className="mb-3">Carte Grise</h5>
                      <p className="text-muted mb-3">Copie lisible recto-verso. Formats : JPG, PNG, PDF</p>
                      <div className="custom-file mb-3">
                        <input
                          type="file"
                          className="custom-file-input"
                          id="carteGriseFile"
                          onChange={(e) => handleFileChange(e, 'carteGrise')}
                          accept="image/jpeg,image/png,application/pdf"
                        />
                        <label className="custom-file-label" htmlFor="carteGriseFile">
                          {files.carteGrise ? files.carteGrise.name : 'Parcourir'}
                        </label>
                      </div>
                      {filePreviews.carteGrise && (
                        <div className="text-center py-3">
                          {files.carteGrise.type === 'application/pdf' ? (
                            <embed src={filePreviews.carteGrise} type="application/pdf" width="100%" height="300px" />
                          ) : (
                            <img src={filePreviews.carteGrise} alt="Aperçu Carte Grise" style={{ maxWidth: '100%', maxHeight: '300px' }} />
                          )}
                        </div>
                      )}
                      {filePreviews.carteGrise && (
                        <div className="mt-4 d-flex justify-content-between">
                          {isCarteGriseValidated ? (
                            <h5 className="text-success">Document validé</h5>
                          ) : (
                            <>
                              <button
                                className="btn btn-success"
                                onClick={handleValidateCarteGrise}
                              >
                                Valider le Document
                              </button>
                              <button
                                className="btn btn-danger"
                                onClick={handleRefuseCarteGrise}
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

              <div className="dotted-border mt-3">
                <div className="alert alert-warning text-justify">
                  <strong>Informations importantes</strong><br />
                  Tous les champs marqués d’un astérisque (*) sont obligatoires<br />
                  Les documents doivent être au format PDF ou image (JPG, PNG)<br />
                  Taille maximale du fichier : 5 Mo<br />
                  Les informations doivent correspondre exactement à celles figurant sur les documents
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={handlePrevious}>Précédent</button>
          <button className="btn btn-primary" onClick={handleContinue} disabled={!isFormComplete}>Continuer</button>
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
                  Vous êtes sur le point de valider la Carte Grise. Cette action
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
                  refuser la Carte Grise. Cette action indiquera que le document est
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

export default Documents;