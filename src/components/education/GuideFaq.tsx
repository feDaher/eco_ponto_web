import { ChevronDown } from 'lucide-react';
import { GUIDE_SECTIONS } from '@/lib/routes';
import { GuideHeading } from '@/components/education/GuideHeading';
import type { DisposalGuide } from '@/types/education';

type GuideFaqProps = {
  faq: DisposalGuide['faq'];
};

export function GuideFaq({ faq }: GuideFaqProps) {
  const headingId = `${GUIDE_SECTIONS.faq}-heading`;

  return (
    <section
      id={GUIDE_SECTIONS.faq}
      aria-labelledby={headingId}
      className="scroll-mt-24 space-y-6"
    >
      <GuideHeading
        id={headingId}
        eyebrow={faq.eyebrow}
        title={faq.title}
        description={faq.description}
      />

      <div className="space-y-3">
        {faq.items.map((item) => (
          <details
            key={item.question}
            className="group overflow-hidden rounded-2xl border border-slate-100 bg-card"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-medium text-slate-900 transition-colors outline-none hover:bg-surface-alt focus-visible:ring-3 focus-visible:ring-ring/50 [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                aria-hidden="true"
                className="size-5 shrink-0 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="border-t border-slate-100 p-5 text-sm leading-relaxed text-slate-600">
              {item.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
