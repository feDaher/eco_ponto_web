import { CarFront, FileCheck2, ShieldCheck } from 'lucide-react';
import type { PointAdditionalInfo as AdditionalInfo } from '@/types/api';

type PointAdditionalInfoProps = {
  info?: AdditionalInfo;
};

export function PointAdditionalInfo({ info }: PointAdditionalInfoProps) {
  const groups = [
    { title: 'Estacionamento', items: info?.parking ?? [], icon: CarFront },
    {
      title: 'Descarte seguro',
      items: info?.safeDisposal ?? [],
      icon: ShieldCheck,
    },
    { title: 'Comprovantes', items: info?.receipts ?? [], icon: FileCheck2 },
  ].filter((group) => group.items.length > 0);

  if (groups.length === 0) return null;

  return (
    <section
      aria-label="Informações adicionais do ponto"
      className="grid gap-4 sm:grid-cols-3"
    >
      {groups.map(({ title, items, icon: Icon }) => (
        <article
          key={title}
          className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-brand-light text-brand-muted">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <h2 className="font-semibold text-slate-900">{title}</h2>
          </div>
          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
            {items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}
