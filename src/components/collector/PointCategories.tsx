'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  CircleCheck,
  Clock3,
  Loader2,
  PauseCircle,
  Pencil,
  ShieldCheck,
} from 'lucide-react';
import { CategoryReviewHistory } from '@/components/categories/CategoryReviewHistory';
import { FIELD_CLASS, LABEL_CLASS } from '@/components/point/fieldStyles';
import { SectionCard } from '@/components/point/SectionCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import {
  PointCategoryApiError,
  categoryLabels,
  listCategoryReviews,
  listMyPoints,
  listWasteCategories,
  updatePointCategories,
} from '@/services/pointCategories';
import type {
  CategoryReviewEntry,
  CollectorPoint,
  PointCategoryLink,
  WasteCategoryOption,
} from '@/types/pointCategories';

const HISTORY_LIMIT = 5;

const HEADING_CLASS =
  'text-[11px] font-bold tracking-wider text-slate-400 uppercase';

type Feedback = { tone: 'success' | 'error'; text: string };

type HistoryState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; entries: CategoryReviewEntry[] };

function plural(count: number, one: string, many: string) {
  return `${count} ${count === 1 ? one : many}`;
}

function errorMessage(cause: unknown) {
  return cause instanceof PointCategoryApiError
    ? cause.message
    : 'Não foi possível concluir. Tente novamente.';
}

