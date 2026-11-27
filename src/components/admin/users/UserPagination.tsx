import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getPageNumbers } from '@/lib/users';
import { cn } from '@/lib/utils';

export const PAGE_SIZES = [6, 12, 24] as const;

type UserPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
};

export function UserPagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: UserPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const first = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <p>
          Mostrando{' '}
          <strong className="text-slate-800">
            {first}–{last}
          </strong>{' '}
          de <strong className="text-slate-800">{total}</strong>
        </p>
        <label className="flex items-center gap-1.5">
          Por página
          <select
            value={pageSize}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="rounded-lg border border-slate-200 bg-card px-2 py-1 font-semibold text-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-brand"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <nav aria-label="Paginação" className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Anterior
        </Button>
        {getPageNumbers(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <span key={`gap-${index}`} className="px-1 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              aria-current={item === page ? 'page' : undefined}
              className={cn(
                'size-7 cursor-pointer rounded-lg text-xs font-semibold transition',
                item === page
                  ? 'bg-brand-solid text-white'
                  : 'border border-slate-200 bg-card text-slate-700 hover:bg-slate-100'
              )}
            >
              {item}
            </button>
          )
        )}
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Próxima
          <ChevronRight aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}
