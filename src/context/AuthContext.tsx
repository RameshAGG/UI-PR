import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Axios from '../../src/axios-config/axiosInstance.ts';
import { decryptData, encryptData } from '../storageHelper.ts';

interface AuthContextType {
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  roleName: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    roleName?: string;
    user?: {
      id: number;
      email: string;
      // ... other user fields
    };
    permission: string[];
  };
  message: string;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [roleName, setRole] = useState<string | null>(null);
  const login = async (credentials: any) => {
    try {
      const response = await Axios.post<LoginResponse>('v1/auth/login', credentials);
    const { roleName, permission } = response.data.data;
      setRole(roleName || null);
      // localStorage.setItem('roleName', roleName || '');
      localStorage.setItem('roleName', encryptData(roleName) || '');

      localStorage.setItem('permission', encryptData(permission || []));
      if (response.data?.data?.token) {
        localStorage.setItem('token', encryptData(response.data.data.token));
        Axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`;

        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      } else {
        throw new Error('Invalid token received from server');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    try {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();
      setRole(null);
      // Clear any auth headers from axios instance
      delete Axios.defaults.headers.common['Authorization'];

      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthenticated = () => {
    // return !!localStorage.getItem('token');
    const encryptedToken = localStorage.getItem('token');
    const token = decryptData(encryptedToken);
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ login, logout, isAuthenticated, roleName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 