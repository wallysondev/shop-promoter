// src/pages/ProdutosProtected.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import ProdutosScreen from './../pages/ProdutosScreen'

export default function ProdutosProtected() {
  const { token } = useAuth();

  if (!token) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ProdutosScreen />;
}
