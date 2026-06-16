import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { Alerta } from '../components/Alerta';
import { CampoBusca } from '../components/CampoBusca';
import { ModalConfirmacao } from '../components/ModalConfirmacao';
import { Paginacao } from '../components/Paginacao';
import { api } from '../services/api';
import { Carro } from '../types';

const vazio = { marca: '', modelo: '', ano: new Date().getFullYear(), cor: '' };

export function CarrosPage() {
  const [lista, setLista] = useState<Carro[]>([]);
  const [total, setTotal] = useState(0);
  const [pagina, setPagina] = useState(1);
  const [busca, setBusca] = useState('');
  const [form, setForm] = useState(vazio);
  const [editando, setEditando] = useState<Carro | null>(null);
  const [removendo, setRemovendo] = useState<Carro | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [alerta, setAlerta] = useState<{ tipo: 'sucesso' | 'erro'; msg: string } | null>(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    try {
      const res = await api.listarCarros(pagina, 10);
      setLista(res.dados);
      setTotal(res.total);
    } catch (err) {
      setAlerta({ tipo: 'erro', msg: (err as Error).message });
    } finally {
      setCarregando(false);
    }
  }, [pagina]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const filtrados = useMemo(() => {
    const termo = busca.toLowerCase();
    if (!termo) return lista;
    return lista.filter(
      (c) =>
        c.marca.toLowerCase().includes(termo) ||
        c.modelo.toLowerCase().includes(termo) ||
        c.cor.toLowerCase().includes(termo)
    );
  }, [lista, busca]);

  function limparForm() {
    setForm(vazio);
    setEditando(null);
  }

  async function salvar(e: FormEvent) {
    e.preventDefault();
    setSalvando(true);
    try {
      if (editando) {
        await api.atualizarCarro(editando.id, form);
        setAlerta({ tipo: 'sucesso', msg: 'Carro atualizado' });
      } else {
        await api.criarCarro(form);
        setAlerta({ tipo: 'sucesso', msg: 'Carro cadastrado' });
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
      await api.removerCarro(removendo.id);
      setAlerta({ tipo: 'sucesso', msg: 'Carro removido' });
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
        <h2 className="text-xl font-bold text-slate-900">Carros</h2>
        <p className="text-sm text-slate-500">Cadastro e consulta</p>
      </div>

      {alerta && <Alerta tipo={alerta.tipo} mensagem={alerta.msg} onFechar={() => setAlerta(null)} />}

      <form onSubmit={salvar} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-slate-900">{editando ? 'Editar carro' : 'Novo carro'}</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <input placeholder="Marca" required value={form.marca} onChange={(e) => setForm({ ...form, marca: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <input placeholder="Modelo" required value={form.modelo} onChange={(e) => setForm({ ...form, modelo: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <input type="number" placeholder="Ano" required value={form.ano} onChange={(e) => setForm({ ...form, ano: Number(e.target.value) })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
          <input placeholder="Cor" required value={form.cor} onChange={(e) => setForm({ ...form, cor: e.target.value })} className="rounded-xl border border-slate-200 px-4 py-2 text-sm" />
        </div>
        <div className="mt-4 flex gap-3">
          <button type="submit" disabled={salvando} className="rounded-xl bg-marca-600 px-4 py-2 text-sm font-semibold text-white hover:bg-marca-700 disabled:opacity-50">
            {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
          </button>
          {editando && (
            <button type="button" onClick={limparForm} className="rounded-xl border border-slate-200 px-4 py-2 text-sm">
              Cancelar
            </button>
          )}
        </div>
      </form>

      <CampoBusca valor={busca} onMudar={setBusca} placeholder="Buscar por marca, modelo ou cor" />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-100 bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-medium text-slate-600">Marca</th>
              <th className="px-4 py-3 font-medium text-slate-600">Modelo</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 sm:table-cell">Ano</th>
              <th className="hidden px-4 py-3 font-medium text-slate-600 md:table-cell">Cor</th>
              <th className="px-4 py-3 font-medium text-slate-600">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Carregando...</td></tr>
            ) : filtrados.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500">Nenhum carro encontrado</td></tr>
            ) : (
              filtrados.map((carro) => (
                <tr key={carro.id} className="border-b border-slate-50">
                  <td className="px-4 py-3">{carro.marca}</td>
                  <td className="px-4 py-3">{carro.modelo}</td>
                  <td className="hidden px-4 py-3 sm:table-cell">{carro.ano}</td>
                  <td className="hidden px-4 py-3 md:table-cell">{carro.cor}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setEditando(carro); setForm({ marca: carro.marca, modelo: carro.modelo, ano: carro.ano, cor: carro.cor }); }} className="text-marca-600 hover:underline">Editar</button>
                      <button type="button" onClick={() => setRemovendo(carro)} className="text-rose-600 hover:underline">Excluir</button>
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
          titulo="Excluir carro"
          mensagem={`Deseja remover ${removendo.marca} ${removendo.modelo}?`}
          onConfirmar={confirmarRemocao}
          onCancelar={() => setRemovendo(null)}
          carregando={salvando}
        />
      )}
    </div>
  );
}
