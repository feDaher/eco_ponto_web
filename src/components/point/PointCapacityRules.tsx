import { CircleAlert, Scale } from 'lucide-react';
import { formatQuantity } from '@/lib/points';
import type { PointCapacity } from '@/types/api';
import { SectionCard } from './SectionCard';

type PointCapacityRulesProps = {
  capacity: PointCapacity;
  rules: string[];
};

export function PointCapacityRules({
  capacity,
  rules,
}: PointCapacityRulesProps) {
  const { unit, individualLimit, businessMinimum } = capacity;

  return (
    <SectionCard
      id="capacity"
      title="Capacidade e regras de aceite"
      description="Limites e orientações para o descarte."
      icon={Scale}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <CapacityBox
          title="Pessoa física"
          value={
            individualLimit !== undefined
              ? `Até ${formatQuantity(individualLimit, unit)} por entrega`
              : 'Limite não informado'
          }
          note={capacity.individualNote}
        />
        <CapacityBox
          title="Empresas"
          value={
            businessMinimum !== undefined
              ? `A partir de ${formatQuantity(businessMinimum, unit)}`
              : 'Consulte o responsável'
          }
          note={capacity.businessNote}
        />
      </div>

      <h3 className="mt-5 text-sm font-semibold text-slate-900">
        Regras importantes
      </h3>
      {rules.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {rules.map((rule) => (
            <li
              key={rule}
              className="flex items-start gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 px-3 py-2.5 text-sm text-red-950 dark:text-red-200"
            >
              <CircleAlert
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-red-700 dark:text-red-300"
              />
              {rule}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">
          Nenhuma regra adicional informada.
        </p>
      )}
    </SectionCard>
  );
}

type CapacityBoxProps = {
  title: string;
  value: string;
  note?: string;
};

function CapacityBox({ title, value, note }: CapacityBoxProps) {
  return (
    <div className="rounded-2xl bg-surface-alt p-4">
      <p className="text-xs font-semibold tracking-wide text-brand-muted uppercase">
        {title}
      </p>
      <p className="mt-2 text-lg font-bold text-slate-900">{value}</p>
      {note && <p className="mt-1 text-xs text-slate-600">{note}</p>}
    </div>
  );
}
