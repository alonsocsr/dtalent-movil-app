import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

import { User } from '@/lib/types';

// Define types for auth context
interface AuthContextType {
  token: string | null;
  user: User | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>>  = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load the token from storage on startup
  useEffect(() => {
    const loadAuthData = async () => {
      const storedToken = await AsyncStorage.getItem('userToken');
      const storedUser = await AsyncStorage.getItem('userInfo');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };
    loadAuthData();
  }, []);

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.schneck.dlab.software/api/users/demo_login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.json();
      const userToken = result.token;
      const userData = result.user;

      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('userInfo', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
    } catch (error) {
      console.error('Failed to sign in', error);
      throw error; // rethrow to handle it on the sign-in screen
    } finally {
      setIsLoading(false);
    }
  };

  // Sign-out function
  const signOut = async () => {
    setIsLoading(true);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userInfo');
    setToken(null);
    setIsLoading(false);
    router.replace('/sign-in')
  };

  return (
    <AuthContext.Provider value={{ token, user, signIn, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
