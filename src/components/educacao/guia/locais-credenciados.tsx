import { Clock, MapPin, Navigation, Recycle, Smartphone } from 'lucide-react';

import { cn } from '@/utils/utils';
import type {
  AccreditedLocations,
  CollectionLocation,
  LocationBadgeVariant,
} from '@/utils/tipos-guia';

const locationIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Recycle,
  Smartphone,
  Clock,
};

const iconWrapperClasses: Record<LocationBadgeVariant, string> = {
  emerald: 'bg-emerald-100 text-emerald-700',
  sky: 'bg-sky-100 text-sky-700',
};

const badgeClasses: Record<LocationBadgeVariant, string> = {
  emerald: 'bg-emerald-50 text-emerald-800',
  sky: 'bg-sky-50 text-sky-800',
};

type LocationCardProps = {
  location: CollectionLocation;
};

function LocationCard({ location }: LocationCardProps) {
  const Icon = locationIcons[location.icone];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-5 md:flex-row">
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl',
          iconWrapperClasses[location.corIcone]
        )}
      >
        {Icon && <Icon className="size-6" />}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold">{location.nome}</h3>
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
              badgeClasses[location.badge.variante]
            )}
          >
            {location.badge.texto}
          </span>
        </div>

        <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          {location.endereco}
        </p>

        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            {location.statusOpen}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-slate-400" />
            {location.tipoAceito}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-2">
        <a
          href="#" // Lembrar de substituir pelo link do maps. Palavra chave: "Traçar rota"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-800"
        >
          <Navigation className="size-4" />
          Traçar Rota
        </a>
        <a
          href="#"
          className="inline-flex items-center justify-center rounded-full border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
        >
          Ver Detalhes
        </a>
      </div>
    </div>
  );
}

type AccreditedLocationsProps = {
  locations: AccreditedLocations;
};

export function AccreditedLocations({ locations }: AccreditedLocationsProps) {
  return (
    <section className="mt-12" id="locais-coleta">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            {locations.overline}
          </p>
          <h2 className="mt-2 text-2xl font-bold lg:text-3xl">
            {locations.titulo}
          </h2>
          <p className="mt-2 max-w-3xl text-base text-muted-foreground">
            {locations.subtitulo}
          </p>
        </div>

        <a
          href="/map"
          className="whitespace-nowrap font-medium text-emerald-700 hover:underline"
        >
          Ver todos os 9 postos no mapa interativo →
        </a>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Card do mapa placeholder */}
        <div className="flex flex-col overflow-hidden rounded-2xl border bg-card">
          <div className="flex items-start justify-between gap-3 p-5">
            <h3 className="text-lg font-semibold">{locations.mapa.titulo}</h3>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
              <MapPin className="size-3.5" />
              {locations.mapa.pillRegiao}
            </span>
          </div>

          <p className="px-5 pb-3 text-sm text-muted-foreground">
            {locations.mapa.descricao}
          </p>

          <div className="mx-5 mb-3 aspect-[4/3] overflow-hidden rounded-xl">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400" />
              <div className="absolute inset-0 opacity-30">
                <div className="h-full w-full border border-slate-400/30" />
                <div className="absolute inset-0 -translate-x-1/2 border-r border-slate-400/30" />
                <div className="absolute inset-0 -translate-y-1/2 border-b border-slate-400/30" />
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="flex size-12 items-center justify-center rounded-full bg-emerald-700 text-white shadow-lg">
                  <MapPin className="size-5" />
                </span>
                <span className="mt-2 inline-block whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-md">
                  {locations.mapa.labelPin}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t p-5 text-sm">
            <span className="text-muted-foreground">
              {locations.mapa.raioAtendimento}
            </span>
            <span className="font-medium text-emerald-700">
              {locations.mapa.acessoPublico}
            </span>
          </div>
        </div>

        {/* Lista de postos */}
        <div className="space-y-4">
          {locations.postos.map((location, index) => (
            <LocationCard key={index} location={location} />
          ))}
        </div>
      </div>
    </section>
  );
}
