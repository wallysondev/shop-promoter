// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  // Aqui você poderia usar AsyncStorage para manter o login salvo
  useEffect(() => {
    async function loadToken() {
      try {
        const savedToken = await AsyncStorage.getItem('token');
        if (savedToken) setToken(savedToken);
      } catch (e) {
        console.error('Erro ao carregar token', e);
      }
    }
    
    loadToken();
  }, []);

  const login = async (newToken: string) => {
    setToken(newToken);
    await AsyncStorage.setItem('token', newToken);
    console.log(newtoken);
  };

  const logout = async () => {
    setToken(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
