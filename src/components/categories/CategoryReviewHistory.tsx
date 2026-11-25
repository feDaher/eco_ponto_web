import { CircleCheck, CircleX } from 'lucide-react';
import { formatDate } from '@/lib/points';
import type { CategoryReviewEntry } from '@/types/pointCategories';

type CategoryReviewHistoryProps = {
  entries: CategoryReviewEntry[];
  labelOf: (code: string) => string;
  emptyText?: string;
};

export function CategoryReviewHistory({
  entries,
  labelOf,
  emptyText = 'Nenhuma decisão registrada até agora.',
}: CategoryReviewHistoryProps) {
  if (entries.length === 0) {
    return <p className="text-xs text-slate-500">{emptyText}</p>;
  }

  return (
    <ol className="space-y-2">
      {entries.map((entry) => {
        const approved = entry.decision === 'APPROVED';
        const Icon = approved ? CircleCheck : CircleX;

        return (
          <li
            key={entry.id}
            className="flex gap-2.5 rounded-xl border border-slate-200/80 bg-card p-3 text-sm"
          >
            <Icon
              aria-hidden="true"
              className={
                approved
                  ? 'mt-0.5 size-4 shrink-0 text-brand'
                  : 'mt-0.5 size-4 shrink-0 text-red-600 dark:text-red-400'
              }
            />
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="font-semibold text-slate-800">
                {labelOf(entry.code)}{' '}
                <span
                  className={
                    approved
                      ? 'font-medium text-brand-dark'
                      : 'font-medium text-red-700 dark:text-red-300'
                  }
                >
                  {approved ? 'aprovada' : 'rejeitada'}
                </span>
              </p>
              <p className="text-xs text-slate-500">
                <time dateTime={entry.reviewedAt}>
                  {formatDate(entry.reviewedAt)}
                </time>
                {entry.reviewedBy && <> · por {entry.reviewedBy.name}</>}
              </p>
              {entry.reason && (
                <p className="text-xs break-words text-slate-600">
                  Motivo: {entry.reason}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
