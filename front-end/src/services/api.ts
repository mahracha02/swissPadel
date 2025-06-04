import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

const API_URL = 'https://127.0.0.1:8000/api';

// Define types for request data
type RequestData = Record<string, unknown>;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth methods
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    console.log('Login response:', response.data); // Debug log
    const { token, user } = response.data;
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return response.data;
  } catch (error) {
    console.error('Login error:', error); // Debug log
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('No token found during logout');
      return;
    }
    
    await axios.post(`${API_URL}/auth/logout`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } finally {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Admin API methods
export const getAdminData = async (endpoint: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  console.log('Making request with token:', token); // Debug log
  
  const response = await axios.get(`${API_URL}/admin/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const postAdminData = async (endpoint: string, data: RequestData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await axios.post(`${API_URL}/admin/${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const putAdminData = async (endpoint: string, data: RequestData) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await axios.put(`${API_URL}/admin/${endpoint}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export const deleteAdminData = async (endpoint: string) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const response = await axios.delete(`${API_URL}/admin/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.data;
};

export default api; 