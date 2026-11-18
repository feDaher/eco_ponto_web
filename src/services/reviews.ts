import { reviewKey } from '@/lib/reviews';
import type { ModeratedReview } from '@/types/api';
import { getPointBySlug, getPoints } from './api';

export async function getModeratedReviews(): Promise<ModeratedReview[]> {
  const points = await getPoints({});
  const details = await Promise.all(
    points.map((point) => getPointBySlug(point.slug))
  );

  return details
    .flatMap((point) =>
      point
        ? point.reviews.map((review) => ({
            ...review,
            key: reviewKey(point.slug, review.id),
            pointSlug: point.slug,
            pointName: point.name,
          }))
        : []
    )
    .sort((a, b) => b.date.localeCompare(a.date));
}
