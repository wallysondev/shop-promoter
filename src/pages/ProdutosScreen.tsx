import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import Api from '../services/api';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Produto, Regiao, RootStackParamList } from '../utils/types';
import { useAuth } from '../context/AuthContext';

import placeholderImg from '../../assets/not-product.png';
import Feather from '@expo/vector-icons/Feather';

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function ProdutosScreen() {
  const { token } = useAuth();
  const route = useRoute<RouteProp<RootStackParamList, 'Produtos'>>();
  const { item: cliente, filial } = route.params;
  const navigation = useNavigation<NavigationProps>();

  const [regiao, setNumregiao] = useState<Regiao | null>(null);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [abaSelecionada, setAbaSelecionada] = useState<'produtos' | 'itens'>('produtos');
  const [itensSelecionados, setItensSelecionados] = useState<Produto[]>([]);

  async function fetchProdutos() {
    try {
      if (!filial || filial === 0) {
        Alert.alert('Atenção', 'Filial não encontrada!');
        return;
      }

      const response = await Api.get(`/regiaocli?codcli=${cliente.codcli}&codfilial=${filial}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.regiao || response.data.regiao.length === 0) {
        Alert.alert('Atenção', 'Cliente sem região cadastrada. Verifique os dados.');
        return;
      }

      const numregiao: Regiao = response.data.regiao[0];
      setNumregiao(numregiao);

      const resproduto = await Api.get(`/produto?numregiao=${numregiao.numregiao}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProdutos(resproduto.data.detalhes);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro ao Buscar Produtos', error.message);
      } else {
        Alert.alert('Erro', 'Erro desconhecido');
      }
    }
  }

  useEffect(() => {
    fetchProdutos();
  }, []);

  const produtosFiltrados = produtos.filter((c) =>
    c.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
    c.codprod.toString().includes(filtro)
  );

  function adicionarItem(produto: Produto) {
    const jaAdicionado = itensSelecionados.find((p) => p.codprod === produto.codprod);
    if (!jaAdicionado) {
      setItensSelecionados([...itensSelecionados, produto]);
    }
  }

  function removerItem(codprod: number) {
    const novaLista = itensSelecionados.filter((item) => item.codprod !== codprod);
    setItensSelecionados(novaLista);
  } 

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      {/* Voltar */}
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

      {/* Abas */}
      <View className="flex-row border-b border-gray-300 mb-4">
        <TouchableOpacity
          className="flex-1 items-center pb-2"
          onPress={() => setAbaSelecionada('produtos')}
        >
          <Text className={`font-medium text-base ${abaSelecionada === 'produtos' ? 'text-blue-600' : 'text-gray-600'}`}>
            Produtos
          </Text>
          {abaSelecionada === 'produtos' && (
            <View className="h-0.5 bg-blue-600 mt-1 w-16 rounded" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center pb-2"
          onPress={() => setAbaSelecionada('itens')}
        >
          <Text className={`font-medium text-base ${abaSelecionada === 'itens' ? 'text-blue-600' : 'text-gray-600'}`}>
            Itens
          </Text>
          {abaSelecionada === 'itens' && (
            <View className="h-0.5 bg-blue-600 mt-1 w-16 rounded" />
          )}
        </TouchableOpacity>
      </View>

      {/* Campo de filtro (somente na aba Produtos) */}
      {abaSelecionada === 'produtos' && (
        <View className="bg-gray-100 rounded-full p-2 w-full mb-4">
          <TextInput
            placeholder="Código, Descrição..."
            placeholderTextColor="#9CA3AF"
            value={filtro}
            onChangeText={setFiltro}
            className="rounded-xl px-4 py-3 text-sm text-gray-600"
          />
        </View>
      )}

      {/* Conteúdo das abas */}
      {abaSelecionada === 'produtos' ? (
        <FlatList
          data={produtosFiltrados}
          keyExtractor={(item) => item.codprod.toString()}
          renderItem={({ item }) => (
            <View className="flex-row items-center p-3 border-b border-gray-200">
              <Image
                source={item.fotoprod ? { uri: item.fotoprod } : placeholderImg}
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  {item.codprod} - {item.descricao}
                </Text>
                <Text className="text-sm text-gray-500">Preço: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.pvenda)}</Text>
              </View>
              <TouchableOpacity onPress={() => adicionarItem(item)}>
                <AntDesign name="pluscircleo" size={24} color="green" />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <FlatList
          data={itensSelecionados}
          keyExtractor={(item) => item.codprod.toString()}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center mt-4">Nenhum item adicionado.</Text>
          }
          renderItem={({ item }) => (
            <View className="flex-row items-center p-3 border-b border-gray-200">
              <Image
                source={item.fotoprod ? { uri: item.fotoprod } : placeholderImg}
                style={{ width: 60, height: 60, borderRadius: 8, marginRight: 12 }}
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="font-medium text-gray-800">
                  {item.codprod} - {item.descricao}
                </Text>
                <Text className="text-sm text-gray-500">Preço: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.pvenda)}</Text>
              </View>
              <TouchableOpacity onPress={() => removerItem(item.codprod)}>
                <Feather name="trash" size={20} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}