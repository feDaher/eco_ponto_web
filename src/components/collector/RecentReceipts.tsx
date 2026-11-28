import { History } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { recentReceipts, type ReceiptStatus } from '@/data/mockCollector';

const STATUS: Record<ReceiptStatus, { label: string; className: string }> = {
  sorted: { label: 'Triado', className: 'bg-brand-light text-brand-dark' },
  awaiting: {
    label: 'Aguardando destinador',
    className: 'bg-slate-200 text-slate-700',
  },
};

const kg = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

export function RecentReceipts() {
  const totalKg = recentReceipts.reduce(
    (total, receipt) => total + receipt.weightKg,
    0
  );

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.history}
      title="Últimos recebimentos de hoje"
      aside={
        <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
          Hoje: {kg.format(totalKg)} kg
        </span>
      }
    >
      <ul className="grid gap-2.5">
        {recentReceipts.map((receipt) => {
          const status = STATUS[receipt.status];

          return (
            <li
              key={receipt.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/60 bg-surface p-3 text-sm"
            >
              <div className="flex items-center gap-3">
                <time className="rounded-md border border-slate-200 bg-card px-2 py-1 text-xs font-bold text-slate-500">
                  {receipt.time}
                </time>
                <div>
                  <p className="font-bold text-slate-800">
                    {receipt.donor}{' '}
                    <span className="font-normal text-slate-500">
                      ({receipt.donorType})
                    </span>
                  </p>
                  <p className="text-xs text-slate-500">
                    {receipt.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="font-extrabold text-slate-800">
                    {kg.format(receipt.weightKg)} kg
                  </p>
                  <p className="text-[11px] text-slate-400">{receipt.id}</p>
                </div>
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[11px] font-bold',
                    status.className
                  )}
                >
                  {status.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-500">
        <History aria-hidden="true" className="size-3.5" />
        Histórico completo e relatórios em breve.
      </p>
    </SectionCard>
  );
}
