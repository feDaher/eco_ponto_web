import { FileClock, Info } from 'lucide-react';
import { pendingRequest } from '@/data/mockCollector';

export function PendingRequestNotice() {
  const { protocol, title, category, detail } = pendingRequest;

  return (
    <section
      aria-labelledby="pending-request-heading"
      className="flex flex-col gap-4 rounded-2xl border border-surface-accent bg-surface-strong p-4 sm:flex-row sm:items-start"
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-brand">
        <FileClock aria-hidden="true" className="size-5" />
      </span>

      <div className="flex-1 space-y-2 text-sm text-slate-600">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            id="pending-request-heading"
            className="text-base font-bold text-slate-800"
          >
            {title}
          </h2>
          <span className="rounded bg-card/70 px-2 py-0.5 text-[11px] font-semibold text-brand">
            Em análise pelo fiscal ({protocol})
          </span>
        </div>
        <p>
          Sua solicitação de inclusão da categoria <strong>{category}</strong> e{' '}
          {detail} foi enviada e está pendente de aprovação pela moderação
          municipal. Durante a avaliação, os dados públicos cadastrados
          permanecem ativos no mapa de coleta.
        </p>
        <p className="flex items-start gap-1.5 text-xs text-slate-500">
          <Info aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <strong>Normativa PNRS / SMA:</strong> edições em dados críticos
            (endereço, CNPJ e inclusão de resíduos perigosos classe I) requerem
            validação técnica obrigatória.
          </span>
        </p>
      </div>
    </section>
  );
}
