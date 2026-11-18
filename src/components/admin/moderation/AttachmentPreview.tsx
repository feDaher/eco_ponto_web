'use client';

import { FileText, ImageIcon } from 'lucide-react';
import type { Attachment } from '@/types/api';
import { Modal } from './Modal';

export const ATTACHMENT_KINDS = {
  document: { label: 'Documento', icon: FileText },
  photo: { label: 'Registro fotográfico', icon: ImageIcon },
};

type AttachmentPreviewProps = {
  attachment: Attachment;
  onClose: () => void;
};

export function AttachmentPreview({
  attachment,
  onClose,
}: AttachmentPreviewProps) {
  const kind = ATTACHMENT_KINDS[attachment.kind];
  const Icon = kind.icon;

  return (
    <Modal
      title={attachment.name}
      subtitle={kind.label}
      icon={Icon}
      size="lg"
      onClose={onClose}
    >
      <div className="mt-5 rounded-xl border border-slate-200 bg-surface-alt p-5">
        <div
          aria-hidden="true"
          className="mb-4 flex h-40 items-center justify-center rounded-lg bg-linear-to-br from-brand-light to-surface-strong text-brand"
        >
          <Icon className="size-11 opacity-70" />
        </div>
        <p className="text-sm leading-6 text-slate-700">
          {attachment.description}
        </p>
        <p className="mt-3 text-xs text-slate-500">
          Prévia demonstrativa do anexo cadastrado. A leitura do arquivo
          original depende da integração com a API.
        </p>
      </div>
    </Modal>
  );
}
