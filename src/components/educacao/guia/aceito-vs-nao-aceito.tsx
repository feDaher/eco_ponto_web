import {
  Battery,
  BatteryCharging,
  Car,
  CheckCircle2,
  CircleDot,
  Droplet,
  FlameKindling,
  Smartphone,
  Trash2,
  XCircle,
} from 'lucide-react';

import { cn } from '@/utils/utils';
import type { SortingCategory } from '@/utils/tipos-guia';

const acceptedIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Battery,
  BatteryCharging,
  CircleDot,
  Smartphone,
};

const rejectedIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Car,
  Droplet,
  FlameKindling,
  Trash2,
};

type CategoryCardProps = {
  category: SortingCategory;
  type: 'accepted' | 'rejected';
};

function CategoryCard({ category, type }: CategoryCardProps) {
  const isAccepted = type === 'accepted';
  const icons = isAccepted ? acceptedIcons : rejectedIcons;

  return (
    <div className="rounded-2xl border bg-card p-6">
      <div className="flex items-start gap-3">
        <span
          className={cn(
            'flex size-12 shrink-0 items-center justify-center rounded-full',
            isAccepted
              ? 'bg-emerald-100 text-emerald-800'
              : 'bg-red-100 text-red-700'
          )}
        >
          {isAccepted ? (
            <CheckCircle2 className="size-6" />
          ) : (
            <XCircle className="size-6" />
          )}
        </span>

        <div>
          <h3
            className={cn(
              'text-lg font-semibold',
              isAccepted ? 'text-foreground' : 'text-red-900'
            )}
          >
            {category.titulo}
          </h3>
          <p
            className={cn(
              'mt-1 text-sm',
              isAccepted ? 'text-muted-foreground' : 'text-red-700/80'
            )}
          >
            {category.descricao}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {category.itens.map((item, index) => {
          const Icon = icons[item.icone];

          return (
            <li
              key={index}
              className={cn(
                'rounded-xl p-4',
                isAccepted ? 'bg-slate-50' : 'bg-red-50/40'
              )}
            >
              <div className="flex items-start gap-3">
                {Icon && (
                  <Icon
                    className={cn(
                      'size-5 shrink-0',
                      isAccepted ? 'text-emerald-700' : 'text-red-700'
                    )}
                  />
                )}
                <div>
                  <h4
                    className={cn(
                      'text-sm font-semibold',
                      isAccepted ? 'text-foreground' : 'text-red-950'
                    )}
                  >
                    {item.titulo}
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {item.descricao}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

type AcceptedVsNotAcceptedProps = {
  sorting: {
    overline: string;
    titulo: string;
    subtitulo: string;
    aceitos: SortingCategory;
    naoAceitos: SortingCategory;
  };
};

export function AcceptedVsNotAccepted({ sorting }: AcceptedVsNotAcceptedProps) {
  return (
    <section className="mt-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
        {sorting.overline}
      </p>
      <h2 className="mt-2 text-2xl font-bold lg:text-3xl">{sorting.titulo}</h2>
      <p className="mt-2 max-w-3xl text-base text-muted-foreground">
        {sorting.subtitulo}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryCard category={sorting.aceitos} type="accepted" />
        <CategoryCard category={sorting.naoAceitos} type="rejected" />
      </div>
    </section>
  );
}
