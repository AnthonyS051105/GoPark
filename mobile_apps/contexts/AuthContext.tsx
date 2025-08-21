import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_CONFIG, { getApiUrl, autoDetectBackendUrl } from '../utils/api';
import GoogleAuthService from '../services/GoogleAuthService';

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profilePicture?: string;
}

interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  loginWithGoogle: () => Promise<AuthResult>;
  signup: (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string
  ) => Promise<AuthResult>;
  logout: () => Promise<void>;
  getProfile: () => Promise<AuthResult>;
  checkAuthState: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearAuthData = useCallback(async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userData');
  }, []);

  // Check if user is already logged in when app starts
  const checkAuthState = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);

      // ✅ Auto-detect working backend URL on startup
      if (__DEV__) {
        console.log('🔧 Auto-detecting backend URL...');
        const workingUrl = await autoDetectBackendUrl();
        if (workingUrl) {
          console.log('✅ Backend connection established:', workingUrl);
        } else {
          console.log('❌ No working backend URL found');
        }
      }

      const token = await AsyncStorage.getItem('authToken');
      const userData = await AsyncStorage.getItem('userData');

      console.log('🔍 Checking auth state...');
      console.log('📦 Token found:', !!token);
      console.log('👤 User data found:', !!userData);

      if (token && userData) {
        console.log('🔐 Verifying stored token...');
        // Verify token with backend
        const isValid = await verifyToken(token);
        if (isValid) {
          const user = JSON.parse(userData);
          setUser(user);
          setIsAuthenticated(true);
          console.log('✅ Token valid, user authenticated:', user.email);
        } else {
          // Token expired or invalid, clear storage
          console.log('❌ Token invalid, clearing storage');
          await clearAuthData();
        }
      } else {
        console.log('ℹ️ No stored credentials found');
      }
    } catch (error) {
      console.error('❌ Error checking auth state:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const verifyToken = async (token: string): Promise<boolean> => {
    try {
      // ✅ Auto-detect working backend URL first
      const workingUrl = await autoDetectBackendUrl();
      if (!workingUrl) {
        console.log('❌ No working backend URL found during token verification');
        return false;
      }

      console.log('🔗 API URL:', getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_TOKEN));

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.VERIFY_TOKEN), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ token }),
      });

      const data = await response.json();
      console.log('🔍 Token verification response:', {
        status: response.status,
        success: data.success,
        error: data.error,
      });

      return data.success && response.ok;
    } catch (error) {
      console.error('Error verifying token:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // ✅ First, try to auto-detect working backend URL
      console.log('🔍 Auto-detecting backend URL...');
      const workingUrl = await autoDetectBackendUrl();

      if (!workingUrl) {
        console.log('❌ No working backend URL found');
        return {
          success: false,
          error: 'Cannot connect to server. Please check if backend is running.',
        };
      }

      console.log('🔐 Attempting login to:', getApiUrl(API_CONFIG.ENDPOINTS.LOGIN));

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.LOGIN), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      console.log('📡 Login response:', {
        status: response.status,
        success: data.success,
      });

      if (response.ok && data.success) {
        // Save auth data
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        console.log('✅ Login successful for:', data.user.email);
        return { success: true, user: data.user };
      } else {
        console.log('❌ Login failed:', data.error);
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('❌ Login network error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    fullName: string,
    phoneNumber: string
  ): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      // ✅ First, try to auto-detect working backend URL
      console.log('🔍 Auto-detecting backend URL...');
      const workingUrl = await autoDetectBackendUrl();

      if (!workingUrl) {
        console.log('❌ No working backend URL found');
        return {
          success: false,
          error: 'Cannot connect to server. Please check if backend is running.',
        };
      }

      const url = getApiUrl(API_CONFIG.ENDPOINTS.SIGNUP);
      console.log('📝 Attempting signup to:', url);

      // ✅ Add timeout and better error handling
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          email,
          password,
          fullName,
          phoneNumber,
        }),
        signal: controller.signal, // Add abort signal
      });

      clearTimeout(timeoutId);

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      const data = await response.json();
      console.log('📦 Response data:', data);

      if (response.ok && data.success) {
        // Save auth data
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        console.log('✅ Signup successful for:', data.user.email);
        return { success: true, user: data.user };
      } else {
        console.log('❌ Signup failed:', data.error);
        return { success: false, error: data.error || 'Signup failed' };
      }
    } catch (error: any) {
      console.error('❌ Signup network error:', error);

      // ✅ Better error messages
      if (error.name === 'AbortError') {
        return { success: false, error: 'Request timeout. Please try again.' };
      }
      if (error.message && error.message.includes('Network request failed')) {
        return {
          success: false,
          error: 'Cannot connect to server. Please check if backend is running.',
        };
      }

      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<AuthResult> => {
    try {
      setIsLoading(true);

      console.log('🔐 Starting Google Sign-In...');

      // Get Google user info
      const googleResult = await GoogleAuthService.signIn();

      if (!googleResult.success) {
        console.log('❌ Google Sign-In failed:', googleResult.error);
        return { success: false, error: googleResult.error };
      }

      console.log('✅ Google Sign-In successful, sending to backend...');

      // Send Google token to your backend for verification
      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.GOOGLE_LOGIN), {
        method: 'POST',
        headers: API_CONFIG.HEADERS,
        body: JSON.stringify({
          accessToken: googleResult.accessToken,
          user: googleResult.user,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Save auth data
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));

        setUser(data.user);
        setIsAuthenticated(true);

        console.log('✅ Google login successful for:', data.user.email);
        return { success: true, user: data.user };
      } else {
        console.log('❌ Backend verification failed:', data.error);
        return { success: false, error: data.error || 'Google login failed' };
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      return {
        success: false,
        error: 'Network error. Please check your connection.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Sign out from Google as well
      await GoogleAuthService.signOut();

      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
      console.log('👋 User logged out');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async (): Promise<AuthResult> => {
    try {
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        return { success: false, error: 'No token found' };
      }

      const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.PROFILE), {
        method: 'GET',
        headers: {
          ...API_CONFIG.HEADERS,
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Failed to get profile' };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    signup,
    logout,
    getProfile,
    checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
