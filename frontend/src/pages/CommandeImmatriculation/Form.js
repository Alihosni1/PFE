import React from 'react';
import { Stepper, Step, StepLabel, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useStep } from './StepContext'; 

const steps = ['Type de client', 'Informations client', 'Vérification CINE','Documents','Validation','Commande plaque','Confirmation','Finalisation'];

export default function Form() {
  const location = useLocation();
  const { completedSteps } = useStep();

  const getActiveStep = () => {
    if (location.pathname.includes('/typeclient')) return 0;
    if (location.pathname.includes('/infoclient')) return 1;
    if (location.pathname.includes('/verificationcine')) return 2;
    if(location.pathname.includes('/documents')) return 3;
    if(location.pathname.includes('/validation')) return 4;
    if(location.pathname.includes('/commandes')) return 5;
    if(location.pathname.includes('/confirmation')) return 6;
    if(location.pathname.includes('/finalisation')) return 7;


    return 0;
  };

  return (
    
        <Box sx={{ width: '100%', mt: 2 }}>
          <strong>Commande d'immatriculation</strong><br />
          <br />
          <Stepper activeStep={getActiveStep()}>
            {steps.map((label, index) => (
              <Step key={index} completed={completedSteps.includes(index)}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
  );
}
