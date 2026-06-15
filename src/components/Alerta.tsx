interface AlertaProps {
  tipo: 'sucesso' | 'erro';
  mensagem: string;
  onFechar: () => void;
}

export function Alerta({ tipo, mensagem, onFechar }: AlertaProps) {
  const estilo =
    tipo === 'sucesso'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
      : 'border-rose-200 bg-rose-50 text-rose-800';

  return (
    <div className={`flex items-start justify-between gap-4 rounded-xl border px-4 py-3 shadow-sm ${estilo}`}>
      <p className="text-sm font-medium">{mensagem}</p>
      <button
        type="button"
        onClick={onFechar}
        className="rounded-lg px-2 py-1 text-xs font-semibold opacity-70 hover:opacity-100"
      >
        Fechar
      </button>
    </div>
  );
}
