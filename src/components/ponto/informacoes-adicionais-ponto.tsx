import { CarFront, FileCheck2, ShieldCheck } from 'lucide-react';

import type { AdditionalPointInfo } from '@/utils/tipos';

type PointAdditionalInfoProps = {
  additionalInfo?: AdditionalPointInfo;
};

export function PointAdditionalInfo({
  additionalInfo,
}: PointAdditionalInfoProps) {
  const groups = [
    {
      title: 'Estacionamento',
      items: additionalInfo?.estacionamento ?? [],
      Icon: CarFront,
    },
    {
      title: 'Descarte seguro',
      items: additionalInfo?.descarteSeguro ?? [],
      Icon: ShieldCheck,
    },
    {
      title: 'Comprovantes',
      items: additionalInfo?.comprovantes ?? [],
      Icon: FileCheck2,
    },
  ].filter((group) => group.items.length > 0);

  if (groups.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Informações adicionais do ponto"
      className="grid gap-3 sm:grid-cols-3"
    >
      {groups.map(({ title, items, Icon }) => (
        <article key={title} className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-md bg-emerald-50 text-emerald-800">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <h2 className="font-semibold">{title}</h2>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
