import type { LucideIcon } from 'lucide-react';

type SectionCardProps = {
  id: string;
  title: string;
  description?: string;
  eyebrow?: string;
  icon?: LucideIcon;
  aside?: React.ReactNode;
  children: React.ReactNode;
};

export function SectionCard({
  id,
  title,
  description,
  eyebrow,
  icon: Icon,
  aside,
  children,
}: SectionCardProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="scroll-mt-24 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          {eyebrow && (
            <p className="text-xs font-bold tracking-wider text-brand uppercase">
              {eyebrow}
            </p>
          )}
          <h2
            id={headingId}
            className="text-lg font-bold text-slate-900 sm:text-xl"
          >
            {title}
          </h2>
          {description && (
            <p className="text-sm text-slate-600">{description}</p>
          )}
        </div>
        {aside ??
          (Icon && (
            <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-brand-light text-brand-muted">
              <Icon aria-hidden="true" className="size-5" />
            </span>
          ))}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
