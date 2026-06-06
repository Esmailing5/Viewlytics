'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';

const TOKEN_COOKIE_NAME = 'vl_token';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' });
    setUser(null);
    setTokenState(null);
    router.push('/');
  };

  useEffect(() => {
    async function initAuth() {
      const savedToken = Cookies.get(TOKEN_COOKIE_NAME);
      if (!savedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${savedToken}`,
          },
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setTokenState(savedToken);
        } else {
          // Token is invalid/expired
          logout();
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, error: errorData.error || 'Credenciales inválidas' };
      }

      const data = await res.json();
      const userToken = data.token;
      const loggedInUser = data.user;

      // Set cookie for 7 days
      Cookies.set(TOKEN_COOKIE_NAME, userToken, { expires: 7, path: '/' });
      setUser(loggedInUser);
      setTokenState(userToken);
      return { success: true };
    } catch (err) {
      console.error('Error during login:', err);
      return { success: false, error: 'Error de red al conectar con el servidor' };
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
