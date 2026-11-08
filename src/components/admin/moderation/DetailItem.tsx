import type { LucideIcon } from 'lucide-react';

type DetailItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="flex gap-2.5">
      <Icon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
      <dl>
        <dt className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
          {label}
        </dt>
        <dd className="mt-0.5 text-sm leading-5 text-slate-800">{value}</dd>
      </dl>
    </div>
  );
}
