import React, { useState } from 'react';
import {SafeAreaView} from 'react-native-safe-area-context'
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Api from '../services/api';
import Icon from '@expo/vector-icons/Feather';

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

      <View className="bg-gray-100 rounded-xl p-4 w-full mb-4">
        <View className="flex-row items-center space-x-3">
          {/* Ícone de usuário */}
          <Icon name="user" size={24} color="#9ca3af" />

          {/* Label e campo de entrada */}
          <View className="flex-1">
            <Text className="text-sm text-gray-500 font-semibold px-3">
              Nome de Usuario
            </Text>
            <TextInput
              className="ext-base font-bold text-gray-800 p-0 px-3"
              placeholder="Usuário"
              keyboardType="default"
              value={username}
              onChangeText={setUsername}
            />
          </View>
        </View>
      </View>

      <View className="bg-gray-100 rounded-xl p-2 w-full mb-4">
        <View className="flex-row items-center space-x-3">
          {/* Ícone */}
          <Icon name="lock" size={24} color="#9ca3af" />

          {/* Texto explicativo + campo */}
          <View className="flex-1">
            <Text className="text-sm text-gray-500 font-semibold px-3">
              Senha
            </Text>
            <TextInput
              className="text-base font-bold text-gray-800 p-0 px-3"
              placeholder="Digite sua senha"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="w-full bg-blue-600 py-3 rounded-xl"
        onPress={handleLogin}
      >
        <Text className="text-center text-white font-semibold">Entrar</Text>
      </TouchableOpacity>

      <View className="w-full py-4 px-6 relative bottom-0">
        <Text className="text-black text-center text-sm">
          © 2025 Walldev. Todos os direitos reservados.
        </Text>
      </View>
    </SafeAreaView>
  );
}