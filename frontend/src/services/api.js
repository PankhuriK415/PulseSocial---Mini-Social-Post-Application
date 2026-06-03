const BASE_URL = import.meta.env.VITE_API_URL || 'https://pulsesocial-mini-social-post-application.onrender.com/api';

/**
 * Custom fetcher wrapper to handle token authorization header and response parsing
 */
const apiRequest = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  
  // Set headers
  const headers = new Headers();
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Add auth token if present
  const token = localStorage.getItem('token');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const config = {
    ...options,
    headers: {
      ...Object.fromEntries(headers.entries()),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error.message);
    throw error;
  }
};

const api = {
  // Auth API
  auth: {
    signup: (userData) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
  },
  
  // Posts API
  posts: {
    getAll: (page = 1, limit = 10) => apiRequest(`/posts?page=${page}&limit=${limit}`, { method: 'GET' }),
    getById: (id) => apiRequest(`/posts/${id}`, { method: 'GET' }),
    create: (postData) => apiRequest('/posts', { method: 'POST', body: JSON.stringify(postData) }),
    toggleLike: (id) => apiRequest(`/posts/${id}/like`, { method: 'PUT' }),
    addComment: (id, text) => apiRequest(`/posts/${id}/comment`, { method: 'POST', body: JSON.stringify({ text }) }),
    getByUser: (userId) => apiRequest(`/posts/user/${userId}`, { method: 'GET' }),
  }
};

export default api;
