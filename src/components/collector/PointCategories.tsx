import { CircleCheck, ShieldCheck } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import {
  authorizedCategories,
  categoryUnderReview,
} from '@/data/mockCollector';

export function PointCategories() {
  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.categories}
      title="Categorias no ponto"
      description={`${authorizedCategories.length} ativas`}
      icon={ShieldCheck}
    >
      <h3 className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        Autorizadas no mapa
      </h3>
      <ul className="mt-2 flex flex-wrap gap-1.5">
        {authorizedCategories.map((category) => (
          <li
            key={category}
            className="flex items-center gap-1 rounded-full border border-brand-light bg-surface-alt px-2.5 py-1 text-xs font-semibold text-brand-dark"
          >
            <CircleCheck aria-hidden="true" className="size-3 text-brand" />
            {category}
          </li>
        ))}
      </ul>

      <h3 className="mt-5 border-t border-slate-100 pt-4 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
        Em tramitação técnica
      </h3>
      <div className="mt-2 space-y-1 rounded-xl border border-amber-200/80 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 p-3 text-sm">
        <p className="flex flex-wrap justify-between gap-2 font-bold text-slate-800">
          {categoryUnderReview.label}
          <span className="rounded bg-amber-100 dark:bg-amber-900/40 px-1.5 py-0.5 text-[11px] text-amber-800 dark:text-amber-200">
            {categoryUnderReview.phase}
          </span>
        </p>
        <p className="text-xs text-slate-500">
          {categoryUnderReview.description}
        </p>
      </div>
    </SectionCard>
  );
}
