//responsável por exibir um botão de abertura com ícone, rótulo e contagem
export function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition sm:flex-none ${
        active
          ? 'bg-[#2f664d] text-white shadow-sm'
          : 'text-[#52615a] hover:bg-[#f3f7f4] hover:text-[#2e6349] dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground'
      }`}
    >
      {icon}
      <span className="text-left">{label}</span>
      {count !== undefined && (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
            active
              ? 'bg-white/20 text-white'
              : 'bg-[#edf2ef] text-[#617068] dark:bg-muted dark:text-muted-foreground'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
