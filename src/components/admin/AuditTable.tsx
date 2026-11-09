'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  Ban,
  CloudOff,
  Loader2,
  Pencil,
  RefreshCw,
  SearchX,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';
import {
  AUDIT_ACTION_LABEL,
  auditUserHref,
  formatDateTime,
  parseFilters,
  toQuery,
  type AuditFiltersValue,
} from '@/lib/audit';
import { ROUTES } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { AuditApiError, fetchAuditLogs } from '@/services/audit';
import type { AuditAction, AuditLogItem, AuditLogUser } from '@/types/audit';
import {
  AUDIT_BUTTON_CLASS,
  AUDIT_BUTTON_TONES,
  AUDIT_PILL_CLASS,
} from './auditStyles';

const PAGE_SIZE = 20;

type Status = 'loading' | 'success' | 'error';

const MONO_CLASS = 'font-mono text-xs text-slate-800';
const METHOD_CLASS =
  'inline-block rounded-lg bg-surface-accent px-2 py-0.5 font-mono text-xs font-bold text-slate-800';
const TH_CLASS =
  'px-3 py-4 text-left text-xs font-bold tracking-wider text-slate-500 uppercase';
const TD_CLASS = 'px-3 py-4 align-middle';

const ACTION_STYLES: Record<
  AuditAction,
  { icon: LucideIcon; className: string }
> = {
  ACCESS_DENIED: {
    icon: Ban,
    className: 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300',
  },
  RESOURCE_CHANGED: {
    icon: Pencil,
    className: 'bg-surface-strong text-slate-800',
  },
};

function ActionBadge({ action }: { action: AuditAction }) {
  const { icon: Icon, className } = ACTION_STYLES[action];

  return (
    <span className={cn(AUDIT_PILL_CLASS, className)}>
      <Icon aria-hidden="true" className="size-3.5" />
      {AUDIT_ACTION_LABEL[action]}
    </span>
  );
}

function StatusBadge({ code, prefix }: { code: number; prefix?: string }) {
  const ok = code >= 200 && code < 300;

  return (
    <span
      className={cn(
        AUDIT_PILL_CLASS,
        'font-bold tabular-nums',
        ok
          ? 'bg-brand-light text-brand-dark'
          : 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
      )}
    >
      {prefix ? `${prefix} ${code}` : code}
    </span>
  );
}

function UserInfo({
  user,
  filterHref,
}: {
  user: AuditLogUser | null;
  filterHref: (userId: string) => string;
}) {
  if (!user) {
    return (
      <span className="block font-semibold text-slate-500 italic">
        Usuário removido
      </span>
    );
  }

  return (
    <>
      <Link
        href={filterHref(user.id)}
        scroll={false}
        title={`Filtrar registros de ${user.name}`}
        className="font-semibold text-slate-900 underline-offset-4 hover:text-brand hover:underline focus-visible:outline-2 focus-visible:outline-brand"
      >
        {user.name}
      </Link>
      <span className="mt-0.5 block text-xs break-all text-slate-500">
        {user.email}
      </span>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-18 animate-pulse rounded-2xl bg-muted" />
      ))}
    </div>
  );
}

function MessageState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-card px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-light text-brand">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      <p className="max-w-md text-sm text-slate-600">{description}</p>
      {action}
    </div>
  );
}

function ErrorState({
  status,
  onRetry,
}: {
  status: number;
  onRetry: () => void;
}) {
  if (status === 403) {
    return (
      <MessageState
        icon={ShieldAlert}
        title="Acesso negado"
        description="Você não tem permissão para consultar a trilha de auditoria."
      />
    );
  }

  const invalid = status === 400;
  return (
    <MessageState
      icon={CloudOff}
      title={
        invalid ? 'Filtros inválidos' : 'Não foi possível carregar os registros'
      }
      description={
        invalid
          ? 'Confira os filtros aplicados (o período pode ter no máximo 90 dias) e tente novamente.'
          : 'Ocorreu um erro ao consultar a trilha de auditoria. Tente novamente em instantes.'
      }
      action={
        <button
          type="button"
          onClick={onRetry}
          className={cn(AUDIT_BUTTON_CLASS, AUDIT_BUTTON_TONES.outline, 'mt-2')}
        >
          <RefreshCw aria-hidden="true" className="size-4" />
          Tentar novamente
        </button>
      }
    />
  );
}

export function AuditTable() {
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();
  const [reloadToken, setReloadToken] = useState(0);

  return (
    <AuditTableContent
      key={`${paramsKey}-${reloadToken}`}
      paramsKey={paramsKey}
      onRetry={() => setReloadToken((value) => value + 1)}
    />
  );
}

