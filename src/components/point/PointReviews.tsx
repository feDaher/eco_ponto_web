'use client';

import { useState } from 'react';
import { AlertCircle, MapPin, MessageSquareQuote } from 'lucide-react';
import { averageRating, formatDate, pluralize } from '@/lib/points';
import { listPointReviews } from '@/services/reviews';
import type { Review } from '@/types/api';
import { ReviewForm } from './ReviewForm';
import { SectionCard } from './SectionCard';
import { StarRating } from './StarRating';

type PointReviewsProps = {
  pointId: string;
  pointName: string;
  initialReviews: Review[];
  initialError: string | null;
  live: boolean;
};

export function PointReviews({
  pointId,
  pointName,
  initialReviews,
  initialError,
  live,
}: PointReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [error, setError] = useState(initialError);

  const average = averageRating(reviews);
  const averageLabel = average.toFixed(1).replace('.', ',');
  const countLabel = pluralize(reviews.length, 'avaliação', 'avaliações');

  async function handlePublished(review: Review) {
    setReviews((current) => [
      review,
      ...current.filter((item) => item.id !== review.id),
    ]);

    try {
      setReviews(await listPointReviews(pointId));
      setError(null);
    } catch {
      setError(
        'A avaliação foi salva, mas não foi possível atualizar a lista.'
      );
    }
  }

  return (
    <SectionCard
      id="reviews"
      eyebrow="Comunidade e cidadania"
      title="Avaliações e experiência dos usuários"
      description="Opiniões de quem já utilizou este ponto."
      aside={
        reviews.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="sr-only">
              Nota média {averageLabel} de 5, {countLabel}.
            </span>
            <span aria-hidden="true" className="text-3xl font-bold">
              {averageLabel}
            </span>
            <div aria-hidden="true">
              <StarRating value={average} />
              <p className="mt-0.5 text-xs text-slate-500">{countLabel}</p>
            </div>
          </div>
        )
      }
    >
      {error && (
        <p
          role="alert"
          className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}

      {reviews.length > 0 ? (
        <ul className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="min-w-0 rounded-2xl bg-surface-alt p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="sr-only">{review.rating} de 5 estrelas.</span>
                <StarRating value={review.rating} />
                <time
                  dateTime={review.date}
                  className="shrink-0 text-xs text-slate-500"
                >
                  {formatDate(review.date)}
                </time>
              </div>

              {review.comment ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-700">
                  “{review.comment}”
                </p>
              ) : (
                <p className="mt-3 text-sm text-slate-500 italic">
                  Avaliação sem comentário.
                </p>
              )}

              <div className="mt-4 flex items-center gap-2 border-t border-slate-200/60 pt-3">
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-light text-xs font-semibold text-brand-dark"
                >
                  {review.author.trim().charAt(0).toLocaleUpperCase('pt-BR')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {review.author}
                  </p>
                  {review.neighborhood && (
                    <p className="flex items-center gap-1 text-xs text-slate-500">
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
        !error && (
          <div className="rounded-2xl bg-surface-alt p-5 text-center">
            <MessageSquareQuote
              aria-hidden="true"
              className="mx-auto size-6 text-slate-400"
            />
            <p className="mt-2 text-sm text-slate-500">
              Este ponto ainda não recebeu avaliações.
            </p>
          </div>
        )
      )}

      <ReviewForm
        pointId={pointId}
        pointName={pointName}
        live={live}
        onPublished={handlePublished}
      />
    </SectionCard>
  );
}
