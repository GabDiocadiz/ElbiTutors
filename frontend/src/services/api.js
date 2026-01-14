import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true,
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // FIX: We Log the error, but we MUST return the full 'error' object
    // so components can check error.response.status (like 404 or 401)
    const message = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    
    return Promise.reject(error); // Return the OBJECT, not just the string
  }
);

export const loginUser = (data) => api.post('/auth/login', data); 
export const fetchTutors = () => api.get('/users?tutors=true'); 
export const getUserProfile = () => api.get('/users/me'); 

export const bookSession = (data) => api.post('/sessions', data);
export const submitFeedback = (id, data) => api.post(`/sessions/${id}/feedback`, data);

export default api;