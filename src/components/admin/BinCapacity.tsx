import { AlertTriangle } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { cn } from '@/lib/utils';
import type { BinLevel } from '@/types/api';

const CRITICAL_FILL_PERCENT = 80;

type BinCapacityProps = {
  bins: BinLevel[];
};

export function BinCapacity({ bins }: BinCapacityProps) {
  const criticalCount = bins.filter(
    (bin) => bin.fillPercent >= CRITICAL_FILL_PERCENT
  ).length;

  return (
    <SectionCard
      id="bins"
      title="Capacidade das urnas"
      description="Telemetria das últimas 24 horas"
      aside={
        criticalCount > 0 ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
            <AlertTriangle aria-hidden="true" className="size-3.5" />
            {criticalCount === 1
              ? '1 urna cheia'
              : `${criticalCount} urnas cheias`}
          </span>
        ) : undefined
      }
    >
      <ul className="grid gap-2.5">
        {bins.map((bin) => {
          const isCritical = bin.fillPercent >= CRITICAL_FILL_PERCENT;

          return (
            <li
              key={bin.name}
              className="rounded-xl border border-slate-200/60 bg-surface p-3"
            >
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-slate-800">{bin.name}</span>
                <span
                  className={cn(
                    'shrink-0 text-xs font-bold',
                    isCritical ? 'text-red-700' : 'text-brand'
                  )}
                >
                  {bin.fillPercent}% {isCritical ? 'cheia' : 'ocupada'}
                </span>
              </div>
              <div
                role="progressbar"
                aria-label={`Ocupação de ${bin.name}`}
                aria-valuenow={bin.fillPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200"
              >
                <div
                  className={cn(
                    'h-full rounded-full',
                    isCritical ? 'bg-red-600' : 'bg-brand'
                  )}
                  style={{ width: `${bin.fillPercent}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </SectionCard>
  );
}
