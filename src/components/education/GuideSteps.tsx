import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GUIDE_SECTIONS } from '@/lib/routes';
import { GuideHeading } from '@/components/education/GuideHeading';
import type { DisposalGuide, StepNoteTone } from '@/types/education';

const NOTE_TONES: Record<StepNoteTone, string> = {
  warning:
    'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200',
  success: 'bg-brand-light text-brand-muted',
  neutral: 'bg-surface-alt text-slate-600',
};

type GuideStepsProps = {
  steps: DisposalGuide['steps'];
};

export function GuideSteps({ steps }: GuideStepsProps) {
  const headingId = `${GUIDE_SECTIONS.steps}-heading`;

  return (
    <section
      id={GUIDE_SECTIONS.steps}
      aria-labelledby={headingId}
      className="scroll-mt-24 space-y-6"
    >
      <GuideHeading
        id={headingId}
        eyebrow={steps.eyebrow}
        title={steps.title}
        description={steps.description}
        aside={
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-accent px-4 py-1.5 text-sm font-medium text-slate-700">
            <ShieldCheck aria-hidden="true" className="size-4 text-brand" />
            {steps.reference}
          </span>
        }
      />

      <ol className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.items.map((step, index) => {
          const isLast = index === steps.items.length - 1;
          const NoteIcon = step.note.icon;

          return (
            <li
              key={step.title}
              className="flex h-full flex-col rounded-3xl border border-slate-100 bg-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'flex size-10 items-center justify-center rounded-xl text-lg font-bold',
                    isLast
                      ? 'bg-brand-solid text-white'
                      : 'bg-brand-light text-brand-muted'
                  )}
                >
                  {index + 1}
                </span>
                <step.icon aria-hidden="true" className="size-6 text-brand" />
              </div>

              <h3 className="mt-4 text-xl font-semibold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-slate-600">
                {step.description}
              </p>

              <p
                className={cn(
                  'mt-5 flex items-center gap-2 rounded-xl px-3 py-3 text-xs font-medium',
                  NOTE_TONES[step.note.tone]
                )}
              >
                <NoteIcon aria-hidden="true" className="size-4 shrink-0" />
                {step.note.text}
              </p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
