import { AlertTriangle, Check, Mail, X } from 'lucide-react';
import type { ActionDialogState } from './types';

const rejectionReasons = [
  'Documentação incompleta ou vencida',
  'Falta de foto ou urna fora do padrão',
  'Localização fora da jurisdição do polo',
  'Outro motivo com parecer personalizado',
];

const removalReasons = [
  'Estabelecimento encerrou as atividades',
  'Licença ou documentação irregular',
  'Localização fora da jurisdição do polo',
  'Outro motivo com parecer personalizado',
];

//responsável por exibir a janela de decisão de reprovação ou remoção do ponto de coleta
export function ActionDialog({
  state,
  onChange,
  onClose,
  onConfirm,
}: {
  state: ActionDialogState;
  onChange: (state: ActionDialogState) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const isReject = state.type === 'reject';
  const reasons = isReject ? rejectionReasons : removalReasons;
  const title = isReject
    ? 'Reprovar ponto de coleta'
    : 'Remover ponto homologado';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#14231b]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-dialog-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl sm:p-6 dark:bg-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff0ee] text-[#b33b35] dark:bg-red-950/40 dark:text-red-300">
              <AlertTriangle className="h-5 w-5" />
            </span>
            <div>
              <h2
                id="action-dialog-title"
                className="text-lg font-bold text-[#25342b] dark:text-foreground"
              >
                {title}
              </h2>
              <p className="mt-1 text-sm text-[#758179] dark:text-muted-foreground">
                {state.point.name}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="rounded-lg p-1.5 text-[#758179] hover:bg-[#f2f5f3] dark:text-muted-foreground dark:hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <fieldset className="mt-5">
          <legend className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#6e7b73] dark:text-muted-foreground">
            {isReject
              ? 'Motivo técnico da inconformidade'
              : 'Justificativa da remoção'}
          </legend>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <label
                key={reason}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${
                  state.reason === reason
                    ? 'border-[#a9c7b3] bg-[#f3f8f4] dark:border-brand dark:bg-muted'
                    : 'border-[#e6ece8] hover:bg-[#fafcfb] dark:border-border dark:hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name="decision-reason"
                  value={reason}
                  checked={state.reason === reason}
                  onChange={() => onChange({ ...state, reason })}
                  className="mt-0.5 accent-[#2f664d]"
                />
                <span className="font-medium text-[#35473b] dark:text-foreground">
                  {reason}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {state.reason === 'Outro motivo com parecer personalizado' && (
          <label className="mt-4 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#6e7b73] dark:text-muted-foreground">
            Justificativa técnica do fiscal
            <textarea
              value={state.customReason}
              onChange={(event) =>
                onChange({ ...state, customReason: event.target.value })
              }
              rows={4}
              placeholder="Descreva o motivo que ficará registrado na auditoria..."
              className="mt-2 w-full resize-y rounded-xl border border-[#dce5df] px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-[#35473b] outline-none placeholder:text-[#a1aaa4] focus:border-[#74a184] focus:ring-2 focus:ring-[#74a184]/20 dark:border-border dark:bg-background dark:text-foreground dark:placeholder:text-muted-foreground"
            />
          </label>
        )}

        <div className="mt-4 rounded-xl border border-[#e6ece8] bg-[#f8faf8] p-3 dark:border-border dark:bg-background">
          <label className="flex cursor-pointer items-start gap-3 text-sm">
            <input
              type="checkbox"
              checked={state.notifyRequester}
              onChange={(event) =>
                onChange({ ...state, notifyRequester: event.target.checked })
              }
              className="mt-0.5 h-4 w-4 accent-[#2f664d]"
            />
            <span className="flex gap-2">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#5b7e65] dark:text-brand" />
              <span>
                <span className="block font-medium text-[#35473b] dark:text-foreground">
                  Enviar notificação por e-mail
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#7c8982] dark:text-muted-foreground">
                  A escolha será registrada; o envio real depende da integração
                  com o serviço de e-mail.
                </span>
              </span>
            </span>
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg px-4 text-sm font-medium text-[#59685f] hover:bg-[#f3f6f4] dark:text-muted-foreground dark:hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={
              !state.reason ||
              (state.reason.startsWith('Outro motivo') &&
                !state.customReason.trim())
            }
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#b83a35] px-4 text-sm font-semibold text-white transition hover:bg-[#a12e2a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {isReject ? 'Confirmar reprovação' : 'Confirmar remoção'}
          </button>
        </div>
      </section>
    </div>
  );
}
