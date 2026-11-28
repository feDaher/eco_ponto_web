'use client';

import { Gauge, MapPinCheck, Scale, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { collectorStats } from '@/data/mockCollector';
import { cn } from '@/lib/utils';
import type { PointStatus } from '@/types/api';
import { useCollector } from './collectorContext';

const kg = new Intl.NumberFormat('pt-BR');

const dateFormat = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const MAP_STATUS: Record<
  PointStatus,
  { label: string; badge: string; dot: string; hint: string }
> = {
  approved: {
    label: 'Ativo e verificado',
    badge: 'bg-brand-light text-brand-dark',
    dot: 'bg-brand',
    hint: 'Visível para os cidadãos no mapa.',
  },
  pending: {
    label: 'Em análise',
    badge:
      'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    dot: 'bg-amber-500',
    hint: 'Oculto no mapa até a aprovação.',
  },
  rejected: {
    label: 'Cadastro reprovado',
    badge: 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300',
    dot: 'bg-red-500',
    hint: 'Revise os dados do ponto e envie de novo.',
  },
  removed: {
    label: 'Inativo no mapa',
    badge: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-400',
    hint: 'O ponto não aparece para os cidadãos.',
  },
};

export function CollectorStats() {
  const { selectedPoint: point } = useCollector();
  const { monthlyKg, monthlyGrowth, storedKg, capacityKg } = collectorStats;
  const usage = Math.round((storedKg / capacityKg) * 100);
  const status = point ? MAP_STATUS[point.status] : null;

  const hint = !point
    ? 'Cadastre um ponto para aparecer no mapa.'
    : point.isOutdated
      ? 'Horários desatualizados: confirme os horários do ponto.'
      : point.status === 'approved' && point.hoursConfirmedAt
        ? `Horários confirmados em ${dateFormat.format(new Date(point.hoursConfirmedAt))}.`
        : status?.hint;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <StatCard label="Total recebido (mês)" icon={Scale}>
        <div>
          <p className="text-2xl font-extrabold tracking-tight text-slate-800">
            {kg.format(monthlyKg)}{' '}
            <span className="text-base font-semibold text-brand-muted">kg</span>
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-brand">
            <TrendingUp aria-hidden="true" className="size-3" />+{monthlyGrowth}
            % vs. mês anterior
          </p>
        </div>
      </StatCard>

      <StatCard label="Capacidade central" icon={Gauge}>
        <div>
          <p className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-800">
              {usage}%
            </span>
            <span className="text-xs font-medium text-brand-muted">
              {kg.format(storedKg)} / {kg.format(capacityKg)} kg
            </span>
          </p>
          <div
            role="progressbar"
            aria-label="Capacidade utilizada"
            aria-valuenow={usage}
            aria-valuemin={0}
            aria-valuemax={100}
            className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100"
          >
            <div
              className="h-2 rounded-full bg-brand-solid"
              style={{ width: `${usage}%` }}
            />
          </div>
        </div>
      </StatCard>

      <StatCard label="Status no mapa" icon={MapPinCheck}>
        <div className="space-y-1">
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
              status?.badge ?? 'bg-slate-100 text-slate-700'
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'size-1.5 rounded-full',
                status?.dot ?? 'bg-slate-400'
              )}
            />
            {status?.label ?? 'Sem ponto vinculado'}
          </span>
          <p className="text-xs text-brand-muted">{hint}</p>
        </div>
      </StatCard>
    </div>
  );
}
