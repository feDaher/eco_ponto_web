import Link from 'next/link';
import { cn } from '@/lib/utils';
import { pluralize } from '@/lib/points';
import { ROUTES } from '@/lib/routes';
import type { GuideCategory } from '@/types/education';

type GuideCategoryNavProps = {
  categories: GuideCategory[];
  activeSlug: string;
};

export function GuideCategoryNav({
  categories,
  activeSlug,
}: GuideCategoryNavProps) {
  return (
    <nav aria-label="Categorias de descarte">
      <ul className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map(({ slug, label, icon: Icon, pointCount }) => {
          const isActive = slug === activeSlug;
          const content = (
            <>
              <Icon
                aria-hidden="true"
                className={cn(
                  'size-4.5 shrink-0',
                  isActive ? 'text-white' : 'text-brand-muted'
                )}
              />
              {label}
              <span
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  isActive ? 'bg-white/20 text-white' : 'bg-card text-slate-600'
                )}
              >
                {pluralize(pointCount, 'ponto', 'pontos')}
              </span>
            </>
          );
          const pillClasses = cn(
            'inline-flex h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors',
            isActive
              ? 'bg-brand-solid text-white shadow-sm'
              : 'bg-surface-accent text-slate-900 hover:bg-surface-strong'
          );

          return (
            <li key={slug}>
              {isActive ? (
                <span aria-current="page" className={pillClasses}>
                  {content}
                </span>
              ) : (
                <Link
                  href={ROUTES.educationCategory(slug)}
                  className={pillClasses}
                >
                  {content}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
