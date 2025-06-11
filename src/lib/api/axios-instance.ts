import axios, { AxiosInstance } from "axios";
import { createLaravelSecurity } from "../utils/security";
// import { newSecurity } from "@/lib/utils/security";

// Konfigurasi untuk Security
// const HASH_METHOD = 'sha256';
const APP_KEY = process.env.NEXT_PUBLIC_APP_KEY || "secret";
// const CIPHER_MODE = 'aes';

// Base URL for each service
const SERVICE_URLS = {
  ACTIVITY: process.env.NEXT_PUBLIC_ACTIVITY_SERVICE_URL || "http://localhost:3001",
  USER: process.env.NEXT_PUBLIC_USER_SERVICE_URL || "http://localhost:3002",
  AUTH: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "http://localhost:3003",
  REGISTRATION: process.env.NEXT_PUBLIC_REGISTRATION_SERVICE_URL || "http://localhost:3004",
  MATCHING: process.env.NEXT_PUBLIC_MATCHING_SERVICE_URL || "http://localhost:3005",
  MONITORING: process.env.NEXT_PUBLIC_MONITORING_SERVICE_URL || "http://localhost:3006",
  FILE: process.env.NEXT_PUBLIC_FILE_SERVICE_URL || "http://localhost:3007",
  NOTIFICATION: process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_URL || "http://localhost:3008",
  BROKER: process.env.NEXT_PUBLIC_BROKER_SERVICE_URL || "http://localhost:3009",
  MONEV: process.env.NEXT_PUBLIC_MONEV_SERVICE_URL || "http://localhost:3010",
  CALENDAR: process.env.NEXT_PUBLIC_CALENDAR_SERVICE_URL || "http://localhost:3011",
  REPORT: process.env.NEXT_PUBLIC_REPORT_SERVICE_URL || "http://localhost:3012",
};

export function getAccessKey(): string {
  // security
  const security = createLaravelSecurity(APP_KEY);
  // get access key
  const accessKey = security.generateAccessKey();
  return accessKey;
}

// Create axios instances for each service
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Request interceptor - adds auth token and security headers
  instance.interceptors.request.use(
    (config) => {
      // Tambahkan Authorization header jika token tersedia
      const token = localStorage.getItem("auth_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Tambahkan security headers
      try {
        // Generate Access-Key header dengan timestamp
        const accessKey = getAccessKey();

        config.headers["Access-Key"] = accessKey;
      } catch (error) {
        console.error("Error adding security headers:", error);
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
      // if (error.response?.status === 401) {
      //   localStorage.removeItem("auth_token");
      //   // Redirect to login page or refresh token
      //   window.location.href = "/login";
      // }
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
  file: createAxiosInstance(SERVICE_URLS.FILE),
  notification: createAxiosInstance(SERVICE_URLS.NOTIFICATION),
  broker: createAxiosInstance(SERVICE_URLS.BROKER),
  monev: createAxiosInstance(SERVICE_URLS.MONEV),
  calendar: createAxiosInstance(SERVICE_URLS.CALENDAR),
  report: createAxiosInstance(SERVICE_URLS.REPORT),
};
