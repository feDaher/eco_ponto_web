import { ArrowUpRight, Recycle } from 'lucide-react';

import type { WasteDestination } from '@/utils/tipos';

type PointDestinationProps = {
  destination?: WasteDestination;
};

function formatNumber(value: number, decimalPlaces = 0) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  }).format(value);
}
// Destinação do resíduos
export function PointDestination({ destination }: PointDestinationProps) {
  if (!destination) {
    return null;
  }

  const indicators = [
    destination.materialRecicladoToneladas !== undefined && {
      value: `${formatNumber(destination.materialRecicladoToneladas, 1)} t`,
      label: 'Materiais encaminhados',
    },
    destination.percentualRejeitos !== undefined && {
      value: `${formatNumber(destination.percentualRejeitos)}%`,
      label: 'De rejeitos enviados a aterro',
    },
    destination.familiasBeneficiadas !== undefined && {
      value: formatNumber(destination.familiasBeneficiadas),
      label: 'Famílias beneficiadas',
    },
    destination.cooperativasParceiras !== undefined && {
      value: formatNumber(destination.cooperativasParceiras),
      label: 'Cooperativas parceiras',
    },
  ].filter((indicator) => indicator !== false);

  return (
    <section
      aria-labelledby="destinacao-heading"
      className="relative overflow-hidden rounded-lg bg-emerald-900 p-6 text-white sm:p-8"
    >
      <Recycle
        aria-hidden="true"
        className="pointer-events-none absolute -right-6 top-8 size-48 opacity-[0.08] sm:size-64"
      />

      <div className="relative max-w-3xl">
        <p className="text-xs font-medium uppercase text-emerald-200">
          Destinação responsável
        </p>
        <h2
          id="destinacao-heading"
          className="mt-2 text-2xl font-semibold sm:text-3xl"
        >
          Para onde vai o resíduo após o descarte?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-emerald-50/90">
          {destination.descricao}
        </p>
      </div>

      {indicators.length > 0 && (
        <dl className="relative mt-7 grid gap-5 border-t border-white/20 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map((indicator) => (
            <div key={indicator.label}>
              <dt className="text-sm text-emerald-100/80">{indicator.label}</dt>
              <dd className="mt-1 text-3xl font-semibold">{indicator.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {destination.relatorioUrl && (
        <a
          href={destination.relatorioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-6 inline-flex min-h-10 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-medium text-emerald-950 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Ver relatório de destinação
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </a>
      )}
    </section>
  );
}
