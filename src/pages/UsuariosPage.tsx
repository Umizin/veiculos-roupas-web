import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Alerta } from '../components/Alerta';
import { CampoBusca } from '../components/CampoBusca';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { Paginacao } from '../components/Paginacao';
import { api } from '../services/api';
import { Usuario } from '../types';

const vazio = { nome: '', email: '', senha: '', perfil: 'usuario' as const };

export function UsuariosPage() {
  const [lista, setLista] = useState<Usuario[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<Usuario | null>(null);
  const [removendo, setRemovendo] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await api.listarUsuarios(pagina, 10);
      setLista(res.dados);
      setTotal(res.total);
    } catch (err) {
      setAlerta({ tipo: 'erro', msg: (err as Error).message });
    } finally {
      setCarregando(false);
    }
  }, [pagina]);

  useEffect(() => { carregar(); }, [carregar]);

  const filtrados = useMemo(() => {
    const termo = busca.toLowerCase();
    if (!termo) return lista;
    return lista.filter((u) => u.nome.toLowerCase().includes(termo) || u.email.toLowerCase().includes(termo));
  }, [lista, busca]);

  function limparForm() { setForm(vazio); setEditando(null); }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editando) {
        const dados: Partial<Usuario> & { senha?: string } = { nome: form.nome, email: form.email, perfil: form.perfil };
        if (form.senha) dados.senha = form.senha;
        await api.atualizarUsuario(editando.id, dados);
        setAlerta({ tipo: 'sucesso', msg: 'Usuario atualizado' });
      } else {
        await api.criarUsuario(form);
        setAlerta({ tipo: 'sucesso', msg: 'Usuario cadastrado' });
      }
      limparForm();
      carregar();
    } catch (err) {
      setAlerta({ tipo: 'erro', msg: (err as Error).message });
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarRemocao() {
    if (!removendo) return;
    setSalvando(true);
    try {
      await api.removerUsuario(removendo.id);
      setAlerta({ tipo: 'sucesso', msg: 'Usuario removido' });
      setRemovendo(null);
      carregar();
    } catch (err) {
      setAlerta({ tipo: 'erro', msg: (err as Error).message });
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Usuarios</h2>
        <p className="text-sm text-slate-500">Gerenciamento de acesso (admin)</p>
      </div>

      {alerta && <Alerta tipo={alerta.tipo} mensagem={alerta.msg} onFechar={() => setAlerta(null)} />}

      <form onSubmit={salvar} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">{editando ? 'Editar usuario' : 'Novo usuario'}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input placeholder="Nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <input type="password" placeholder={editando ? 'Nova senha (opcional)' : 'Senha'} required={!editando} minLength={6} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <select value={form.perfil} onChange={(e) => setForm({ ...form, perfil: e.target.value as 'admin' | 'usuario' })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
            <option value="usuario">Usuario</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="mt-4 flex gap-3">
          <button type="submit" disabled={salvando} className="rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50">
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editando && <button type="button" onClick={limparForm} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancelar</button>}
        </div>
      </form>

      <CampoBusca valor={busca} onMudar={setBusca} placeholder="Buscar por nome ou email" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Nome</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 sm:table-cell">Email</th>
              <th className="px-4 py-3 font-medium text-slate-600">Perfil</th>
              <th className="px-4 py-3 font-medium text-slate-600">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Carregando...</td></tr>
            ) : filtrados.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Nenhum usuario encontrado</td></tr>
            ) : (
              filtrados.map((usuario) => (
                <tr key={usuario.id} className="border-b border-slate-50">
                  <td className="px-4 py-3">{usuario.nome}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{usuario.email}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${usuario.perfil === 'admin' ? 'bg-marca-100 text-marca-700' : 'bg-slate-100 text-slate-600'}`}>
                      {usuario.perfil}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setEditando(usuario); setForm({ nome: usuario.nome, email: usuario.email, senha: '', perfil: usuario.perfil }); }} className="text-marca-600 hover:underline">Editar</button>
                      <button type="button" onClick={() => setRemovendo(usuario)} className="text-rose-600 hover:underline">Excluir</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Paginacao pagina={pagina} total={total} limite={10} onMudar={setPagina} />

      {removendo && (
        <ModalConfirmacao
          titulo="Excluir usuario"
          mensagem={`Deseja remover ${removendo.nome}?`}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setRemovendo(null)}
          carregando={salvando}
        />
      )}
    </div>
  );
}
