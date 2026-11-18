import {
  Compass,
  Download,
  FileSpreadsheet,
  Layers,
  MapPin,
} from 'lucide-react';
import {
  CategoryRow,
  ExportFormat,
  ExportScope,
  PointRow,
} from '@/types/reports';

interface CategoryAndPointSectionProps {
  categories: CategoryRow[];
  points: PointRow[];
  onExport: (scope: ExportScope, format: ExportFormat) => void;
  isExporting?: boolean;
  isLoading?: boolean;
}

export function CategoryAndPointSection({
  categories,
  points,
  onExport,
  isExporting = false,
  isLoading = false,
}: CategoryAndPointSectionProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-card lg:col-span-7" />
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-card lg:col-span-5" />
      </div>
    );
  }

  const totalCategoryWeight = categories.reduce(
    (acc, item) => acc + item.weightKg,
    0
  );

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-card p-5 shadow-sm sm:p-6 lg:col-span-7">
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Fracionamento Gravimétrico
              </p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                Volume de Descartes por Categoria
              </h2>
            </div>

            <button
              type="button"
              disabled={isExporting || categories.length === 0}
              onClick={() => onExport('category', 'csv')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <FileSpreadsheet aria-hidden="true" className="size-3.5" />
              Exportar Tabela
            </button>
          </div>

          {categories.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Nenhum dado de categoria registrado para o filtro selecionado.
            </p>
          ) : (
            <div className="mt-5 flex flex-col gap-5">
              {categories.map((cat) => (
                <div key={cat.categoryId} className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand-dark">
                        <Layers aria-hidden="true" className="size-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {cat.displayName || cat.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {cat.disposals} descartes • Destinador:{' '}
                          {cat.destinador || 'Não informado'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {cat.weightKg.toLocaleString('pt-BR', {
                          maximumFractionDigits: 1,
                        })}{' '}
                        kg
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {cat.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-chart-1 transition-all"
                      style={{ width: `${Math.min(cat.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span>
            Total consolidado:{' '}
            <strong className="font-semibold text-slate-900">
              {totalCategoryWeight.toLocaleString('pt-BR', {
                maximumFractionDigits: 1,
              })}{' '}
              kg
            </strong>
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-card p-5 shadow-sm sm:p-6 lg:col-span-5">
        <div>
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Mapeamento Territorial
              </p>
              <h2 className="mt-0.5 text-lg font-bold text-slate-900">
                Densidade por Ponto de Coleta
              </h2>
            </div>

            <button
              type="button"
              disabled={isExporting || points.length === 0}
              onClick={() => onExport('geospatial', 'geojson')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              <MapPin aria-hidden="true" className="size-3.5" />
              GeoJSON
            </button>
          </div>

          <div className="mt-4 flex items-center justify-between rounded-xl border border-brand/20 bg-brand-light px-3.5 py-2.5 text-xs">
            <span className="inline-flex items-center gap-1.5 font-semibold text-brand-dark">
              <span className="size-2 rounded-full bg-brand" />
              Manhuaçu • Zona da Mata
            </span>
            <span className="font-medium text-brand-dark">
              {points.length}{' '}
              {points.length === 1 ? 'EcoPonto GPS' : 'EcoPontos GPS'}
            </span>
          </div>

          {points.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">
              Nenhum ponto georreferenciado registrado no período.
            </p>
          ) : (
            <div className="mt-4 divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
              {points.map((point, index) => (
                <div
                  key={point.collectionPointId}
                  className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-solid text-xs font-bold text-brand-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {point.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {point.neighborhood ? `${point.neighborhood} • ` : ''}
                        {point.address}
                      </p>
                      <p className="mt-0.5 font-mono text-[11px] text-slate-400">
                        {point.latitude.toFixed(5)},{' '}
                        {point.longitude.toFixed(5)}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {point.weightKg.toLocaleString('pt-BR', {
                        maximumFractionDigits: 1,
                      })}{' '}
                      kg
                    </p>
                    <p className="text-xs text-slate-500">
                      {point.percentage.toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={isExporting || points.length === 0}
          onClick={() => onExport('geospatial', 'kml')}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
        >
          <Compass aria-hidden="true" className="size-4 text-brand-dark" />
          Baixar Trilha Geoespacial (KML)
          <Download aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
