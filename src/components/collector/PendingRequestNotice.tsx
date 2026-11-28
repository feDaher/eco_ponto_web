import { FileClock, Info } from 'lucide-react';
import type { CategoryUnderReview, CollectorPoint } from '@/types/collector';

type PendingRequestNoticeProps = {
  point: CollectorPoint | null;
  categoryUnderReview?: CategoryUnderReview | null;
};

export function PendingRequestNotice({
  point,
  categoryUnderReview,
}: PendingRequestNoticeProps) {
  const isPointPending = point?.status === 'pending';
  const activeCategoryReview =
    categoryUnderReview ?? point?.categoryUnderReview ?? null;

  if (!isPointPending && !activeCategoryReview) {
    return null;
  }

  const protocolLabel = point?.protocol
    ? `Em análise pelo fiscal (${point.protocol})`
    : 'Em análise pelo fiscal';

  const title = isPointPending
    ? 'Cadastro do ponto em análise'
    : 'Alterações críticas em análise';

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
            {protocolLabel}
          </span>
        </div>

        <p>
          {isPointPending && activeCategoryReview ? (
            <>
              O cadastro do ponto <strong>{point.name}</strong> e a inclusão da
              categoria <strong>{activeCategoryReview.label}</strong> estão
              aguardando aprovação da moderação municipal.
            </>
          ) : isPointPending ? (
            <>
              O cadastro do ponto <strong>{point.name}</strong> foi enviado e
              está pendente de aprovação pela moderação municipal. Assim que for
              homologado, ele ficará visível no mapa público de coleta.
            </>
          ) : (
            <>
              Sua solicitação de inclusão da categoria{' '}
              <strong>{activeCategoryReview?.label}</strong> foi enviada e está
              pendente de aprovação pela moderação municipal. Durante a
              avaliação, os dados públicos cadastrados permanecem ativos no mapa
              de coleta.
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
