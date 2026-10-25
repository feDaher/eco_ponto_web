import { CheckCircle2 } from 'lucide-react';

//responsável por exibir um card de métrica com ícone, rótulo, valor, nota e comparação
export function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  comparison,
  color,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string | number;
  note: string;
  comparison?: string;
  color: 'green' | 'red' | 'blue';
}) {
  const palette = {
    green:
      'bg-[#e9f5ed] text-[#2f664d] dark:bg-green-950/40 dark:text-green-300',
    red: 'bg-[#fff0ee] text-[#b33b35] dark:bg-red-950/40 dark:text-red-300',
    blue: 'bg-[#edf2ff] text-[#4e69aa] dark:bg-blue-950/40 dark:text-blue-300',
  }[color];

  return (
    <article className="rounded-2xl border border-[#e8eeea] bg-white p-5 shadow-[0_2px_12px_rgba(33,58,45,0.03)] dark:border-border dark:bg-card">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#77837c] dark:text-muted-foreground">
          {label}
        </p>
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${palette}`}
        >
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <div className="mt-3 flex items-end gap-3">
        <p className="text-[34px] font-bold leading-none tracking-[-0.04em] text-[#1c2923] dark:text-foreground">
          {value}
        </p>
        <div className="pb-0.5">
          <p className="text-xs text-[#7a8780] dark:text-muted-foreground">
            {note}
          </p>
          {comparison && (
            <p className="mt-1 text-[11px] text-[#87928b] dark:text-muted-foreground">
              {comparison}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
