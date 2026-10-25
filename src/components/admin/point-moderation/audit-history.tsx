import { ClipboardList, ShieldCheck, UserRound } from 'lucide-react';
import type { AuditEntry } from './types';

// responsável por exibir o histórico de decisões e auditoria do polo regional
export function AuditHistory({ entries }: { entries: AuditEntry[] }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[#e5ece7] bg-white shadow-[0_2px_14px_rgba(33,58,45,0.035)] dark:border-border dark:bg-card">
      <div className="flex flex-col justify-between gap-3 border-b border-[#edf1ef] px-5 py-5 sm:flex-row sm:items-center sm:px-6 dark:border-border">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold tracking-[-0.02em] text-[#203128] dark:text-foreground">
            <ClipboardList className="h-5 w-5 text-[#397653] dark:text-brand" />
            Histórico de decisões & auditoria
          </h2>
          <p className="mt-1 text-sm text-[#76827b] dark:text-muted-foreground">
            Registros de aprovação, reprovação e remoção deste polo regional.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-[#77837c] dark:text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-[#508363] dark:text-brand" />
          Registro auditável
        </span>
      </div>

      {entries.length === 0 ? (
        <div className="px-6 py-14 text-center">
          <ClipboardList className="mx-auto h-8 w-8 text-[#a2b2a8] dark:text-muted-foreground" />
          <p className="mt-3 font-medium text-[#46574c] dark:text-foreground">
            Nenhum registro encontrado
          </p>
          <p className="mt-1 text-sm text-[#87928b] dark:text-muted-foreground">
            Altere o filtro de decisão para consultar outros registros.
          </p>
        </div>
      ) : (
        <>
          <div className="hidden grid-cols-[1.5fr_0.78fr_1.05fr_0.78fr_0.8fr] gap-4 bg-[#f4f7fb] px-6 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#78857e] lg:grid dark:bg-muted dark:text-muted-foreground">
            <span>Protocolo / estabelecimento</span>
            <span>Decisão</span>
            <span>Fiscal / analista</span>
            <span>Data</span>
            <span>Motivo</span>
          </div>
          <div className="divide-y divide-[#edf1ef] dark:divide-border">
            {entries.map((entry) => (
              <article
                key={entry.id}
                className="grid gap-4 px-5 py-4 sm:px-6 lg:grid-cols-[1.5fr_0.78fr_1.05fr_0.78fr_0.8fr] lg:items-center"
              >
                <div>
                  <p className="font-semibold text-[#26362c] dark:text-foreground">
                    {entry.establishment}
                  </p>
                  <p className="mt-1 text-xs text-[#7a8780] dark:text-muted-foreground">
                    Protocolo #{entry.protocol}
                  </p>
                </div>
                <div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.04em] ${
                      entry.decision === 'Aprovado'
                        ? 'bg-[#e8f5ec] text-[#32744f] dark:bg-green-950/40 dark:text-green-300'
                        : entry.decision === 'Reprovado'
                          ? 'bg-[#fff0ee] text-[#b33b35] dark:bg-red-950/40 dark:text-red-300'
                          : 'bg-[#edf1f5] text-[#596b79] dark:bg-muted dark:text-muted-foreground'
                    }`}
                  >
                    {entry.decision}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-sm text-[#43534a] dark:text-foreground">
                  <UserRound className="h-4 w-4 shrink-0 text-[#89968e] dark:text-muted-foreground" />
                  {entry.analyst}
                </p>
                <p className="text-sm text-[#5c6b62] dark:text-muted-foreground">
                  {entry.date}
                  <span className="block text-xs text-[#859189] dark:text-muted-foreground">
                    às {entry.time}
                  </span>
                </p>
                <p className="text-sm leading-5 text-[#5b6961] dark:text-muted-foreground">
                  {entry.reason ?? (
                    <span className="text-[#9aa49e] dark:text-muted-foreground">
                      —
                    </span>
                  )}
                </p>
              </article>
            ))}
          </div>
        </>
      )}

      <div className="flex flex-col justify-between gap-2 border-t border-[#edf1ef] bg-[#fbfcfb] px-5 py-3 text-xs text-[#7d8982] sm:flex-row sm:items-center sm:px-6 dark:border-border dark:bg-background dark:text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5" />
          Motivos registrados compõem a trilha de auditoria.
        </span>
        <span>
          {entries.length} {entries.length === 1 ? 'registro' : 'registros'}{' '}
          exibidos
        </span>
      </div>
    </section>
  );
}
