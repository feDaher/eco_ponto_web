import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/routes';
import { formatDistance, getDirectionsUrl } from '@/lib/geo';
import { MATERIALS } from '@/lib/materials';
import type { CollectionPoint } from '@/types/api';

type PointCardProps = {
  point: CollectionPoint;
  distance?: number;
  isActive: boolean;
  variant?: 'default' | 'muted';
  onHover: (id: string | null) => void;
  onClick: () => void;
};

export function PointCard({
  point,
  distance,
  isActive,
  variant = 'default',
  onHover,
  onClick,
}: PointCardProps) {
  return (
    <li
      id={`point-card-${point.id}`}
      onMouseEnter={() => onHover(point.id)}
      onMouseLeave={() => onHover(null)}
      className={cn(
        'space-y-3 rounded-2xl border p-4 transition-colors',
        variant === 'muted' ? 'bg-surface-alt' : 'bg-white',
        isActive
          ? 'border-brand shadow-md'
          : 'border-slate-100 hover:border-slate-200'
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-start justify-between gap-3 text-left"
      >
        <span>
          <span className="block font-bold text-slate-900">{point.name}</span>
          <span className="mt-0.5 block text-xs text-slate-500">
            {point.address} - {point.neighborhood}
          </span>
        </span>
        {distance !== undefined && (
          <span className="shrink-0 rounded-lg bg-brand-light px-2 py-1 text-[11px] font-semibold text-brand-muted">
            {formatDistance(distance)}
          </span>
        )}
      </button>

      <div className="flex flex-wrap gap-1.5">
        {point.materials.map((m) => (
          <span
            key={m}
            className={cn(
              'rounded-md border border-slate-200/60 px-2 py-0.5 text-[10px] font-medium text-slate-600',
              variant === 'muted' ? 'bg-white' : 'bg-surface-alt'
            )}
          >
            {MATERIALS[m].label}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-slate-200/50 pt-2 text-xs">
        <span className="font-medium text-brand">{point.hours}</span>
        <span className="flex shrink-0 items-center gap-3">
          <Link
            href={ROUTES.point(point.id)}
            className="font-semibold text-slate-600 hover:text-brand"
          >
            Detalhes
          </Link>
          <a
            href={getDirectionsUrl(point)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-brand hover:text-brand-dark"
          >
            Traçar rota
            <ExternalLink aria-hidden="true" className="h-3 w-3" />
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        </span>
      </div>
    </li>
  );
}
