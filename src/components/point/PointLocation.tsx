import Image from 'next/image';
import { ExternalLink, MapPin, Recycle, ShieldCheck } from 'lucide-react';
import { getDirectionsUrl } from '@/lib/geo';
import type { PointDetails } from '@/types/api';
import { PointLocationMap } from './PointLocationMap';

type PointLocationProps = {
  point: PointDetails;
};

export function PointLocation({ point }: PointLocationProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <section
        aria-labelledby="about-heading"
        className="flex flex-col overflow-hidden rounded-3xl bg-brand text-white shadow-sm"
      >
        <div className="relative min-h-48 flex-1 bg-brand-dark sm:min-h-64">
          {point.imageUrl ? (
            <Image
              src={point.imageUrl}
              alt={`Foto de ${point.name}`}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          ) : (
            <Recycle
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 text-white/10"
            />
          )}
          <span className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
            <ShieldCheck aria-hidden="true" className="size-4" />
            {point.verification.monitored
              ? 'Ponto monitorado'
              : 'Ponto de coleta'}
          </span>
        </div>

        <div className="space-y-2 p-6">
          <h2 id="about-heading" className="text-xl font-bold sm:text-2xl">
            Sobre o ponto
          </h2>
          <p className="text-sm leading-relaxed text-brand-foreground">
            {point.description}
          </p>
        </div>
      </section>

      <section
        aria-labelledby="location-heading"
        className="flex flex-col rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
      >
        <h2 id="location-heading" className="text-lg font-bold text-slate-900">
          Localização e cobertura
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Encontre o ponto e planeje sua visita.
        </p>

        <div className="mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-slate-100 bg-surface-alt">
          <PointLocationMap
            position={{ lat: point.lat, lng: point.lng }}
            title={point.name}
          />
        </div>

        <p className="mt-4 flex items-start gap-2 text-sm text-slate-600">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {point.address} - {point.neighborhood}, {point.city}, CEP {point.cep}
        </p>

        {point.coverage && (
          <div className="mt-3 rounded-2xl bg-surface-alt px-4 py-3 text-sm text-slate-700">
            {point.coverage.radiusKm !== undefined && (
              <p className="font-semibold">
                Raio de cobertura: {point.coverage.radiusKm} km
              </p>
            )}
            {point.coverage.description && (
              <p className="mt-0.5 text-xs text-slate-600">
                {point.coverage.description}
              </p>
            )}
          </div>
        )}

        <a
          href={getDirectionsUrl(point)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
        >
          Abrir rota no Google Maps
          <ExternalLink aria-hidden="true" className="size-4" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      </section>
    </div>
  );
}
