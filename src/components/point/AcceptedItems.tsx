import { Badge } from '@/components/ui/Badge';
import { MATERIALS } from '@/lib/materials';
import type { AcceptedItem, Material } from '@/types/api';
import { SectionCard } from './SectionCard';

type AcceptedItemsProps = {
  items: AcceptedItem[];
  materials: Material[];
};

export function AcceptedItems({ items, materials }: AcceptedItemsProps) {
  return (
    <SectionCard
      id="items"
      eyebrow="Inventário de reciclagem"
      title="Itens aceitos para coleta e descarte"
      description="Confira os materiais recebidos neste ponto."
      aside={
        <ul
          aria-label="Categorias aceitas"
          className="flex max-w-full flex-wrap gap-1.5 sm:justify-end"
        >
          {materials.map((material) => (
            <li key={material}>
              <Badge variant="outline">{MATERIALS[material].label}</Badge>
            </li>
          ))}
        </ul>
      }
    >
      {items.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {items.map((item) => {
            const Icon = MATERIALS[item.material].icon;

            return (
              <li
                key={item.name}
                className="min-w-0 rounded-2xl bg-surface-alt p-4"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-card text-brand">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <h3 className="mt-3 text-sm font-semibold break-words text-slate-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  {item.description}
                </p>
                <p className="mt-3 text-xs font-medium text-brand">
                  {MATERIALS[item.material].label}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-2xl bg-surface-alt p-4 text-sm text-slate-500">
          Nenhum item aceito foi informado para este ponto.
        </p>
      )}
    </SectionCard>
  );
}
