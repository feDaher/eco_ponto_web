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
          <header>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Materiais Aceitos &amp; Gestão de Capacidade
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Monitore o estoque e limites de armazenamento por tipo de resíduo.
            </p>
          </header>

          <MaterialCapacityManager />
        </div>
      </div>
    </div>
  );
}
