'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, Settings2 } from 'lucide-react';
import { CapacitySummary } from '@/components/collector/CapacitySummary';
import { useCollector } from '@/components/collector/collectorContext';
import { MaterialItem, fillPercent } from '@/components/collector/MaterialItem';
import { SectionCard } from '@/components/point/SectionCard';
import { buttonVariants } from '@/components/ui/Button';
import { COLLECTOR_SECTIONS, ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { formatMaterialLabel } from '@/services/collector';
import type { CollectorMaterial, CollectorPoint } from '@/types/collector';

const CRITICAL_FILL_PERCENT = 85;
const LOCAL_ADJUST_NOTICE =
  'Ajuste aplicado nesta sessão. A persistência de estoque e limites depende de endpoint próprio no backend.';

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function buildInitialMaterials(
  point: CollectorPoint | null
): CollectorMaterial[] {
  const rawMaterials = point?.materials ?? [];

  return rawMaterials.map((code, index) => {
    const label = formatMaterialLabel(code);
    return {
      id: `${point?.id ?? 'point'}-${code}-${index}`,
      code,
      name: label,
      description: `Categoria habilitada: ${label}`,
      accepting: point?.status === 'approved',
      storedKg: 0,
      capacityKg: 0,
    };
  });
}

type MaterialCapacityListProps = {
  pointKey: string;
  initialMaterials: CollectorMaterial[];
};

function MaterialCapacityList({
  pointKey,
  initialMaterials,
}: MaterialCapacityListProps) {
  const [materials, setMaterials] =
    useState<CollectorMaterial[]>(initialMaterials);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  function update(id: string, patch: Partial<CollectorMaterial>) {
    setMaterials((current) =>
      current.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  }

  function toggleReceiving(material: CollectorMaterial) {
    const accepting = !material.accepting;
    update(material.id, { accepting });
    setMessage(
      `${material.name}: recepção ${accepting ? 'reaberta' : 'pausada'} no app público. ${LOCAL_ADJUST_NOTICE}`
    );
  }

  function changeLimit(material: CollectorMaterial, capacityKg: number) {
    update(material.id, { capacityKg });
    setMessage(
      `${material.name}: limite alterado para ${capacityKg.toLocaleString('pt-BR')} kg. ${LOCAL_ADJUST_NOTICE}`
    );
  }

  const totals = useMemo(() => {
    const stored = materials.reduce((sum, m) => sum + m.storedKg, 0);
    const capacity = materials.reduce((sum, m) => sum + m.capacityKg, 0);
    const critical = materials.filter(
      (m) => m.accepting && fillPercent(m) >= CRITICAL_FILL_PERCENT
    ).length;

    return {
      stored,
      capacity,
      critical,
      percent: capacity > 0 ? Math.round((stored / capacity) * 100) : 0,
    };
  }, [materials]);

  const term = normalize(query.trim());
  const visible = materials.filter(
    (m) =>
      normalize(m.name).includes(term) ||
      (m.code ? normalize(m.code).includes(term) : false)
  );

  return (
    <div key={pointKey} className="space-y-6">
      <CapacitySummary
        percent={totals.percent}
        storedKg={totals.stored}
        capacityKg={totals.capacity}
        criticalCount={totals.critical}
        criticalPercent={CRITICAL_FILL_PERCENT}
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SectionCard
            id="material-list"
            title="Gestão de resíduos e baias"
            description="Controle o estoque físico, o limite de cada baia e se o material aparece como aceito no app público."
          >
            <div className="space-y-4">
              <label className="relative block sm:w-64">
                <span className="sr-only">Filtrar resíduo</span>
                <Search
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Filtrar resíduo"
                  className="w-full rounded-full border border-slate-200 bg-card py-2 pr-3 pl-9 text-sm text-slate-800 outline-none focus-visible:ring-2 focus-visible:ring-brand"
                />
              </label>

              {message && (
                <p
                  role="status"
                  className="rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
                >
                  {message}
                </p>
              )}

              <ul className="space-y-3">
                {visible.map((m) => (
                  <MaterialItem
                    key={m.id}
                    material={m}
                    criticalPercent={CRITICAL_FILL_PERCENT}
                    onToggle={toggleReceiving}
                    onLimitChange={changeLimit}
                  />
                ))}

                {visible.length === 0 && (
                  <li className="py-6 text-center text-sm text-slate-500">
                    {materials.length === 0
                      ? 'Nenhum material habilitado neste ponto de coleta.'
                      : 'Nenhum resíduo encontrado.'}
                  </li>
                )}
              </ul>
            </div>
          </SectionCard>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-card p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-light text-brand">
            <Settings2 aria-hidden="true" className="size-5" />
          </span>

          <h2 className="mt-4 font-semibold text-slate-900">
            Alterar portfólio de coleta
          </h2>

          <p className="mt-1 text-sm text-slate-600">
            Para incluir ou remover tipos de material, solicite a alteração das
            categorias aceitas pelo seu ponto.
          </p>

          <Link
            href={`${ROUTES.collector}#${COLLECTOR_SECTIONS.categories}`}
            className={cn(buttonVariants({ size: 'lg' }), 'mt-4 w-full')}
          >
            Alterar categorias aceitas
          </Link>
        </aside>
      </div>
    </div>
  );
}

export function MaterialCapacityManager() {
  const { selectedPoint } = useCollector();
  const pointKey = selectedPoint
    ? `${selectedPoint.id}:${selectedPoint.materials.join(',')}`
    : 'no-point';

  const initialMaterials = useMemo(
    () => buildInitialMaterials(selectedPoint),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pointKey]
  );

  return (
    <MaterialCapacityList
      key={pointKey}
      pointKey={pointKey}
      initialMaterials={initialMaterials}
    />
  );
}
