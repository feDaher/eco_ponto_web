import { BadgeCheck, Clock } from 'lucide-react';
import type { PointStatus } from '@/types/api';
import type { CollectorPoint } from '@/types/collector';

type CollectorHeaderProps = {
  name: string;
  unit?: string | null;
  isOpen: boolean;
  pointStatus?: PointStatus | null;
  cnpj?: string | null;
  points?: CollectorPoint[];
  selectedPointId?: string | null;
  onSelectPoint?: (pointId: string) => void;
};

export function CollectorHeader({
  name,
  unit,
  isOpen,
  pointStatus,
  cnpj,
  points = [],
  selectedPointId,
  onSelectPoint,
}: CollectorHeaderProps) {
  const isApproved = pointStatus === 'approved';
  const isPending = pointStatus === 'pending';

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {name}
          </h1>

          {isApproved && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-bold text-brand-dark">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              {cnpj ? 'CNPJ homologado' : 'Ponto homologado'}
            </span>
          )}

          {isPending && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
              <Clock aria-hidden="true" className="size-3.5" />
              Em análise
            </span>
          )}
        </div>

        {unit && <p className="text-sm text-slate-600">{unit}</p>}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {points.length > 1 && onSelectPoint && (
          <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <span className="sr-only">Selecionar ponto de coleta</span>
            <select
              value={selectedPointId ?? points[0].id}
              onChange={(event) => onSelectPoint(event.target.value)}
              className="rounded-xl border border-slate-200 bg-card px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-brand focus:outline-none"
            >
              {points.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {pointStatus && (
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand-dark">
            <span
              aria-hidden="true"
              className={
                isOpen
                  ? 'size-2 rounded-full bg-brand'
                  : 'size-2 rounded-full bg-slate-400'
              }
            />
            {isOpen ? 'Aberto e recebendo' : 'Fechado'}
          </p>
        )}
      </div>
    </header>
  );
}
