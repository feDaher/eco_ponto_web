import {
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Eye,
  ImageIcon,
  Leaf,
  MapPin,
  Package,
  Phone,
  UserRound,
  X,
} from 'lucide-react';
import { MATERIALS } from '@/lib/materials';
import { CATEGORIES, formatSubmittedAt } from '@/lib/moderation';
import { cn } from '@/lib/utils';
import type { Attachment, PointRequest } from '@/types/api';
import { ATTACHMENT_KINDS } from './AttachmentPreview';
import { DetailItem } from './DetailItem';

const BUTTON_CLASS =
  'inline-flex h-9 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';

const BUTTON_TONES = {
  outline:
    'border border-slate-200 bg-card font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-brand',
  primary:
    'bg-brand-solid text-white hover:bg-brand-solid-hover focus-visible:outline-brand',
  danger:
    'bg-red-50 text-red-700 hover:bg-red-100 focus-visible:outline-red-600 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70',
};

type PointRequestCardProps = {
  request: PointRequest;
  now: number;
  expanded: boolean;
  onToggleDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRemove: () => void;
  onPreview: (attachment: Attachment) => void;
};

export function PointRequestCard({
  request,
  now,
  expanded,
  onToggleDetails,
  onApprove,
  onReject,
  onRemove,
  onPreview,
}: PointRequestCardProps) {
  const approved = request.status === 'approved';
  const category = CATEGORIES[request.category];
  const CategoryIcon = category.icon;
  const detailsId = `request-details-${request.id}`;
  const materials = request.materials.map((m) => MATERIALS[m].label);
  const fullAddress = `${request.address} - ${request.neighborhood}, ${request.city}, CEP ${request.cep}`;

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200/80 bg-card shadow-xs">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                  approved
                    ? 'bg-brand-light text-brand-dark'
                    : 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200'
                )}
              >
                {approved ? (
                  <CheckCircle2 aria-hidden="true" className="size-3.5" />
                ) : (
                  <Clock3 aria-hidden="true" className="size-3.5" />
                )}
                {approved ? 'Homologado' : 'Aguardando análise'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-strong px-2.5 py-1 text-[11px] font-medium text-slate-700">
                <CategoryIcon aria-hidden="true" className="size-3.5" />
                {category.label}
              </span>
              <span className="text-xs text-slate-500">
                Protocolo{' '}
                <strong className="font-semibold text-slate-700">
                  #{request.protocol}
                </strong>
                <span aria-hidden="true" className="px-1.5 text-slate-300">
                  •
                </span>
                Enviado{' '}
                <time dateTime={request.submittedAt}>
                  {formatSubmittedAt(request.submittedAt, now)}
                </time>
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {request.name}
            </h2>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin
                aria-hidden="true"
                className="size-4 shrink-0 text-brand"
              />
              {request.address} - {request.neighborhood}, {request.city}
            </p>

            <dl className="mt-4 grid gap-3 rounded-xl bg-surface-alt p-4 sm:grid-cols-2">
              <div>
                <dt className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Solicitante
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">
                  {request.requester}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                  Itens aceitos
                </dt>
                <dd className="mt-1 text-sm text-slate-700">
                  {materials.join(' · ')}
                </dd>
              </div>
            </dl>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 xl:max-w-80 xl:justify-end">
            <button
              type="button"
              onClick={onToggleDetails}
              aria-expanded={expanded}
              aria-controls={detailsId}
              className={cn(BUTTON_CLASS, BUTTON_TONES.outline)}
            >
              <Eye aria-hidden="true" className="size-4" />
              {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
              <ChevronRight
                aria-hidden="true"
                className={cn(
                  'size-4 transition-transform',
                  expanded && 'rotate-90'
                )}
              />
            </button>
            {approved ? (
              <button
                type="button"
                onClick={onRemove}
                className={cn(BUTTON_CLASS, BUTTON_TONES.danger)}
              >
                <X aria-hidden="true" className="size-4" />
                Remover ponto
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onApprove}
                  className={cn(BUTTON_CLASS, BUTTON_TONES.primary)}
                >
                  <Check aria-hidden="true" className="size-4" />
                  Aprovar ponto
                </button>
                <button
                  type="button"
                  onClick={onReject}
                  className={cn(BUTTON_CLASS, BUTTON_TONES.danger)}
                >
                  <X aria-hidden="true" className="size-4" />
                  Reprovar ponto
                </button>
              </>
            )}
          </div>
        </div>

        {expanded && (
          <div
            id={detailsId}
            className="mt-6 grid gap-x-8 gap-y-6 border-t border-slate-100 pt-5 lg:grid-cols-[1fr_0.92fr]"
          >
            <section aria-labelledby={`${detailsId}-data`}>
              <h3
                id={`${detailsId}-data`}
                className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"
              >
                <ClipboardCheck
                  aria-hidden="true"
                  className="size-4 text-brand"
                />
                Dados do ponto e do responsável
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailItem
                  icon={Clock3}
                  label="Horário de coleta"
                  value={request.hours}
                />
                <DetailItem
                  icon={Package}
                  label="Estrutura de coleta"
                  value={request.structure}
                />
                <DetailItem
                  icon={Leaf}
                  label="Capacidade"
                  value={request.capacity}
                />
                <DetailItem
                  icon={Phone}
                  label="Contato"
                  value={request.contact}
                />
                <DetailItem
                  icon={UserRound}
                  label="Responsável pelo cadastro"
                  value={request.requester}
                />
                <DetailItem
                  icon={Building2}
                  label="CNPJ"
                  value={request.cnpj}
                />
                <DetailItem
                  icon={MapPin}
                  label="Endereço completo"
                  value={fullAddress}
                />
              </div>

              <h4 className="mt-5 mb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                Tipos de resíduos coletados
              </h4>
              <ul className="flex flex-wrap gap-2">
                {materials.map((label) => (
                  <li
                    key={label}
                    className="rounded-full bg-brand-light px-3 py-1.5 text-xs font-medium text-brand-dark"
                  >
                    {label}
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby={`${detailsId}-files`}>
              <h3
                id={`${detailsId}-files`}
                className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800"
              >
                <ImageIcon aria-hidden="true" className="size-4 text-brand" />
                Registro fotográfico e documentos
              </h3>
              <button
                type="button"
                onClick={() =>
                  onPreview({
                    name: 'Registro_fotografico.jpg',
                    description: request.photoCaption,
                    kind: 'photo',
                  })
                }
                className="flex min-h-28 w-full cursor-pointer items-end rounded-xl border border-slate-200 bg-linear-to-br from-brand-light to-surface-strong p-4 text-left transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-brand"
              >
                <span className="inline-flex items-center gap-2 rounded-lg bg-card/90 px-3 py-2 text-xs font-semibold text-slate-800">
                  <ImageIcon aria-hidden="true" className="size-4" />
                  {request.photoCaption}
                </span>
              </button>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {request.attachments.map((attachment) => {
                  const kind = ATTACHMENT_KINDS[attachment.kind];
                  const KindIcon = kind.icon;

                  return (
                    <li key={attachment.name}>
                      <button
                        type="button"
                        onClick={() => onPreview(attachment)}
                        className="flex w-full min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-surface-alt p-3 text-left transition-colors hover:border-brand focus-visible:outline-2 focus-visible:outline-brand"
                      >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                          <KindIcon aria-hidden="true" className="size-4" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-slate-800">
                            {attachment.name}
                          </span>
                          <span className="mt-0.5 block text-[11px] text-slate-500">
                            {kind.label} · abrir prévia
                          </span>
                        </span>
                        <Eye
                          aria-hidden="true"
                          className="size-4 shrink-0 text-slate-400"
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          </div>
        )}
      </div>
    </article>
  );
}
