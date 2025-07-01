// src/pages/ClientesProtected.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import ClientesScreen from './../pages/ClientesScreen'

export default function ClientesProtected() {
  const { token } = useAuth();

  if (!token) {
    // Aqui você pode redirecionar para login ou mostrar loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ClientesScreen />;
}