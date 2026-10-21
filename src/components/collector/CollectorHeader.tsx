import { BadgeCheck } from 'lucide-react';
import { collectorProfile } from '@/data/mockCollector';

export function CollectorHeader() {
  const { name, unit, isOpen } = collectorProfile;

  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            {name}
          </h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-light px-2.5 py-0.5 text-[11px] font-bold text-brand-dark">
            <BadgeCheck aria-hidden="true" className="size-3.5" />
            CNPJ homologado
          </span>
        </div>
        <p className="text-sm text-slate-600">{unit}</p>
      </div>

      <p className="inline-flex items-center gap-2 rounded-full bg-brand-light px-3 py-1.5 text-xs font-semibold text-brand-dark">
        <span
          aria-hidden="true"
          className={
            isOpen
              ? 'size-2 rounded-full bg-brand'
              : 'size-2 rounded-full bg-slate-400'
          }
        />
        {isOpen ? 'Aberto e recebendo' : 'Fechado'}
      </p>
    </header>
  );
}
