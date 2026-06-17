import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alerta } from '../components/Alerta';
import { api } from '../services/api';
import { ResumoDashboard } from '../types';

const cards = [
  { chave: 'carros' as const, titulo: 'Carros', link: '/carros', cor: 'bg-blue-500' },
  { chave: 'motos' as const, titulo: 'Motos', link: '/motos', cor: 'bg-violet-500' },
  { chave: 'marcas' as const, titulo: 'Marcas', link: '/marcas', cor: 'bg-amber-500' },
  { chave: 'usuarios' as const, titulo: 'Usuarios', link: '/usuarios', cor: 'bg-emerald-500' }
];

export function DashboardPage() {
  const [resumo, setResumo] = useState<ResumoDashboard | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const dados = await api.obterResumo();
      setResumo(dados);
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
        <p className="text-sm text-slate-500">Visao geral dos cadastros</p>
      </div>

      {erro && <Alerta tipo="erro" mensagem={erro} onFechar={() => setErro('')} />}

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.chave}
            to={card.link}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-marca-200 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">{card.titulo}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">
                  {carregando ? '...' : resumo?.[card.chave] ?? 0}
                </p>
              </div>
              <div className={`h-12 w-12 rounded-xl ${card.cor} opacity-80`} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
