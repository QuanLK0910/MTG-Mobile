import axios from 'axios';

// Create axios instance with base configuration
export const api = axios.create({
  baseURL: 'http://10.0.2.2:5244/api', // Update this with your actual API base URL
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*'
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error data:', error.response.data);
      console.error('Error status:', error.response.status);
    }
  }
);
