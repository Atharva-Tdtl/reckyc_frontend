import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://tdtlworld.com/rekyc-backend/api' 
});

API.interceptors.request.use(config => {
  const token = localStorage.getItem('kyc_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('kyc_token');
      // window.location.href = '/login'; // Disabled for demo stability
    }
    return Promise.reject(err);
  }
);

export const AI = axios.create({ 
  baseURL: 'https://tdtlworld.com/rekyc-backend/ai' 
});

export default API;
