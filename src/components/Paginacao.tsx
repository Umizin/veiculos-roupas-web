interface PaginacaoProps {
  pagina: number;
  total: number;
  limite: number;
  onMudar: (pagina: number) => void;
}

export function Paginacao({ pagina, total, limite, onMudar }: PaginacaoProps) {
  const paginas = Math.ceil(total / limite) || 1;

  if (paginas <= 1) return null;

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-600">
        Pagina {pagina} de {paginas} ({total} itens)
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pagina <= 1}
          onClick={() => onMudar(pagina - 1)}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
        >
          Anterior
        </button>
        <button
          type="button"
          disabled={pagina >= paginas}
          onClick={() => onMudar(pagina + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm disabled:opacity-40"
        >
          Proxima
        </button>
      </div>
    </div>
  );
}
