import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token envoyé:', token);
  } else {
    console.warn('Aucun token trouvé dans localStorage');
  }
  console.log('Requête:', config.url, config.headers);
  return config;
}, error => {
  console.error('Erreur d\'interceptor:', error);
  return Promise.reject(error);
});

API.interceptors.response.use(
  response => {
    if (response.config.url === '/login' && response.data.nomOperateur) {
      localStorage.setItem('userData', JSON.stringify({ 
        nomOperateur: response.data.nomOperateur,
        prenomOperateur: response.data.prenomOperateur 
      }));
    }
    return response;
  },
  error => {
    console.error('Erreur de réponse:', error.response?.status, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const postSite = (data) => API.post('/sites', data);

export const postCommande = async (data) => {
  try {
    const response = await API.post('/commandes', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l’envoi de la commande.');
  }
};

export const getCommandes = async () => {
  try {
    const response = await API.get('/commandes');
    return response.data || [];
  } catch (error) {
    console.error('Détails de l\'erreur getCommandes:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des commandes.');
  }
};

export const getSites = async () => {
  try {
    const response = await API.get('/sites');
    return response.data || [];
  } catch (error) {
    console.error('Détails de l\'erreur getSites:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des sites.');
  }
};

export const createSite = async (data) => {
  try {
    const response = await API.post('/sites', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la création du site.');
  }
};

export const updateSite = async (id, data) => {
  try {
    const response = await API.put(`/sites/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la modification du site.');
  }
};

export const getActiveSites = async () => {
  try {
    const response = await API.get('/active-sites');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des sites actifs.');
  }
};

export const getCommandesBySite = async (siteId) => {
  try {
    const response = await API.get(`/commandes/site/${siteId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des commandes.');
  }
};

export const updateSiteStatus = async (id, status) => {
  try {
    const response = await API.put(`/sites/${id}/status`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de la mise à jour du statut.');
  }
};

export const addOperateur = async (siteId, operateurData) => {
  try {
    const response = await API.post(`/sites/${siteId}/operateurs`, operateurData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Erreur lors de l\'ajout de l\'opérateur.');
  }
};