import type { Metadata } from 'next';
import { PointModeration } from '@/components/admin/moderation/PointModeration';

export const metadata: Metadata = {
  title: 'Moderação de pontos | EcoPonto Digital',
  robots: { index: false },
};

export default function AdminPointsPage() {
  return <PointModeration />;
}
