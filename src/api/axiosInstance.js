import axios from 'axios';
import { STORAGE_KEYS } from '@/constants/storageKeys';

const API_BASE_URL = import.meta.env.DEV
  ? '/api'
  : import.meta.env.VITE_API_BASE_URL || '/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Attach the auth token and the active company on every request.
// The backend must still verify that the user is allowed to access that company.
axiosInstance.interceptors.request.use((config) => {
  try {
    const auth = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || 'null');
    if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`;
  } catch {
    /* ignore corrupted storage */
  }
  const companyId = localStorage.getItem(STORAGE_KEYS.ACTIVE_COMPANY);
  if (companyId) config.headers['X-Company-Id'] = companyId;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
      if (window.location.pathname !== '/login') window.location.assign('/login');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
