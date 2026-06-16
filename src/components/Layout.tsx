import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const menus = [
  { para: '/', titulo: 'Dashboard', descricao: 'Resumo geral' },
  { para: '/carros', titulo: 'Carros', descricao: 'Cadastro de carros' },
  { para: '/motos', titulo: 'Motos', descricao: 'Cadastro de motos' },
  { para: '/marcas', titulo: 'Marcas', descricao: 'Marcas de roupa' },
  { para: '/usuarios', titulo: 'Usuarios', descricao: 'Acesso admin', admin: true }
];

export function Layout() {
  const { usuario, logout, ehAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-marca-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-sm font-medium text-marca-600">Veiculos e Roupas</p>
            <h1 className="text-2xl font-bold text-slate-900">Painel de Cadastro</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-slate-900">{usuario?.nome}</p>
              <p className="text-xs text-slate-500">{usuario?.perfil}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-3">
          {menus
            .filter((m) => !m.admin || ehAdmin)
            .map((menu) => (
              <NavLink
                key={menu.para}
                to={menu.para}
                end={menu.para === '/'}
                className={({ isActive }) =>
                  `block w-full rounded-2xl border px-4 py-4 text-left transition ${
                    isActive
                      ? 'border-marca-500 bg-marca-600 text-white shadow-lg shadow-marca-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-marca-100 hover:bg-marca-50'
                  }`
                }
              >
                <p className="font-semibold">{menu.titulo}</p>
                <p className="mt-1 text-sm opacity-80">{menu.descricao}</p>
              </NavLink>
            ))}
        </aside>

        <section className="space-y-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
