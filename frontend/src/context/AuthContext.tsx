import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, loginAdmin as loginAdminService, logoutUser, getUserProfile } from '../../services/authService';

export interface User {
  fullName: string;
  username: string;
  email: string;
  mobile?: number;
  picture?: string;
  isAdmin: boolean;
  orders?: any[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: any) => Promise<any>;
  loginAdmin: (userData: any) => Promise<any>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = async () => {
    if (localStorage.getItem('userLoggedIn') !== 'true') {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await getUserProfile();
      if (res.data?.success && res.data?.data) {
        setUser(res.data.data);
      } else {
        setUser(null);
        localStorage.removeItem('userLoggedIn');
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('userLoggedIn');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (userData: any) => {
    try {
      const res = await loginUser(userData);
      if (res.data?.success) {
        localStorage.setItem('userLoggedIn', 'true');
        await checkAuth();
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const loginAdmin = async (userData: any) => {
    try {
      const res = await loginAdminService(userData);
      if (res.data?.success) {
        localStorage.setItem('userLoggedIn', 'true');
        await checkAuth();
      }
      return res;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem('userLoggedIn');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        loginAdmin,
        logout,
        checkAuth,
      }}
    >
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
