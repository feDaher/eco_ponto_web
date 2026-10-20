import type { LucideIcon } from 'lucide-react';

type StatCardProps = {
  label: string;
  icon: LucideIcon;
  children: React.ReactNode;
};

export function StatCard({ label, icon: Icon, children }: StatCardProps) {
  return (
    <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex items-start justify-between">
        <h3 className="text-[11px] font-bold tracking-wider text-brand-muted uppercase">
          {label}
        </h3>
        <span className="rounded-lg bg-brand-light p-1.5 text-brand">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      {children}
    </div>
  );
}
