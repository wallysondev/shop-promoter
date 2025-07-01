// src/types.ts

export type Login = {
  matricula: number;
  codusur: number;
  nome: string;
  role: string;
};

export type Cliente = {
  codcli: number;
  cliente: string;
  cgc: string;
  bloqueio: string;
  latitude: number;
  longitude: number;
};

export type Produto = {
  codprod: number;
  descricao: string;
  numregiao: number;
  ptabela: number;
  pvenda: number;
  codst: number;
  fotoprod: string;
};

export type Regiao = {
  codcli: number;
  codfilialnf: number;
  numregiao: number;
};

export type RootStackParamList = {
  logindata: { item: Login };
  Clientes: undefined;  // se a tela Clientes não recebe parâmetro
  Produtos: { item: Cliente; filial: number; regiao: Regiao; produto: Produto};
  Detalhes: { id: string };        // rota Detalhes, com parâmetro id
  // outras rotas aqui...
};
