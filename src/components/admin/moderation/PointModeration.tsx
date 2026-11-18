'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  Filter,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@/context/AuthContext';
import {
  approvalRate,
  formatChange,
  formatPercent,
  formatTime,
} from '@/lib/moderation';
import type {
  Attachment,
  AuditEntry,
  ModerationData,
  ModerationDecision,
  PointRequest,
} from '@/types/api';
import { AttachmentPreview } from './AttachmentPreview';
import { AuditHistory } from './AuditHistory';
import {
  DecisionDialog,
  type DecisionAction,
  type DecisionResult,
} from './DecisionDialog';
import { ModerationTabs, panelId, tabId, type TabItem } from './ModerationTabs';
import { PointRequestCard } from './PointRequestCard';

type Tab = 'pending' | 'history' | 'approved';

type AuditFilter = 'all' | ModerationDecision;

const AUDIT_FILTERS: { value: AuditFilter; label: string }[] = [
  { value: 'all', label: 'Todas as decisões' },
  { value: 'approved', label: 'Aprovados' },
  { value: 'rejected', label: 'Reprovados' },
  { value: 'removed', label: 'Removidos' },
];

const NOTICE_MS = 3500;

const SELECT_CLASS =
  'flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-card px-3 text-sm text-slate-700 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand';

type PointModerationProps = {
  initialData: ModerationData;
};

