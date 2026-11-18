import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export type Material = {
  id: string;
  name: string;
  description: string;
  storedKg: number;
  capacityKg: number;
  accepting: boolean;
};

type MaterialItemProps = {
  material: Material;
  criticalPercent: number;
  onToggle: (id: string) => void;
};

const kg = (value: number) => value.toLocaleString('pt-BR');

export function MaterialItem({
  material: m,
  criticalPercent,
  onToggle,
}: MaterialItemProps) {
  const fill = Math.round((m.storedKg / m.capacityKg) * 100);
  const paused = !m.accepting;
  const critical = !paused && fill >= criticalPercent;

  return (
    <li
      className={cn(
        'rounded-2xl border p-4',
        paused && 'border-slate-200 bg-slate-100',
        critical && 'border-red-200 bg-red-50',
        !paused && !critical && 'border-slate-200 bg-surface'
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800">{m.name}</h3>
          <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={cn(
              'rounded-full px-2.5 py-1 text-[11px] font-bold',
              paused && 'bg-slate-200 text-slate-600',
              critical && 'bg-red-100 text-red-700',
              !paused && !critical && 'bg-green-100 text-green-700'
            )}
          >
            {paused
              ? 'Recepção pausada'
              : critical
                ? `${fill}% Quase cheio`
                : 'Aberto para coleta'}
          </span>

          <button
            type="button"
            role="switch"
            aria-checked={m.accepting}
            aria-label={`Receber ${m.name}`}
            onClick={() => onToggle(m.id)}
            className={cn(
              'relative h-6 w-11 shrink-0 rounded-full transition-colors',
              m.accepting ? 'bg-brand' : 'bg-slate-300'
            )}
          >
            <span
              className={cn(
                'absolute top-0.5 size-5 rounded-full bg-white shadow transition-all',
                m.accepting ? 'left-[22px]' : 'left-0.5'
              )}
            />
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <span className="text-slate-600">
          <strong>{kg(m.storedKg)} kg</strong> / {kg(m.capacityKg)} kg
          {fill === 100 ? ' (100% atingido)' : ' capacidade'}
        </span>
        <span
          className={cn(
            'font-semibold',
            critical ? 'text-red-700' : 'text-slate-600'
          )}
        >
          {paused
            ? 'Bloqueado para triagem'
            : critical
              ? `${fill}% (Risco de transbordo)`
              : `${fill}% ocupação`}
        </span>
      </div>

      <div
        role="progressbar"
        aria-label={`Ocupação de ${m.name}`}
        aria-valuenow={fill}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-200"
      >
        <div
          className={cn(
            'h-full rounded-full transition-all',
            paused && 'bg-slate-500',
            critical && 'bg-red-600',
            !paused && !critical && 'bg-brand'
          )}
          style={{ width: `${fill}%` }}
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Button variant="outline" size="sm">
          <SlidersHorizontal aria-hidden="true" />
          Limite
        </Button>
      </div>
    </li>
  );
}
