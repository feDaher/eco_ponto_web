import { BookOpen, Clock, Send, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pluralize, formatDate } from '@/lib/points';
import { GUIDE_SECTIONS } from '@/lib/routes';
import type { DisposalGuide, GuideTag, GuideTone } from '@/types/education';

const TAG_TONES: Record<GuideTone, string> = {
  brand: 'bg-brand-light text-brand-muted',
  accent: 'bg-surface-accent text-slate-700',
  neutral: 'border border-slate-200 bg-card text-slate-700',
};

type GuideHeaderProps = {
  guide: DisposalGuide;
  pointCount: number;
};

function splitHighlight(title: string, highlight: string) {
  const index = highlight ? title.indexOf(highlight) : -1;
  if (index === -1) return [title, '', ''];

  return [
    title.slice(0, index),
    highlight,
    title.slice(index + highlight.length),
  ];
}

export function GuideHeader({ guide, pointCount }: GuideHeaderProps) {
  const [before, highlight, after] = splitHighlight(
    guide.title,
    guide.highlight
  );
  const tags: GuideTag[] = [
    {
      label: `Atualizado em ${formatDate(guide.updatedAt)}`,
      icon: Clock,
      tone: 'brand',
    },
    {
      label: `Leitura de ${guide.readingMinutes} min`,
      icon: BookOpen,
      tone: 'accent',
    },
    ...guide.tags,
  ];

  return (
    <section aria-labelledby="guide-title" className="space-y-6">
      <ul className="flex flex-wrap gap-2">
        {tags.map(({ label, icon: Icon, tone }) => (
          <li
            key={label}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
              TAG_TONES[tone]
            )}
          >
            <Icon aria-hidden="true" className="size-3.5" />
            {label}
          </li>
        ))}
      </ul>

      <div className="space-y-4">
        <h1
          id="guide-title"
          className="max-w-4xl text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl xl:text-5xl"
        >
          {before}
          {highlight && (
            <span className="text-brand underline decoration-brand/40 decoration-2 underline-offset-4">
              {highlight}
            </span>
          )}
          {after}
        </h1>
        <p className="max-w-3xl leading-relaxed text-slate-600 lg:text-lg">
          {guide.description}
        </p>
      </div>

      <div className="grid items-center gap-6 rounded-3xl border border-slate-100 bg-card p-6 shadow-sm lg:grid-cols-[1fr_auto] lg:p-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-muted">
              <Zap aria-hidden="true" className="size-6" />
            </span>
            <span className="text-xs font-bold tracking-wider text-brand uppercase">
              Resumo rápido
            </span>
          </div>
          <h2 className="text-xl font-semibold text-slate-900 lg:text-2xl">
            {guide.summary.title}
          </h2>
          <ol className="space-y-1 text-sm leading-relaxed text-slate-600">
            {guide.summary.steps.map((step, index) => (
              <li key={step.title}>
                <strong className="text-slate-900">
                  {index + 1}. {step.title}
                </strong>{' '}
                {step.text}
              </li>
            ))}
          </ol>
        </div>

        {pointCount > 0 && (
          <a
            href={`#${GUIDE_SECTIONS.locations}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-solid px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-solid-hover"
          >
            <Send aria-hidden="true" className="size-4" />
            Ver {pluralize(pointCount, 'ponto de coleta', 'pontos de coleta')}
          </a>
        )}
      </div>
    </section>
  );
}
