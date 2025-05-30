import { apiServices } from "../axios-instance";

const authApi = apiServices.auth;

export interface IdentityCheckCredentials {
  email: string;
}

export interface LoginCredentials {
  email: string;
  identity: AuthResponseIdentityCheck;
}

export interface LogoutCredentials {
  email: string;
  auth_token: string;
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
  };
  access_token: string;
}

export interface AuthResponseIdentityCheck {
  email: string;
  userExists: boolean;
  provider: string;
}

// Auth management service endpoints
export const authService = {
  // Check provider identity
  identityCheck: async (credentials: IdentityCheckCredentials) => {
    const response = await authApi.get<AuthResponseIdentityCheck>(
      `/auth/identity/${credentials.email}`
    );
    return response.data.provider;
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      //check identity to determine provider
      const identityResponse = authApi.get<AuthResponseIdentityCheck>(
        `/auth/identity/${credentials.email}`
      );

      const provider = (await identityResponse).data.provider;
      let response = null;

      if (provider === "google") {
        response = await authApi.get<AuthResponse>("/auth/google/redirect");
      } else {
        response = await authApi.get<AuthResponse>("/auth/its/redirect");
      }

      localStorage.setItem("auth_token", response.data.access_token);
      return response.data;
    } catch (e) {
      throw e;
    }
  },

  // Logout
  logout: async (credentials: LogoutCredentials): Promise<void> => {
    try {
      //check identity to determine provider
      const identityResponse = authApi.get<AuthResponseIdentityCheck>(
        `/auth/identity/${credentials.email}`
      );

      const provider = (await identityResponse).data.provider;
      const headers = {
        Authorization: `Bearer ${credentials.auth_token}`,
      };

      if (provider === "google") {
        await authApi.post("/auth/logout", {}, { headers });
      } else {
        await authApi.post("/auth/its/logout", {}, { headers });
      }

      // Clear local storage
      localStorage.removeItem("auth_token");
    } catch (e) {
      // Always clear tokens on logout attempt
      localStorage.removeItem("auth_token");
      throw e;
    }
  },

  /**
   * @info
   * These functions are to be implemented in future releases
   */
  // // Verify email
  // verifyEmail: async (token: string) => {
  //   const response = await authApi.post('/auth/verify-email', { token });
  //   return response.data;
  // },

  // // Reset password request
  // requestPasswordReset: async (email: string) => {
  //   const response = await authApi.post('/auth/forgot-password', { email });
  //   return response.data;
  // },

  // // Reset password
  // resetPassword: async (token: string, newPassword: string) => {
  //   const response = await authApi.post('/auth/reset-password', {
  //     token,
  //     newPassword
  //   });
  //   return response.data;
  // },

  // // Signup
  // signup: async (userData: SignupCredentials) => {
  //   const response = await authApi.post<AuthResponse>('/auth/signup', userData);
  //   localStorage.setItem('auth_token', response.data.token);
  //   localStorage.setItem('refresh_token', response.data.refreshToken);
  //   return response.data;
  // },

  //   // Refresh Token
  // refreshToken: async () => {
  //   const refreshToken = localStorage.getItem('refresh_token');
  //   if (!refreshToken) {
  //     throw new Error('No refresh token available');
  //   }

  //   const response = await authApi.post<{token: string, refreshToken: string}>(
  //     '/auth/refresh-token',
  //     { refreshToken }
  //   );

  //   localStorage.setItem('auth_token', response.data.token);
  //   localStorage.setItem('refresh_token', response.data.refreshToken);

  //   return response.data;
  // },
};
