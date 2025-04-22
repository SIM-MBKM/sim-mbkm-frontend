import axios from 'axios';

// Base URL for each service
const SERVICE_URLS = {
  ACTIVITY: process.env.NEXT_PUBLIC_ACTIVITY_SERVICE_URL || 'http://localhost:3001',
  USER: process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:3002',
  AUTH: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3003', 
  REGISTRATION: process.env.NEXT_PUBLIC_REGISTRATION_SERVICE_URL || 'http://localhost:3004',
  MATCHING: process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL || 'http://localhost:3005',
  MONITORING: process.env.NEXT_PUBLIC_MONITORING_SERVICE_URL || 'http://localhost:3006',
};

// Create axios instances for each service
const createAxiosInstance = (baseURL: string) => {
  console.log(`Creating axios instance for ${baseURL}`);
  // const isActivityService = baseURL.includes('ACTIVITY') || baseURL === SERVICE_URLS.ACTIVITY;
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - adds auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('auth_token');
      console.log("LOCAL STORAGE TOKEN: ", token);
      if (token) {
        console.log("TOKEN EXISTS: ", token);
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle common errors
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized errors (token expired)
      if (error.response?.status === 401) {
        localStorage.removeItem('auth_token');
        // Redirect to login page or refresh token
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Export instances for each service
export const apiServices = {
  activity: createAxiosInstance(SERVICE_URLS.ACTIVITY),
  user: createAxiosInstance(SERVICE_URLS.USER),
  auth: createAxiosInstance(SERVICE_URLS.AUTH),
  registration: createAxiosInstance(SERVICE_URLS.REGISTRATION),
  matching: createAxiosInstance(SERVICE_URLS.MATCHING),
  monitoring: createAxiosInstance(SERVICE_URLS.MONITORING),
}; 