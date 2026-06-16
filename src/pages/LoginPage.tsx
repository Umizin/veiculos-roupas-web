import { FormEvent, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Alerta } from '../components/Alerta';
import { estaLogado } from '../services/auth';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  if (estaLogado()) {
    return <Navigate to="/" replace />;
  }

  async function enviar(e: FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro('');
    try {
      await login(email, senha);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-marca-50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-slate-900">Entrar</h1>
        <p className="mt-1 text-sm text-slate-500">Acesse o painel de cadastro</p>

        {erro && (
          <div className="mt-4">
            <Alerta tipo="erro" mensagem={erro} onFechar={() => setErro('')} />
          </div>
        )}

        <form onSubmit={enviar} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-marca-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Senha</label>
            <input
              type="password"
              required
              minLength={6}
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-marca-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={carregando}
            className="w-full rounded-xl bg-marca-600 py-2.5 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50"
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-500">
          Sem conta?{' '}
          <Link to="/registrar" className="font-medium text-marca-600 hover:underline">
            Registrar
          </Link>
        </p>
      </div>
    </div>
  );
}
