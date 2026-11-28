import Link from 'next/link';
import { ChevronRight, CircleHelp, Info } from 'lucide-react';
import { ROUTES } from '@/lib/routes';
type AppInfoProps = {
  version: string;
};

export function AppInfo({ version }: AppInfoProps) {
  return (
    <div className="space-y-3">
      <p className="flex items-center justify-between rounded-2xl border border-slate-100 bg-card px-5 py-4 text-sm shadow-sm">
        <span className="flex items-center gap-2 font-semibold text-slate-900">
          <Info aria-hidden="true" className="size-4 text-slate-500" />
          Versão do aplicativo
        </span>
        <span className="text-slate-500 tabular-nums">{version}</span>
      </p>
      <Link
        href={ROUTES.education}
        className="flex items-center justify-between rounded-2xl border border-slate-100 bg-card px-5 py-4 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
      >
        <span className="flex items-center gap-2">
          <CircleHelp aria-hidden="true" className="size-4 text-brand" />
          Central de ajuda
        </span>
        <ChevronRight aria-hidden="true" className="size-4 text-slate-400" />
      </Link>
    </div>
  );
}
