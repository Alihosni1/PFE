import { FaUser, FaCar, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStep } from './StepContext';    



const ConfirmationPage = () => {
  const { markStepComplete } = useStep();
  const navigate = useNavigate();

  // Récupérer les données de localStorage
  const clientInfo = JSON.parse(localStorage.getItem('clientInfo')) || {
    nom: '',
    prenom: '',
    cine: '',
    gsm: '',
    email: '',
  };
  const vehicleOwnerInfo = JSON.parse(localStorage.getItem('vehicleOwnerInfo')) || {
    adresse: '',
  };
  const vehicleData = JSON.parse(localStorage.getItem('vehicleData')) || {
    registrationNumber: '',
    chassisNumber: '',
    brand: '',
    type: '',
  };
  const commandePlaque = JSON.parse(localStorage.getItem('commandePlaque')) || {
    numeroCommande: '',
    motif: [],
    typePlaque: '',
    prix: 0,
    quantity: 0,
    dateValidation: '',
  };
  const clientType = localStorage.getItem('clientType') || 'Particulier';

  const documents = [
    { name: 'CINE', description: 'Carte d’identité nationale électronique' },
    { name: 'Carte Grise', description: 'Certificat d’immatriculation' },
    ...(clientType === 'societe' ? [
      { name: 'Procuration', description: 'Autorisation d’immatriculation au nom de la société' },
      { name: 'Copie RC', description: 'Registre de Commerce certifié conforme' },
    ] : []),
  ];
  const totalDocuments = documents.length;
  const validatedDocuments = totalDocuments; // Tous validés depuis Validation.js
  const progressPercentage = (validatedDocuments / totalDocuments) * 100;

  const handlePrevious = () => {
    navigate('/PlaqueInfo');
  };

  const handleContinue = () => {
    markStepComplete(6);
    // Nettoyer localStorage après confirmation
    localStorage.removeItem('clientInfo');
    localStorage.removeItem('vehicleOwnerInfo');
    localStorage.removeItem('vehicleData');
    localStorage.removeItem('cineDocument');
    localStorage.removeItem('carteGriseDocument');
    localStorage.removeItem('procurationDocument');
    localStorage.removeItem('rcCopyDocument');
    localStorage.removeItem('commandePlaque');
    localStorage.removeItem('clientType');
    navigate('/finalisation');
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className='pull-right'>
        <a href='###' className="btn btn-primary btn-sm scroll-click">
          Référence: {commandePlaque.numeroCommande || 'Non disponible'}
        </a>
      </div>
      
      <h1 className="text-blue h4 mb-1 text-center">Confirmation de votre commande</h1>
      <p className="text-muted mb-4 text-center">
        Veuillez vérifier les détails ci-dessous avant de finaliser votre commande
      </p>

      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="mb-6">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-gray-50 text-left">
                  <div className="row flex items-center">
                    <FaUser className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Informations client</h3>
                  </div>
                </th>
                <th className="p-4 bg-gray-50 text-left">
                  <div className="row flex items-center">
                    <FaCar className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Informations véhicule</h3>
                  </div>
                </th>
                <th className="p-4 bg-gray-50 text-left">
                  <div className="row flex items-center">
                    <FaFileAlt className="text-blue-600 mr-2" />
                    <h3 className="font-semibold text-gray-800">Détails de la commande</h3>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border-t border-gray-200">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium">Identité:</span> {`${clientInfo.nom} ${clientInfo.prenom}`.trim() || 'Non fourni'}</li>
                    <li><span className="font-medium">CINE:</span> {clientInfo.cine || 'Non fourni'}</li>
                    <li><span className="font-medium">Adresse:</span> {vehicleOwnerInfo.adresse || 'Non fourni'}</li>
                    <li><span className="font-medium">Contact:</span> {clientInfo.gsm || 'Non fourni'}</li>
                    <li><span className="font-medium">Email:</span> {clientInfo.email || 'Non fourni'}</li>
                  </ul>
                </td>
                <td className="p-4 border-t border-gray-200">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium">Immatriculation:</span> {vehicleData.registrationNumber || 'Non fourni'}</li>
                    <li><span className="font-medium">Numéro de châssis:</span> {vehicleData.chassisNumber || 'Non fourni'}</li>
                    <li><span className="font-medium">Marque:</span> {vehicleData.brand || 'Non fourni'}</li>
                    <li><span className="font-medium">Type:</span> {vehicleData.type || 'Non fourni'}</li>
                  </ul>
                </td>
                <td className="p-4 border-t border-gray-200">
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium">Type de commande:</span> {commandePlaque.motif.join(', ') || 'Non fourni'}</li>
                    <li><span className="font-medium">Type de plaque:</span> {commandePlaque.typePlaque || 'Non fourni'}</li>
                    <li><span className="font-medium">Prix unitaire:</span> {commandePlaque.quantity > 0 ? `${(commandePlaque.prix / commandePlaque.quantity).toFixed(2)} MAD` : '0.00 MAD'}</li>
                    <li><span className="font-medium">Date de commande:</span> {new Date(commandePlaque.dateValidation).toLocaleDateString('fr-FR') || 'Non fourni'}</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="row flex items-center mb-2">
            <FaCheckCircle className="text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-800">État des documents</h3>
          </div>
          <div className='pull-right'>
            <a href='###' className="btn btn-primary btn-sm scroll-click">{`${validatedDocuments}/${totalDocuments} documents`}</a>
          </div>
          <br />
          <div className="progress mt-3">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${progressPercentage}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded-lg border border-green-200">
                <div>
                  <strong>{doc.name}</strong>
                  <span className="text-green-600 pull-right">Validé</span>
                  <p className="text-muted mb-4">{doc.description}</p>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-secondary" onClick={handlePrevious}>Précédent</button>
          <button type="button" className="btn btn-primary" onClick={handleContinue}>Confirmer la commande</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;