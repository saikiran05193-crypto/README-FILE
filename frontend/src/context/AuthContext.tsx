import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, getMe } from '../services/api';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'OPERATOR' | 'VIEWER';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isOperator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await getMe();
          setUser(data.user);
        } catch (err) {
          console.warn('[Auth] Session token expired or invalid');
          localStorage.removeItem('auth_token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await loginUser({ email, password });
    localStorage.setItem('auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === 'ADMIN';
  const isOperator = user?.role === 'ADMIN' || user?.role === 'OPERATOR';

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      isAdmin,
      isOperator
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
