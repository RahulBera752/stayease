import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://stayease-9gsn.onrender.com/api',
  withCredentials: true, // send httpOnly JWT cookie with every request
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    return Promise.reject({ ...error, message });
  }
);

export default api;