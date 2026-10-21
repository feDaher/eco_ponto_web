import { ArrowUpRight, Recycle } from 'lucide-react';
import type { WasteDestination } from '@/types/api';

type PointDestinationProps = {
  destination?: WasteDestination;
};

function formatNumber(value: number, decimals = 0) {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function PointDestination({ destination }: PointDestinationProps) {
  if (!destination) return null;

  const indicators = [
    destination.recycledTons !== undefined && {
      value: `${formatNumber(destination.recycledTons, 1)} t`,
      label: 'Materiais encaminhados',
    },
    destination.landfillPercentage !== undefined && {
      value: `${formatNumber(destination.landfillPercentage)}%`,
      label: 'De rejeitos enviados a aterro',
    },
    destination.familiesBenefited !== undefined && {
      value: formatNumber(destination.familiesBenefited),
      label: 'Famílias beneficiadas',
    },
    destination.partnerCooperatives !== undefined && {
      value: formatNumber(destination.partnerCooperatives),
      label: 'Cooperativas parceiras',
    },
  ].filter((indicator) => indicator !== false);

  return (
    <section
      aria-labelledby="destination-heading"
      className="relative overflow-hidden rounded-3xl bg-brand-deep p-6 text-white sm:p-8"
    >
      <Recycle
        aria-hidden="true"
        className="pointer-events-none absolute top-8 -right-6 size-48 opacity-10 sm:size-64"
      />

      <div className="relative max-w-3xl">
        <p className="text-xs font-bold tracking-wider text-brand-pale uppercase">
          Destinação responsável
        </p>
        <h2
          id="destination-heading"
          className="mt-2 text-2xl font-bold sm:text-3xl"
        >
          Para onde vai o resíduo após o descarte?
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-brand-foreground">
          {destination.description}
        </p>
      </div>

      {indicators.length > 0 && (
        <dl className="relative mt-7 grid gap-5 border-t border-white/20 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {indicators.map((indicator) => (
            <div key={indicator.label}>
              <dt className="text-sm text-brand-pale">{indicator.label}</dt>
              <dd className="mt-1 text-3xl font-bold">{indicator.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {destination.reportUrl && (
        <a
          href={destination.reportUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative mt-6 inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-deep transition-colors hover:bg-brand-light"
        >
          Ver relatório de destinação
          <ArrowUpRight aria-hidden="true" className="size-4" />
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      )}
    </section>
  );
}
