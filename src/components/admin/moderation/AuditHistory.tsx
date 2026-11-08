import { ClipboardList, ShieldCheck, UserRound } from 'lucide-react';
import { DECISION_LABELS, formatDate, formatTime } from '@/lib/moderation';
import { cn } from '@/lib/utils';
import type { AuditEntry, ModerationDecision } from '@/types/api';

const DECISION_TONES: Record<ModerationDecision, string> = {
  approved: 'bg-brand-light text-brand-dark',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  removed: 'bg-slate-100 text-slate-600',
};

const COLUMNS = 'lg:grid-cols-[1.5fr_0.8fr_1fr_0.8fr_1fr]';

type AuditHistoryProps = {
  entries: AuditEntry[];
};

export function AuditHistory({ entries }: AuditHistoryProps) {
  return (
    <section
      aria-labelledby="audit-heading"
      className="overflow-hidden rounded-2xl border border-slate-200/80 bg-card shadow-xs"
    >
      <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
        <div>
          <h2
            id="audit-heading"
            className="flex items-center gap-2 text-lg font-bold text-slate-900"
          >
            <ClipboardList aria-hidden="true" className="size-5 text-brand" />
            Histórico de decisões & auditoria
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Registros de aprovação, reprovação e remoção deste polo regional.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck aria-hidden="true" className="size-4 text-brand" />
          Registro auditável
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <ClipboardList
            aria-hidden="true"
            className="mx-auto size-8 text-slate-400"
          />
          <p className="mt-3 font-medium text-slate-700">
            Nenhum registro encontrado
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Altere o filtro de decisão para consultar outros registros.
          </p>
        </div>
      ) : (
        <>
          <div
            aria-hidden="true"
            className={cn(
              'hidden gap-4 bg-surface-alt px-6 py-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase lg:grid',
              COLUMNS
            )}
          >
            <span>Protocolo / estabelecimento</span>
            <span>Decisão</span>
            <span>Fiscal / analista</span>
            <span>Data</span>
            <span>Motivo</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className={cn(
                  'grid gap-3 px-5 py-4 sm:px-6 lg:items-center lg:gap-4',
                  COLUMNS
                )}
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {entry.establishment}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Protocolo #{entry.protocol}
                  </p>
                </div>
                <div>
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase',
                      DECISION_TONES[entry.decision]
                    )}
                  >
                    {DECISION_LABELS[entry.decision]}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-sm text-slate-700">
                  <UserRound
                    aria-hidden="true"
                    className="size-4 shrink-0 text-slate-400"
                  />
                  {entry.analyst}
                </p>
                <p className="text-sm text-slate-600">
                  <time dateTime={entry.decidedAt}>
                    {formatDate(entry.decidedAt)}
                    <span className="block text-xs text-slate-500">
                      às {formatTime(entry.decidedAt)}
                    </span>
                  </time>
                </p>
                <p className="text-sm leading-5 text-slate-600">
                  {entry.reason ?? (
                    <span className="text-slate-400">
                      <span aria-hidden="true">—</span>
                      <span className="sr-only">Sem motivo registrado</span>
                    </span>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-surface-alt px-5 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:px-6">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck aria-hidden="true" className="size-3.5" />
          Motivos registrados compõem a trilha de auditoria.
        </span>
        <span>
          {entries.length} {entries.length === 1 ? 'registro' : 'registros'}{' '}
          {entries.length === 1 ? 'exibido' : 'exibidos'}
        </span>
      </div>
    </section>
  );
}
