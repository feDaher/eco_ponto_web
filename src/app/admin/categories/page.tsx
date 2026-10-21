import { connection } from 'next/server';
import { ClockAlert, Tags } from 'lucide-react';
import { AlertPointsTable } from '@/components/admin/AlertPointsTable';
import { CategoryTable } from '@/components/admin/CategoryTable';
import { SectionCard } from '@/components/point/SectionCard';
import { StatCard } from '@/components/ui/StatCard';
import { OUTDATED_AFTER_DAYS } from '@/lib/points';
import { getOutdatedPoints } from '@/services/api';
import {
  getActivePointCounts,
  getWasteCategories,
} from '@/services/categories';

export default async function AdminCategoriesPage() {
  await connection();

  const [categories, pointCounts, outdatedPoints] = await Promise.all([
    getWasteCategories(),
    getActivePointCounts(),
    getOutdatedPoints(),
  ]);
  const activeCount = categories.filter((category) => category.active).length;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Configuração operacional
        </p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Categorias e horários
        </h1>
        <p className="text-sm text-slate-600">
          Gerencie as categorias de resíduo e atualize os horários dos pontos
          sem confirmação há mais de {OUTDATED_AFTER_DAYS} dias.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Categorias ativas" icon={Tags}>
          <p className="text-3xl font-bold text-slate-900">
            {activeCount}
            <span className="ml-1.5 text-sm font-medium text-slate-500">
              de {categories.length}
            </span>
          </p>
        </StatCard>
        <StatCard label="Horários desatualizados" icon={ClockAlert}>
          <p className="text-3xl font-bold text-slate-900">
            {outdatedPoints.length}
            <span className="ml-1.5 text-sm font-medium text-slate-500">
              {outdatedPoints.length === 1 ? 'ponto' : 'pontos'}
            </span>
          </p>
        </StatCard>
      </div>

      <SectionCard
        id="categories"
        title="Categorias de resíduo"
        description="Cadastre, renomeie ou desative as categorias aceitas pelos pontos."
        icon={Tags}
      >
        <CategoryTable
          initialCategories={categories}
          pointCounts={pointCounts}
        />
      </SectionCard>

      <SectionCard
        id="outdated-hours"
        title="Pontos com horário desatualizado"
        description={`Pontos sem confirmação de horário há mais de ${OUTDATED_AFTER_DAYS} dias.`}
        icon={ClockAlert}
      >
        <AlertPointsTable initialPoints={outdatedPoints} />
      </SectionCard>
    </div>
  );
}
