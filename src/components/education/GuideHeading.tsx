import type { GuideSectionHeading } from '@/types/education';

type GuideHeadingProps = GuideSectionHeading & {
  id: string;
  aside?: React.ReactNode;
};

export function GuideHeading({
  id,
  eyebrow,
  title,
  description,
  aside,
}: GuideHeadingProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        <p className="text-xs font-bold tracking-wider text-brand uppercase">
          {eyebrow}
        </p>
        <h2 id={id} className="text-2xl font-bold text-slate-900 lg:text-3xl">
          {title}
        </h2>
        <p className="max-w-3xl text-slate-600">{description}</p>
      </div>
      {aside}
    </div>
  );
}
