import { ComingSoon } from '@/components/layout/ComingSoon';

export default async function EducationCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  return (
    <ComingSoon title={`Aprender & Dicas: ${decodeURIComponent(category)}`} />
  );
}
