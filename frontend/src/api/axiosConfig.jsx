import axios from 'axios';

// ✨ FIX: The baseURL is now read from your environment variables.
// This makes it easy to switch between local and production URLs.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Interceptor to add the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle 401 Unauthorized errors globally
// This prevents the app from breaking if a token expires.
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // If the error is a 401 (Unauthorized)...
    if (error.response && error.response.status === 401) {
      // ...it means our token is bad. So, we clear the stored data.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // And redirect the user to the login page to get a new token.
      // We check to make sure we're not already on the login page to avoid a loop.
      if (window.location.pathname !== '/login') {
        window.location = '/login'; 
      }
    }
    // For any other errors, we just let them proceed as normal.
    return Promise.reject(error);
  }
);

export default api;
