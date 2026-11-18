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
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Capacidade total utilizada
            </p>
            <p className="mt-1 text-3xl font-bold text-card-foreground">
              {percent}%
            </p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-brand-light text-brand">
            <Gauge aria-hidden="true" className="size-4" />
          </span>
        </div>

        <div className="mt-3 flex justify-between text-xs font-semibold text-brand">
          <span>{kg(storedKg)} kg ocupados</span>
          <span className="text-muted-foreground">
            Teto {kg(capacityKg)} kg
          </span>
        </div>

        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Alerta de lotação
            </p>
            <p className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">
                {criticalCount}
              </span>
              <span className="text-xs font-semibold text-red-600">
                Crítica &gt; {criticalPercent}%
              </span>
            </p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-red-950/30 text-red-600">
            <AlertTriangle aria-hidden="true" className="size-4" />
          </span>
        </div>
      </div>
    </div>
  );
}
