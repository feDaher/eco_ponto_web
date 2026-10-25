import { Clock3 } from 'lucide-react';

//responsável por exibir um item de detalhe com ícone, rótulo e valor
export function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock3;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#6f947b] dark:text-brand" />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7f8b83] dark:text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 text-sm leading-5 text-[#38483e] dark:text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}
