// src/pages/ProdutosProtected.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import ProdutosScreen from '../pages/ProdutosScreen'; // ← componente real da tela de clientes

export default function ProdutosProtected() {
  const { token } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (!token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    }
  }, [token]);

  if (!token) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <ProdutosScreen />;
}
