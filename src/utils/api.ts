import axios from 'axios';
import { parseCookies } from 'nookies';

export const setupAPIClient = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
  });

  api.interceptors.request.use((config) => {
    const cookies = parseCookies();
    const token = cookies['@app.token'];

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  });

  return api;
};
