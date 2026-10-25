import { FileText, ImageIcon, X } from 'lucide-react';
import type { Attachment } from './types';

//mostra uma prévia do anexo
export function AttachmentPreview({
  attachment,
  onClose,
}: {
  attachment: Attachment;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#14231b]/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="attachment-title"
        className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl dark:bg-card"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f5ec] text-[#397653] dark:bg-green-950/40 dark:text-brand">
              {attachment.kind === 'Documento' ? (
                <FileText className="h-5 w-5" />
              ) : (
                <ImageIcon className="h-5 w-5" />
              )}
            </span>
            <div>
              <h2
                id="attachment-title"
                className="break-all font-bold text-[#25342b] dark:text-foreground"
              >
                {attachment.name}
              </h2>
              <p className="mt-1 text-xs text-[#7c8982] dark:text-muted-foreground">
                {attachment.kind}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar prévia"
            className="rounded-lg p-1.5 text-[#758179] hover:bg-[#f2f5f3] dark:text-muted-foreground dark:hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5 rounded-xl border border-[#e5ece7] bg-[#f8faf8] p-5 dark:border-border dark:bg-background">
          {attachment.kind === 'Registro fotográfico' && (
            <div className="mb-4 flex h-44 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#dcebdd_0%,#f4ead7_50%,#aac9ad_100%)] text-[#466d50] dark:bg-[linear-gradient(135deg,#263b2e_0%,#3a382b_50%,#314c38_100%)] dark:text-brand">
              <ImageIcon className="h-11 w-11 opacity-70" />
            </div>
          )}
          {attachment.kind === 'Documento' && (
            <div className="mb-4 flex h-28 items-center justify-center rounded-lg bg-[#edf2ff] text-[#526ba7] dark:bg-blue-950/40 dark:text-blue-300">
              <FileText className="h-10 w-10" />
            </div>
          )}
          <p className="text-sm leading-6 text-[#54635a] dark:text-foreground">
            {attachment.description}
          </p>
          <p className="mt-3 text-xs text-[#8b958f] dark:text-muted-foreground">
            Prévia demonstrativa do anexo cadastrado. A leitura do arquivo
            original depende da integração com a API.
          </p>
        </div>
      </section>
    </div>
  );
}
