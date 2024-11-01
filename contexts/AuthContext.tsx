import React, { createContext, useContext, useState } from 'react';
import { authService } from '../Services/auth';
import { jwtDecode } from 'jwt-decode';

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
      const loginResponse: LoginResponse = await authService.login({ phoneNumber, password });
      
      if (!loginResponse.accessToken || typeof loginResponse.accessToken !== 'string') {
        throw new Error('Invalid token received from server');
      }
      
      const decoded = jwtDecode<DecodedToken>(loginResponse.accessToken);
      setDecodedToken(decoded);
      
      setUser(loginResponse.user);
      setIsAuthenticated(true);
      
      console.log('Login successful!', {
        user: loginResponse.user,
        decodedToken: decoded
      });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setDecodedToken(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
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
