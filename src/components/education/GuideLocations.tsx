import Link from 'next/link';
import {
  Clock,
  ExternalLink,
  MapPin,
  MapPinned,
  Navigation,
} from 'lucide-react';
import { getDirectionsUrl } from '@/lib/geo';
import { pluralize } from '@/lib/points';
import { GUIDE_SECTIONS, ROUTES } from '@/lib/routes';
import { GuideHeading } from '@/components/education/GuideHeading';
import type { CollectionPoint } from '@/types/api';
import type { GuideSectionHeading } from '@/types/education';

function GuidePointCard({ point }: { point: CollectionPoint }) {
  return (
    <li className="flex flex-col gap-4 rounded-3xl border border-slate-100 bg-card p-5 shadow-sm md:flex-row md:items-center">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-muted">
        <MapPin aria-hidden="true" className="size-6" />
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <h3 className="font-semibold text-slate-900">{point.name}</h3>
        <p className="text-sm text-slate-600">
          {point.address} - {point.neighborhood}, {point.city}
        </p>
        <p className="flex items-center gap-1.5 text-xs font-medium text-brand">
          <Clock aria-hidden="true" className="size-3.5" />
          {point.hours}
        </p>
      </div>

      <div className="flex shrink-0 flex-col gap-2 sm:flex-row md:flex-col">
        <a
          href={getDirectionsUrl(point)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-solid px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover"
        >
          <Navigation aria-hidden="true" className="size-4" />
          Traçar rota
          <ExternalLink aria-hidden="true" className="size-3" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
        <Link
          href={ROUTES.point(point.slug)}
          className="inline-flex items-center justify-center rounded-full border border-brand px-4 py-2 text-sm font-medium text-brand transition-colors hover:bg-brand-light"
        >
          Ver detalhes
          <span className="sr-only"> de {point.name}</span>
        </Link>
      </div>
    </li>
  );
}

type GuideLocationsProps = {
  heading: GuideSectionHeading;
  points: CollectionPoint[];
};

export function GuideLocations({ heading, points }: GuideLocationsProps) {
  const headingId = `${GUIDE_SECTIONS.locations}-heading`;

  return (
    <section
      id={GUIDE_SECTIONS.locations}
      aria-labelledby={headingId}
      className="scroll-mt-24 space-y-6"
    >
      <GuideHeading id={headingId} {...heading} />

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[2fr_1fr]">
        {points.length > 0 ? (
          <ul className="space-y-4">
            {points.map((point) => (
              <GuidePointCard key={point.id} point={point} />
            ))}
          </ul>
        ) : (
          <p className="rounded-3xl border border-dashed border-slate-200 bg-card p-6 text-sm text-slate-600">
            Ainda não há pontos aprovados para esta categoria. Confira o mapa
            para ver os pontos de outros materiais.
          </p>
        )}

        <aside className="space-y-4 rounded-3xl border border-slate-100 bg-surface-alt p-6">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-light text-brand-muted">
            <MapPinned aria-hidden="true" className="size-6" />
          </span>
          <h3 className="text-lg font-semibold text-slate-900">
            Veja todos no mapa
          </h3>
          <p className="text-sm text-slate-600">
            {pluralize(points.length, 'ponto aceita', 'pontos aceitam')} este
            material. No mapa interativo você filtra por material, busca pelo
            seu endereço e vê a distância até cada ponto.
          </p>
          <Link
            href={ROUTES.map}
            className="inline-flex items-center gap-2 rounded-full bg-brand-solid px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover"
          >
            Abrir mapa interativo
          </Link>
        </aside>
      </div>
    </section>
  );
}
