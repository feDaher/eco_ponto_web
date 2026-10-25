import {
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Eye,
  FileText,
  ImageIcon,
  Leaf,
  MapPin,
  Package,
  Phone,
  Store,
  UserRound,
  X,
} from 'lucide-react';
import { DetailItem } from './detail-item';
import type { Attachment, CollectionPoint, PointCategory } from './types';

function categoryIcon(category: PointCategory) {
  if (category === 'Varejo / urna interna')
    return <Store className="h-3.5 w-3.5" />;
  if (category === 'Descarte especializado')
    return <Package className="h-3.5 w-3.5" />;
  return <Building2 className="h-3.5 w-3.5" />;
}

//responsável por exibir um card de ponto de coleta com informações resumidas e ações de aprovação, reprovação ou remoção
export function PointCard({
  point,
  expanded,
  onToggleDetails,
  onApprove,
  onReject,
  onRemove,
  onPreview,
  approved,
}: {
  point: CollectionPoint;
  expanded: boolean;
  onToggleDetails: () => void;
  onApprove: () => void;
  onReject: () => void;
  onRemove: () => void;
  onPreview: (attachment: Attachment) => void;
  approved: boolean;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#e4ebe7] bg-white shadow-[0_2px_14px_rgba(33,58,45,0.035)] dark:border-border dark:bg-card">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  approved
                    ? 'bg-[#e8f5ec] text-[#30734e] dark:bg-green-950/40 dark:text-green-300'
                    : 'bg-[#fff4df] text-[#9a6b17] dark:bg-amber-950/40 dark:text-amber-200'
                }`}
              >
                {approved ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <Clock3 className="h-3.5 w-3.5" />
                )}
                {approved ? 'Homologado' : 'Aguardando análise'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf2ff] px-2.5 py-1 text-[11px] font-medium text-[#5067a3] dark:bg-blue-950/40 dark:text-blue-300">
                {categoryIcon(point.category)}
                {point.category}
              </span>
              <span className="text-xs text-[#7c8982] dark:text-muted-foreground">
                Protocolo{' '}
                <strong className="font-semibold text-[#4b5b52] dark:text-foreground">
                  #{point.protocol}
                </strong>
                <span className="px-1.5 text-[#bdc7c1] dark:text-muted-foreground">
                  •
                </span>
                Enviado {point.sentAt.toLowerCase()}
              </span>
            </div>

            <h2 className="text-xl font-bold leading-snug tracking-[-0.025em] text-[#1e2c25] sm:text-[22px] dark:text-foreground">
              {point.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#66746c] dark:text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-[#397653] dark:text-brand" />
                {point.address}
              </span>
            </div>

            <div className="mt-4 grid gap-3 rounded-xl bg-[#f3f6ff] p-4 sm:grid-cols-2 dark:bg-muted">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#78857e] dark:text-muted-foreground">
                  Solicitante
                </p>
                <p className="mt-1 text-sm font-semibold text-[#28352e] dark:text-foreground">
                  {point.requester}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#78857e] dark:text-muted-foreground">
                  Itens aceitos
                </p>
                <p className="mt-1 text-sm text-[#48574f] dark:text-foreground">
                  {point.acceptedItems.join(' · ')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2 xl:max-w-[320px] xl:justify-end">
            <button
              type="button"
              onClick={onToggleDetails}
              aria-expanded={expanded}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#dce6e0] bg-white px-3 text-sm font-medium text-[#41584a] transition hover:bg-[#f3f7f4] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#347153] dark:border-border dark:bg-card dark:text-foreground dark:hover:bg-muted"
            >
              <Eye className="h-4 w-4" />
              {expanded ? 'Ocultar detalhes' : 'Ver detalhes'}
              <ChevronRight
                className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
              />
            </button>
            {!approved ? (
              <>
                <button
                  type="button"
                  onClick={onApprove}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#2f664d] px-3 text-sm font-semibold text-white transition hover:bg-[#28573f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#347153]"
                >
                  <Check className="h-4 w-4" />
                  Aprovar ponto
                </button>
                <button
                  type="button"
                  onClick={onReject}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#fff0ee] px-3 text-sm font-semibold text-[#b33b35] transition hover:bg-[#ffe6e3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b33b35] dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
                >
                  <X className="h-4 w-4" />
                  Reprovar ponto
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#fff0ee] px-3 text-sm font-semibold text-[#b33b35] transition hover:bg-[#ffe6e3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#b33b35] dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-950/70"
              >
                <X className="h-4 w-4" />
                Remover ponto
              </button>
            )}
          </div>
        </div>

        {expanded && (
          <div className="mt-6 border-t border-[#e9efeb] pt-5 dark:border-border">
            <div className="grid gap-x-8 gap-y-6 lg:grid-cols-[1fr_0.92fr]">
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#344b3c] dark:text-foreground">
                  <ClipboardCheck className="h-4 w-4 text-[#39805a] dark:text-brand" />
                  Dados do ponto e do responsável
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailItem
                    icon={Clock3}
                    label="Horário de coleta"
                    value={point.collectionHours}
                  />
                  <DetailItem
                    icon={Package}
                    label="Estrutura de coleta"
                    value={point.structure}
                  />
                  <DetailItem
                    icon={Leaf}
                    label="Capacidade"
                    value={point.capacity}
                  />
                  <DetailItem
                    icon={Phone}
                    label="Contato"
                    value={point.contact}
                  />
                  <DetailItem
                    icon={UserRound}
                    label="Responsável pelo cadastro"
                    value={point.responsible}
                  />
                  <DetailItem
                    icon={Building2}
                    label="CNPJ"
                    value={point.cnpj}
                  />
                  <DetailItem
                    icon={MapPin}
                    label="Endereço completo"
                    value={point.address}
                  />
                </div>

                <h3 className="mb-2 mt-5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#758179] dark:text-muted-foreground">
                  Tipos de resíduos coletados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {point.wasteTypes.map((wasteType) => (
                    <span
                      key={wasteType}
                      className="rounded-full bg-[#e8f5ec] px-3 py-1.5 text-xs font-medium text-[#416a52] dark:bg-green-950/40 dark:text-green-300"
                    >
                      {wasteType}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#344b3c] dark:text-foreground">
                  <ImageIcon className="h-4 w-4 text-[#39805a] dark:text-brand" />
                  Registro fotográfico e documentos
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    onPreview({
                      name: 'Registro_fotografico.jpg',
                      description: point.photoCaption,
                      kind: 'Registro fotográfico',
                    })
                  }
                  className="group relative flex min-h-[116px] w-full items-end overflow-hidden rounded-xl border border-[#dce7df] bg-[linear-gradient(135deg,#dcebdd_0%,#f4ead7_50%,#aac9ad_100%)] p-4 text-left transition hover:brightness-[0.98] dark:border-border dark:bg-[linear-gradient(135deg,#263b2e_0%,#3a382b_50%,#314c38_100%)]"
                >
                  <div className="absolute right-5 top-4 h-14 w-20 rounded-lg border border-white/80 bg-white/45 shadow-sm">
                    <div className="absolute bottom-0 left-0 h-8 w-full rounded-b-lg bg-[#84a787]/70" />
                    <div className="absolute bottom-4 left-3 h-5 w-4 rounded-t bg-[#e5f0e6]" />
                    <div className="absolute bottom-4 right-3 h-7 w-5 rounded-t bg-[#f6f2e6]" />
                  </div>
                  <span className="relative inline-flex items-center gap-2 rounded-lg bg-white/90 px-3 py-2 text-xs font-semibold text-[#3b5745] dark:bg-card/90 dark:text-foreground">
                    <ImageIcon className="h-4 w-4" />
                    {point.photoCaption}
                  </span>
                </button>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {point.attachments.map((attachment) => (
                    <button
                      key={attachment.name}
                      type="button"
                      onClick={() => onPreview(attachment)}
                      className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e2eae5] bg-[#fbfcfb] p-3 text-left transition hover:border-[#b8d0c0] hover:bg-[#f5f9f6] dark:border-border dark:bg-background dark:hover:bg-muted"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e8f5ec] text-[#397653] dark:bg-green-950/40 dark:text-brand">
                        <FileText className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-xs font-semibold text-[#34483b] dark:text-foreground">
                          {attachment.name}
                        </span>
                        <span className="mt-0.5 block text-[11px] text-[#839087] dark:text-muted-foreground">
                          {attachment.kind} · abrir prévia
                        </span>
                      </span>
                      <Eye className="h-4 w-4 shrink-0 text-[#718278] dark:text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
