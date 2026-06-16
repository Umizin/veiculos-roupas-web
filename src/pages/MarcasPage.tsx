import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Alerta } from '../components/Alerta';
import { CampoBusca } from '../components/CampoBusca';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { Paginacao } from '../components/Paginacao';
import { api } from '../services/api';
import { MarcaRoupa } from '../types';

const vazio = { nome: '', pais: '', segmento: '' };

export function MarcasPage() {
  const [lista, setLista] = useState<MarcaRoupa[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<MarcaRoupa | null>(null);
  const [removendo, setRemovendo] = useState<MarcaRoupa | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await api.listarMarcas(pagina, 10);
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
    return lista.filter((m) => m.nome.toLowerCase().includes(termo) || m.pais.toLowerCase().includes(termo) || m.segmento.toLowerCase().includes(termo));
  }, [lista, busca]);

  function limparForm() { setForm(vazio); setEditando(null); }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editando) {
        await api.atualizarMarca(editando.id, form);
        setAlerta({ tipo: 'sucesso', msg: 'Marca atualizada' });
      } else {
        await api.criarMarca(form);
        setAlerta({ tipo: 'sucesso', msg: 'Marca cadastrada' });
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
      await api.removerMarca(removendo.id);
      setAlerta({ tipo: 'sucesso', msg: 'Marca removida' });
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
        <h2 className="text-xl font-bold text-slate-900">Marcas de Roupa</h2>
        <p className="text-sm text-slate-500">Cadastro e consulta</p>
      </div>

      {alerta && <Alerta tipo={alerta.tipo} mensagem={alerta.msg} onFechar={() => setAlerta(null)} />}

      <form onSubmit={salvar} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">{editando ? 'Editar marca' : 'Nova marca'}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <input placeholder="Nome" required value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <input placeholder="Pais" required value={form.pais} onChange={(e) => setForm({ ...form, pais: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <input placeholder="Segmento" required value={form.segmento} onChange={(e) => setForm({ ...form, segmento: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </div>
        <div className="mt-4 flex gap-3">
          <button type="submit" disabled={salvando} className="rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50">
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editando && <button type="button" onClick={limparForm} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">Cancelar</button>}
        </div>
      </form>

      <CampoBusca valor={busca} onMudar={setBusca} placeholder="Buscar por nome, pais ou segmento" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Nome</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 sm:table-cell">Pais</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 md:table-cell">Segmento</th>
              <th className="px-4 py-3 font-medium text-slate-600">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Carregando...</td></tr>
            ) : filtrados.length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-500">Nenhuma marca encontrada</td></tr>
            ) : (
              filtrados.map((marca) => (
                <tr key={marca.id} className="border-b border-slate-50">
                  <td className="px-4 py-3">{marca.nome}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{marca.pais}</td>
                  <td className="hidden px-4 py-3 md:table-cell">{marca.segmento}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setEditando(marca); setForm({ nome: marca.nome, pais: marca.pais, segmento: marca.segmento }); }} className="text-marca-600 hover:underline">Editar</button>
                      <button type="button" onClick={() => setRemovendo(marca)} className="text-rose-600 hover:underline">Excluir</button>
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
          titulo="Excluir marca"
          mensagem={`Deseja remover ${removendo.nome}?`}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setRemovendo(null)}
          carregando={salvando}
        />
      )}
    </div>
  );
}
