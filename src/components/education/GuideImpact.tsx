import Image from 'next/image';
import { Zap } from 'lucide-react';
import { GUIDE_SECTIONS } from '@/lib/routes';
import type { DisposalGuide } from '@/types/education';

type GuideImpactProps = {
  impact: DisposalGuide['impact'];
};

export function GuideImpact({ impact }: GuideImpactProps) {
  const headingId = `${GUIDE_SECTIONS.impact}-heading`;

  return (
    <section
      id={GUIDE_SECTIONS.impact}
      aria-labelledby={headingId}
      className="relative scroll-mt-24 overflow-hidden rounded-3xl bg-brand-deep p-8 text-white lg:p-12"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 left-1/3 size-96 rounded-full bg-white/5 blur-3xl"
      />

      <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_24rem]">
        <div className="space-y-6">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-brand-pale">
            <Zap aria-hidden="true" className="size-4" />
            {impact.tag}
          </span>
          <h2
            id={headingId}
            className="text-3xl leading-tight font-bold text-white lg:text-4xl"
          >
            {impact.title}
          </h2>
          <p className="max-w-[60ch] leading-relaxed text-brand-foreground/90 lg:text-lg">
            {impact.description}
          </p>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {impact.stats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col-reverse gap-2 rounded-2xl bg-white/10 p-5"
              >
                <dt className="text-sm leading-snug text-brand-foreground">
                  {stat.label}
                </dt>
                <dd className="text-3xl font-bold text-brand-pale">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <aside className="flex flex-col items-center rounded-2xl bg-white/10 p-8 text-center">
          <Image
            src="/icons/ecoponto-logo-icon-white.png"
            alt=""
            width={28}
            height={25}
            className="h-auto w-16"
          />
          <h3 className="mt-4 text-lg font-bold text-white">
            {impact.panel.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-brand-foreground/90">
            {impact.panel.description}
          </p>
        </aside>
      </div>
    </section>
  );
}
