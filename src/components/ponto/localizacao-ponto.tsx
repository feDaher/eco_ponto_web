import { ExternalLink, MapPin, ShieldCheck } from 'lucide-react';

import type { CollectionPoint } from '@/utils/tipos';

type PointLocationProps = {
  point: CollectionPoint;
};
// componente que exibe a localização e imagem do ponto de coleta
export function PointLocation({ point }: PointLocationProps) {
  const { latitude, longitude } = point.endereco;
  const mapMargin = 0.018;
  const mapParams = new URLSearchParams({
    bbox: `${longitude - mapMargin},${latitude - mapMargin},${longitude + mapMargin},${latitude + mapMargin}`,
    layer: 'mapnik',
    marker: `${latitude},${longitude}`,
  });
  const embeddedMapUrl = `https://www.openstreetmap.org/export/embed.html?${mapParams.toString()}`;
  const externalMapUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;
  const address = `${point.endereco.rua}, ${point.endereco.numero} - ${point.endereco.bairro}, ${point.endereco.cidade} - ${point.endereco.estado}`;

  return (
    <section
      aria-label="Localização e imagem do ponto"
      className="grid gap-4 lg:grid-cols-[1.35fr_1fr]"
    >
      <figure
        aria-label={`Imagem de ${point.nome}`}
        className="relative flex min-h-[300px] flex-col justify-between overflow-hidden rounded-lg border bg-cover bg-center p-5 text-white sm:min-h-[360px]"
        role="img"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(16, 45, 34, 0.08) 20%, rgba(16, 45, 34, 0.88) 100%), url("${point.imagemPrincipal}"), linear-gradient(135deg, #a9b9a7, #536d5b)`,
        }}
      >
        <div className="flex items-center gap-2 self-start rounded-full bg-emerald-950/75 px-3 py-1.5 text-xs font-medium">
          <ShieldCheck aria-hidden="true" className="size-4" />
          {point.status.monitorado ? 'Ponto monitorado' : 'Ponto de coleta'}
        </div>

        <figcaption className="max-w-xl">
          <h2 className="text-xl font-semibold sm:text-2xl">{point.nome}</h2>
          <p className="mt-2 text-sm text-white/90">{point.descricao}</p>
        </figcaption>
      </figure>

      <aside className="rounded-lg border bg-card p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">
              Localização &amp; Cobertura
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Encontre o ponto e planeje sua visita.
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800">
            {point.endereco.estado}
          </span>
        </div>

        <div className="mt-4 aspect-[4/3] overflow-hidden rounded-md border bg-muted">
          <iframe
            title={`Mapa de localização de ${point.nome}`}
            src={embeddedMapUrl}
            loading="lazy"
            className="h-full w-full border-0"
          />
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
            <p>{address}</p>
          </div>
          {point.endereco.cobertura && (
            <div className="rounded-md bg-emerald-50 px-3 py-2 text-emerald-950">
              {point.endereco.cobertura.raioKm !== undefined && (
                <p className="font-medium">
                  Raio de cobertura: {point.endereco.cobertura.raioKm} km
                </p>
              )}
              {point.endereco.cobertura.descricao && (
                <p className="mt-0.5 text-xs text-emerald-900">
                  {point.endereco.cobertura.descricao}
                </p>
              )}
            </div>
          )}
        </div>

        <a
          href={externalMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-emerald-800 underline-offset-4 hover:underline"
        >
          Abrir mapa
          <ExternalLink aria-hidden="true" className="size-4" />
        </a>
      </aside>
    </section>
  );
}
