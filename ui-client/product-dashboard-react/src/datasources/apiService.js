import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Utility to get headers
const getHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Handle errors
const handleError = (error) => {
  const errorMessage = error.response?.data?.detail || error.message || 'An unknown error occurred';
  console.error('API Error:', errorMessage);
  throw new Error(errorMessage);
};

// Generic GET request
export const get = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.get(endpoint, { params, headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Generic POST request
export const post = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Generic PUT request
export const put = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Generic PATCH request
export const patch = async (endpoint, data) => {
  try {
    const response = await apiClient.patch(endpoint, data, { headers: getHeaders() });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Generic DELETE request (supports optional request body via `data`)
export const del = async (endpoint, data = undefined) => {
  try {
    // axios.delete accepts config as second arg; include data when provided
    const config = { headers: getHeaders() };
    if (data !== undefined) config.data = data;
    await apiClient.delete(endpoint, config);
  } catch (error) {
    handleError(error);
  }
};