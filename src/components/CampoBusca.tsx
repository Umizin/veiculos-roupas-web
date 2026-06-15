interface CampoBuscaProps {
  valor: string;
  onMudar: (valor: string) => void;
  placeholder?: string;
}

export function CampoBusca({ valor, onMudar, placeholder = 'Buscar...' }: CampoBuscaProps) {
  return (
    <input
      type="search"
      value={valor}
      onChange={(e) => onMudar(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:border-marca-500 focus:outline-none focus:ring-2 focus:ring-marca-100"
    />
  );
}
