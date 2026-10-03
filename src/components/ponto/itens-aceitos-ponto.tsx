import {
  BatteryCharging,
  Cable,
  Laptop,
  Monitor,
  PlugZap,
  Recycle,
  Smartphone,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import type { CollectionPoint } from '@/utils/tipos';

type AcceptedItemsProps = {
  items: CollectionPoint['itensAceitos'];
  categories: CollectionPoint['categorias'];
};

function getItemIcon(name: string) {
  const normalizedName = name.toLocaleLowerCase('pt-BR');

  if (normalizedName.includes('laptop') || normalizedName.includes('pc'))
    return Laptop;
  if (normalizedName.includes('celular')) return Smartphone;
  if (normalizedName.includes('bateria') || normalizedName.includes('pilha'))
    return BatteryCharging;
  if (normalizedName.includes('cabo') || normalizedName.includes('fio'))
    return Cable;
  if (normalizedName.includes('monitor') || normalizedName.includes('tv'))
    return Monitor;
  if (normalizedName.includes('eletro')) return PlugZap;

  return Recycle;
}
// componente que exibe os itens aceitos para coleta e descarte no ponto de coleta
export function AcceptedItems({ items, categories }: AcceptedItemsProps) {
  return (
    <section
      aria-labelledby="itens-aceitos-heading"
      className="rounded-lg border bg-card p-5 sm:p-6"
    >
      <div className="grid items-start gap-x-4 gap-y-2 sm:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className="text-xs font-medium uppercase text-emerald-800">
            Inventário de reciclagem
          </p>
          <h2 id="itens-aceitos-heading" className="mt-1 text-xl font-semibold">
            Itens Aceitos para Coleta e Descarte
          </h2>
        </div>
        <div className="flex w-full max-w-full flex-col items-end gap-1.5 sm:w-auto">
          <p className="text-xs font-medium text-muted-foreground">
            Categorias aceitas
          </p>
          <div
            className="flex max-w-full flex-wrap justify-end gap-1.5"
            aria-label="Categorias aceitas"
          >
            {categories.map((category) => (
              <Badge key={category} variant="outline">
                {category}
              </Badge>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground sm:col-start-1">
          Confira os materiais recebidos neste ponto.
        </p>
      </div>

      {items.length > 0 ? (
        <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          {items.map((item) => {
            const Icon = getItemIcon(item.nome);

            return (
              <li key={item.nome} className="min-w-0 rounded-md bg-sky-50 p-4">
                <div className="flex size-9 items-center justify-center rounded-md bg-white text-emerald-800">
                  <Icon aria-hidden="true" className="size-5" />
                </div>
                <h3 className="mt-3 break-words text-sm font-semibold">
                  {item.nome}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {item.descricao}
                </p>
                <p className="mt-3 text-xs font-medium text-emerald-800">
                  {item.categoria}
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-5 rounded-md bg-muted p-4 text-sm text-muted-foreground">
          Nenhum item aceito foi informado para este ponto.
        </p>
      )}
    </section>
  );
}
