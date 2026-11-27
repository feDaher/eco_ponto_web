type CollectionPointMapPreviewProps = {
  latitude: number | null;
  longitude: number | null;
};

export function CollectionPointMapPreview({
  latitude,
  longitude,
}: CollectionPointMapPreviewProps) {
  if (latitude === null || longitude === null) {
    return (
      <div className="flex min-h-52 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-surface px-6 text-center text-sm text-slate-500">
        Informe as coordenadas para visualizar o local no mapa.
      </div>
    );
  }

  const padding = 0.015;
  const bounds = [
    longitude - padding,
    latitude - padding,
    longitude + padding,
    latitude + padding,
  ]
    .map((coordinate) => coordinate.toFixed(6))
    .join('%2C');
  const source = `https://www.openstreetmap.org/export/embed.html?bbox=${bounds}&marker=${latitude}%2C${longitude}`;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-card">
      <iframe
        title="Pré-visualização do endereço no mapa"
        src={source}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="h-52 w-full"
      />
      <a
        href={`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=17/${latitude}/${longitude}`}
        target="_blank"
        rel="noreferrer"
        className="block border-t border-slate-100 px-3 py-2 text-xs font-medium text-brand hover:underline"
      >
        Abrir mapa em outra aba
      </a>
    </div>
  );
}
