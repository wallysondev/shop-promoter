import { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, ActivityIndicator, Alert, TouchableOpacity, TextInput } from 'react-native';

import Api from '../services/api';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Produto, Regiao, RootStackParamList } from '../utils/types';

import { useAuth } from '../context/AuthContext';

// quando nao houver uma imagem carrega essa,
import placeholderImg from '../../assets/not-product.png';

// diz que posso acessar qualquer rota que estiver no rootstack type
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;


export default function ProdutosScreen() {
  const { token } = useAuth();

  const route = useRoute<RouteProp<RootStackParamList, 'Produtos'>>();
  const { item: cliente, filial } = route.params;

  const navigation = useNavigation();

  const [regiao, setNumregiao] = useState<Regiao | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchProdutos() {
    try {
        // Tratativa de região 
        if (!filial || filial === 0) {
          Alert.alert('Atenção', 'Filial não encontrada!');
          return; // interrompe aqui, não segue adiante
        }

        // Aqui tem que carregar pela região do cliente, essa região vai vir da praça do cliente ou se o cliente tiver região da filial do rca na 3314
        const response = await Api.get(`/regiaocli?codcli=${cliente.codcli}&codfilial=${filial}`,{
          headers: {
            Authorization: `Bearer ${token}`, // ou outro prefixo, se for o caso
          },
        });
        
        // Tratativa de região 
        if (!response.data.regiao || response.data.regiao.length === 0) {
          Alert.alert('Atenção', 'Cliente sem região cadastrada. Verifique os dados.');
          return; // interrompe aqui, não segue adiante
        }

        const numregiao: Regiao = response.data.regiao[0];
        setNumregiao(numregiao);

        // Aqui tem que carregar pela região do cliente, essa região vai vir da praça do cliente ou se o cliente tiver região da filial do rca na 3314
        const resproduto = await Api.get(`/produto?numregiao=${numregiao.numregiao}`,{
          headers: {
            Authorization: `Bearer ${token}`, // ou outro prefixo, se for o caso
          },
        });

        setProdutos(resproduto.data.detalhes);

    } catch (error) {
      if (error instanceof Error) {
        // Aqui você tem certeza que error é Error, e pode acessar error.message
        Alert.alert('Erro ao Buscar Produtos', error.message);
      } else {
        Alert.alert('Erro', 'Erro desconhecido');
      }
    }// finally {
    //    setLoading(false);
    //}
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  const [filtro, setFiltro] = useState('');

  const produtosFiltrados = produtos.filter(c =>
    c.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    c.codprod.toString().includes(filtro)
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/* Botão de voltar */}
      <TouchableOpacity
        className="flex-row items-center mb-4"
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={24} color="black" />
        <Text className="ml-2 text-base font-medium">Voltar</Text>
      </TouchableOpacity>

      <Text className="text-lg font-bold mb-2">
        Cliente {cliente.cliente}
      </Text>

      <View className='rounded-xl p-2'>
        <TextInput
          placeholder="Código, Descricão..."
          placeholderTextColor="#9CA3AF" // mesma cor do texto do ComboBox
          value={filtro}
          onChangeText={setFiltro}
          className="rounded-xl px-4 py-3 text-sm text-gray-600"
        />
      </View>

      <FlatList 
        data={produtosFiltrados}
        keyExtractor={(item) => item.codprod.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center p-3 border-b border-gray-200">
            <Image
              source={ item.fotoprod ? { uri: item.fotoprod } : placeholderImg }
              style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
              resizeMode="cover"
            />
            <View>
              <Text className="font-medium text-gray-800">
                {item.codprod} - {item.descricao}
              </Text>
              <Text className="text-sm text-gray-500">Preço: R$ {item.pvenda}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
