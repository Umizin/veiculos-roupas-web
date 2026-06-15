import { createContext, useContext, useState, ReactNode } from 'react';
import { api } from '../services/api';
import { limparSessao, obterUsuario, salvarSessao } from '../services/auth';
import { Usuario } from '../types';

interface AuthContexto {
  usuario: Usuario | null;
  login: (email: string, senha: string) => Promise<void>;
  registrar: (nome: string, email: string, senha: string) => Promise<void>;
  logout: () => void;
  ehAdmin: boolean;
}

const Contexto = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => obterUsuario<Usuario>());

  async function login(email: string, senha: string) {
    const resposta = await api.login(email, senha);
    salvarSessao(resposta.token, resposta.usuario);
    setUsuario(resposta.usuario);
  }

  async function registrar(nome: string, email: string, senha: string) {
    const resposta = await api.registrar(nome, email, senha);
    salvarSessao(resposta.token, resposta.usuario);
    setUsuario(resposta.usuario);
  }

  function logout() {
    limparSessao();
    setUsuario(null);
  }

  return (
    <Contexto.Provider
      value={{
        usuario,
        login,
        registrar,
        logout,
        ehAdmin: usuario?.perfil === 'admin'
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error('useAuth fora do provider');
  return ctx;
}
