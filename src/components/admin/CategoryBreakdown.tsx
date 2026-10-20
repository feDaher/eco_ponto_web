import { SectionCard } from '@/components/point/SectionCard';
import { cn } from '@/lib/utils';
import type { CategoryVolume } from '@/types/api';

const COLORS = [
  'bg-brand-dark',
  'bg-brand',
  'bg-brand-medium',
  'bg-brand-muted',
  'bg-brand-pale',
];

const kg = new Intl.NumberFormat('pt-BR');

type CategoryBreakdownProps = {
  categories: CategoryVolume[];
  period: string;
};

export function CategoryBreakdown({
  categories,
  period,
}: CategoryBreakdownProps) {
  const totalKg = categories.reduce((total, item) => total + item.kg, 0);
  const rows = categories.map((category, index) => ({
    ...category,
    color: COLORS[index % COLORS.length],
    percent: totalKg ? Math.round((category.kg / totalKg) * 100) : 0,
  }));

  return (
    <SectionCard
      id="categories"
      title="Coleta por categoria de resíduo"
      description={`Volume segregado em ${period.toLowerCase()}`}
      aside={
        <span className="rounded-xl bg-surface-alt px-3 py-1.5 text-right">
          <span className="block text-[11px] font-semibold text-slate-500">
            Total
          </span>
          <span className="text-sm font-bold text-slate-800">
            {kg.format(totalKg)} kg
          </span>
        </span>
      }
    >
      <div
        aria-hidden="true"
        className="flex h-2.5 overflow-hidden rounded-full bg-slate-100"
      >
        {rows.map((row) => (
          <div
            key={row.name}
            className={row.color}
            style={{ width: `${row.percent}%` }}
          />
        ))}
      </div>

      <ul className="mt-4 grid gap-2">
        {rows.map((row) => (
          <li key={row.name} className="rounded-xl bg-surface px-3 py-2.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cn('size-2 shrink-0 rounded-full', row.color)}
                />
                <span className="font-semibold text-slate-800">{row.name}</span>
              </span>
              <span className="flex shrink-0 items-center gap-2">
                <span className="font-bold text-slate-800">
                  {kg.format(row.kg)} kg
                </span>
                <span className="rounded-full bg-brand-light px-2 py-0.5 text-xs font-bold text-brand-dark">
                  {row.percent}%
                </span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
