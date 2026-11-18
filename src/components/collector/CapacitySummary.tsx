import { AlertTriangle, Gauge } from 'lucide-react';

type CapacitySummaryProps = {
  percent: number;
  storedKg: number;
  capacityKg: number;
  criticalCount: number;
  criticalPercent: number;
};

const kg = (value: number) => value.toLocaleString('pt-BR');

export function CapacitySummary({
  percent,
  storedKg,
  capacityKg,
  criticalCount,
  criticalPercent,
}: CapacitySummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Capacidade total utilizada
            </p>
            <p className="mt-1 text-3xl font-bold text-slate-900">{percent}%</p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-brand-light text-brand">
            <Gauge aria-hidden="true" className="size-4" />
          </span>
        </div>

        <div className="mt-3 flex justify-between text-xs font-semibold text-brand">
          <span>{kg(storedKg)} kg ocupados</span>
          <span className="text-slate-500">Teto {kg(capacityKg)} kg</span>
        </div>

        <div
          role="progressbar"
          aria-label="Capacidade total utilizada"
          aria-valuenow={Math.min(percent, 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200"
        >
          <div
            className="h-full rounded-full bg-brand-solid"
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Alerta de lotação
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600 dark:text-red-400">
                {criticalCount}
              </span>
              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                {criticalCount === 1 ? 'baia' : 'baias'} com ocupação ≥{' '}
                {criticalPercent}%
              </span>
            </p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300">
            <AlertTriangle aria-hidden="true" className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
