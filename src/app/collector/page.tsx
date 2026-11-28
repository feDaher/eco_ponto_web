import type { Metadata } from 'next';
import { CollectorDashboardClient } from '@/components/collector/CollectorDashboardClient';

export const metadata: Metadata = {
  title: 'Painel do Coletor | EcoPonto Digital',
  description:
    'Registre recebimentos e gerencie os dados do seu ponto de coleta.',
  robots: { index: false },
};

export default function CollectorPage() {
  return <CollectorDashboardClient />;
}
