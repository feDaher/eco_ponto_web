import {
  Leaf,
  MapPin,
  Recycle,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';
import { ReportSummary, ReportUsers } from '@/types/reports';

const GRID_CLASS = 'grid gap-4 sm:grid-cols-2 xl:grid-cols-4';

const USERS_COPY: Record<
  ReportUsers['scope'],
  { title: string; unit: [string, string]; note: string }
> = {
  platform: {
    title: 'Usuários Cadastrados',
    unit: ['usuário', 'usuários'],
    note: 'cadastrados no período',
  },
  collector: {
    title: 'Cidadãos Atendidos',
    unit: ['cidadão', 'cidadãos'],
    note: 'com o primeiro descarte no período',
  },
};

interface ReportSummaryCardsProps {
  summary: ReportSummary | null;
  isLoading?: boolean;
}

export function ReportSummaryCards({
  summary,
  isLoading = false,
}: ReportSummaryCardsProps) {
  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-card"
          />
        ))}
      </div>
    );
  }

  if (!summary) return null;

  const { totals, comparison, co2, activePoints, users } = summary;
  const variation = comparison.variationPercent;
  const usersCopy = USERS_COPY[users.scope];

  return (
    <div className={GRID_CLASS}>
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Volume Descartado
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totals.weightKg.toLocaleString('pt-BR', {
                maximumFractionDigits: 1,
              })}
              <span className="ml-1 text-sm font-medium text-slate-500">
                kg
              </span>
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-light text-brand-dark">
            <Recycle aria-hidden="true" className="size-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
          {variation !== null ? (
            <>
              {variation >= 0 ? (
                <TrendingUp
                  aria-hidden="true"
                  className="size-3.5 text-brand-dark"
                />
              ) : (
                <TrendingDown
                  aria-hidden="true"
                  className="size-3.5 text-red-600 dark:text-red-400"
                />
              )}
              <span
                className={
                  variation >= 0
                    ? 'font-semibold text-brand-dark'
                    : 'font-semibold text-red-600 dark:text-red-400'
                }
              >
                {variation >= 0 ? '+' : ''}
                {variation.toFixed(1)}%
              </span>
              <span>comparado ao período anterior</span>
            </>
          ) : (
            <span>{totals.disposals} descartes no período</span>
          )}
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              CO₂ Evitado (Estimativa)
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {co2.avoidedKg.toLocaleString('pt-BR', {
                maximumFractionDigits: 2,
              })}
              <span className="ml-1 text-sm font-medium text-slate-500">
                kg
              </span>
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-light text-brand-dark">
            <Leaf aria-hidden="true" className="size-5" />
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          <strong className="font-semibold text-brand-dark">
            {co2.treesSaved} árvores
          </strong>{' '}
          salvas em pegada ecológica
        </p>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Postos Ativos Monitorados
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {activePoints.total}
              <span className="ml-1 text-sm font-medium text-slate-500">
                {activePoints.total === 1 ? 'posto' : 'postos'}
              </span>
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-light text-brand-dark">
            <MapPin aria-hidden="true" className="size-5" />
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          <strong className="font-semibold text-slate-700">
            {totals.disposals} descartes
          </strong>{' '}
          homologados no período
        </p>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {usersCopy.title}
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {users.total.toLocaleString('pt-BR')}
              <span className="ml-1 text-sm font-medium text-slate-500">
                {usersCopy.unit[users.total === 1 ? 0 : 1]}
              </span>
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-brand-light text-brand-dark">
            <Users aria-hidden="true" className="size-5" />
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-500">
          <strong className="font-semibold text-brand-dark">
            +{users.newInPeriod.toLocaleString('pt-BR')}
          </strong>{' '}
          {usersCopy.note}
        </p>
      </div>
    </div>
  );
}
