'use client';

import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CollectorSidebar } from './CollectorSidebar';
import { useCollector } from './collectorContext';

export function CollectorShell({ children }: { children: React.ReactNode }) {
  const { error, reload } = useCollector();

  return (
    <div className="bg-surface">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 md:px-6 lg:flex-row">
        <CollectorSidebar />

        <div className="min-w-0 flex-1 space-y-6">
          {error && (
            <div
              role="alert"
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
            >
              <p className="flex items-center gap-2 font-medium">
                <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
                {error}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={reload}
              >
                <RefreshCw aria-hidden="true" />
                Tentar novamente
              </Button>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
