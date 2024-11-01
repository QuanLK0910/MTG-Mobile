import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../Services/auth';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for our context
interface User {
  id: number;
  phone: string;
  name: string;
  // Add other user properties as needed
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

// Add interface for decoded JWT
interface DecodedToken {
  exp: number;
  iat: number;
  userId: number;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  // ... other claims
}

// Add enum for roles
enum UserRole {
  Admin = '1',
  Manager = '2',
  Staff = '3',
  Customer = '4'
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  decodedToken: DecodedToken | null;
  login: (phoneNumber: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isStaff: () => boolean;
  isAdmin: () => boolean;
  isManager: () => boolean;
  isCustomer: () => boolean;
  getUserRole: () => string | null;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);

  const login = async (phoneNumber: string, password: string) => {
    try {
      const loginResponse = await authService.login({ phoneNumber, password });
      
      if (!loginResponse.accessToken || typeof loginResponse.accessToken !== 'string') {
        throw new Error('Invalid token received from server');
      }
      
      const decoded = jwtDecode<DecodedToken>(loginResponse.accessToken);
      console.log('Decoded token:', decoded);
      setDecodedToken(decoded);
      setIsAuthenticated(true);
      
      await AsyncStorage.setItem('accessToken', loginResponse.accessToken);
      if (loginResponse.user) {
        setUser(loginResponse.user);
        await AsyncStorage.setItem('user', JSON.stringify(loginResponse.user));
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setDecodedToken(null);
      setIsAuthenticated(false);
      
      await AsyncStorage.multiRemove(['token', 'user']);
    } catch (error) {
            throw error;
    }
  };

  const getUserRole = () => {
    return decodedToken?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  };

  const isAdmin = () => getUserRole() === UserRole.Admin;
  const isManager = () => getUserRole() === UserRole.Manager;
  const isStaff = () => getUserRole() === UserRole.Staff;
  const isCustomer = () => getUserRole() === UserRole.Customer;

  useEffect(() => {
    const loadUser = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const userData = await AsyncStorage.getItem('user');
        
        if (accessToken && userData) {
          setUser(JSON.parse(userData));
          setIsAuthenticated(true);
        }
      } catch (error) {
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      decodedToken, 
      login, 
      logout, 
      isStaff,
      isAdmin,
      isManager,
      isCustomer,
      getUserRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
