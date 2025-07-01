import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Api from '../services/api'

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const navigation = useNavigation();

  async function handleLogin(){
    try{
      const response = await Api.get(`/token?username=${username}&password=${senha}`);
      const {token, dados} = response.data;
      
      if (token) {
        login(token);           // salva o token no contexto
        navigation.replace('Clientes', { item: dados}); // navega para Clientes
      }
      
    }catch(error){
      console.error('Erro ao fazer login:', error);
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-2xl font-bold mb-6 text-gray-800">Login</Text>
      <TextInput
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        placeholder="Usuário"
        keyboardType="default"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      <TouchableOpacity
        className="w-full bg-blue-600 py-3 rounded-xl"
        onPress={handleLogin}
      >
        <Text className="text-center text-white font-semibold">Entrar</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}