'use client'; // 1. Obrigatório por usar Hooks (useEvaluations)

import { MapPin, MessageSquareQuote } from 'lucide-react';
import { averageRating, formatDate, pluralize } from '@/lib/points';
import type { Review } from '@/types/api';
import { useEvaluations } from '@/components/admin/EvaluationContext'; // 2. Import do contexto
import { ReviewForm } from './ReviewForm';
import { SectionCard } from './SectionCard';
import { StarRating } from './StarRating';

type PointReviewsProps = {
  reviews?: Review[]; // Deixamos opcional caso venha do mock global
  pointName: string;
};

export function PointReviews({
  reviews: initialReviews,
  pointName,
}: PointReviewsProps) {
  // 3. Pegamos a lista global do Context
  const { evaluations } = useEvaluations();

  // 4. Mapeamos e FILTRAMOS apenas as que estão com status === 'visible'
  // (Formatamos para bater com a interface Review que seu componente já usa)
  const activeReviews: Review[] = evaluations
    .filter((e) => e.status === 'visible')
    .map((e) => ({
      id: e.id,
      author: e.author,
      rating: Math.min(Math.max(Math.round(e.stars), 1), 5) as Review['rating'], // Faz o cast para bater com '1 | 2 | 3 | 4 | 5'
      comment: e.comment,
      date: e.date,
      neighborhood: e.location,
    }));
  // Usamos a lista filtrada do context (ou as props como fallback)
  const reviewsToDisplay =
    activeReviews.length > 0 ? activeReviews : initialReviews || [];

  const average = averageRating(reviewsToDisplay);
  const averageLabel = average.toFixed(1).replace('.', ',');
  const countLabel = pluralize(
    reviewsToDisplay.length,
    'avaliação',
    'avaliações'
  );

  return (
    <SectionCard
      id="reviews"
      eyebrow="Comunidade e cidadania"
      title="Avaliações e experiência dos usuários"
      description="Opiniões de quem já utilizou este ponto."
      aside={
        reviewsToDisplay.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="sr-only">
              Nota média {averageLabel} de 5, {countLabel}.
            </span>
            <span aria-hidden="true" className="text-3xl font-bold">
              {averageLabel}
            </span>
            <div aria-hidden="true">
              <StarRating value={average} />
              <p className="mt-0.5 text-xs text-ink">{countLabel}</p>
            </div>
          </div>
        )
      }
    >
      {reviewsToDisplay.length > 0 ? (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reviewsToDisplay.map((review) => (
            <li
              key={review.id}
              className="min-w-0 rounded-2xl bg-surface-alt p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="sr-only">{review.rating} de 5 estrelas.</span>
                <StarRating value={review.rating} />
                <time
                  dateTime={review.date}
                  className="shrink-0 text-xs text-ink"
                >
                  {formatDate(review.date)}
                </time>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-ink">
                “{review.comment}”
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-surface-accent pt-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand-dark"
                >
                  {review.author.trim().charAt(0).toLocaleUpperCase('pt-BR')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {review.author}
                  </p>
                  {review.neighborhood && (
                    <p className="flex items-center gap-1 text-xs text-ink">
                      <MapPin aria-hidden="true" className="size-3" />
                      <span className="truncate">{review.neighborhood}</span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl bg-surface-alt p-5 text-center">
          <MessageSquareQuote
            aria-hidden="true"
            className="mx-auto size-6 text-ink"
          />
          <p className="mt-2 text-sm text-ink">
            Este ponto ainda não recebeu avaliações.
          </p>
        </div>
      )}

      <ReviewForm pointName={pointName} />
    </SectionCard>
  );
}
