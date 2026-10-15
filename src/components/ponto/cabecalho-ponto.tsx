import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  MessageCircle,
  Navigation,
  Star,
} from 'lucide-react';

import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/utils/utils';
import type { CollectionPoint } from '@/utils/tipos';
import { calculateAverage, isPointOpen } from '@/utils/utils-ponto';

import { ShareButton } from './compartilhar-button';
import { PointStatus } from './status-ponto';

type PointHeaderProps = {
  point: CollectionPoint;
};

export function PointHeader({ point }: PointHeaderProps) {
  // cabeçalho da ficha do ponto
  const averageRating = calculateAverage(
    point.reviews.map((review) => review.rating)
  );
  const isOpenNow = isPointOpen(point.schedules, point.address.timeZone);

  const isWhatsappAuthorized =
    point.contact.whatsapp.authorized && !!point.contact.whatsapp.phoneNumber;

  const whatsappUrl = isWhatsappAuthorized
    ? `https://wa.me/${point.contact.whatsapp.phoneNumber}`
    : null;

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${point.address.latitude},${point.address.longitude}`;

  return (
    <section className="space-y-6">
      {/* Voltar */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para os pontos de coleta
        </Link>
      </div>

      <PointStatus status={point.status} />

      {/* Cabeçalho principal */}
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span
            className={`relative flex h-3 w-3 ${isOpenNow ? '' : 'hidden'}`}
          >
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
          </span>
          {!isOpenNow && (
            <span
              aria-hidden="true"
              className="h-3 w-3 rounded-full bg-muted-foreground/50"
            />
          )}

          <span
            className={`text-sm font-medium ${isOpenNow ? 'text-green-700' : 'text-muted-foreground'}`}
          >
            {isOpenNow ? 'Aberto agora' : 'Fechado agora'}
          </span>
        </div>

        {/* Título */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {point.name}
          </h1>

          <p className="mt-2 text-base text-muted-foreground">
            {point.responsiblePerson}
          </p>
        </div>

        {/* Endereço e avaliação */}
        <div className="flex flex-col gap-3 text-sm text-muted-foreground md:flex-row md:items-center md:gap-6">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />

            <span>
              {point.address.street}, {point.address.number}
              <br className="md:hidden" /> — {point.address.neighborhood},{' '}
              {point.address.city}-{point.address.state}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />

              <span className="font-semibold text-foreground">
                {averageRating.toFixed(1)}
              </span>
            </div>

            <span>
              ({point.reviews.length}{' '}
              {point.reviews.length === 1 ? 'avaliação' : 'avaliações'})
            </span>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {/* Como chegar */}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({
              variant: 'outline',
              size: 'default',
            }),
            'gap-2'
          )}
        >
          <Navigation className="h-4 w-4" />
          Como chegar
        </a>

        {/* WhatsApp */}
        {isWhatsappAuthorized && whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({
                variant: 'default',
                size: 'default',
              })
            )}
          >
            <MessageCircle className="h-4 w-4" />
            Falar no WhatsApp
          </a>
        )}

        {/* Compartilhar */}
        <ShareButton
          title={point.name}
          text={`Confira as informações do ${point.name}`}
        />
      </div>

      {/* Informação sobre o responsável pelo contato */}
      {isWhatsappAuthorized && (
        <p className="text-xs text-muted-foreground">
          O contato via WhatsApp está autorizado pelo responsável pelo ponto de
          coleta.
        </p>
      )}
    </section>
  );
}
