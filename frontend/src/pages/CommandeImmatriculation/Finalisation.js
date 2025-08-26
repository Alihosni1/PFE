import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useStep } from './StepContext';

const Finalisation = () => {
  const [progress, setProgress] = useState(17);
  const [logs, setLogs] = useState([
    '[12:18:15] Démarrage de la vérification...',
    '[12:18:17] Validation des informations du client...',
    
  ]);

  useEffect(() => {
    const intervals = [
      { time: 2000, log: '[12:18:19] Vérification de narsa...', progress: 40 },
      { time: 4000, log: '[12:18:21] Validation des documents...', progress: 70 },
      { time: 6000, log: '[12:18:23] Vérification terminée.', progress: 100 },
    ];

    intervals.forEach(({ time, log, progress }, index) => {
      const timeout = setTimeout(() => {
        setLogs((prevLogs) => [...prevLogs.slice(0, index + 3), log]);
        setProgress(progress);
      }, time);

      return () => clearTimeout(timeout);
    });
  }, []);
    const { markStepComplete } = useStep();
  const navigate=useNavigate();
  const handlePrevious = () => {
    navigate('/confirmation')
  };

  const handleContinue = () => {
     if(progress===100){   
        markStepComplete(7)
        navigate('/Operateur')
        }     
};



  return (
    <div className="p-8 bg-gray-100 min-h-screen">

        <h1 className="text-blue h4 mb-1 text-center">Vérification de Conformité</h1>
        <p className="text-muted mb-4 text-center">
            Vérification de la commande en cours avant confirmation finale
        </p>
     
      <div className="bg-white p-6 rounded-b-lg shadow-md">
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="row flex items-center mb-2">
            <FaCheckCircle className="text-blue-600 mr-2" />
            <h3 className="font-semibold text-gray-800">État de la Vérification</h3>
          </div>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <FaSync className="text-blue-600 mr-2" />
              <span className="font-medium text-gray-800">Vérification des données client...</span>
            </div>
            <div className="progress mt-3">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${progress}%` }}
                aria-valuenow={progress}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{progress}% complété</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">
            Console de vérification
          </p>
          {logs.map((log, index) => (
            <p key={index} className="text-sm text-blue-600 mt-2">
              {log}
            </p>
          ))}
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button type="button" className="btn btn-secondary" onClick={handlePrevious}>Précédent</button>
          <button type="submit" className="btn btn-primary" onClick={handleContinue}>Continuer</button>
        </div>
      </div>
    </div>
  );
};

export default Finalisation;