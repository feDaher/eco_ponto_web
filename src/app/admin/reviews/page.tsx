import type { Metadata } from 'next';
import { ReviewModeration } from '@/components/admin/reviews/ReviewModeration';
import { getModeratedReviews } from '@/services/reviews';

export const metadata: Metadata = {
  title: 'Moderação de avaliações | EcoPonto Digital',
  robots: { index: false },
};

export default async function AdminReviewsPage() {
  const reviews = await getModeratedReviews();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Comunidade e cidadania
        </p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Moderação de avaliações
        </h1>
        <p className="text-sm text-slate-600">
          As avaliações são publicadas automaticamente na ficha do ponto.
          Acompanhe os relatos e oculte os conteúdos impróprios.
        </p>
      </header>

      <ReviewModeration reviews={reviews} />
    </div>
  );
}
