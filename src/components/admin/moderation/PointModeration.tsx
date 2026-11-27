'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Check,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Tags,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';
import { formatTime } from '@/lib/moderation';
import { toPointRequest } from '@/lib/moderationAdapter';
import {
  getPendingPoints,
  approvePoint,
  rejectPoint,
  ModerationError,
} from '@/services/moderation';

import type { Attachment, PointRequest } from '@/types/api';

import { AttachmentPreview } from './AttachmentPreview';
import { CategoryRequests } from './CategoryRequests';

import { DecisionDialog, type DecisionResult } from './DecisionDialog';

import { ModerationTabs, panelId, tabId, type TabItem } from './ModerationTabs';

import { PointRequestCard } from './PointRequestCard';
import { usePendingCategories } from './usePendingCategories';

type Tab = 'pending' | 'categories' | 'history' | 'approved';

const NOTICE_MS = 3500;

const SELECT_CLASS =
  'flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-card px-3 text-sm text-slate-700 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand';

export function PointModeration() {
  const { token, logout, status } = useAuth();

  const [reloadKey, setReloadKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [decisionError, setDecisionError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [region, setRegion] = useState('all');
  const [tab, setTab] = useState<Tab>('pending');
  const [requests, setRequests] = useState<PointRequest[]>([]);
  const [expanded, setExpanded] = useState<string[]>([]);

  const [dialog, setDialog] = useState<{
    request: PointRequest;
  } | null>(null);

  const [preview, setPreview] = useState<Attachment | null>(null);
  const [notice, setNotice] = useState('');
  const [refreshedAt, setRefreshedAt] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const noticeTimer = useRef<number | undefined>(undefined);
  const decisionLock = useRef(false);
  const pendingCategories = usePendingCategories();

  useEffect(() => () => window.clearTimeout(noticeTimer.current), []);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function loadPendingPoints(authToken: string) {
      setLoading(true);
      setError('');

      try {
        const data = await getPendingPoints(authToken);

        if (cancelled) return;

        setRequests(data.map(toPointRequest));
        setRefreshedAt(new Date().toISOString());
        setNow(Date.now());
      } catch (err) {
        if (cancelled) return;

        if (err instanceof ModerationError && err.status === 401) {
          logout();
          return;
        }

        setError(
          err instanceof ModerationError
            ? err.message
            : 'Não foi possível carregar as solicitações.'
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadPendingPoints(token);

    return () => {
      cancelled = true;
    };
  }, [token, logout, reloadKey]);

  const regions = [...new Set(requests.map((request) => request.city))].sort();

  const selectedRegion = regions.includes(region) ? region : 'all';

  const pending = requests.filter(
    (request) =>
      request.status === 'pending' &&
      (selectedRegion === 'all' || request.city === selectedRegion)
  );

  const tabs: TabItem<Tab>[] = [
    {
      id: 'pending',
      label: 'Aguardando moderação',
      icon: Clock3,
      count: loading || error ? undefined : pending.length,
    },
    {
      id: 'categories',
      label: 'Categorias solicitadas',
      icon: Tags,
      count: pendingCategories.loading
        ? undefined
        : pendingCategories.requests.length,
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
    if (loading || submitting) return;

    setLoading(true);
    setDecisionError('');
    setReloadKey((current) => current + 1);
  }

  function changeRegion(next: string) {
    setRegion(next);
    setExpanded([]);
  }

  function handleDecisionError(err: unknown, fallback: string) {
    if (err instanceof ModerationError && err.status === 401) {
      logout();
      return;
    }

    setDecisionError(err instanceof ModerationError ? err.message : fallback);
  }

  function finishDecision(id: string) {
    setRequests((current) => current.filter((request) => request.id !== id));

    setExpanded((current) => current.filter((item) => item !== id));

    setLoading(true);
    setReloadKey((current) => current + 1);
  }

  async function approve(request: PointRequest) {
    if (!token || loading || decisionLock.current) return;

    decisionLock.current = true;
    setSubmitting(true);
    setDecisionError('');

    try {
      await approvePoint(request.id, token);

      finishDecision(request.id);

      showNotice(`${request.name} foi aprovado com sucesso.`);
    } catch (err) {
      handleDecisionError(err, 'Não foi possível aprovar o ponto.');
    } finally {
      decisionLock.current = false;
      setSubmitting(false);
    }
  }

  async function confirmDecision({ reason }: DecisionResult) {
    if (!dialog || !token || decisionLock.current) return;

    if (!reason.trim()) {
      setDecisionError('Informe o motivo da reprovação.');
      return;
    }

    const request = dialog.request;

    decisionLock.current = true;
    setSubmitting(true);
    setDecisionError('');

    try {
      await rejectPoint(request.id, token, reason);

      finishDecision(request.id);
      setDialog(null);

      showNotice(`${request.name} foi reprovado com sucesso.`);
    } catch (err) {
      handleDecisionError(err, 'Não foi possível reprovar o ponto.');
    } finally {
      decisionLock.current = false;
      setSubmitting(false);
    }
  }

  if (status === 'loading') {
    return <p role="status">Carregando sessão...</p>;
  }

  if (!token) {
    return <p role="alert">Entre na sua conta para acessar a moderação.</p>;
  }

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
            Analise as solicitações de pontos de coleta.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {tab === 'pending' && (
            <>
              <label className={SELECT_CLASS}>
                <MapPin aria-hidden="true" className="size-4 text-brand" />

                <span className="sr-only">Polo regional</span>

                <select
                  value={selectedRegion}
                  onChange={(event) => changeRegion(event.target.value)}
                  className="cursor-pointer bg-transparent font-medium outline-none"
                >
                  <option value="all">Todas as regiões</option>

                  {regions.map((option) => (
                    <option key={option} value={option}>
                      Polo {option}
                    </option>
                  ))}
                </select>
              </label>

              <button
                type="button"
                onClick={refreshQueue}
                disabled={loading || submitting}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-brand-solid px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  aria-hidden="true"
                  className={`size-4 ${loading ? 'animate-spin' : ''}`}
                />
                Atualizar fila
              </button>
            </>
          )}
        </div>
      </header>

      {tab === 'pending' && refreshedAt && (
        <p className="text-xs text-slate-500">
          Fila atualizada às {formatTime(refreshedAt)}.
        </p>
      )}

      {decisionError && !dialog && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {decisionError}
        </div>
      )}

      {submitting && (
        <p role="status" className="text-sm text-slate-500">
          Registrando decisão...
        </p>
      )}

      <ModerationTabs tabs={tabs} active={tab} onChange={setTab} />

      <div role="tabpanel" id={panelId(tab)} aria-labelledby={tabId(tab)}>
        {tab === 'categories' ? (
          <CategoryRequests state={pendingCategories} onNotice={showNotice} />
        ) : tab === 'history' ? (
          <div className="rounded-2xl border border-slate-200 bg-card p-6">
            <h2 className="font-semibold text-slate-800">
              Histórico de decisões
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              O histórico completo depende da integração com a API de auditoria.
            </p>
          </div>
        ) : tab === 'approved' ? (
          <div className="rounded-2xl border border-slate-200 bg-card p-6">
            <h2 className="font-semibold text-slate-800">Pontos homologados</h2>

            <p className="mt-2 text-sm text-slate-500">
              A consulta de pontos homologados ainda precisa ser integrada.
            </p>
          </div>
        ) : loading ? (
          <div
            role="status"
            className="rounded-xl border border-slate-200 bg-card p-6 text-sm"
          >
            Carregando solicitações...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}

            <button
              type="button"
              onClick={refreshQueue}
              className="ml-3 font-semibold underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : pending.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-card px-6 py-14 text-center">
            <CheckCircle2
              aria-hidden="true"
              className="mx-auto size-9 text-brand"
            />

            <h2 className="mt-3 font-semibold text-slate-800">Tudo em dia</h2>

            <p className="mt-1 text-sm text-slate-500">
              Não há pontos aguardando moderação nesta região.
            </p>
          </div>
        ) : (
          <div
            className={`space-y-4 ${
              submitting ? 'pointer-events-none opacity-60' : ''
            }`}
            inert={submitting}
          >
            {pending.map((request) => (
              <PointRequestCard
                key={request.id}
                request={request}
                now={now}
                expanded={expanded.includes(request.id)}
                onToggleDetails={() => toggleDetails(request.id)}
                onApprove={() => void approve(request)}
                onReject={() => {
                  setDecisionError('');
                  setDialog({ request });
                }}
                onRemove={() =>
                  showNotice('A remoção ainda não está disponível.')
                }
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
          action="reject"
          pointName={dialog.request.name}
          busy={submitting}
          error={decisionError}
          onClose={() => {
            if (!decisionLock.current) {
              setDialog(null);
            }
          }}
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
