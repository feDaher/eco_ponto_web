import { MapPin, MessageSquareQuote, Star } from 'lucide-react';

import type { CollectionPoint } from '@/utils/tipos';
import { calculateAverage, formatDate } from '@/utils/utils-ponto';

import { ReviewForm } from './formulario-avaliacao';

type PointReviewsProps = {
  reviews: CollectionPoint['avaliacoes'];
  pointName: string;
};

export function PointReviews({
  // componente da página para as avaliações
  reviews,
  pointName,
}: PointReviewsProps) {
  const averageRating = calculateAverage(reviews.map((review) => review.nota));

  return (
    <section
      aria-labelledby="avaliacoes-heading"
      className="rounded-lg border bg-card p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="text-xs font-medium uppercase text-emerald-800">
            Comunidade e cidadania
          </p>
          <h2 id="avaliacoes-heading" className="mt-1 text-xl font-semibold">
            Avaliações e Experiência dos Usuários
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Opiniões de quem já utilizou este ponto.
          </p>
        </div>

        <div
          className="flex items-center gap-3"
          aria-label={`Nota média ${averageRating.toFixed(1)} de 5, ${reviews.length} avaliações`}
        >
          <span className="text-3xl font-semibold">
            {averageRating.toFixed(1)}
          </span>
          <div>
            <div className="flex text-amber-500" aria-hidden="true">
              {[1, 2, 3, 4, 5].map((starValue) => (
                //o valor das estrelas
                <Star
                  key={starValue}
                  className={`size-4 ${starValue <= Math.round(averageRating) ? 'fill-current' : 'fill-transparent'}`}
                />
              ))}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {reviews.length}{' '}
              {reviews.length === 1 ? 'avaliação' : 'avaliações'}
            </p>
          </div>
        </div>
      </div>

      {reviews.length > 0 ? (
        <ul className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reviews.map((review) => (
            <li key={review.id} className="min-w-0 rounded-md bg-sky-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div
                  className="flex text-amber-500"
                  aria-label={`${review.nota} de 5 estrelas`}
                >
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <Star
                      key={starValue}
                      aria-hidden="true"
                      className={`size-4 ${starValue <= review.nota ? 'fill-current' : 'fill-transparent'}`}
                    />
                  ))}
                </div>
                <time
                  className="shrink-0 text-xs text-muted-foreground"
                  dateTime={review.data}
                >
                  {formatDate(review.data)}
                </time>
              </div>

              <p className="mt-3 text-sm leading-relaxed">
                “{review.comentario}”
              </p>

              <div className="mt-4 flex items-center gap-2 border-t border-sky-100 pt-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-900">
                  {review.usuario.trim().charAt(0).toLocaleUpperCase('pt-BR')}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {review.usuario}
                  </p>
                  {review.localizacaoUsuario && (
                    <p className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin aria-hidden="true" className="size-3" />
                      <span className="truncate">
                        {review.localizacaoUsuario}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-5 rounded-md bg-muted/50 p-5 text-center">
          <MessageSquareQuote
            aria-hidden="true"
            className="mx-auto size-6 text-muted-foreground"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Este ponto ainda não recebeu avaliações.
          </p>
        </div>
      )}

      <ReviewForm pointName={pointName} />
    </section>
  );
}
