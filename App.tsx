import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/pages/LoginScreen';
import ClientesProtected from './src/components/ClienteProtected'
import ProdutosProtected from './src/components/ProdutoProtected'

import { AuthProvider } from './src/context/AuthContext';

import { RootStackParamList } from './src/utils/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Clientes" component={ClientesProtected} />
          <Stack.Screen name="Produtos" component={ProdutosProtected} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
