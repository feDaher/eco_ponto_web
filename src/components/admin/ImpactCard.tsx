import { Leaf } from 'lucide-react';

const number = new Intl.NumberFormat('pt-BR');

type ImpactCardProps = {
  co2SavedTons: number;
  treesEquivalent: number;
};

export function ImpactCard({ co2SavedTons, treesEquivalent }: ImpactCardProps) {
  return (
    <section
      aria-labelledby="impact-heading"
      className="rounded-3xl bg-brand-solid p-5 text-brand-foreground sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="impact-heading"
            className="text-xs font-bold tracking-wider text-brand-pale uppercase"
          >
            Impacto ecológico direto
          </h2>
          <p className="mt-2 text-3xl font-bold">
            {number.format(co2SavedTons)} t de CO₂
          </p>
          <p className="mt-1 text-sm text-brand-pale">
            evitadas na atmosfera de Manhuaçu
          </p>
        </div>
        <span className="rounded-2xl bg-white/15 p-2.5">
          <Leaf aria-hidden="true" className="size-5 text-brand-pale" />
        </span>
      </div>
      <p className="mt-5 border-t border-white/20 pt-3 text-sm">
        Equivalente a {number.format(treesEquivalent)} árvores preservadas
      </p>
    </section>
  );
}
