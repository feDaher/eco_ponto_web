import Link from 'next/link';
import {
  ArrowRight,
  Leaf,
  Package,
  RefreshCw,
  Recycle,
  Sparkles,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { firstName, formatKg, getLevel, initials } from '@/lib/account';
import { HOME_BY_ROLE, ROUTES } from '@/lib/routes';
import { ROLE_LABELS } from '@/lib/users';
import { cn } from '@/lib/utils';
import type { DisposalSummary } from '@/types/account';
import type { User } from '@/types/user';

const CHART_COLORS = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
];

export type SummaryState =
  | { status: 'loading' }
  | { status: 'ready'; data: DisposalSummary }
  | { status: 'error'; message: string };

type ProfileOverviewProps = {
  user: User;
  summary: SummaryState | null;
  onRetry: () => void;
};

export function ProfileOverview({
  user,
  summary,
  onRetry,
}: ProfileOverviewProps) {
  return (
    <section
      aria-labelledby="account-heading"
      className="space-y-4 rounded-3xl border border-slate-100 bg-card p-5 shadow-sm sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-base font-bold text-brand-dark"
        >
          {initials(user.name)}
        </span>
        <div className="min-w-0">
          <h1
            id="account-heading"
            className="truncate text-xl font-bold text-slate-900"
          >
            Olá, {firstName(user.name)}
          </h1>
          <p className="text-sm text-slate-500">
            {user.role === 'CITIZEN'
              ? 'Sua dedicação está fazendo a diferença.'
              : `Perfil: ${ROLE_LABELS[user.role]}`}
          </p>
        </div>
      </div>

      {summary === null ? (
        <StaffShortcut user={user} />
      ) : summary.status === 'loading' ? (
        <SummarySkeleton />
      ) : summary.status === 'error' ? (
        <SummaryError message={summary.message} onRetry={onRetry} />
      ) : (
        <CitizenSummary data={summary.data} />
      )}
    </section>
  );
}

function CitizenSummary({ data }: { data: DisposalSummary }) {
  const level = getLevel(data.totalPoints);
  const totalKg = data.byCategory.reduce((sum, c) => sum + c.weightKg, 0);

  return (
    <>
      <div className="rounded-2xl bg-brand-deep p-4 text-white">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-brand-pale uppercase">
            <Sparkles aria-hidden="true" className="size-3.5" />
            Eco-guerreiro nível {level.level}
          </p>
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-xs font-semibold">
            {level.percent}%
          </span>
        </div>
        <p className="mt-2 text-lg font-bold">
          {level.percent >= 80
            ? 'Subindo de nível em breve'
            : 'Rumo ao próximo nível'}
        </p>
        <div
          role="progressbar"
          aria-label={`Progresso para o nível ${level.level + 1}`}
          aria-valuemin={0}
          aria-valuemax={level.target}
          aria-valuenow={level.current}
          className="mt-3 h-2 overflow-hidden rounded-full bg-white/20"
        >
          <div
            className="h-full rounded-full bg-brand-pale"
            style={{ width: `${level.percent}%` }}
          />
        </div>
        <p className="mt-1.5 flex justify-between text-xs text-brand-foreground">
          <span>Progresso para o nível {level.level + 1}</span>
          <span className="tabular-nums">
            {level.current} / {level.target} pts
          </span>
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-3">
        <StatTile
          icon={Recycle}
          label="Itens reciclados"
          value={String(data.totalDisposals)}
        />
        <StatTile
          icon={Package}
          label="Lixo encaminhado"
          value={formatKg(data.totalWeightKg)}
          unit="kg"
        />
      </dl>

      <div className="rounded-2xl bg-surface-alt p-4">
        <p className="flex items-center gap-2 text-sm font-semibold text-slate-900">
          <Leaf aria-hidden="true" className="size-4 text-brand" />
          Impacto por categoria
        </p>
        {totalKg > 0 ? (
          <>
            <div
              aria-hidden="true"
              className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-slate-200"
            >
              {data.byCategory.map((category, index) => (
                <span
                  key={category.name}
                  className={CHART_COLORS[index % CHART_COLORS.length]}
                  style={{ width: `${(category.weightKg / totalKg) * 100}%` }}
                />
              ))}
            </div>
            <ul className="mt-3 grid gap-1.5 text-xs text-slate-600 sm:grid-cols-2">
              {data.byCategory.map((category, index) => (
                <li key={category.name} className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-2 shrink-0 rounded-full',
                      CHART_COLORS[index % CHART_COLORS.length]
                    )}
                  />
                  <span className="truncate">{category.name}</span>
                  <span className="ml-auto font-semibold tabular-nums">
                    {formatKg(category.weightKg)} kg
                  </span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            Seu primeiro descarte aparece aqui.{' '}
            <Link
              href={ROUTES.map}
              className="font-semibold text-brand hover:underline"
            >
              Encontre um ponto de coleta
            </Link>
            .
          </p>
        )}
      </div>
    </>
  );
}

function StatTile({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: typeof Recycle;
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 rounded-2xl bg-surface-alt p-4 text-center">
      <span className="rounded-xl bg-brand-light p-2 text-brand">
        <Icon aria-hidden="true" className="size-4" />
      </span>
      <dt className="order-last text-[11px] font-bold tracking-wider text-slate-500 uppercase">
        {label}
      </dt>
      <dd className="text-2xl font-extrabold text-slate-900 tabular-nums">
        {value}
        {unit && (
          <span className="ml-1 text-sm font-medium text-slate-500">
            {unit}
          </span>
        )}
      </dd>
    </div>
  );
}

function SummarySkeleton() {
  return (
    <div aria-hidden="true" className="space-y-3">
      <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
      <div className="grid grid-cols-2 gap-3">
        <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

function SummaryError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-surface-alt p-4 text-sm text-slate-600">
      <p>{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className={cn(buttonVariants({ variant: 'outline' }), 'mt-3')}
      >
        <RefreshCw aria-hidden="true" />
        Tentar novamente
      </button>
    </div>
  );
}

function StaffShortcut({ user }: { user: User }) {
  return (
    <div className="rounded-2xl bg-surface-alt p-4">
      <p className="text-sm text-slate-600">
        O resumo de descartes é exclusivo da conta de cidadão. Acompanhe seu
        trabalho pelo painel do seu perfil.
      </p>
      <Link
        href={HOME_BY_ROLE[user.role]}
        className={cn(buttonVariants(), 'mt-3')}
      >
        Ir para o meu painel
        <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
