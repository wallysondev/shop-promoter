// src/components/clientes/NavbarUser.tsx
import { View, Text, TouchableOpacity, Image } from 'react-native';
import Icon from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Login } from '../../utils/types';
import { useAuth } from '../../context/AuthContext';

type Props = {
  logindata: Login;
};

export const NavbarUser = ({ logindata }: Props) => {
  const { logout } = useAuth();
  
  return (
    <View className="flex-row justify-between items-center rounded-xl px-4">
      <View className="flex-row items-center">
        <Image
          source={require('../../../assets/favicon.png')}
          className="w-12 h-12 rounded-full mr-4"
        />
        <View>
          <Text className="text-base font-semibold text-gray-800">
            {logindata.nome}
          </Text>
          <Text className="text-sm text-gray-600">
            Código de vendedor {logindata.codusur}
          </Text>
          <Text className="text-sm text-gray-600">
            Acesso: {logindata.role}
          </Text>
        </View>
      </View>

      <View className="flex-row gap-x-4 items-center">
        <TouchableOpacity onPress={() => alert('Notificações')}>
          <Icon name="bell" size={20} color="#4B5563" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={logout}>
          <AntDesign name="logout" size={20} color="#4B5563" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
