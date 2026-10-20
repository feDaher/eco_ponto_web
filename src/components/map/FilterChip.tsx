import { cn } from '@/lib/utils';

type FilterChipProps = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isSelected: boolean;
  onClick: () => void;
};

export function FilterChip({
  label,
  icon: Icon,
  isSelected,
  onClick,
}: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold whitespace-nowrap transition-colors',
        isSelected
          ? 'border-brand bg-brand text-white shadow-sm'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}
