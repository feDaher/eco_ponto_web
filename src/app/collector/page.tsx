import type { Metadata } from 'next';
import { CollectorHeader } from '@/components/collector/CollectorHeader';
import { CollectorSidebar } from '@/components/collector/CollectorSidebar';
import { CollectorStats } from '@/components/collector/CollectorStats';
import { OpeningHoursEditor } from '@/components/collector/OpeningHoursEditor';
import { PendingRequestNotice } from '@/components/collector/PendingRequestNotice';
import { PointCategories } from '@/components/collector/PointCategories';
import { PointInfoCard } from '@/components/collector/PointInfoCard';
import { ReceiptForm } from '@/components/collector/ReceiptForm';
import { RecentReceipts } from '@/components/collector/RecentReceipts';
import { COLLECTOR_SECTIONS } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Painel do Coletor | EcoPonto Digital',
  description:
    'Registre recebimentos e gerencie os dados do seu ponto de coleta.',
  robots: { index: false },
};

export default function CollectorPage() {
  return (
    <div className="bg-surface">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row">
        <CollectorSidebar />

        <div
          id={COLLECTOR_SECTIONS.overview}
          className="min-w-0 flex-1 scroll-mt-24 space-y-6"
        >
          <CollectorHeader />
          <PendingRequestNotice />
          <CollectorStats />

          <div className="grid gap-6 xl:grid-cols-3">
            <div className="space-y-6 xl:col-span-2">
              <ReceiptForm />
              <RecentReceipts />
            </div>
            <div className="space-y-6">
              <PointInfoCard />
              <OpeningHoursEditor />
              <PointCategories />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