function AuditTableContent({
  paramsKey,
  onRetry,
}: {
  paramsKey: string;
  onRetry: () => void;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [items, setItems] = useState<AuditLogItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [errorStatus, setErrorStatus] = useState(500);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  const filters: AuditFiltersValue = parseFilters(
    new URLSearchParams(paramsKey)
  );
  const filterHref = (userId: string) =>
    auditUserHref(pathname, filters, userId);
  const loginHref = `${ROUTES.login}?next=${encodeURIComponent(
    paramsKey ? `${pathname}?${paramsKey}` : pathname
  )}`;

  useEffect(() => {
    let cancelled = false;

    fetchAuditLogs({
      ...toQuery(parseFilters(new URLSearchParams(paramsKey))),
      limit: PAGE_SIZE,
    })
      .then((response) => {
        if (cancelled) return;
        setItems(response.items);
        setNextCursor(response.nextCursor);
        setStatus('success');
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        const code = error instanceof AuditApiError ? error.status : 500;

        if (code === 401) {
          router.replace(loginHref);
          return;
        }

        setErrorStatus(code);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [paramsKey, loginHref, router]);

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const response = await fetchAuditLogs({
        ...toQuery(filters),
        cursor: nextCursor,
        limit: PAGE_SIZE,
      });
      setItems((previous) => [...previous, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (error: unknown) {
      const code = error instanceof AuditApiError ? error.status : 500;
      if (code === 401) {
        router.replace(loginHref);
      } else if (code === 403) {
        setErrorStatus(403);
        setStatus('error');
      } else {
        setLoadMoreFailed(true);
      }
    } finally {
      setLoadingMore(false);
    }
  }

  const liveMessage =
    status === 'loading'
      ? 'Carregando registros de auditoria.'
      : status === 'error'
        ? 'Não foi possível exibir os registros.'
        : `${items.length} ${items.length === 1 ? 'registro exibido' : 'registros exibidos'}.`;

  return (
    <div>
      <p role="status" className="sr-only">
        {liveMessage}
      </p>

      {status === 'loading' && <LoadingSkeleton />}

      {status === 'error' && (
        <ErrorState status={errorStatus} onRetry={onRetry} />
      )}

      {status === 'success' && items.length === 0 && (
        <MessageState
          icon={SearchX}
          title="Nenhum registro encontrado"
          description="Ajuste ou limpe os filtros para ver outros resultados."
        />
      )}

      {status === 'success' && items.length > 0 && (
        <>
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-200 bg-card xl:block">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col className="w-[13%]" />
                <col className="w-[21%]" />
                <col className="w-[19%]" />
                <col className="w-[25%]" />
                <col className="w-[11%]" />
                <col className="w-[9%]" />
              </colgroup>
              <caption className="sr-only">
                Registros de auditoria, do mais recente para o mais antigo
              </caption>
              <thead>
                <tr className="bg-surface-alt">
                  <th scope="col" className={TH_CLASS}>
                    Data e hora
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Usuário
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Ação
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Método e rota
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Recurso
                  </th>
                  <th scope="col" className={TH_CLASS}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((item) => {
                  const { date, time } = formatDateTime(item.createdAt);
                  return (
                    <tr key={item.id}>
                      <td className={cn(TD_CLASS, 'whitespace-nowrap')}>
                        <time dateTime={item.createdAt}>
                          <span className="block font-semibold text-slate-900">
                            {date}
                          </span>
                          <span className="mt-0.5 block text-xs text-slate-500 tabular-nums">
                            {time}
                          </span>
                        </time>
                      </td>
                      <td className={TD_CLASS}>
                        <UserInfo user={item.user} filterHref={filterHref} />
                      </td>
                      <td className={TD_CLASS}>
                        <ActionBadge action={item.action} />
                      </td>
                      <td className={TD_CLASS}>
                        <span className={METHOD_CLASS}>{item.method}</span>
                        <span
                          className={cn(MONO_CLASS, 'mt-1 block break-all')}
                        >
                          {item.route}
                        </span>
                      </td>
                      <td className={cn(TD_CLASS, MONO_CLASS)}>
                        {item.resourceId ?? '—'}
                      </td>
                      <td className={TD_CLASS}>
                        <StatusBadge code={item.statusCode} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <ul
            aria-label="Registros de auditoria"
            className="mt-4 flex flex-col gap-3 xl:hidden"
          >
            {items.map((item) => {
              const { date, time } = formatDateTime(item.createdAt);
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-card p-4 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <ActionBadge action={item.action} />
                    <time
                      dateTime={item.createdAt}
                      className="text-right text-xs font-semibold text-slate-500"
                    >
                      {date} · {time}
                    </time>
                  </div>
                  <div className="text-sm">
                    <UserInfo user={item.user} filterHref={filterHref} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <span className={METHOD_CLASS}>{item.method}</span>
                    <span className={cn(MONO_CLASS, 'break-all')}>
                      {item.route}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                    <span>
                      Recurso:{' '}
                      <span className={MONO_CLASS}>
                        {item.resourceId ?? '—'}
                      </span>
                    </span>
                    <StatusBadge code={item.statusCode} prefix="Status" />
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
            <span className="text-sm text-slate-500">
              Exibindo {items.length}{' '}
              {items.length === 1 ? 'registro' : 'registros'}, do mais recente
              para o mais antigo.
            </span>

            <div className="flex flex-col gap-2 md:items-end">
              {loadMoreFailed && (
                <p
                  role="alert"
                  className="text-sm font-medium text-red-700 dark:text-red-300"
                >
                  Não foi possível carregar mais registros. Tente de novo.
                </p>
              )}
              {nextCursor && (
                <button
                  type="button"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  aria-busy={loadingMore}
                  className={cn(
                    AUDIT_BUTTON_CLASS,
                    AUDIT_BUTTON_TONES.outline,
                    'w-full md:w-auto'
                  )}
                >
                  {loadingMore ? (
                    <>
                      <Loader2
                        aria-hidden="true"
                        className="size-4 animate-spin"
                      />
                      Carregando...
                    </>
                  ) : (
                    'Carregar mais'
                  )}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
