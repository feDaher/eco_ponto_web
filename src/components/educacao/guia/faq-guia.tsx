'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/utils/utils';
import type { FaqItem } from '@/utils/tipos-guia';

type GuideFaqProps = {
  items: FaqItem[];
};

export function GuideFaq({ items }: GuideFaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="mt-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
        TIRA-DÚVIDAS FREQUENTE
      </p>
      <h2 className="mt-2 text-2xl font-bold lg:text-3xl">
        Perguntas Frequentes sobre Descarte de Baterias
      </h2>
      <p className="mt-2 max-w-3xl text-base text-muted-foreground">
        Respostas diretas embasadas na Política Nacional de Resíduos Sólidos
        (PNRS).
      </p>

      <div className="mt-6 space-y-3">
        {items.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border bg-card"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/50"
              >
                <span className="text-base font-medium">{item.pergunta}</span>
                <ChevronDown
                  aria-hidden
                  className={cn(
                    'size-5 shrink-0 transition-transform',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>

              <div
                id={`faq-panel-${index}`}
                hidden={!isOpen}
                className="border-t p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {item.resposta}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
