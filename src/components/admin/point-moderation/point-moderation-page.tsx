'use client';

import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Filter,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  initialAuditEntries,
  initialMetrics,
  initialPoints,
  regions,
} from './mock-data';
import { TabButton } from './tab-button';
import { MetricCard } from './metric-card';
import { PointCard } from './point-card';
import { ActionDialog } from './decision-dialog';
import { AuditHistory } from './audit-history';
import { AttachmentPreview } from './attachment-preview';
import { formatDateTime } from './utils';
import type {
  ActionDialogState,
  ActionType,
  Attachment,
  CollectionPoint,
  Decision,
  ModerationTab,
  Region,
} from './types';

//responsável por exibir a página de moderação de pontos de coleta, incluindo métricas, lista de pontos pendentes, aprovados e histórico de auditoria
export default function PointsModerationPage() {
  const [selectedRegion, setSelectedRegion] = useState<Region>('Manhuaçu – MG');
  const [activeTab, setActiveTab] = useState<ModerationTab>('pending');
  const [points, setPoints] = useState(initialPoints);
  const [auditEntries, setAuditEntries] = useState(initialAuditEntries);
  const [metrics, setMetrics] = useState(initialMetrics);
  const [expandedPoints, setExpandedPoints] = useState<string[]>([]);
  const [auditFilter, setAuditFilter] = useState<'all' | Decision>('all');
  const [actionDialog, setActionDialog] = useState<ActionDialogState | null>(
    null
  );
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(
    null
  );
  const [notice, setNotice] = useState('');
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const regionPoints = useMemo(
    () => points.filter((point) => point.region === selectedRegion),
    [points, selectedRegion]
  );
  const pendingPoints = regionPoints.filter(
    (point) => point.status === 'pending'
  );
  const approvedPoints = regionPoints.filter(
    (point) => point.status === 'approved'
  );
  const visibleAuditEntries = auditEntries.filter(
    (entry) =>
      entry.region === selectedRegion &&
      (auditFilter === 'all' || entry.decision === auditFilter)
  );
  const regionMetric = metrics[selectedRegion];
  const approvalRate =
    regionMetric.approved + regionMetric.rejected === 0
      ? 0
      : Math.round(
          (regionMetric.approved /
            (regionMetric.approved + regionMetric.rejected)) *
            1000
        ) / 10;
  const formattedApprovalRate = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(approvalRate);
  const formattedPreviousApprovalRate = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
  }).format(regionMetric.previousMonthApprovalRate);
  const approvalRateChange =
    Math.round((approvalRate - regionMetric.previousMonthApprovalRate) * 10) /
    10;
  const formattedApprovalRateChange = new Intl.NumberFormat('pt-BR', {
    maximumFractionDigits: 1,
    signDisplay: 'always',
  }).format(approvalRateChange);

  function toggleDetails(pointId: string) {
    setExpandedPoints((current) =>
      current.includes(pointId)
        ? current.filter((id) => id !== pointId)
        : [...current, pointId]
    );
  }

  function refreshQueue() {
    setLastRefresh(new Date());
    setNotice('Fila atualizada com sucesso.');
    window.setTimeout(() => setNotice(''), 3500);
  }

  function confirmDecision() {
    if (!actionDialog) return;
    const { type, point, reason, customReason, notifyRequester } = actionDialog;
    const finalReason =
      reason === 'Outro motivo com parecer personalizado'
        ? customReason.trim()
        : reason;

    if (!finalReason) {
      setNotice('Informe o motivo para continuar.');
      return;
    }

    const decision: Decision = type === 'reject' ? 'Reprovado' : 'Removido';
    const { date, time } = formatDateTime(new Date());
    setPoints((current) =>
      current.map((item) =>
        item.id === point.id
          ? { ...item, status: type === 'reject' ? 'rejected' : 'removed' }
          : item
      )
    );
    setAuditEntries((current) => [
      {
        id: `audit-${Date.now()}`,
        protocol: point.protocol,
        establishment: point.name,
        region: point.region,
        decision,
        analyst: `Admin Geral (${selectedRegion.split(' – ')[0]})`,
        date,
        time,
        reason: finalReason,
      },
      ...current,
    ]);
    if (type === 'reject') {
      setMetrics((current) => ({
        ...current,
        [point.region]: {
          ...current[point.region],
          rejected: current[point.region].rejected + 1,
        },
      }));
    }
    setActionDialog(null);
    setNotice(
      type === 'reject'
        ? notifyRequester
          ? 'Reprovação registrada. O envio da notificação por e-mail depende da integração.'
          : 'Ponto reprovado e motivo registrado sem notificação por e-mail.'
        : notifyRequester
          ? 'Remoção registrada. O envio da notificação por e-mail depende da integração.'
          : 'Ponto removido e motivo registrado sem notificação por e-mail.'
    );
    window.setTimeout(() => setNotice(''), 3500);
  }

  function approvePoint(point: CollectionPoint) {
    const { date, time } = formatDateTime(new Date());
    setPoints((current) =>
      current.map((item) =>
        item.id === point.id ? { ...item, status: 'approved' } : item
      )
    );
    setAuditEntries((current) => [
      {
        id: `audit-${Date.now()}`,
        protocol: point.protocol,
        establishment: point.name,
        region: point.region,
        decision: 'Aprovado',
        analyst: `Admin Geral (${selectedRegion.split(' – ')[0]})`,
        date,
        time,
      },
      ...current,
    ]);
    setMetrics((current) => ({
      ...current,
      [point.region]: {
        ...current[point.region],
        approved: current[point.region].approved + 1,
      },
    }));
    setNotice('Ponto aprovado e publicado no mapa.');
    window.setTimeout(() => setNotice(''), 3500);
  }

  function openActionDialog(point: CollectionPoint, type: ActionType) {
    setActionDialog({
      type,
      point,
      reason: '',
      customReason: '',
      notifyRequester: true,
    });
  }

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-slate-200/70 bg-[#f4f7f8] text-[#1d2b28] dark:border-border dark:bg-background dark:text-foreground">
      <header className="flex min-h-[76px] flex-wrap items-center justify-between gap-3 border-b border-[#e2e9e6] bg-white px-4 py-3 sm:px-6 xl:px-8 dark:border-border dark:bg-card">
        <div className="flex items-center gap-2 text-xs font-medium text-[#65736c] dark:text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-[#347153] dark:text-brand" />
          <span className="hidden sm:inline">
            PAINEL DE MODERAÇÃO CADASTRAL
          </span>
          <span className="hidden text-[#b5c0ba] sm:inline dark:text-muted-foreground">
            •
          </span>
          <span>Auditoria de pontos</span>
        </div>
        <label className="flex h-10 items-center gap-2 rounded-full border border-[#e7ece9] bg-[#fbfcfb] px-3 text-xs text-[#33473b] dark:border-border dark:bg-background dark:text-foreground">
          <MapPin className="h-4 w-4 text-[#347153] dark:text-brand" />
          <span className="sr-only">Polo regional</span>
          <select
            value={selectedRegion}
            onChange={(event) => {
              setSelectedRegion(event.target.value as Region);
              setExpandedPoints([]);
              setAuditFilter('all');
            }}
            className="max-w-[190px] cursor-pointer bg-transparent font-medium outline-none dark:[color-scheme:dark]"
          >
            {regions.map((region) => (
              <option
                key={region}
                value={region}
                className="bg-white text-[#33473b] dark:bg-[#18211c] dark:text-[#e9efeb]"
              >
                Polo Regional {region}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-[#7b8981]" />
        </label>
      </header>

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold text-[#60816f] dark:text-brand">
              Gestão municipal{' '}
              <span className="px-1 text-[#bdc9c1] dark:text-muted-foreground">
                /
              </span>{' '}
              Pontos de coleta
            </p>
            <h1 className="text-3xl font-bold tracking-[-0.04em] text-[#17231e] sm:text-[38px] dark:text-foreground">
              Aprovação e moderação
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[#69766f] dark:text-muted-foreground">
              Analise solicitações, acompanhe os pontos homologados e consulte o
              histórico de decisões do polo.
            </p>
          </div>
          {activeTab === 'pending' && (
            <div className="flex flex-wrap items-center gap-3">
              {lastRefresh && (
                <span className="text-xs text-[#7c8982] dark:text-muted-foreground">
                  Atualizada às{' '}
                  {new Intl.DateTimeFormat('pt-BR', {
                    timeStyle: 'short',
                  }).format(lastRefresh)}
                </span>
              )}
              <button
                type="button"
                onClick={refreshQueue}
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#2f664d] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#28573f] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#347153]"
              >
                <RefreshCw className="h-4 w-4" />
                Atualizar fila
              </button>
            </div>
          )}
          {activeTab === 'history' && (
            <label className="flex h-10 items-center gap-2 self-start rounded-lg border border-[#dde6e1] bg-white px-3 text-sm text-[#42554a] xl:self-auto dark:border-border dark:bg-card dark:text-foreground">
              <Filter className="h-4 w-4 text-[#698071] dark:text-muted-foreground" />
              <span className="sr-only">Filtrar histórico por decisão</span>
              <select
                value={auditFilter}
                onChange={(event) =>
                  setAuditFilter(event.target.value as 'all' | Decision)
                }
                className="cursor-pointer bg-transparent outline-none dark:[color-scheme:dark]"
              >
                <option
                  value="all"
                  className="bg-white text-[#33473b] dark:bg-[#18211c] dark:text-[#e9efeb]"
                >
                  Todas as decisões
                </option>
                <option
                  value="Aprovado"
                  className="bg-white text-[#33473b] dark:bg-[#18211c] dark:text-[#e9efeb]"
                >
                  Aprovados
                </option>
                <option
                  value="Reprovado"
                  className="bg-white text-[#33473b] dark:bg-[#18211c] dark:text-[#e9efeb]"
                >
                  Reprovados
                </option>
                <option
                  value="Removido"
                  className="bg-white text-[#33473b] dark:bg-[#18211c] dark:text-[#e9efeb]"
                >
                  Removidos
                </option>
              </select>
              <ChevronDown className="h-3.5 w-3.5 text-[#7b8981]" />
            </label>
          )}
        </div>

        <section
          aria-label="Indicadores mensais"
          className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
          <MetricCard
            icon={CheckCircle2}
            label="Homologações no mês"
            value={regionMetric.approved}
            note="Pontos aprovados neste mês"
            color="green"
          />
          <MetricCard
            icon={AlertTriangle}
            label="Rejeitados no mês"
            value={regionMetric.rejected}
            note="Solicitações reprovadas neste mês"
            color="red"
          />
          <MetricCard
            icon={ShieldCheck}
            label="Qualidade cadastral"
            value={`${formattedApprovalRate}%`}
            note="Taxa de aprovação mensal"
            comparison={`Mês passado: ${formattedPreviousApprovalRate}% (${formattedApprovalRateChange} pontos percentuais)`}
            color="blue"
          />
        </section>

        <div className="mb-5 flex flex-wrap gap-2 rounded-xl border border-[#e7ece9] bg-white p-1.5 dark:border-border dark:bg-card">
          <TabButton
            active={activeTab === 'pending'}
            onClick={() => setActiveTab('pending')}
            icon={<Clock3 className="h-4 w-4" />}
            label="Aguardando moderação"
            count={pendingPoints.length}
          />
          <TabButton
            active={activeTab === 'history'}
            onClick={() => setActiveTab('history')}
            icon={<ClipboardList className="h-4 w-4" />}
            label="Histórico de decisões & auditoria"
          />
          <TabButton
            active={activeTab === 'approved'}
            onClick={() => setActiveTab('approved')}
            icon={<MapPin className="h-4 w-4" />}
            label="Pontos já homologados"
            count={approvedPoints.length}
          />
        </div>

        {activeTab !== 'history' ? (
          <section
            aria-label={
              activeTab === 'pending'
                ? 'Pontos aguardando moderação'
                : 'Pontos homologados'
            }
            className="space-y-4"
          >
            {(activeTab === 'pending' ? pendingPoints : approvedPoints)
              .length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d5dfd9] bg-white px-6 py-14 text-center dark:border-border dark:bg-card">
                <CheckCircle2 className="mx-auto h-9 w-9 text-[#77a38b] dark:text-brand" />
                <h2 className="mt-3 font-semibold text-[#344a3d] dark:text-foreground">
                  Tudo em dia
                </h2>
                <p className="mt-1 text-sm text-[#7c8982] dark:text-muted-foreground">
                  Não há pontos{' '}
                  {activeTab === 'pending'
                    ? 'aguardando moderação'
                    : 'homologados'}{' '}
                  neste polo.
                </p>
              </div>
            ) : (
              (activeTab === 'pending' ? pendingPoints : approvedPoints).map(
                (point) => (
                  <PointCard
                    key={point.id}
                    point={point}
                    expanded={expandedPoints.includes(point.id)}
                    onToggleDetails={() => toggleDetails(point.id)}
                    onApprove={() => approvePoint(point)}
                    onReject={() => openActionDialog(point, 'reject')}
                    onRemove={() => openActionDialog(point, 'remove')}
                    onPreview={setPreviewAttachment}
                    approved={activeTab === 'approved'}
                  />
                )
              )
            )}
          </section>
        ) : (
          <AuditHistory entries={visibleAuditEntries} />
        )}

        {notice && (
          <div
            role="status"
            className="fixed bottom-5 right-5 z-40 flex max-w-[calc(100%-2.5rem)] items-center gap-2 rounded-xl bg-[#244f3a] px-4 py-3 text-sm font-medium text-white shadow-xl"
          >
            <Check className="h-4 w-4 shrink-0" />
            {notice}
          </div>
        )}
      </main>

      {actionDialog && (
        <ActionDialog
          state={actionDialog}
          onChange={setActionDialog}
          onClose={() => setActionDialog(null)}
          onConfirm={confirmDecision}
        />
      )}
      {previewAttachment && (
        <AttachmentPreview
          attachment={previewAttachment}
          onClose={() => setPreviewAttachment(null)}
        />
      )}
    </div>
  );
}
