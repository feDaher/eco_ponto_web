'use client';

import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  History,
  Loader2,
  MapPin,
  RefreshCw,
  X,
} from 'lucide-react';
import { CategoryReviewHistory } from '@/components/categories/CategoryReviewHistory';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import {
  PointCategoryApiError,
  listCategoryReviews,
  reviewPointCategory,
} from '@/services/pointCategories';
import type {
  CategoryDecision,
  CategoryReviewEntry,
  PendingCategoryRequest,
} from '@/types/pointCategories';
import { DecisionDialog } from './DecisionDialog';
import {
  requestKey,
  type PendingCategoriesState,
} from './usePendingCategories';

type HistoryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; entries: CategoryReviewEntry[] };

type PointGroup = {
  pointId: string;
  pointName: string;
  items: PendingCategoryRequest[];
};

type CategoryRequestsProps = {
  state: PendingCategoriesState;
  onNotice: (message: string) => void;
};

function groupByPoint(requests: PendingCategoryRequest[]): PointGroup[] {
  const groups = new Map<string, PointGroup>();
  for (const request of requests) {
    const group = groups.get(request.pointId) ?? {
      pointId: request.pointId,
      pointName: request.pointName,
      items: [],
    };
    group.items.push(request);
    groups.set(request.pointId, group);
  }
  return [...groups.values()].sort((a, b) =>
    a.pointName.localeCompare(b.pointName, 'pt-BR')
  );
}

