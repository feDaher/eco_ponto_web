import type { LucideIcon } from 'lucide-react';

type SettingRowProps = {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  action: React.ReactNode;
};

export function SettingRow({
  id,
  icon: Icon,
  title,
  description,
  action,
}: SettingRowProps) {
  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-surface-alt p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="rounded-xl bg-card p-2 text-brand">
          <Icon aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p
            id={`${id}-title`}
            className="text-sm font-semibold text-slate-900"
          >
            {title}
          </p>
          <p id={`${id}-description`} className="text-xs text-slate-600">
            {description}
          </p>
        </div>
      </div>
      <div className="shrink-0 self-end sm:self-auto">{action}</div>
    </li>
  );
}
