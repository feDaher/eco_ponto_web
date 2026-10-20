import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const STARS = [1, 2, 3, 4, 5];

const SIZES = {
  sm: 'size-4',
  lg: 'size-7',
};

type StarRatingProps = {
  value: number;
  size?: keyof typeof SIZES;
};

export function StarRating({ value, size = 'sm' }: StarRatingProps) {
  const rounded = Math.round(value);

  return (
    <span aria-hidden="true" className="flex text-amber-500">
      {STARS.map((star) => (
        <Star
          key={star}
          className={cn(
            SIZES[size],
            star <= rounded ? 'fill-current' : 'fill-transparent'
          )}
        />
      ))}
    </span>
  );
}
