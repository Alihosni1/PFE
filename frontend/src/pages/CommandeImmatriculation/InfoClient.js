import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from './Form';
import { useStep } from './StepContext';

const InfoClient = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    cine: '',
    adresse: '',
    dateValidite: '',
    gsm: '',
    email: ''
  });
  const navigate = useNavigate();
  const { markStepComplete } = useStep(); 

  const handlePrevious = () => {
    navigate('/typeclient');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('clientInfo', JSON.stringify(formData));
    markStepComplete(1);
    navigate('/VerificationCINE');
  };

  return (
    <>
      <Form />
      <div className='dotted-border mt-3'>
        <h4 className="text-blue h4 mb-1 text-center">Information du Client</h4>
        <p className="mb-4 text-center">Entrez les informations du particulier</p>
      </div>
      <form onSubmit={handleSubmit}>
       <div className='dotted-border mt-3'>
        <div className="form-group row">
          <div className="col-md-4 col-sm-12">
            <label>NOM *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nom"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>PRENOM *</label>
            <input
              type="text"
              className="form-control"
              placeholder="Prénom"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-4 col-sm-12">
            <label>CINE N° *</label>
            <input
              type="text"
              className="form-control"
              placeholder="CINE N°"
              name="cine"
              value={formData.cine}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-12 col-md-4 col-form-label">ADRESSE *</label>
          <div className="col-sm-12 col-md-6">
            <input
              className="form-control"
              type="text"
              placeholder="ADRESSE"
              name="adresse"
              value={formData.adresse}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-12 col-md-5 col-form-label">
            DATE DE VALIDITE *
          </label>
          <div className="col-sm-12 col-md-3">
            <input
              type="date"
              className="form-control"
              name="dateValidite"
              value={formData.dateValidite}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-12 col-md-4 col-form-label">
            N° DE GSM *
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              className="form-control"
              type="tel"
              placeholder=""
              name="gsm"
              value={formData.gsm}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-12 col-md-4 col-form-label">
            EMAIL (optionnel)
          </label>
          <div className="col-sm-12 col-md-6">
            <input
              className="form-control"
              type="email"
              placeholder="aaaaaa@example.com"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>
       </div> 
        <div className="d-flex justify-content-between mt-3">
          <button type="button" className="btn btn-secondary" onClick={handlePrevious} >
            Précédent
          </button>
          <button type="submit" className="btn btn-success">
            Continuer
          </button>
        </div>
      </form>
    </>
  );
};

export default InfoClient;