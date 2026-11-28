'use client';

import { FileClock, Info } from 'lucide-react';
import { useCollector } from './collectorContext';

export function PendingRequestNotice() {
  const { selectedPoint: point } = useCollector();
  if (!point) return null;

  const isPointPending = point.status === 'pending';
  const pendingLabels = point.categories
    .filter((category) => category.approvalStatus === 'PENDING')
    .map((category) => category.label);

  if (!isPointPending && pendingLabels.length === 0) return null;

  const categories = new Intl.ListFormat('pt-BR', {
    style: 'long',
    type: 'conjunction',
  }).format(pendingLabels);
  const plural = pendingLabels.length > 1;

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
            {isPointPending
              ? 'Cadastro do ponto em análise'
              : 'Alterações em análise'}
          </h2>
          <span className="rounded bg-card/70 px-2 py-0.5 text-[11px] font-semibold text-brand">
            Em análise pela moderação
          </span>
        </div>

        <p>
          {isPointPending ? (
            <>
              O cadastro do ponto <strong>{point.name}</strong> está aguardando
              a aprovação da moderação municipal. Assim que for homologado, ele
              aparece no mapa público.
            </>
          ) : (
            <>
              {plural ? 'As categorias' : 'A categoria'}{' '}
              <strong>{categories}</strong> {plural ? 'aguardam' : 'aguarda'} a
              aprovação da moderação municipal. Enquanto isso, os dados públicos
              já aprovados continuam ativos no mapa.
            </>
          )}
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
