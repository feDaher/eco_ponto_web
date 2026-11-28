'use client';

import { BadgeCheck, Clock } from 'lucide-react';
import { FIELD_CLASS } from '@/components/point/fieldStyles';
import { useAuth } from '@/context/AuthContext';
import { isOpenNow } from '@/lib/points';
import { cn } from '@/lib/utils';
import { useCollector } from './collectorContext';

export function CollectorHeader() {
  const { user } = useAuth();
  const { loading, points, selectedPoint, selectPoint } = useCollector();

  if (loading) {
    return (
      <div
        aria-hidden="true"
        className="h-16 animate-pulse rounded-2xl bg-slate-200/70"
      />
    );
  }

  const name = selectedPoint?.cooperative?.name ?? user?.name ?? '';
  const location = selectedPoint
    ? [selectedPoint.name, selectedPoint.city].filter(Boolean).join(' • ')
    : 'Nenhum ponto de coleta cadastrado';
  const isOpen = selectedPoint ? isOpenNow(selectedPoint.schedule) : false;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {name}
          </h1>

          {selectedPoint?.status === 'approved' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-bold text-brand-dark">
              <BadgeCheck aria-hidden="true" className="size-3.5" />
              Ponto homologado
            </span>
          )}

          {selectedPoint?.status === 'pending' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
              <Clock aria-hidden="true" className="size-3.5" />
              Em análise
            </span>
          )}
        </div>

        <p className="text-sm text-slate-600">{location}</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {points.length > 1 && selectedPoint && (
          <label className="text-xs font-medium text-slate-600">
            <span className="sr-only">Ponto de coleta</span>
            <select
              value={selectedPoint.id}
              onChange={(event) => selectPoint(event.target.value)}
              className={cn(FIELD_CLASS, 'cursor-pointer text-sm')}
            >
              {points.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                </option>
              ))}
            </select>
          </label>
        )}

        {selectedPoint && (
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand-dark">
            <span
              aria-hidden="true"
              className={cn(
                'size-2 rounded-full',
                isOpen ? 'bg-brand' : 'bg-slate-400'
              )}
            />
            {isOpen ? 'Aberto e recebendo' : 'Fechado agora'}
          </p>
        )}
      </div>
    </header>
  );
}