export function PointCategories() {
  const { token, logout } = useAuth();
  const [points, setPoints] = useState<CollectorPoint[]>([]);
  const [pointId, setPointId] = useState<string | null>(null);
  const [options, setOptions] = useState<WasteCategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState>({ status: 'loading' });
  const [editing, setEditing] = useState(false);
  const [selection, setSelection] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleError = useCallback(
    (cause: unknown) => {
      if (cause instanceof PointCategoryApiError && cause.status === 401) {
        logout();
      }
      return errorMessage(cause);
    },
    [logout]
  );

  useEffect(() => {
    if (!token) return;
    let active = true;

    Promise.all([listMyPoints(token), listWasteCategories().catch(() => [])])
      .then(([mine, categories]) => {
        if (!active) return;
        setPoints(mine);
        setOptions(categories);
        setPointId((current) =>
          mine.some((point) => point.id === current)
            ? current
            : (mine[0]?.id ?? null)
        );
        setLoadError(null);
      })
      .catch((cause: unknown) => {
        if (active) setLoadError(handleError(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, handleError, reloadKey]);

  useEffect(() => {
    if (!token || !pointId) return;
    let active = true;

    listCategoryReviews(token, pointId)
      .then((entries) => {
        if (active) setHistory({ status: 'ready', entries });
      })
      .catch((cause: unknown) => {
        if (active) {
          setHistory({ status: 'error', message: handleError(cause) });
        }
      });

    return () => {
      active = false;
    };
  }, [token, pointId, handleError, reloadKey]);

  const labelOf = useMemo(() => categoryLabels(options), [options]);
  const point = points.find((item) => item.id === pointId) ?? null;
  const approved = point?.categories.filter(
    (link) => link.approvalStatus === 'APPROVED'
  );
  const pending = point?.categories.filter(
    (link) => link.approvalStatus === 'PENDING'
  );

  const knownCodes = new Set(options.map((option) => option.code));
  const choices: WasteCategoryOption[] = [
    ...options,
    ...(point?.categories ?? [])
      .filter((link) => !knownCodes.has(link.code))
      .map((link) => ({
        id: link.categoryId,
        code: link.code,
        label: link.code,
      })),
  ];

  function reload() {
    setLoading(true);
    setLoadError(null);
    setFeedback(null);
    setHistory({ status: 'loading' });
    setReloadKey((key) => key + 1);
  }

  function changePoint(id: string) {
    setPointId(id);
    setEditing(false);
    setFeedback(null);
    setHistory({ status: 'loading' });
  }

  function startEditing() {
    if (!point) return;
    setSelection(point.categories.map((link) => link.code));
    setFeedback(null);
    setEditing(true);
  }

  function toggle(code: string) {
    setSelection((current) =>
      current.includes(code)
        ? current.filter((item) => item !== code)
        : [...current, code]
    );
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!token || !point) return;

    const keepsApproved = point.categories.some(
      (link) =>
        link.approvalStatus === 'APPROVED' && selection.includes(link.code)
    );
    if (selection.length === 0 || !keepsApproved) {
      setFeedback({
        tone: 'error',
        text: 'Mantenha ao menos uma categoria já aprovada. Novas categorias só entram depois da análise.',
      });
      return;
    }

    const before = new Set(point.categories.map((link) => link.code));
    const added = selection.filter((code) => !before.has(code)).length;
    const removed = point.categories.filter(
      (link) => !selection.includes(link.code)
    ).length;

    if (added === 0 && removed === 0) {
      setEditing(false);
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const links: PointCategoryLink[] = await updatePointCategories(
        token,
        point.id,
        selection
      );
      setPoints((current) =>
        current.map((item) =>
          item.id === point.id ? { ...item, categories: links } : item
        )
      );
      setEditing(false);

      const parts = [];
      if (added > 0) {
        parts.push(
          `${plural(added, 'categoria enviada', 'categorias enviadas')} para análise`
        );
      }
      if (removed > 0) {
        parts.push(
          plural(removed, 'categoria removida', 'categorias removidas')
        );
      }
      setFeedback({ tone: 'success', text: `${parts.join(' e ')}.` });
    } catch (cause) {
      setFeedback({ tone: 'error', text: handleError(cause) });
    } finally {
      setSaving(false);
    }
  }

  const description = loading
    ? 'Carregando…'
    : approved
      ? `${approved.length} ${approved.length === 1 ? 'ativa' : 'ativas'}${
          pending && pending.length > 0 ? ` · ${pending.length} em análise` : ''
        }`
      : undefined;

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.categories}
      title="Categorias no ponto"
      description={description}
      icon={ShieldCheck}
    >
      {loading ? (
        <div className="space-y-2" aria-busy="true">
          <div className="h-8 animate-pulse rounded-full bg-slate-100" />
          <div className="h-16 animate-pulse rounded-xl bg-slate-100" />
          <span className="sr-only">Carregando categorias…</span>
        </div>
      ) : loadError ? (
        <div
          role="alert"
          className="space-y-3 text-sm text-red-700 dark:text-red-300"
        >
          <p>{loadError}</p>
          <Button variant="outline" onClick={reload}>
            Tentar novamente
          </Button>
        </div>
      ) : !point ? (
        <p className="text-sm text-slate-500">
          Você ainda não tem um ponto de coleta cadastrado.
        </p>
      ) : (
        <div className="space-y-5">
          {points.length > 1 && (
            <label className={LABEL_CLASS}>
              Ponto de coleta
              <select
                value={point.id}
                onChange={(event) => changePoint(event.target.value)}
                className={FIELD_CLASS}
              >
                {points.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          {editing ? (
            <form onSubmit={save} noValidate className="space-y-4">
              <fieldset>
                <legend className={HEADING_CLASS}>Materiais aceitos</legend>
                <p className="mt-1 text-xs text-slate-500">
                  Categorias novas ficam em análise e só aparecem no mapa depois
                  da aprovação. Desmarcar remove na hora.
                </p>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                  {choices.map((option) => {
                    const link = point.categories.find(
                      (item) => item.code === option.code
                    );
                    return (
                      <li key={option.code}>
                        <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 has-[:checked]:border-brand has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-brand">
                          <input
                            type="checkbox"
                            checked={selection.includes(option.code)}
                            onChange={() => toggle(option.code)}
                            className="size-4 accent-brand-solid"
                          />
                          <span className="flex-1">{option.label}</span>
                          {link?.approvalStatus === 'PENDING' && (
                            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                              em análise
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>

              <div className="flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditing(false);
                    setFeedback(null);
                  }}
                  disabled={saving}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && (
                    <Loader2 aria-hidden="true" className="animate-spin" />
                  )}
                  Salvar categorias
                </Button>
              </div>
            </form>
          ) : (
            <>
              <div>
                <h3 className={HEADING_CLASS}>Autorizadas no mapa</h3>
                {approved && approved.length > 0 ? (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {approved.map((link) => (
                      <li
                        key={link.categoryId}
                        className="flex items-center gap-1 rounded-full border border-brand-light bg-surface-alt px-2.5 py-1 text-xs font-semibold text-brand-dark"
                      >
                        {link.isAccepting ? (
                          <CircleCheck
                            aria-hidden="true"
                            className="size-3 text-brand"
                          />
                        ) : (
                          <PauseCircle
                            aria-hidden="true"
                            className="size-3 text-slate-500"
                          />
                        )}
                        {labelOf(link.code)}
                        {!link.isAccepting && (
                          <span className="font-medium text-slate-500">
                            (pausada)
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    Nenhuma categoria aprovada.
                  </p>
                )}
              </div>

              {pending && pending.length > 0 && (
                <div className="border-t border-slate-100 pt-4">
                  <h3 className={HEADING_CLASS}>Aguardando aprovação</h3>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {pending.map((link) => (
                      <li
                        key={link.categoryId}
                        className="flex items-center gap-1 rounded-full border border-amber-200/80 bg-amber-50/60 px-2.5 py-1 text-xs font-semibold text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-200"
                      >
                        <Clock3 aria-hidden="true" className="size-3" />
                        {labelOf(link.code)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-xs text-slate-500">
                    Até a decisão da moderação, elas não aparecem no mapa nem
                    recebem descartes.
                  </p>
                </div>
              )}

              <Button variant="outline" onClick={startEditing}>
                <Pencil aria-hidden="true" />
                Alterar categorias
              </Button>
            </>
          )}

          {feedback && (
            <p
              role={feedback.tone === 'error' ? 'alert' : 'status'}
              className={
                feedback.tone === 'error'
                  ? 'text-sm font-medium text-red-700 dark:text-red-300'
                  : 'text-sm font-medium text-brand'
              }
            >
              {feedback.text}
            </p>
          )}

          <div className="border-t border-slate-100 pt-4">
            <h3 className={HEADING_CLASS}>Decisões da moderação</h3>
            <div className="mt-2">
              {history.status === 'loading' ? (
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2
                    aria-hidden="true"
                    className="size-3.5 animate-spin"
                  />
                  Carregando histórico…
                </p>
              ) : history.status === 'error' ? (
                <p
                  role="alert"
                  className="text-xs text-red-700 dark:text-red-300"
                >
                  {history.message}
                </p>
              ) : (
                <CategoryReviewHistory
                  entries={history.entries.slice(0, HISTORY_LIMIT)}
                  labelOf={labelOf}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
