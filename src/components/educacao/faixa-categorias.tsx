import Link from 'next/link';
import { BatteryPlus, Laptop, Monitor, Smartphone } from 'lucide-react';

import { cn } from '@/utils/utils';
import type { GuideCategory } from '@/utils/tipos-guia';

const categoryIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  BatteryPlus,
  Smartphone,
  Laptop,
  Monitor,
};

type CategoryStripProps = {
  categories: GuideCategory[];
  activeSlug: string;
};

export function CategoryStrip({ categories, activeSlug }: CategoryStripProps) {
  return (
    <div className="w-full bg-white shadow-[0_1px_4px_rgba(16,24,40,0.06)]">
      <div className="flex gap-5 overflow-x-auto px-12 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => {
          const Icon = categoryIcons[category.icone];
          const isActive = category.slug === activeSlug;

          const pillClasses = cn(
            'inline-flex h-[38px] shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors',
            isActive
              ? 'bg-[#36654A] text-white shadow-[0_2px_8px_rgba(16,24,40,0.12)]'
              : 'bg-[#EBF2FD] text-[#121C2A] hover:bg-[#D9E2F3]'
          );

          const iconClasses = cn(
            'size-[18px] shrink-0',
            isActive ? 'text-white' : 'text-[#476555]'
          );

          const badgeClasses = cn(
            'inline-flex h-[18px] items-center rounded-full px-2.5 text-xs font-medium',
            isActive ? 'bg-[#4F7F62] text-white' : 'bg-[#D9E2F3] text-[#414943]'
          );

          if (isActive) {
            return (
              <span
                key={category.slug}
                className={pillClasses}
                aria-current="page"
              >
                {Icon && <Icon className={iconClasses} />}
                {category.rotulo}
                <span className={badgeClasses}>{category.postos}</span>
              </span>
            );
          }

          return (
            <Link
              key={category.slug}
              href={`/education/${category.slug}`}
              className={pillClasses}
            >
              {Icon && <Icon className={iconClasses} />}
              {category.rotulo}
              <span className={badgeClasses}>{category.postos}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
