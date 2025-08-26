import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PlaqueInfo from './pages/CommandeImmatriculation/PlaqueInfo';
import Sites from './pages/SiteManagement';
import SiteList from './pages/SiteList';
import Login from './pages/login';
import TypeClient from './pages/CommandeImmatriculation/TypeClient';
import InfoClient from './pages/CommandeImmatriculation/InfoClient';
import VerificationCINE from './pages/CommandeImmatriculation/VerificationCINE';
import Documents from './pages/CommandeImmatriculation/Documents';
import Validation from './pages/CommandeImmatriculation/Validation';
import Confirmation from './pages/CommandeImmatriculation/Confirmation';
import Dashboard from './pages/Dashboard';
import Operateur from './pages/Operateur';
import PrivateRouteRole from './auth/PrivateRouteRole';
import Finalisation from './pages/CommandeImmatriculation/Finalisation';
import { StepProvider } from './pages/CommandeImmatriculation/StepContext';
import Commande from './pages/Commande';
import AjouterOperateur from './pages/AjouterOperateur';


const App = () => (
  <Router>
    <StepProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/commande" element={<Commande />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/typeclient" element={<TypeClient />} />
        <Route path="/infoclient" element={<InfoClient />} />
        <Route path="/PlaqueInfo" element={<PlaqueInfo />} />
        <Route path="/VerificationCINE" element={<VerificationCINE />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/validation" element={<Validation />} />
        <Route path="/finalisation" element={<Finalisation />} />
        <Route path="/operateur" element={<PrivateRouteRole allowedRoles={['operateur']}><Operateur /></PrivateRouteRole> } />

        <Route element={<MainLayout />}>
          <Route
            path="/Dashboard"
            element={
              <PrivateRouteRole allowedRoles={['admin']}>
                <Dashboard />
              </PrivateRouteRole>
            }
          />
          <Route
            path="/sites"
            element={
              <PrivateRouteRole allowedRoles={['admin']}>
                <Sites />
              </PrivateRouteRole>
            }
          />
          <Route
            path="/sites/list"
            element={
              <PrivateRouteRole allowedRoles={['admin']}>
                <SiteList />
              </PrivateRouteRole>
            }
          />
          <Route
            path="/addOp"
            element={
              <PrivateRouteRole allowedRoles={['admin']}>
                <AjouterOperateur />
              </PrivateRouteRole>
            }
          />
          <Route
            path="/commandes"
            element={
              <PrivateRouteRole allowedRoles={['admin']}>
                <Commande />
              </PrivateRouteRole>
            }
          />
        </Route>
      </Routes>
    </StepProvider>
  </Router>
);

export default App;