import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  demoLogin: (role: UserRole) => Promise<User>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sfp_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and check current token session on load
  useEffect(() => {
    async function checkAuth() {
      const storedToken = localStorage.getItem('sfp_token');
      if (!storedToken) {
        // Auto-login to Student for instant preview experience if no session
        try {
          const res = await fetch('/api/auth/demo-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ role: 'STUDENT' }),
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data.user);
            setToken(data.token);
            localStorage.setItem('sfp_token', data.token);
          }
        } catch (e) {
          console.warn('Initial demo auto-login failed:', e);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem('sfp_token');
          setToken(null);
          setUser(null);
        }
      } catch (e) {
        console.error('Session verify error:', e);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('sfp_token', data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const demoLogin = async (role: UserRole): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/demo-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Demo login failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('sfp_token', data.token);
      return data.user;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: any): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('sfp_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('sfp_token');
    setUser(null);
    setToken(null);
  };

  const updateUser = (updated: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updated } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
