'use client';

import { Download, Shield } from 'lucide-react';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type PrivacyCardProps = {
  onDownload: () => void;
};

export function PrivacyCard({ onDownload }: PrivacyCardProps) {
  return (
    <section
      aria-labelledby="privacy-heading"
      className="rounded-3xl border border-slate-100 bg-card p-5 shadow-sm sm:p-6"
    >
      <h2
        id="privacy-heading"
        className="flex items-center gap-2 font-bold text-slate-900"
      >
        <Shield aria-hidden="true" className="size-4 text-brand" />
        Privacidade e LGPD
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Seus dados são tratados conforme a Lei Geral de Proteção de Dados (LGPD)
        e usados só para operar a rede de coleta. Você pode baixar uma cópia do
        que guardamos sobre você a qualquer momento.
      </p>
      <button
        type="button"
        onClick={onDownload}
        className={cn(
          buttonVariants({ variant: 'outline' }),
          'mt-4 w-full select-none'
        )}
      >
        <Download aria-hidden="true" />
        Baixar meus dados
      </button>
    </section>
  );
}
