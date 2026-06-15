export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil: 'admin' | 'usuario';
}

export interface Carro {
  id: string;
  marca: string;
  modelo: string;
  ano: number;
  cor: string;
}

export interface Moto {
  id: string;
  marca: string;
  modelo: string;
  cilindrada: number;
  tipo: string;
}

export interface MarcaRoupa {
  id: string;
  nome: string;
  pais: string;
  segmento: string;
}

export interface ResultadoPaginado<T> {
  dados: T[];
  total: number;
  pagina: number;
  limite: number;
}

export interface LoginResposta {
  token: string;
  usuario: Usuario;
}

export interface ResumoDashboard {
  carros: number;
  motos: number;
  marcas: number;
  usuarios: number;
}

export type Pagina = 'dashboard' | 'carros' | 'motos' | 'marcas' | 'usuarios';