export function PointModeration({ initialData }: PointModerationProps) {
  const { user } = useAuth();
  const [region, setRegion] = useState(initialData.regions[0]);
  const [tab, setTab] = useState<Tab>('pending');
  const [requests, setRequests] = useState(initialData.requests);
  const [audit, setAudit] = useState(initialData.audit);
  const [metrics, setMetrics] = useState(initialData.metrics);
  const [expanded, setExpanded] = useState<string[]>([]);
  const [auditFilter, setAuditFilter] = useState<AuditFilter>('all');
  const [dialog, setDialog] = useState<{
    action: DecisionAction;
    request: PointRequest;
  } | null>(null);
  const [preview, setPreview] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState('');
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const noticeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  const regionRequests = requests.filter((r) => r.city === region);
  const pending = regionRequests.filter((r) => r.status === 'pending');
  const approved = regionRequests.filter((r) => r.status === 'approved');
  const visibleAudit = audit.filter(
    (entry) =>
      entry.city === region &&
      (auditFilter === 'all' || entry.decision === auditFilter)
  );
  const regionMetrics = metrics[region];
  const rate = approvalRate(regionMetrics);
  const analyst = user?.name ?? 'Administrador';

  const tabs: TabItem<Tab>[] = [
    {
      id: 'pending',
      label: 'Aguardando moderação',
      icon: Clock3,
      count: pending.length,
    },
    {
      id: 'history',
      label: 'Histórico de decisões & auditoria',
      icon: ClipboardList,
    },
    {
      id: 'approved',
      label: 'Pontos já homologados',
      icon: MapPin,
      count: approved.length,
    },
  ];

  function showNotice(message: string) {
    window.clearTimeout(noticeTimer.current);
    setNotice(message);
    noticeTimer.current = window.setTimeout(() => setNotice(''), NOTICE_MS);
  }

  function toggleDetails(id: string) {
    setExpanded((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  }

  function refreshQueue() {
    const current = new Date();
    setNow(current.getTime());
    setRefreshedAt(current.toISOString());
    showNotice('Fila atualizada.');
  }

  function recordDecision(
    request: PointRequest,
    decision: ModerationDecision,
    reason?: string
  ) {
    const entry: AuditEntry = {
      id: crypto.randomUUID(),
      protocol: request.protocol,
      establishment: request.name,
      city: request.city,
      decision,
      analyst,
      decidedAt: new Date().toISOString(),
      reason,
    };

    setRequests((current) =>
      current.map((item) =>
        item.id === request.id ? { ...item, status: decision } : item
      )
    );
    setAudit((current) => [entry, ...current]);
    setExpanded((current) => current.filter((id) => id !== request.id));

    if (decision !== 'removed') {
      setMetrics((current) => ({
        ...current,
        [request.city]: {
          ...current[request.city],
          [decision]: current[request.city][decision] + 1,
        },
      }));
    }
  }

  function approve(request: PointRequest) {
    recordDecision(request, 'approved');
    showNotice(`${request.name} foi aprovado e publicado no mapa.`);
  }

  function confirmDecision({ reason, notify }: DecisionResult) {
    if (!dialog) return;
    const { action, request } = dialog;
    const rejected = action === 'reject';

    recordDecision(request, rejected ? 'rejected' : 'removed', reason);
    setDialog(null);
    showNotice(
      `${request.name} foi ${rejected ? 'reprovado' : 'removido'}.` +
        (notify
          ? ' O envio do e-mail depende da integração com o serviço.'
          : ' Nenhuma notificação será enviada.')
    );
  }

  function changeRegion(next: string) {
    setRegion(next);
    setExpanded([]);
    setAuditFilter('all');
  }

  const list = tab === 'pending' ? pending : approved;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
            <ShieldCheck aria-hidden="true" className="size-3.5" />
            Painel de moderação cadastral
          </p>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Aprovação e moderação de pontos
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Analise solicitações, acompanhe os pontos homologados e consulte o
            histórico de decisões do polo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className={SELECT_CLASS}>
            <MapPin aria-hidden="true" className="size-4 text-brand" />
            <span className="sr-only">Polo regional</span>
            <select
              value={region}
              onChange={(event) => changeRegion(event.target.value)}
              className="cursor-pointer bg-transparent font-medium outline-none"
            >
              {initialData.regions.map((option) => (
                <option key={option} value={option}>
                  Polo {option}
                </option>
              ))}
            </select>
          </label>

          {tab === 'pending' && (
            <button
              type="button"
              onClick={refreshQueue}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full bg-brand-solid px-4 text-sm font-semibold text-white transition-colors hover:bg-brand-solid-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <RefreshCw aria-hidden="true" className="size-4" />
              Atualizar fila
            </button>
          )}

          {tab === 'history' && (
            <label className={SELECT_CLASS}>
              <Filter aria-hidden="true" className="size-4 text-slate-500" />
              <span className="sr-only">Filtrar histórico por decisão</span>
              <select
                value={auditFilter}
                onChange={(event) =>
                  setAuditFilter(event.target.value as AuditFilter)
                }
                className="cursor-pointer bg-transparent outline-none"
              >
                {AUDIT_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
      </header>

      {tab === 'pending' && refreshedAt && (
        <p className="-mt-3 text-xs text-slate-500">
          Fila atualizada às {formatTime(refreshedAt)}.
        </p>
      )}

      <section
        aria-label="Indicadores mensais"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
      >
        <StatCard label="Homologações no mês" icon={CheckCircle2}>
          <MetricValue
            value={String(regionMetrics.approved)}
            note="Pontos aprovados neste mês"
          />
        </StatCard>
        <StatCard label="Reprovados no mês" icon={AlertTriangle}>
          <MetricValue
            value={String(regionMetrics.rejected)}
            note="Solicitações reprovadas neste mês"
          />
        </StatCard>
        <StatCard label="Qualidade cadastral" icon={ShieldCheck}>
          <MetricValue
            value={formatPercent(rate)}
            note="Taxa de aprovação no mês"
            comparison={`Mês passado: ${formatPercent(regionMetrics.previousApprovalRate)} (${formatChange(rate - regionMetrics.previousApprovalRate)} p.p.)`}
          />
        </StatCard>
      </section>

      <ModerationTabs tabs={tabs} active={tab} onChange={setTab} />

      <div role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)}>
        {tab === 'history' ? (
          <AuditHistory entries={visibleAudit} />
        ) : list.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-card px-6 py-14 text-center">
            <CheckCircle2
              aria-hidden="true"
              className="mx-auto size-9 text-brand"
            />
            <h2 className="mt-3 font-semibold text-slate-800">Tudo em dia</h2>
            <p className="mt-1 text-sm text-slate-500">
              Não há pontos{' '}
              {tab === 'pending' ? 'aguardando moderação' : 'homologados'} neste
              polo.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {list.map((request) => (
              <PointRequestCard
                key={request.id}
                request={request}
                now={now}
                expanded={expanded.includes(request.id)}
                onToggleDetails={() => toggleDetails(request.id)}
                onApprove={() => approve(request)}
                onReject={() => setDialog({ action: 'reject', request })}
                onRemove={() => setDialog({ action: 'remove', request })}
                onPreview={setPreview}
              />
            ))}
          </div>
        )}
      </div>

      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed right-5 bottom-5 z-40 max-w-[calc(100%-2.5rem)]"
      >
        {notice && (
          <p className="flex items-center gap-2 rounded-xl bg-brand-deep px-4 py-3 text-sm font-medium text-white shadow-xl">
            <Check aria-hidden="true" className="size-4 shrink-0" />
            {notice}
          </p>
        )}
      </div>

      {dialog && (
        <DecisionDialog
          action={dialog.action}
          pointName={dialog.request.name}
          onClose={() => setDialog(null)}
          onConfirm={confirmDecision}
        />
      )}
      {preview && (
        <AttachmentPreview
          attachment={preview}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

type MetricValueProps = {
  value: string;
  note: string;
  comparison?: string;
};

function MetricValue({ value, note, comparison }: MetricValueProps) {
  return (
    <div>
      <p className="text-3xl font-extrabold tracking-tight text-slate-800">
        {value}
      </p>
      <p className="mt-1 text-xs text-slate-500">{note}</p>
      {comparison && (
        <p className="mt-0.5 text-[11px] text-slate-500">{comparison}</p>
      )}
    </div>
  );
}
