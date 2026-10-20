import { BinCapacity } from '@/components/admin/BinCapacity';
import { CategoryBreakdown } from '@/components/admin/CategoryBreakdown';
import { DashboardKpis } from '@/components/admin/DashboardKpis';
import { ImpactCard } from '@/components/admin/ImpactCard';
import { getDashboardStats } from '@/services/dashboard';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-brand"
            />
            Painel de inteligência municipal
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Visão executiva e gestão operacional
          </h1>
          <p className="text-sm text-slate-600">
            Monitoramento consolidado dos ecopontos do polo regional Manhuaçu.
          </p>
        </div>
        <p className="rounded-full bg-surface-strong px-3 py-1.5 text-xs font-semibold text-brand-dark">
          Período: {stats.period}
        </p>
      </header>

      <DashboardKpis stats={stats} />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <CategoryBreakdown
            categories={stats.categories}
            period={stats.period}
          />
        </div>
        <div className="space-y-6 xl:col-span-2">
          <ImpactCard
            co2SavedTons={stats.co2SavedTons}
            treesEquivalent={stats.treesEquivalent}
          />
          <BinCapacity bins={stats.bins} />
        </div>
      </div>
    </div>
  );
}
