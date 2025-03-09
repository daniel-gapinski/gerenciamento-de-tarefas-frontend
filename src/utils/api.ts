import axios from 'axios';
import { parseCookies } from 'nookies';

// Cria uma instância do Axios com a configuração básica
export const setupAPIClient = () => {
  const api = axios.create({
    baseURL: 'http://localhost:3000', // URL do seu backend
  });

  // Adiciona o token no cabeçalho de cada requisição
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
