'use client';

import { useCollector } from '@/components/collector/collectorContext';
import { CollectorStats } from '@/components/collector/CollectorStats';
import { OpeningHoursEditor } from '@/components/collector/OpeningHoursEditor';
import { PendingRequestNotice } from '@/components/collector/PendingRequestNotice';
import { PointCategories } from '@/components/collector/PointCategories';
import { PointInfoCard } from '@/components/collector/PointInfoCard';
import { ReceiptForm } from '@/components/collector/ReceiptForm';
import { RecentReceipts } from '@/components/collector/RecentReceipts';
import { COLLECTOR_SECTIONS } from '@/lib/routes';

export function CollectorDashboardClient() {
  const { selectedPoint, authorizedCategories } = useCollector();

  return (
    <div id={COLLECTOR_SECTIONS.overview} className="scroll-mt-24 space-y-6">
      <PendingRequestNotice
        point={selectedPoint}
        categoryUnderReview={selectedPoint?.categoryUnderReview}
      />

      <CollectorStats point={selectedPoint} />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <ReceiptForm />
          <RecentReceipts />
        </div>
        <div className="space-y-6">
          <PointInfoCard point={selectedPoint} />
          <OpeningHoursEditor />
          <PointCategories
            authorizedCategories={authorizedCategories}
            categoryUnderReview={selectedPoint?.categoryUnderReview}
            hasPoint={Boolean(selectedPoint)}
          />
        </div>
      </div>
    </div>
  );
}
