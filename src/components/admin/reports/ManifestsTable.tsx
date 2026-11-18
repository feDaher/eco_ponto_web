import { CheckCircle2, Clock, Download, Search, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { DisposalStatus, ManifestRow, Paged } from '@/types/reports';

interface ManifestsTableProps {
  data: Paged<ManifestRow> | null;
  search: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onPageChange: (newPage: number) => void;
  onExport: () => void;
  isExporting?: boolean;
  isLoading?: boolean;
}

const STATUS_CONFIG: Record<
  DisposalStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  CONFIRMED: {
    label: 'Auditado',
    className: 'bg-brand-light text-brand-dark',
    icon: CheckCircle2,
  },
  PENDING: {
    label: 'Em Triagem',
    className:
      'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300',
    icon: Clock,
  },
  CANCELLED: {
    label: 'Cancelado',
    className: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    icon: XCircle,
  },
};

export function ManifestsTable({
  data,
  search,
  onSearchChange,
  onSearchSubmit,
  onPageChange,
  onExport,
  isExporting = false,
  isLoading = false,
}: ManifestsTableProps) {
  const startItem =
    data && data.total > 0 ? (data.page - 1) * data.pageSize + 1 : 0;
  const endItem = data ? Math.min(data.page * data.pageSize, data.total) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-card shadow-sm">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Rastreabilidade em Tempo Real
          </p>
          <h2 className="mt-0.5 text-lg font-bold text-slate-900">
            Registros Recentes & Certificados
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              aria-label="Buscar protocolo ou destinador"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSearchSubmit();
              }}
              placeholder="Buscar protocolo ou destinador..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand focus:outline-none"
            />
          </div>

          <Button
            variant="outline"
            size="lg"
            className="cursor-pointer"
            onClick={onExport}
            disabled={isExporting || isLoading || !data || data.total === 0}
          >
            <Download aria-hidden="true" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-64 animate-pulse bg-slate-50" />
      ) : !data || data.items.length === 0 ? (
        <div className="p-10 text-center text-sm text-slate-500">
          Nenhum manifesto de descarte encontrado para os filtros aplicados.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
                  <th className="px-5 py-3.5">Protocolo MTR</th>
                  <th className="px-5 py-3.5">Data & Hora</th>
                  <th className="px-5 py-3.5">Ponto de Origem</th>
                  <th className="px-5 py-3.5">Categoria & Peso</th>
                  <th className="px-5 py-3.5">Destinador Homologado</th>
                  <th className="px-5 py-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {data.items.map((row) => {
                  const statusInfo = STATUS_CONFIG[row.status];
                  const StatusIcon = statusInfo.icon;
                  const formattedDate = new Date(row.disposedAt).toLocaleString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    }
                  );

                  return (
                    <tr
                      key={row.protocol}
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs font-semibold text-brand-dark">
                        #{row.protocol}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-slate-600">
                        {formattedDate}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-900">
                        {row.collectionPointName}
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-slate-900">
                          {row.categoryDisplayName || row.categoryName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {row.weightKg.toLocaleString('pt-BR', {
                            maximumFractionDigits: 1,
                          })}{' '}
                          kg
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {row.destinador || 'Não informado'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.className}`}
                        >
                          <StatusIcon aria-hidden="true" className="size-3" />
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-5 py-3.5 text-xs text-slate-600">
            <span>
              Mostrando{' '}
              <strong className="font-semibold text-slate-900">
                {startItem}–{endItem}
              </strong>{' '}
              de{' '}
              <strong className="font-semibold text-slate-900">
                {data.total}
              </strong>{' '}
              manifestos no período
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={data.page <= 1}
                onClick={() => onPageChange(data.page - 1)}
                className="rounded-lg border border-slate-200 bg-card px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
              >
                Anterior
              </button>

              <span className="inline-flex size-7 items-center justify-center rounded-lg bg-brand-solid font-semibold text-brand-foreground">
                {data.page}
              </span>

              <button
                type="button"
                disabled={data.page >= data.totalPages}
                onClick={() => onPageChange(data.page + 1)}
                className="rounded-lg border border-slate-200 bg-card px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-100 disabled:opacity-40"
              >
                Próxima
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
