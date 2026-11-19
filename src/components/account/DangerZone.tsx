'use client';

import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

const DANGER_BUTTON =
  'inline-flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600';

type DangerZoneProps = {
  onConfirm: () => Promise<void>;
};

export function DangerZone({ onConfirm }: DangerZoneProps) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <section
      aria-labelledby="danger-heading"
      className="rounded-3xl border border-red-200 bg-red-50 p-5 sm:p-6 dark:border-red-900/60 dark:bg-red-950/30"
    >
      <h2
        id="danger-heading"
        className="flex items-center gap-2 font-bold text-red-700 dark:text-red-300"
      >
        <AlertTriangle aria-hidden="true" className="size-4" />
        Zona de perigo
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-red-900 dark:text-red-200">
        A exclusão da conta é permanente e remove seu histórico de descartes,
        pontos acumulados e comprovantes.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${DANGER_BUTTON} mt-4 bg-card text-red-700 hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-950/60`}
      >
        <Trash2 aria-hidden="true" className="size-4" />
        Excluir conta definitivamente
      </button>

      {open && (
        <Modal
          title="Excluir sua conta?"
          subtitle="Essa ação não pode ser desfeita."
          icon={AlertTriangle}
          tone="danger"
          onClose={() => setOpen(false)}
        >
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Todo o seu histórico de descartes, pontos e comprovantes será
            apagado. Se quiser guardar uma cópia, use &quot;Baixar meus
            dados&quot; antes de continuar.
          </p>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10 cursor-pointer rounded-xl px-4 text-sm font-medium text-slate-600 select-none hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-brand"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={async () => {
                setPending(true);
                await onConfirm();
                setPending(false);
                setOpen(false);
              }}
              disabled={pending}
              aria-busy={pending}
              className={`${DANGER_BUTTON} bg-red-600 px-4 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto dark:bg-red-700 dark:hover:bg-red-600`}
            >
              {pending ? (
                <Loader2 aria-hidden="true" className="size-4 animate-spin" />
              ) : (
                <Trash2 aria-hidden="true" className="size-4" />
              )}
              {pending ? 'Excluindo...' : 'Excluir conta'}
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}
