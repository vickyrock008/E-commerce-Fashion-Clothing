import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

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

// ✨ This is the new, important part! ✨
// We add an interceptor to check all responses from the backend.
api.interceptors.response.use(
  (response) => response, // If the response is successful, just pass it along.
  (error) => {
    // If the error is a 401 (Unauthorized)...
    if (error.response && error.response.status === 401) {
      // ...it means our token is bad. So, we clear the stored data.
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // And redirect the user to the login page to get a new token.
      window.location = '/login'; 
    }
    // For any other errors, we just let them proceed as normal.
    return Promise.reject(error);
  }
);


export default api;