import type { Metadata } from 'next';
import { MaterialCapacityManager } from '@/components/collector/MaterialCapacityManager';

export const metadata: Metadata = {
  title: 'Materiais e Capacidade | EcoPonto Digital',
  description:
    'Monitore o estoque e os limites de armazenamento por tipo de resíduo.',
  robots: { index: false },
};

export default function CollectorMaterialsPage() {
  return (
    <>
      <header className="space-y-1">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Materiais aceitos e gestão de capacidade
        </h2>
        <p className="text-sm text-slate-600">
          Monitore o estoque e limites de armazenamento por tipo de resíduo.
        </p>
      </header>

      <MaterialCapacityManager />
    </>
  );
}
