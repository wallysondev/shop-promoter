import { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, Alert, Image} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import Api from '../services/api';

import { NavbarUser } from '../components/clientes/NavbarUser';
import { SelectorFilial } from '../components/clientes/SelectorFilial';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Cliente, RootStackParamList } from '../utils/types'

import { useAuth } from '../context/AuthContext';

// diz que posso acessar qualquer rota que estiver no rootstack type
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

function obterSigla(nomeCompleto: string) : string {
  if (!nomeCompleto) return "";

  const nomes = nomeCompleto.trim().split(" ").filter(n => n.length > 0);
  const doisPrimeiros = nomes.slice(0, 2);

  const sigla = doisPrimeiros
    .map(n => (n && n[0] ? n[0].toUpperCase() : ""))
    .join("");

  return sigla;
}

export default function ClientesScreen() {
  const { token } = useAuth();

  const route = useRoute<RouteProp<RootStackParamList, 'logindata'>>();
  const { item: logindados } = route.params;

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState('');
  const navigation = useNavigation<NavigationProps>();
  const offset = 0;

  const [filialSelecionada, setFilialSelecionada] = useState<string>('2');

  async function fetchCliente() {
    try {
      const response = await Api.get('/Cliente?limit=50&offset=0',{
        headers: {
          Authorization: `Bearer ${token}`, // ou outro prefixo, se for o caso
        },
      });

      setClientes(response.data.clientes);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Erro',error.message);
      } else {
        Alert.alert('Erro',"Erro desconhecido");
      }
    }
  }

  useEffect(() => {
    fetchCliente();
  }, []);

  const clientesFiltrados = clientes.filter(c =>
    c.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
    c.codcli.toString().includes(filtro)  ||
    c.cgc.toString().includes(filtro)
  );

  function GotoProdutos(item: Cliente){
    if (item.bloqueio === "S"){
      Alert.alert("Cliente Bloqueado","Não é possivel consultar produtos para clientes bloqueados.");
      return;
    }

    navigation.navigate('Produtos', { item, filial: filialSelecionada });
  }

  return (
    <SafeAreaView className="flex-1 p-4 bg-white">
      <NavbarUser logindata={logindados} />
      
      <View>
        <SelectorFilial filial={filialSelecionada} setFilial={setFilialSelecionada} />
        <View className='rounded-xl p-2'>
          <TextInput
            placeholder="Código do cliente, Razão Social..."
            placeholderTextColor="#9CA3AF" // mesma cor do texto do ComboBox
            value={filtro}
            onChangeText={setFiltro}
            className="rounded-xl px-4 py-3 text-sm text-gray-600"
          />
        </View>
      </View>
      
      <FlatList data={clientesFiltrados} keyExtractor={(item) => item.codcli.toString()} renderItem={({ item }) => {
        const corCirculo = item.bloqueio === "S" ? "bg-red-600" : "bg-blue-600";
        return (<TouchableOpacity onPress={() => GotoProdutos(item)} className="flex-row items-center justify-between p-3 border-b border-gray-200">
                  <View className="flex-row items-center flex-1">
                    <View className={`${corCirculo} w-12 h-12 rounded-full justify-center items-center`}>
                      <Text className="text-white font-bold text-lg">
                        {obterSigla(item.cliente)}
                      </Text>
                    </View>

                    <View className="ml-4 flex-1">
                      <Text className="font-medium text-gray-800" numberOfLines={1}>
                        {item.codcli} - {item.cliente}
                      </Text>
                      <Text className="text-sm text-gray-500">{item.cgc}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
        } />
      
    </SafeAreaView>
  );
}