export function CategoryRequests({ state, onNotice }: CategoryRequestsProps) {
  const {
    token,
    requests,
    labelOf,
    loading,
    error,
    reload,
    remove,
    handleError,
  } = state;
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<PendingCategoryRequest | null>(
    null
  );
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [openHistory, setOpenHistory] = useState<string[]>([]);
  const [history, setHistory] = useState<Record<string, HistoryState>>({});

  const groups = groupByPoint(requests);

  async function loadHistory(pointId: string) {
    if (!token) return;
    setHistory((current) => ({ ...current, [pointId]: { status: 'loading' } }));
    try {
      const entries = await listCategoryReviews(token, pointId);
      setHistory((current) => ({
        ...current,
        [pointId]: { status: 'ready', entries },
      }));
    } catch (cause) {
      setHistory((current) => ({
        ...current,
        [pointId]: { status: 'error', message: handleError(cause) },
      }));
    }
  }

  function toggleHistory(pointId: string) {
    const isOpen = openHistory.includes(pointId);
    setOpenHistory((current) =>
      isOpen ? current.filter((id) => id !== pointId) : [...current, pointId]
    );
    if (!isOpen && history[pointId]?.status !== 'ready') {
      void loadHistory(pointId);
    }
  }

  async function decide(
    request: PendingCategoryRequest,
    decision: CategoryDecision,
    reason?: string
  ) {
    if (!token) return;
    const label = labelOf(request.code);
    setBusyKey(requestKey(request));
    setActionError(null);
    setDialogError(null);

    try {
      await reviewPointCategory(
        token,
        request.pointId,
        request.categoryId,
        decision,
        reason
      );
      remove(request);
      setRejecting(null);
      if (openHistory.includes(request.pointId)) {
        void loadHistory(request.pointId);
      } else {
        setHistory((current) => {
          const next = { ...current };
          delete next[request.pointId];
          return next;
        });
      }
      onNotice(
        decision === 'APPROVED'
          ? `${label} aprovada em ${request.pointName}. Já aparece no mapa.`
          : `${label} rejeitada em ${request.pointName}. O coletor verá o motivo no histórico.`
      );
    } catch (cause) {
      const message = handleError(cause);
      if (
        cause instanceof PointCategoryApiError &&
        (cause.status === 404 || cause.status === 409)
      ) {
        setRejecting(null);
        setActionError(message);
        reload();
      } else if (decision === 'REJECTED') {
        setDialogError(message);
      } else {
        setActionError(message);
      }
    } finally {
      setBusyKey(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="max-w-2xl text-sm text-slate-600">
          Categorias que coletores adicionaram a pontos já homologados (todos os
          polos). Até a decisão, elas não aparecem no mapa e não recebem
          descartes.
        </p>
        <Button variant="outline" onClick={reload} disabled={loading}>
          <RefreshCw
            aria-hidden="true"
            className={cn(loading && 'animate-spin')}
          />
          Atualizar lista
        </Button>
      </div>

      {actionError && (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          {actionError}
        </p>
      )}

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {[1, 2].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-card"
            />
          ))}
          <span className="sr-only">Carregando categorias pendentes…</span>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <p>{error}</p>
          <Button variant="outline" onClick={reload} className="mt-4">
            Tentar novamente
          </Button>
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-card px-6 py-14 text-center">
          <CheckCircle2
            aria-hidden="true"
            className="mx-auto size-9 text-brand"
          />
          <h2 className="mt-3 font-semibold text-slate-800">Tudo em dia</h2>
          <p className="mt-1 text-sm text-slate-500">
            Nenhuma categoria aguardando aprovação.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => {
            const isOpen = openHistory.includes(group.pointId);
            const pointHistory = history[group.pointId];
            const historyId = `category-history-${group.pointId}`;

            return (
              <article
                key={group.pointId}
                className="rounded-2xl border border-slate-200/80 bg-card p-4 shadow-xs sm:p-5"
              >
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 font-semibold text-slate-900">
                    <MapPin aria-hidden="true" className="size-4 text-brand" />
                    {group.pointName}
                  </h2>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                    {group.items.length}{' '}
                    {group.items.length === 1 ? 'pendente' : 'pendentes'}
                  </span>
                </header>

                <ul className="mt-3 divide-y divide-slate-100">
                  {group.items.map((request) => {
                    const key = requestKey(request);
                    const busy = busyKey === key;
                    const label = labelOf(request.code);

                    return (
                      <li
                        key={key}
                        className="flex flex-wrap items-center justify-between gap-3 py-3"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800">{label}</p>
                          {label !== request.code && (
                            <p className="text-xs text-slate-500">
                              {request.code}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => void decide(request, 'APPROVED')}
                            disabled={busyKey !== null}
                            aria-label={`Aprovar ${label} em ${group.pointName}`}
                          >
                            {busy ? (
                              <Loader2
                                aria-hidden="true"
                                className="animate-spin"
                              />
                            ) : (
                              <Check aria-hidden="true" />
                            )}
                            Aprovar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setDialogError(null);
                              setRejecting(request);
                            }}
                            disabled={busyKey !== null}
                            aria-label={`Rejeitar ${label} em ${group.pointName}`}
                          >
                            <X aria-hidden="true" />
                            Rejeitar
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <button
                  type="button"
                  onClick={() => toggleHistory(group.pointId)}
                  aria-expanded={isOpen}
                  aria-controls={historyId}
                  className="mt-2 inline-flex cursor-pointer items-center gap-1.5 rounded-md text-xs font-semibold text-brand-dark hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                >
                  <History aria-hidden="true" className="size-3.5" />
                  Histórico de decisões do ponto
                  <ChevronDown
                    aria-hidden="true"
                    className={cn(
                      'size-3.5 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                  />
                </button>

                {isOpen && (
                  <div id={historyId} className="mt-3">
                    {!pointHistory || pointHistory.status === 'loading' ? (
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Loader2
                          aria-hidden="true"
                          className="size-3.5 animate-spin"
                        />
                        Carregando histórico…
                      </p>
                    ) : pointHistory.status === 'error' ? (
                      <p
                        role="alert"
                        className="text-xs text-red-700 dark:text-red-300"
                      >
                        {pointHistory.message}
                      </p>
                    ) : (
                      <CategoryReviewHistory
                        entries={pointHistory.entries}
                        labelOf={labelOf}
                      />
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {rejecting && (
        <DecisionDialog
          action="rejectCategory"
          pointName={`${labelOf(rejecting.code)} · ${rejecting.pointName}`}
          busy={busyKey !== null}
          error={dialogError}
          onClose={() => setRejecting(null)}
          onConfirm={({ reason }) => void decide(rejecting, 'REJECTED', reason)}
        />
      )}
    </div>
  );
}
