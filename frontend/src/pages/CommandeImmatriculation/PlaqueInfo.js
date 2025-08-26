import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PlaqueInfo.css';
import { postCommande } from '../../services/api';
import { useStep } from './StepContext';

const CommandePlaque = () => {
  const generateCommandNumber = () => {
    return `CMD-${Date.now()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  };

  const vehicleData = JSON.parse(localStorage.getItem('vehicleData')) || {
    registrationNumber: '',
    chassisNumber: '',
    brand: '',
    model: '',
  };
  const clientInfo = JSON.parse(localStorage.getItem('clientInfo')) || {
    nom: '',
    prenom: '',
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
  const clientTypeRaw = localStorage.getItem('clientType') || 'Particulier';
  const clientType = clientTypeRaw.charAt(0).toUpperCase() + clientTypeRaw.slice(1).toLowerCase();
  const cineDocument = JSON.parse(localStorage.getItem('cineDocument')) || null;
  const carteGriseDocument = JSON.parse(localStorage.getItem('carteGriseDocument')) || null;
  const procurationDocument = JSON.parse(localStorage.getItem('procurationDocument')) || null;
  const rcCopyDocument = JSON.parse(localStorage.getItem('rcCopyDocument')) || null;

  const userData = JSON.parse(localStorage.getItem('userData')) || {};
  const agentCode = `${userData.nomOperateur || 'Inconnu'} ${userData.prenomOperateur || 'Inconnu'}`.trim();

  const [numeroCommande, setNumeroCommande] = useState(generateCommandNumber());
  const [dateValidation, setDateValidation] = useState('');
  const [numeroImmatriculation, setNumeroImmatriculation] = useState(vehicleData.registrationNumber);
  const [numeroChassis, setNumeroChassis] = useState(vehicleData.chassisNumber);
  const [marqueModele, setMarqueModele] = useState(`${vehicleData.brand} ${vehicleData.model}`.trim());
  const [prix, setPrix] = useState(0);
  const [motif, setMotif] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [frontPlate, setFrontPlate] = useState(false);
  const [rearPlate, setRearPlate] = useState(false);
  const [quantity, setQuantity] = useState(0);

  const options = [
    { plaque: "GF-F1", vehicule: "VÉHICULE LÉGER", price: 250.00, image: "vehicule-leger.jpg", hasFront: true, hasRear: true },
    { plaque: "MF-F2", vehicule: "VÉHICULE POIDS LOURD", price: 200.00, image: "poids-lourd.jpg", hasFront: true, hasRear: true },
    { plaque: "RMR-F3", vehicule: "REMORQUE", price: 180.00, image: "remorque.jpg", hasFront: false, hasRear: true },
    { plaque: "MOTO-F4", vehicule: "MOTO", price: 150.00, image: "moto.jpg", hasFront: false, hasRear: true },
    { plaque: "CYCLO-F5", vehicule: "CYCLOMOTEUR", price: 120.00, image: "cyclo.jpg", hasFront: false, hasRear: true },
  ];

  useEffect(() => {
    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    setDateValidation(formattedDate);

    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.nomOperateur || payload.prenomOperateur) {
        localStorage.setItem('userData', JSON.stringify({
          nomOperateur: payload.nomOperateur || 'Inconnu',
          prenomOperateur: payload.prenomOperateur || 'Inconnu'
        }));
      }
    }
  }, []);

  const handleTopCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      const option = options.find(opt => `${opt.plaque} - ${opt.vehicule}` === value);
      setSelectedOption(option);
      setPrix((frontPlate || rearPlate ? (frontPlate && rearPlate ? 2 : 1) : 0) * (option?.price || 0));
    } else {
      setSelectedOption(null);
      setFrontPlate(false);
      setRearPlate(false);
      setQuantity(0);
      setPrix(0);
    }
  };

  const handlePlateCheckboxChange = (e, position) => {
    const { checked } = e.target;
    if (position === 'front') {
      setFrontPlate(checked);
    } else {
      setRearPlate(checked);
    }
    const newQuantity = (checked ? 1 : 0) + (position === 'front' ? (rearPlate ? 1 : 0) : (frontPlate ? 1 : 0));
    setQuantity(newQuantity);
    setPrix(newQuantity * (selectedOption?.price || 0));
  };

  const { markStepComplete } = useStep(); 
  const navigate = useNavigate();

  const handlePrevious = () => {
    navigate('/validation');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Données envoyées à l\'API:', {
      numeroCommande,
      dateValidation,
      agentCode,
      clientType,
      clientInfo,
      vehicleOwnerInfo,
      vehicleData,
      numeroImmatriculation,
      numeroChassis,
      marqueModele,
      motif,
      typePlaque: selectedOption?.plaque || '',
      typeVehicule: selectedOption?.vehicule || '',
      frontPlate,
      rearPlate,
      quantity,
      prix,
      documents: [
        { name: 'CINE', description: 'Carte d’identité nationale électronique', fileName: 'cine.jpg', fileType: 'image/jpeg', filePath: null },
        { name: 'Carte Grise', description: 'Certificat d’immatriculation', fileName: 'carte_grise.pdf', fileType: 'application/pdf', filePath: null },
      ],
    });

    const documents = [
      {
        name: 'CINE',
        description: 'Carte d’identité nationale électronique',
        fileName: cineDocument?.name || '',
        fileType: cineDocument?.type || '',
        filePath: null,
      },
      {
        name: 'Carte Grise',
        description: 'Certificat d’immatriculation',
        fileName: carteGriseDocument?.name || '',
        fileType: carteGriseDocument?.type || '',
        filePath: null,
      },
      ...(clientType === 'societe' ? [
        {
          name: 'Procuration',
          description: 'Autorisation d’immatriculation au nom de la société',
          fileName: procurationDocument?.name || '',
          fileType: procurationDocument?.type || '',
          filePath: null,
        },
        {
          name: 'Copie RC',
          description: 'Registre de Commerce certifié conforme',
          fileName: rcCopyDocument?.name || '',
          fileType: rcCopyDocument?.type || '',
          filePath: null,
        },
      ] : []),
    ];

    const data = {
      numeroCommande,
      dateValidation,
      agentCode,
      clientType,
      clientInfo,
      vehicleOwnerInfo,
      vehicleData: {
        registrationNumber: numeroImmatriculation,
        chassisNumber: numeroChassis,
        brand: marqueModele.split(' ')[0] || vehicleData.brand,
        model: marqueModele.split(' ').slice(1).join(' ') || vehicleData.model,
        type: vehicleData.type,
      },
      numeroImmatriculation,
      numeroChassis,
      marqueModele,
      motif,
      typePlaque: selectedOption?.plaque || '',
      typeVehicule: selectedOption?.vehicule || '',
      frontPlate,
      rearPlate,
      quantity,
      prix,
      documents,
    };

    try {
      await postCommande(data);
      localStorage.setItem('commandePlaque', JSON.stringify({
        numeroCommande,
        dateValidation,
        agentCode,
        numeroImmatriculation,
        numeroChassis,
        marqueModele,
        motif,
        typePlaque: selectedOption?.plaque || '',
        typeVehicule: selectedOption?.vehicule || '',
        frontPlate,
        rearPlate,
        quantity,
        prix,
      }));
      markStepComplete(5);
      navigate('/confirmation');
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la commande :", error.message);
      alert(`Erreur lors de la commande : ${error.message}`);
    }
  };

  return (
    <div className="card-box mb-30 p-3">
      <h4 className="text-blue h4 mb-4 text-center">Commande de Plaques</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group row">
          <label className="col-sm-12 col-md-2 col-form-label">COMMANDE N°:</label>
          <div className="col-sm-12 col-md-3">
            <input className="form-control" type="text" value={numeroCommande} readOnly />
          </div>
          <label className="col-sm-12 col-md-3 col-form-label">DATE ET HEURE DE LA COMMANDE</label>
          <div className="col-sm-12 col-md-3">
            <input type="datetime-local" className="form-control" value={dateValidation} onChange={(e) => setDateValidation(e.target.value)} />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-12 col-md-2 col-form-label">L’AGENT EN CHARGE</label>
          <div className="col-sm-12 col-md-7">
            <input className="form-control" type="text" value={agentCode} readOnly />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-sm-12 col-md-2 col-form-label">Type de commande :</label>
          {[
            "NOUVELLE PLAQUE",
            "DUP",
            "REMP"
          ].map((item, i) => (
            <div className="custom-control custom-checkbox col-md-3 mb-2 ms-3" key={i}>
              <input type="checkbox" className="custom-control-input" id={`motif-${i}`} value={item} onChange={(e) => {
                const { checked, value } = e.target;
                if (checked) {
                  setMotif([...motif, value]);
                } else {
                  setMotif(motif.filter((m) => m !== value));
                }
              }} />
              <label className="custom-control-label" htmlFor={`motif-${i}`}>{item}</label>
            </div>
          ))}
        </div>

        <div className="form-group">
          <label className="col-form-label titre-section">Type de plaque par catégorie :</label>
          <div className="row">
            {options.map((option, i) => (
              <div className="custom-control custom-checkbox mb-4 text-center vehicule-item col-md-2" key={i}>
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id={`option-top-${i}`}
                  value={`${option.plaque} - ${option.vehicule}`}
                  checked={selectedOption && `${selectedOption.plaque} - ${selectedOption.vehicule}` === `${option.plaque} - ${option.vehicule}`}
                  onChange={handleTopCheckboxChange}
                />
                <label className="custom-control-label" htmlFor={`option-top-${i}`}>
                  {option.plaque} - {option.vehicule} <br /> {option.price} MAD
                </label>
                <div className="d-flex align-items-center justify-content-center">
                  {option.hasFront && (
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input me-2"
                        id={`option-left-${i}`}
                        value={`${option.plaque} - ${option.vehicule}`}
                        checked={frontPlate && selectedOption && `${selectedOption.plaque} - ${selectedOption.vehicule}` === `${option.plaque} - ${option.vehicule}`}
                        onChange={(e) => handlePlateCheckboxChange(e, 'front')}
                        disabled={!selectedOption || `${selectedOption.plaque} - ${selectedOption.vehicule}` !== `${option.plaque} - ${option.vehicule}`}
                      />
                      <label className="custom-control-label" htmlFor={`option-left-${i}`}></label>
                    </div>
                  )}
                  <div>
                    <img
                      src={`/assets/images/vehicules/${option.image}`}
                      alt={option.vehicule}
                      className="vehicule-img"
                    />
                  </div>
                  {option.hasRear && (
                    <div className="custom-control custom-checkbox">
                      <input
                        type="checkbox"
                        className="custom-control-input ms-2"
                        id={`option-right-${i}`}
                        value={`${option.plaque} - ${option.vehicule}`}
                        checked={rearPlate && selectedOption && `${selectedOption.plaque} - ${selectedOption.vehicule}` === `${option.plaque} - ${option.vehicule}`}
                        onChange={(e) => handlePlateCheckboxChange(e, 'rear')}
                        disabled={!selectedOption || `${selectedOption.plaque} - ${selectedOption.vehicule}` !== `${option.plaque} - ${option.vehicule}`}
                      />
                      <label className="custom-control-label" htmlFor={`option-right-${i}`}></label>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-8 col-md-2 col-form-label">Mettre à jour le prix :</label>
          <div className="col-sm-8 col-md-3">
            <input
              className="form-control"
              type="number"
              value={prix || ''}
              onChange={(e) => setPrix(parseFloat(e.target.value) || 0)}
              step="0.01"
              min="0"
            />
          </div>
          <div className="col-sm-8 col-md-3 offset-md-4 text-right">
            <h5 className="text-blue">Total de la commande : {prix ? `${prix} MAD` : '0,00 MAD'}</h5>
          </div>
        </div>
        <div className="form-group row mt-4">
          <div className="col-md-8">
            <div className='dotted-border mt-3'>
              <h5 className="text-blue">Résumé de la Commande</h5>
            </div>
            <div className="row">
              <div className="col-md-6 mt-2">
                <h6>INFORMATIONS DU VÉHICULE</h6>
                <div className='dotted-border mt-3'>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Numéro d’immatriculation :</label>  
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={numeroImmatriculation} readOnly />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Numéro de châssis :</label>
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={numeroChassis} readOnly />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Marque & Modèle :</label>
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={marqueModele} readOnly />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Type de véhicule :</label>
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={selectedOption?.vehicule || ''} readOnly />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mt-2">
                <h6>DÉTAILS DE LA PLAQUE</h6>
                <div className='dotted-border mt-3'>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Type de commande :</label>
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={motif.join(', ') || ''} readOnly />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Responsable :</label>
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={agentCode} readOnly />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Type de plaque :</label>
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={selectedOption?.plaque || ''} readOnly />
                    </div>
                  </div>
                  <div className="form-group row">
                    <label className="col-sm-12 col-md-6 col-form-label">Plaques commandées :</label>
                    <div className="col-sm-12 col-md-6">
                      <input className="form-control" type="text" value={`${frontPlate ? 'Avant' : ''}${frontPlate && rearPlate ? ', ' : ''}${rearPlate ? 'Arrière' : ''}` || ''} readOnly />
                    </div>
                  </div>
                </div> 
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className='dotted-border mt-3'>
              <h5 className="text-blue">Résumé des Coûts</h5>
            </div>  
            <div className='dotted-border mt-3'>
              <div className="form-group row">
                <label className="col-sm-12 col-md-6 col-form-label">Prix unitaire :</label>
                <div className="col-sm-12 col-md-6">
                  <input className="form-control" type="text" value={selectedOption ? `${selectedOption.price} MAD` : '0,00 MAD'} readOnly />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-6 col-form-label">Quantité :</label>
                <div className="col-sm-12 col-md-6">
                  <input className="form-control" type="text" value={quantity} readOnly />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-6 col-form-label">Sous-total :</label>
                <div className="col-sm-12 col-md-6">
                  <input className="form-control" type="text" value={prix ? `${prix} MAD` : '0,00 MAD'} readOnly />
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-12 col-md-6 col-form-label">Total :</label>
                <div className="col-sm-12 col-md-6">
                  <input className="form-control" type="text" value={prix ? `${prix} MAD` : '0,00 MAD'} readOnly />
                </div>
              </div>
            </div>
          </div> 
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-secondary" onClick={handlePrevious}>Précédent</button>
          <button type="submit" className="btn btn-primary">Continuer</button>
        </div>
      </form>
    </div>
  );
};

export default CommandePlaque;