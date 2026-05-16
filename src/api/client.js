import axios from 'axios';

const API = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api' 
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
  baseURL: import.meta.env.VITE_AI_URL || 'http://localhost:8010' 
});

export default API;
