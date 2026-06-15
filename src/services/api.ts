import { obterToken } from './auth';
import {
  Carro,
  LoginResposta,
  MarcaRoupa,
  Moto,
  ResultadoPaginado,
  ResumoDashboard,
  Usuario
} from '../types';

const base = import.meta.env.VITE_API_URL || '/api';

interface OpcoesRequest extends RequestInit {
  autenticado?: boolean;
}

async function request<T>(url: string, opcoes: OpcoesRequest = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (opcoes.autenticado !== false) {
    const token = obterToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const resposta = await fetch(`${base}${url}`, {
    ...opcoes,
    headers: { ...headers, ...(opcoes.headers as Record<string, string>) }
  });

  if (resposta.status === 204) {
    return undefined as T;
  }

  const tipo = resposta.headers.get('content-type') || '';

  if (!tipo.includes('application/json')) {
    throw new Error('API indisponivel. Verifique se o backend esta rodando.');
  }

  const dados = await resposta.json();

  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro na requisicao');
  }

  return dados;
}

export const api = {
  login: (email: string, senha: string) =>
    request<LoginResposta>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha }),
      autenticado: false
    }),

  registrar: (nome: string, email: string, senha: string) =>
    request<LoginResposta>('/auth/registrar', {
      method: 'POST',
      body: JSON.stringify({ nome, email, senha }),
      autenticado: false
    }),

  listarCarros: (pagina = 1, limite = 10) =>
    request<ResultadoPaginado<Carro>>(`/carros?pagina=${pagina}&limite=${limite}`),

  criarCarro: (dados: Omit<Carro, 'id'>) =>
    request<Carro>('/carros', { method: 'POST', body: JSON.stringify(dados) }),

  atualizarCarro: (id: string, dados: Partial<Omit<Carro, 'id'>>) =>
    request<Carro>(`/carros/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),

  removerCarro: (id: string) =>
    request<void>(`/carros/${id}`, { method: 'DELETE' }),

  listarMotos: (pagina = 1, limite = 10) =>
    request<ResultadoPaginado<Moto>>(`/motos?pagina=${pagina}&limite=${limite}`),

  criarMoto: (dados: Omit<Moto, 'id'>) =>
    request<Moto>('/motos', { method: 'POST', body: JSON.stringify(dados) }),

  atualizarMoto: (id: string, dados: Partial<Omit<Moto, 'id'>>) =>
    request<Moto>(`/motos/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),

  removerMoto: (id: string) =>
    request<void>(`/motos/${id}`, { method: 'DELETE' }),

  listarMarcas: (pagina = 1, limite = 10) =>
    request<ResultadoPaginado<MarcaRoupa>>(`/marcas-roupa?pagina=${pagina}&limite=${limite}`),

  criarMarca: (dados: Omit<MarcaRoupa, 'id'>) =>
    request<MarcaRoupa>('/marcas-roupa', { method: 'POST', body: JSON.stringify(dados) }),

  atualizarMarca: (id: string, dados: Partial<Omit<MarcaRoupa, 'id'>>) =>
    request<MarcaRoupa>(`/marcas-roupa/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),

  removerMarca: (id: string) =>
    request<void>(`/marcas-roupa/${id}`, { method: 'DELETE' }),

  listarUsuarios: (pagina = 1, limite = 10) =>
    request<ResultadoPaginado<Usuario>>(`/usuarios?pagina=${pagina}&limite=${limite}`),

  criarUsuario: (dados: Omit<Usuario, 'id'> & { senha: string }) =>
    request<Usuario>('/usuarios', { method: 'POST', body: JSON.stringify(dados) }),

  atualizarUsuario: (id: string, dados: Partial<Omit<Usuario, 'id'>> & { senha?: string }) =>
    request<Usuario>(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(dados) }),

  removerUsuario: (id: string) =>
    request<void>(`/usuarios/${id}`, { method: 'DELETE' }),

  obterResumo: async (): Promise<ResumoDashboard> => {
    const [carros, motos, marcas] = await Promise.all([
      api.listarCarros(1, 1),
      api.listarMotos(1, 1),
      api.listarMarcas(1, 1)
    ]);

    let usuarios = 0;
    try {
      const lista = await api.listarUsuarios(1, 1);
      usuarios = lista.total;
    } catch {
      usuarios = 0;
    }

    return {
      carros: carros.total,
      motos: motos.total,
      marcas: marcas.total,
      usuarios
    };
  }
};
