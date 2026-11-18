'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Globe,
  Loader2,
  MapPin,
  MessageSquare,
  RefreshCw,
  Search,
  Trash2,
} from 'lucide-react';
import {
  ModerationTabs,
  panelId,
  tabId,
  type TabItem,
} from '@/components/admin/moderation/ModerationTabs';
import { FIELD_CLASS } from '@/components/point/fieldStyles';
import { StarRating } from '@/components/point/StarRating';
import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/StatCard';
import { useAuth } from '@/context/AuthContext';
import { formatDate } from '@/lib/points';
import { cn } from '@/lib/utils';
import {
  ReviewApiError,
  deleteReview,
  listModerationReviews,
  setReviewHidden,
} from '@/services/reviews';
import type { ModerationReview } from '@/types/api';

type VisibilityTab = 'all' | 'visible' | 'hidden';
type RatingFilter = 'all' | 'low' | 'mid' | 'high';
type Feedback = { tone: 'success' | 'error'; text: string };

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: 'all', label: 'Todas as notas' },
  { value: 'low', label: '1 estrela' },
  { value: 'mid', label: '2 estrelas' },
  { value: 'high', label: '3 a 5 estrelas' },
];

const PAGE_SIZE = 5;

function matchesRating(rating: number, filter: RatingFilter) {
  if (filter === 'low') return rating === 1;
  if (filter === 'mid') return rating === 2;
  if (filter === 'high') return rating >= 3;
  return true;
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

function errorMessage(error: unknown) {
  return error instanceof ReviewApiError
    ? error.message
    : 'Não foi possível concluir. Tente novamente.';
}

export function ReviewModeration() {
  const { token, logout } = useAuth();
  const [reviews, setReviews] = useState<ModerationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<VisibilityTab>('all');
  const [query, setQuery] = useState('');
  const [rating, setRating] = useState<RatingFilter>('all');
  const [page, setPage] = useState(1);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof ReviewApiError && error.status === 401) logout();
      return errorMessage(error);
    },
    [logout]
  );

  useEffect(() => {
    if (!token) return;
    let active = true;

    listModerationReviews(token)
      .then((items) => {
        if (!active) return;
        setReviews(items);
        setLoadError(null);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(handleError(error));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, handleError, reloadKey]);

  function reload() {
    setLoading(true);
    setLoadError(null);
    setFeedback(null);
    setReloadKey((key) => key + 1);
  }

  const visibleCount = reviews.filter((review) => !review.isHidden).length;
  const hiddenCount = reviews.length - visibleCount;
  const average =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        )
          .toFixed(1)
          .replace('.', ',')
      : '–';

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return reviews.filter(
      (review) =>
        (tab === 'all' || review.isHidden === (tab === 'hidden')) &&
        matchesRating(review.rating, rating) &&
        (!term ||
          [
            review.author.name,
            review.comment ?? '',
            review.collectionPoint.name,
          ].some((field) => normalize(field).includes(term)))
    );
  }, [reviews, tab, rating, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const tabs: TabItem<VisibilityTab>[] = [
    { id: 'all', label: 'Todas', icon: MessageSquare, count: reviews.length },
    { id: 'visible', label: 'Visíveis', icon: Globe, count: visibleCount },
    { id: 'hidden', label: 'Ocultadas', icon: EyeOff, count: hiddenCount },
  ];

  function changeTab(next: VisibilityTab) {
    setTab(next);
    setPage(1);
  }

  async function toggle(review: ModerationReview) {
    if (!token) return;
    const hide = !review.isHidden;
    setBusyId(review.id);
    setFeedback(null);
    try {
      const updated = await setReviewHidden(token, review.id, hide);
      setReviews((current) =>
        current.map((item) => (item.id === updated.id ? updated : item))
      );
      setFeedback({
        tone: 'success',
        text: `Avaliação de ${review.author.name} ${hide ? 'ocultada da' : 'reexibida na'} página de ${review.collectionPoint.name}.`,
      });
    } catch (error) {
      setFeedback({ tone: 'error', text: handleError(error) });
    } finally {
      setBusyId(null);
    }
  }

  async function remove(review: ModerationReview) {
    if (!token) return;
    setBusyId(review.id);
    setFeedback(null);
    try {
      await deleteReview(token, review.id);
      setReviews((current) => current.filter((item) => item.id !== review.id));
      setFeedback({
        tone: 'success',
        text: `Avaliação de ${review.author.name} excluída definitivamente.`,
      });
    } catch (error) {
      setFeedback({ tone: 'error', text: handleError(error) });
    } finally {
      setBusyId(null);
      setConfirmingId(null);
    }
  }

  if (loading) {
    return (
      <p
        role="status"
        className="flex items-center justify-center gap-2 rounded-2xl bg-surface-alt p-8 text-sm text-slate-600"
      >
        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        Carregando avaliações…
      </p>
    );
  }

  if (loadError) {
    return (
      <div
        role="alert"
        className="space-y-3 rounded-2xl bg-red-50 p-6 text-center text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
      >
        <p>{loadError}</p>
        <Button variant="outline" className="cursor-pointer" onClick={reload}>
          <RefreshCw aria-hidden="true" />
          Tentar de novo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total de avaliações" icon={MessageSquare}>
          <p className="text-3xl font-bold text-slate-900">
            {reviews.length}
            <span className="ml-1.5 text-sm font-medium text-slate-500">
              média {average}
            </span>
          </p>
        </StatCard>
        <StatCard label="Visíveis no site" icon={Globe}>
          <p className="text-3xl font-bold text-slate-900">{visibleCount}</p>
        </StatCard>
        <StatCard label="Ocultadas" icon={EyeOff}>
          <p className="text-3xl font-bold text-slate-900">{hiddenCount}</p>
        </StatCard>
      </div>

      <ModerationTabs tabs={tabs} active={tab} onChange={changeTab} />

      <div
        role="tabpanel"
        id={panelId(tab)}
        aria-labelledby={tabId(tab)}
        className="space-y-4"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Buscar avaliação</span>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Buscar por autor, comentário ou ponto"
              className={cn(FIELD_CLASS, 'w-full pl-9')}
            />
          </label>
          <label className="sm:w-48">
            <span className="sr-only">Filtrar por nota</span>
            <select
              value={rating}
              onChange={(event) => {
                setRating(event.target.value as RatingFilter);
                setPage(1);
              }}
              className={cn(FIELD_CLASS, 'w-full')}
            >
              {RATING_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <Button
            variant="outline"
            size="lg"
            className="min-h-10 cursor-pointer"
            onClick={reload}
          >
            <RefreshCw aria-hidden="true" />
            Atualizar
          </Button>
        </div>

        {feedback && (
          <p
            role={feedback.tone === 'error' ? 'alert' : 'status'}
            className={cn(
              'rounded-xl px-4 py-3 text-sm font-medium',
              feedback.tone === 'error'
                ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                : 'bg-brand-light text-brand-dark'
            )}
          >
            {feedback.text}
          </p>
        )}

        {pageItems.length === 0 ? (
          <p className="rounded-2xl bg-surface-alt p-8 text-center text-sm text-slate-500">
            {reviews.length === 0
              ? 'Nenhuma avaliação recebida até agora.'
              : 'Nenhuma avaliação encontrada para os filtros selecionados.'}
          </p>
        ) : (
          <ul className="space-y-3">
            {pageItems.map((review) => {
              const busy = busyId === review.id;
              const confirming = confirmingId === review.id;

              return (
                <li
                  key={review.id}
                  className={cn(
                    'space-y-3 rounded-2xl border border-slate-100 p-4 shadow-xs',
                    review.isHidden ? 'bg-surface-alt' : 'bg-card'
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand-dark"
                      >
                        {review.author.name
                          .trim()
                          .charAt(0)
                          .toLocaleUpperCase('pt-BR')}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {review.author.name}
                        </p>
                        <p className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
                          <MapPin aria-hidden="true" className="size-3" />
                          {review.collectionPoint.name}
                          <span aria-hidden="true">·</span>
                          <time dateTime={review.createdAt}>
                            {formatDate(review.createdAt)}
                          </time>
                        </p>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                        review.isHidden
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-brand-light text-brand-dark'
                      )}
                    >
                      {review.isHidden ? (
                        <EyeOff aria-hidden="true" className="size-3" />
                      ) : (
                        <Globe aria-hidden="true" className="size-3" />
                      )}
                      {review.isHidden ? 'Ocultada' : 'Visível'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <StarRating value={review.rating} />
                    <span className="sr-only">Nota {review.rating} de 5</span>
                  </div>

                  {review.comment ? (
                    <p className="rounded-xl bg-surface-alt p-3 text-sm leading-relaxed text-slate-700">
                      “{review.comment}”
                    </p>
                  ) : (
                    <p className="text-sm text-slate-500 italic">
                      Avaliação sem comentário.
                    </p>
                  )}

                  {confirming ? (
                    <div
                      role="alert"
                      className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300"
                    >
                      <p>
                        Excluir definitivamente? Prefira ocultar: a exclusão não
                        pode ser desfeita.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="cursor-pointer"
                          disabled={busy}
                          onClick={() => setConfirmingId(null)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="destructive"
                          className="cursor-pointer"
                          disabled={busy}
                          onClick={() => void remove(review)}
                        >
                          {busy ? (
                            <Loader2
                              aria-hidden="true"
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 aria-hidden="true" />
                          )}
                          Excluir
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="cursor-pointer text-red-700 dark:text-red-300"
                        disabled={busy}
                        onClick={() => setConfirmingId(review.id)}
                      >
                        <Trash2 aria-hidden="true" />
                        Excluir
                      </Button>
                      <Button
                        variant="outline"
                        className="cursor-pointer"
                        disabled={busy}
                        onClick={() => void toggle(review)}
                      >
                        {busy ? (
                          <Loader2
                            aria-hidden="true"
                            className="animate-spin"
                          />
                        ) : review.isHidden ? (
                          <Eye aria-hidden="true" />
                        ) : (
                          <EyeOff aria-hidden="true" />
                        )}
                        {review.isHidden
                          ? 'Reexibir no site'
                          : 'Ocultar do site'}
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            Página {currentPage} de {totalPages} · {filtered.length}{' '}
            {filtered.length === 1 ? 'avaliação' : 'avaliações'}
          </p>
          <nav aria-label="Paginação" className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage <= 1}
              onClick={() => setPage(currentPage - 1)}
            >
              <ChevronLeft aria-hidden="true" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={currentPage >= totalPages}
              onClick={() => setPage(currentPage + 1)}
            >
              Próxima
              <ChevronRight aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
