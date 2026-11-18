import type { Metadata } from 'next';
import { CollectorSidebar } from '@/components/collector/CollectorSidebar';
import { MaterialCapacityManager } from '@/components/collector/MaterialCapacityManager';
import { CollectorHeader } from '@/components/collector/CollectorHeader';

export const metadata: Metadata = {
  title: 'Materiais e Capacidade | EcoPonto Digital',
  description:
    'Monitore o estoque e os limites de armazenamento por tipo de resíduo.',
  robots: { index: false },
};

export default function CollectorMaterialsPage() {
  return (
    <div className="bg-surface">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row">
        <CollectorSidebar />

        <div className="min-w-0 flex-1 space-y-6">
          <CollectorHeader />
          <header className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Materiais aceitos e gestão de capacidade
            </h2>
            <p className="text-sm text-slate-600">
              Monitore o estoque e limites de armazenamento por tipo de resíduo.
            </p>
          </header>

          <MaterialCapacityManager />
        </div>
      </div>
    </div>
  );
}
