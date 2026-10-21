import { CheckCircle2, XCircle, type LucideIcon } from 'lucide-react';
import { GUIDE_SECTIONS } from '@/lib/routes';
import { GuideHeading } from '@/components/education/GuideHeading';
import type { DisposalGuide, SortingGroup } from '@/types/education';

type SortingVariant = 'accepted' | 'rejected';

const VARIANTS: Record<
  SortingVariant,
  {
    icon: LucideIcon;
    badge: string;
    title: string;
    item: string;
    itemIcon: string;
    itemTitle: string;
  }
> = {
  accepted: {
    icon: CheckCircle2,
    badge: 'bg-brand-light text-brand-muted',
    title: 'text-slate-900',
    item: 'bg-surface-alt',
    itemIcon: 'text-brand',
    itemTitle: 'text-slate-900',
  },
  rejected: {
    icon: XCircle,
    badge: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    title: 'text-red-900 dark:text-red-200',
    item: 'bg-red-50/60 dark:bg-red-950/20',
    itemIcon: 'text-red-700 dark:text-red-300',
    itemTitle: 'text-red-950 dark:text-red-100',
  },
};

type SortingCardProps = {
  group: SortingGroup;
  variant: SortingVariant;
};

function SortingCard({ group, variant }: SortingCardProps) {
  const styles = VARIANTS[variant];

  return (
    <div className="rounded-3xl border border-slate-100 bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <span
          className={`flex size-12 shrink-0 items-center justify-center rounded-full ${styles.badge}`}
        >
          <styles.icon aria-hidden="true" className="size-6" />
        </span>
        <div>
          <h3 className={`text-lg font-semibold ${styles.title}`}>
            {group.title}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{group.description}</p>
        </div>
      </div>

      <ul className="mt-4 space-y-3">
        {group.items.map((item) => (
          <li
            key={item.title}
            className={`flex items-start gap-3 rounded-2xl p-4 ${styles.item}`}
          >
            <item.icon
              aria-hidden="true"
              className={`size-5 shrink-0 ${styles.itemIcon}`}
            />
            <div>
              <h4 className={`text-sm font-semibold ${styles.itemTitle}`}>
                {item.title}
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

type GuideSortingProps = {
  sorting: DisposalGuide['sorting'];
};

export function GuideSorting({ sorting }: GuideSortingProps) {
  const headingId = `${GUIDE_SECTIONS.sorting}-heading`;

  return (
    <section
      id={GUIDE_SECTIONS.sorting}
      aria-labelledby={headingId}
      className="scroll-mt-24 space-y-6"
    >
      <GuideHeading
        id={headingId}
        eyebrow={sorting.eyebrow}
        title={sorting.title}
        description={sorting.description}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SortingCard group={sorting.accepted} variant="accepted" />
        <SortingCard group={sorting.rejected} variant="rejected" />
      </div>
    </section>
  );
}
