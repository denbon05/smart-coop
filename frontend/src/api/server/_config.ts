import Axios from 'axios';

export const axios = Axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URI ?? 'http://localhost:3001',
});
