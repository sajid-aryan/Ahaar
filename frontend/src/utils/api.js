// API Configuration for production deployment
const API_BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:3004" 
  : import.meta.env.VITE_API_BASE_URL || 'https://ahaarbackend.vercel.app';

export const apiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Helper function for making API requests with credentials
export const apiRequest = async (endpoint, options = {}) => {
  const url = apiUrl(endpoint);
  
  const defaultOptions = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

export default { apiUrl, apiRequest };
