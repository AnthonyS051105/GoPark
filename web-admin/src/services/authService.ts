// src/services/authService.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface LoginResponse {
  success: boolean;
  message?: string;
  admin?: {
    id: string;
    displayName: string;
    email: string;
    role: string;
    profilePicture?: string;
    emailVerified: boolean;
    createdAt: string;
    loginCount: number;
    authProvider: string;
  };
  token?: string;
  error?: string;
}

export const authService = {
  // Admin signup
  async adminSignup(email: string, password: string, displayName: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          displayName
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  },

  // Admin login
  async adminLogin(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  },

  // Admin Google OAuth
  async adminGoogleAuth(idToken: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idToken
        }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Google auth error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  },

  // Get admin profile
  async getAdminProfile(token: string): Promise<LoginResponse> {
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return {
        success: false,
        error: 'Network error. Please try again.'
      };
    }
  },
};
