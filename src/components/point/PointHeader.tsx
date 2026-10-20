import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Navigation,
  Star,
} from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { getDirectionsUrl } from '@/lib/geo';
import { averageRating, isOpenNow, pluralize } from '@/lib/points';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { PointDetails } from '@/types/api';
import { ShareButton } from './ShareButton';

type PointHeaderProps = {
  point: PointDetails;
};

export function PointHeader({ point }: PointHeaderProps) {
  const isOpen = isOpenNow(point.schedule);
  const rating = averageRating(point.reviews);
  const whatsappUrl = point.whatsapp?.authorized
    ? `https://wa.me/${point.whatsapp.phone}`
    : null;

  return (
    <header className="space-y-5">
      <Link
        href={ROUTES.map}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Voltar para os pontos de coleta
      </Link>

      <div className="space-y-3">
        <p
          className={cn(
            'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold',
            isOpen
              ? 'bg-brand-light text-brand-dark'
              : 'bg-slate-100 text-slate-600'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'size-2 rounded-full',
              isOpen ? 'animate-pulse bg-brand' : 'bg-slate-400'
            )}
          />
          {isOpen ? 'Aberto agora' : 'Fechado agora'}
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          {point.name}
        </h1>
        <p className="text-slate-600">{point.responsible}</p>

        <div className="flex flex-col gap-2 text-sm text-slate-600 md:flex-row md:items-center md:gap-6">
          <p className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            {point.address} - {point.neighborhood}, {point.city}
          </p>
          {point.reviews.length > 0 && (
            <p className="flex items-center gap-1.5">
              <Star
                aria-hidden="true"
                className="size-4 fill-amber-400 text-amber-400"
              />
              <span className="font-semibold text-slate-900">
                {rating.toFixed(1).replace('.', ',')}
              </span>
              ({pluralize(point.reviews.length, 'avaliação', 'avaliações')})
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={getDirectionsUrl(point)}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          <Navigation aria-hidden="true" />
          Como chegar
          <span className="sr-only">(abre em nova aba)</span>
        </a>

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ size: 'lg' })}
          >
            <MessageCircle aria-hidden="true" />
            Falar no WhatsApp
            <span className="sr-only">(abre em nova aba)</span>
          </a>
        )}

        <ShareButton
          title={point.name}
          text={`Confira as informações do ${point.name} no EcoPonto`}
        />
      </div>

      {whatsappUrl && (
        <p className="text-xs text-slate-500">
          O contato via WhatsApp foi autorizado pelo responsável pelo ponto.
        </p>
      )}
    </header>
  );
}
