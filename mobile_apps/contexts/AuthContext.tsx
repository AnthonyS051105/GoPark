import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  profilePicture?: string;
}

interface StoredUser extends User {
  passwordHash: string;
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
  updateProfile: (updates: Partial<Pick<User, 'fullName' | 'phoneNumber'>>) => Promise<AuthResult>;
  checkAuthState: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const USERS_KEY = 'gopark_users';
const AUTH_TOKEN_KEY = 'authToken';
const USER_DATA_KEY = 'userData';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const hashPassword = async (password: string): Promise<string> => {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
};

const getStoredUsers = async (): Promise<StoredUser[]> => {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const saveStoredUsers = async (users: StoredUser[]): Promise<void> => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const toPublicUser = (stored: StoredUser): User => {
  const { passwordHash: _passwordHash, ...publicUser } = stored;
  return publicUser;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const clearAuthData = useCallback(async (): Promise<void> => {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
    await AsyncStorage.removeItem(USER_DATA_KEY);
  }, []);

  const checkAuthState = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
      const userData = await AsyncStorage.getItem(USER_DATA_KEY);

      if (token && userData) {
        setUser(JSON.parse(userData));
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthData]);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  const persistSession = async (publicUser: User): Promise<void> => {
    const token = `local-${publicUser.id}-${Date.now()}`;
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(publicUser));
    setUser(publicUser);
    setIsAuthenticated(true);
  };

  const login = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setIsLoading(true);
      const normalizedEmail = email.trim().toLowerCase();
      const users = await getStoredUsers();
      const found = users.find((u) => u.email.toLowerCase() === normalizedEmail);

      if (!found) {
        return { success: false, error: 'No account found with this email.' };
      }

      const passwordHash = await hashPassword(password);
      if (found.passwordHash !== passwordHash) {
        return { success: false, error: 'Incorrect password.' };
      }

      const publicUser = toPublicUser(found);
      await persistSession(publicUser);
      return { success: true, user: publicUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Something went wrong. Please try again.' };
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
      const normalizedEmail = email.trim().toLowerCase();
      const users = await getStoredUsers();

      if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return { success: false, error: 'An account with this email already exists.' };
      }

      const passwordHash = await hashPassword(password);
      const newUser: StoredUser = {
        id: `user-${Date.now()}`,
        email: normalizedEmail,
        fullName,
        phoneNumber,
        passwordHash,
      };

      await saveStoredUsers([...users, newUser]);

      const publicUser = toPublicUser(newUser);
      await persistSession(publicUser);
      return { success: true, user: publicUser };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Something went wrong. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (): Promise<AuthResult> => {
    return {
      success: false,
      error: 'Google Sign-In is not available in this version.',
    };
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await clearAuthData();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (
    updates: Partial<Pick<User, 'fullName' | 'phoneNumber'>>
  ): Promise<AuthResult> => {
    if (!user) {
      return { success: false, error: 'Not logged in.' };
    }

    try {
      const updatedUser: User = { ...user, ...updates };

      const users = await getStoredUsers();
      const updatedUsers = users.map((u) =>
        u.id === user.id ? { ...u, ...updates } : u
      );
      await saveStoredUsers(updatedUsers);
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: 'Failed to update profile.' };
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
    updateProfile,
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
