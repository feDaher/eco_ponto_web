'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Flag,
  Globe,
  MapPin,
  MessageSquare,
  Search,
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
import { averageRating, formatDate } from '@/lib/points';
import { useReviewModeration } from '@/lib/reviewModeration';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import type { ModeratedReview } from '@/types/api';

type VisibilityTab = 'all' | 'visible' | 'hidden';
type RatingFilter = 'all' | 'low' | 'mid' | 'high';

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: 'all', label: 'Todas as notas' },
  { value: 'low', label: '1 estrela' },
  { value: 'mid', label: '2 estrelas' },
  { value: 'high', label: '3 a 5 estrelas' },
];

const PAGE_SIZE = 5;
const DEMO_NOTICE = 'Demonstração: vale só para este navegador.';

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

type ReviewModerationProps = {
  reviews: ModeratedReview[];
};

export function ReviewModeration({ reviews }: ReviewModerationProps) {
  const { isHidden, setHidden } = useReviewModeration();
  const [tab, setTab] = useState<VisibilityTab>('all');
  const [query, setQuery] = useState('');
  const [rating, setRating] = useState<RatingFilter>('all');
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const withStatus = useMemo(
    () =>
      reviews.map((review) => ({
        ...review,
        isHidden: isHidden(review.key, review),
      })),
    [reviews, isHidden]
  );

  const visibleCount = withStatus.filter((review) => !review.isHidden).length;
  const hiddenCount = withStatus.length - visibleCount;
  const average = averageRating(reviews).toFixed(1).replace('.', ',');

  const filtered = useMemo(() => {
    const term = normalize(query.trim());
    return withStatus.filter(
      (review) =>
        (tab === 'all' || review.isHidden === (tab === 'hidden')) &&
        matchesRating(review.rating, rating) &&
        (!term ||
          [review.author, review.comment, review.pointName].some((field) =>
            normalize(field).includes(term)
          ))
    );
  }, [withStatus, tab, rating, query]);

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

  function toggle(review: ModeratedReview, hide: boolean) {
    setHidden(review.key, hide);
    setMessage(
      `Avaliação de ${review.author} ${hide ? 'ocultada da' : 'reexibida na'} ficha de ${review.pointName}. ${DEMO_NOTICE}`
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
        <StatCard label="Visíveis na ficha" icon={Globe}>
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
        </div>

        {message && (
          <p
            role="status"
            className="rounded-xl bg-brand-light px-4 py-3 text-sm font-medium text-brand-dark"
          >
            {message}
          </p>
        )}

        {pageItems.length === 0 ? (
          <p className="rounded-2xl bg-surface-alt p-8 text-center text-sm text-slate-500">
            Nenhuma avaliação encontrada para os filtros selecionados.
          </p>
        ) : (
          <ul className="space-y-3">
            {pageItems.map((review) => (
              <li
                key={review.key}
                className={cn(
                  'space-y-3 rounded-2xl border border-slate-100 bg-card p-4 shadow-xs',
                  review.isHidden && 'bg-surface-alt'
                )}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-light text-sm font-bold text-brand-dark"
                    >
                      {review.author
                        .trim()
                        .charAt(0)
                        .toLocaleUpperCase('pt-BR')}
                    </span>
                    <div>
                      <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-900">
                        {review.author}
                        {review.authorBadge && (
                          <span className="rounded-full bg-surface-strong px-2 py-0.5 text-[11px] font-semibold text-brand-dark">
                            {review.authorBadge}
                          </span>
                        )}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin aria-hidden="true" className="size-3" />
                        <Link
                          href={ROUTES.point(review.pointSlug)}
                          className="hover:text-brand hover:underline"
                        >
                          {review.pointName}
                        </Link>
                        <span aria-hidden="true">·</span>
                        <time dateTime={review.date}>
                          {formatDate(review.date)}
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

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <StarRating value={review.rating} />
                  <span className="sr-only">Nota {review.rating} de 5</span>
                  {review.flag && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 font-semibold text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                      <Flag aria-hidden="true" className="size-3" />
                      {review.flag}
                    </span>
                  )}
                </div>

                <p className="rounded-xl bg-surface-alt p-3 text-sm leading-relaxed text-slate-700">
                  “{review.comment}”
                </p>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => toggle(review, !review.isHidden)}
                  >
                    {review.isHidden ? (
                      <Eye aria-hidden="true" />
                    ) : (
                      <EyeOff aria-hidden="true" />
                    )}
                    {review.isHidden ? 'Reexibir na ficha' : 'Ocultar da ficha'}
                  </Button>
                </div>
              </li>
            ))}
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
