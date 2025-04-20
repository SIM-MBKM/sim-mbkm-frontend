import { apiServices } from '../axios-instance';

const authApi = apiServices.auth;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
  role?: string;
  studentId?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token: string;
  refreshToken: string;
}

// Auth management service endpoints
export const authService = {
  // Login
  login: async (credentials: LoginCredentials) => {
    const response = await authApi.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    return response.data;
  },

  // Signup
  signup: async (userData: SignupCredentials) => {
    const response = await authApi.post<AuthResponse>('/auth/signup', userData);
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await authApi.post('/auth/logout');
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Refresh Token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await authApi.post<{token: string, refreshToken: string}>(
      '/auth/refresh-token',
      { refreshToken }
    );
    
    localStorage.setItem('auth_token', response.data.token);
    localStorage.setItem('refresh_token', response.data.refreshToken);
    
    return response.data;
  },

  // Verify email
  verifyEmail: async (token: string) => {
    const response = await authApi.post('/auth/verify-email', { token });
    return response.data;
  },

  // Reset password request
  requestPasswordReset: async (email: string) => {
    const response = await authApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, newPassword: string) => {
    const response = await authApi.post('/auth/reset-password', { 
      token, 
      newPassword 
    });
    return response.data;
  },
}; 