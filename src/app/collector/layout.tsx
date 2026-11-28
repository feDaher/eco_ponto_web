'use client';

import type { ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import {
  CollectorProvider,
  useCollector,
} from '@/components/collector/collectorContext';
import { CollectorHeader } from '@/components/collector/CollectorHeader';
import { CollectorSidebar } from '@/components/collector/CollectorSidebar';

function CollectorShell({ children }: { children: ReactNode }) {
  const {
    isBootstrapping,
    error,
    reload,
    points,
    selectedPoint,
    selectedPointId,
    setSelectedPointId,
    isOpen,
    displayName,
    shortName,
    unitLabel,
    userCity,
  } = useCollector();

  if (isBootstrapping) {
    return (
      <div className="bg-surface">
        <div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row">
          <div className="h-44 w-full animate-pulse rounded-2xl bg-slate-200/70 lg:w-64 lg:shrink-0" />
          <div className="min-w-0 flex-1 space-y-6">
            <div className="h-16 animate-pulse rounded-2xl bg-slate-200/70" />
            <div className="h-32 animate-pulse rounded-2xl bg-slate-200/70" />
            <div className="h-64 animate-pulse rounded-2xl bg-slate-200/70" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row">
        <CollectorSidebar
          shortName={shortName}
          cnpj={selectedPoint?.cnpj}
          subtitle={userCity}
        />

        <div className="min-w-0 flex-1 space-y-6">
          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            >
              <p className="flex items-center gap-2 font-medium">
                <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
                {error}
              </p>
              <button
                type="button"
                onClick={() => void reload()}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-red-800 shadow-xs transition-colors hover:bg-red-100"
              >
                <RefreshCw aria-hidden="true" className="size-3.5" />
                Tentar novamente
              </button>
            </div>
          )}

          <CollectorHeader
            name={displayName}
            unit={unitLabel}
            isOpen={isOpen}
            pointStatus={selectedPoint?.status ?? null}
            cnpj={selectedPoint?.cnpj}
            points={points}
            selectedPointId={selectedPointId}
            onSelectPoint={setSelectedPointId}
          />

          {children}
        </div>
      </div>
    </div>
  );
}

export default function CollectorLayout({ children }: { children: ReactNode }) {
  return (
    <CollectorProvider>
      <CollectorShell>{children}</CollectorShell>
    </CollectorProvider>
  );
}
