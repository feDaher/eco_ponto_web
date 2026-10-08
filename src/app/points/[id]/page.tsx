import { ComingSoon } from '@/components/layout/ComingSoon';

export default async function PointDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <ComingSoon title={`Ponto de Coleta #${id}`} />;
}
