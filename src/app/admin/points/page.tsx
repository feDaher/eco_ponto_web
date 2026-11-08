import type { Metadata } from 'next';
import { PointModeration } from '@/components/admin/moderation/PointModeration';
import { getModerationData } from '@/services/moderation';

export const metadata: Metadata = {
  title: 'Moderação de pontos | EcoPonto Digital',
  robots: { index: false },
};

export default async function AdminPointsPage() {
  const data = await getModerationData();

  return <PointModeration initialData={data} />;
}
