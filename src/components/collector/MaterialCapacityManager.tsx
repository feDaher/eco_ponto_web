'use client';

import { useMemo, useState } from 'react';
import { Search, Settings2 } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { Button } from '@/components/ui/Button';
import { collectorMaterials } from '@/data/mockCollector';
import { CapacitySummary } from '@/components/collector/CapacitySummary';
import {
  MaterialItem,
  type Material,
} from '@/components/collector/MaterialItem';

const CRITICAL_FILL_PERCENT = 85;

export function MaterialCapacityManager() {
  const [materials, setMaterials] = useState<Material[]>(collectorMaterials);
  const [query, setQuery] = useState('');

  function toggleReceiving(id: string) {
    setMaterials((current) =>
      current.map((m) => (m.id === id ? { ...m, accepting: !m.accepting } : m))
    );
  }

  const totals = useMemo(() => {
    const stored = materials.reduce((sum, m) => sum + m.storedKg, 0);
    const capacity = materials.reduce((sum, m) => sum + m.capacityKg, 0);
    const critical = materials.filter(
      (m) =>
        m.accepting &&
        (m.storedKg / m.capacityKg) * 100 >= CRITICAL_FILL_PERCENT
    ).length;

    return {
      stored,
      capacity,
      critical,
      percent: capacity ? Math.round((stored / capacity) * 100) : 0,
    };
  }, [materials]);

  const visible = materials.filter((m) =>
    m.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div id="material-capacity" className="scroll-mt-24 space-y-6">
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
            title="Gestão de Resíduos e Baias"
            description="Controle o fluxo de entrada, estoque físico e status de recepção no app público."
          >
            <div className="relative mb-4">
              <Search
                aria-hidden="true"
                className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar resíduo..."
                aria-label="Filtrar resíduo"
                className="w-full rounded-full border border-slate-200 bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-brand sm:w-64"
              />
            </div>

            <ul className="space-y-3">
              {visible.map((m) => (
                <MaterialItem
                  key={m.id}
                  material={m}
                  criticalPercent={CRITICAL_FILL_PERCENT}
                  onToggle={toggleReceiving}
                />
              ))}

              {visible.length === 0 && (
                <li className="py-6 text-center text-sm text-slate-500">
                  Nenhum resíduo encontrado.
                </li>
              )}
            </ul>
          </SectionCard>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-5">
          <span className="grid size-10 place-items-center rounded-xl bg-brand-light text-brand">
            <Settings2 aria-hidden="true" className="size-5" />
          </span>

          <h2 className="mt-4 font-semibold text-card-foreground">
            Alterar Portfólio de Coleta
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie os tipos de materiais que seu ponto recebe. Adicione ou
            remova categorias do seu portfólio rapidamente.
          </p>

          <Button className="mt-4 w-full">Alterar categorias aceitas</Button>
        </aside>
      </div>
    </div>
  );
}
