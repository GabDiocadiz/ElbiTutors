import axios from 'axios';

// create instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract message from the standardized backend error format
    const message = error.response?.data?.message || 'An unexpected error occurred';
    console.error('API Error:', message);
    
    // Reject
    return Promise.reject(message);
  }
);

// Auth & User Endpoints
export const loginUser = (data) => api.post('/auth/login', data); 
export const fetchTutors = () => api.get('/users?tutors=true'); 
export const getUserProfile = () => api.get('/auth/profile'); 

// Session Endpoints
export const bookSession = (data) => api.post('/sessions', data);
export const submitFeedback = (id, data) => api.post(`/sessions/${id}/feedback`, data);

export default api;