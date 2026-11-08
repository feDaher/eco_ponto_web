'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Ban,
  CloudOff,
  Loader2,
  Pencil,
  RefreshCw,
  SearchX,
  ShieldAlert,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { fetchAuditLogs } from '@/lib/fetchAuditLogs';
import { parseFilters, toQuery } from '@/lib/filters';
import { formatDateTime } from '@/lib/format';
import {
  AUDIT_ACTION_LABEL,
  AuditApiError,
  type AuditAction,
  type AuditLogItem,
  type AuditLogUser,
} from '@/types/audit';

const PAGE_SIZE = 20;

type Status = 'loading' | 'success' | 'error';
const monoClass = 'font-mono text-[13px] text-card-foreground';

function ActionBadge({ action }: { action: AuditAction }) {
  const denied = action === 'ACCESS_DENIED';
  const Icon = denied ? Ban : Pencil;

  return (
    <Badge
      variant="outline"
      className={cn(
        'gap-1.5 whitespace-nowrap rounded-full border-transparent px-3 py-1 text-[13px] font-semibold',
        denied
          ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
      )}
    >
      <Icon className="size-3.5" aria-hidden="true" />
      {AUDIT_ACTION_LABEL[action]}
    </Badge>
  );
}

function StatusBadge({ code, prefix }: { code: number; prefix?: string }) {
  const ok = code >= 200 && code < 300;

  return (
    <Badge
      variant="outline"
      className={cn(
        'rounded-full border-transparent px-3 py-1 text-[13px] font-bold tabular-nums',
        ok
          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
          : 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
      )}
    >
      {prefix ? `${prefix} ${code}` : code}
    </Badge>
  );
}

function UserInfo({ user }: { user: AuditLogUser | null }) {
  if (!user) {
    return (
      <div className="font-semibold italic text-muted-foreground">
        Usuário removido
      </div>
    );
  }

  return (
    <>
      <div className="font-semibold text-card-foreground">{user.name}</div>
      <div className="mt-0.5 break-all text-[13px] text-muted-foreground">
        {user.email}
      </div>
    </>
  );
}

function LoadingSkeleton() {
  return (
    <div aria-hidden="true" className="mt-6 flex flex-col gap-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-[72px] animate-pulse rounded-2xl bg-muted"
        />
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
  icon: typeof SearchX;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-[20px] border border-border bg-card px-6 py-12 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-brand-light text-brand">
        <Icon className="size-6" aria-hidden="true" />
      </span>

      <h3 className="text-lg font-bold text-card-foreground">{title}</h3>

      <p className="max-w-md text-[15px] text-muted-foreground">
        {description}
      </p>

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
        <Button
          type="button"
          variant="outline"
          onClick={onRetry}
          className="mt-2 h-12 gap-2 rounded-[14px] border-border bg-card px-6 text-[15px] font-semibold text-card-foreground hover:bg-muted"
        >
          <RefreshCw className="size-4" aria-hidden="true" />
          Tentar novamente
        </Button>
      }
    />
  );
}
const thClass =
  'px-3 py-[15px] text-left text-xs font-bold uppercase tracking-[0.05em] text-muted-foreground';
const tdClass = 'px-3 py-4 align-middle';
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

  const [items, setItems] = useState<AuditLogItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>('loading');
  const [errorStatus, setErrorStatus] = useState(500);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreFailed, setLoadMoreFailed] = useState(false);

  const currentKey = useRef(paramsKey);

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
          router.replace('/login');
          return;
        }

        setErrorStatus(code);
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [paramsKey, router]);

  async function handleLoadMore() {
    if (!nextCursor || loadingMore) return;
    const keyAtStart = paramsKey;

    setLoadingMore(true);
    setLoadMoreFailed(false);
    try {
      const response = await fetchAuditLogs({
        ...toQuery(parseFilters(new URLSearchParams(paramsKey))),
        cursor: nextCursor,
        limit: PAGE_SIZE,
      });
      if (currentKey.current !== keyAtStart) return;
      setItems((previous) => [...previous, ...response.items]);
      setNextCursor(response.nextCursor);
    } catch (error: unknown) {
      if (currentKey.current !== keyAtStart) return;
      const code = error instanceof AuditApiError ? error.status : 500;
      if (code === 401) {
        router.replace('/login');
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
        : `${items.length} registros exibidos.`;

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
          <div className="mt-6 hidden overflow-hidden rounded-2xl border border-slate-100 bg-card xl:block">
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
                <tr className="bg-surface-alt text-[11px] tracking-wider text-slate-500 uppercase">
                  <th scope="col" className={thClass}>
                    Data e hora
                  </th>
                  <th scope="col" className={thClass}>
                    Usuário
                  </th>
                  <th scope="col" className={thClass}>
                    Ação
                  </th>
                  <th scope="col" className={thClass}>
                    Método e rota
                  </th>
                  <th scope="col" className={thClass}>
                    Recurso
                  </th>
                  <th scope="col" className={thClass}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-card">
                {items.map((item) => {
                  const { date, time } = formatDateTime(item.createdAt);
                  return (
                    <tr key={item.id}>
                      <td className={cn(tdClass, 'whitespace-nowrap')}>
                        <time dateTime={item.createdAt}>
                          <div className="font-semibold text-card-foreground">
                            {date}
                          </div>
                          <div className="mt-0.5 text-[13px] tabular-nums text-muted-foreground">
                            {time}{' '}
                          </div>
                          <div className="mt-0.5 text-[13px] tabular-nums text-muted-foreground"></div>
                        </time>
                      </td>
                      <td className={tdClass}>
                        <UserInfo user={item.user} />
                      </td>
                      <td className={tdClass}>
                        <ActionBadge action={item.action} />
                      </td>
                      <td className={tdClass}>
                        <span className="inline-block rounded-lg bg-surface-accent px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                          {item.method}
                        </span>
                        <div className={cn(monoClass, 'mt-1 break-all')}>
                          {item.route}
                        </div>
                      </td>
                      <td className={cn(tdClass, monoClass)}>
                        {item.resourceId ?? '—'}
                      </td>
                      <td className={tdClass}>
                        <StatusBadge code={item.statusCode} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Celular: cartões */}
          <ul
            aria-label="Registros de auditoria"
            className="mt-4 flex flex-col gap-3 xl:hidden"
          >
            {items.map((item) => {
              const { date, time } = formatDateTime(item.createdAt);
              return (
                <li
                  key={item.id}
                  className="flex flex-col gap-3 rounded-[22px] border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between gap-2">
                    <ActionBadge action={item.action} />
                    <time
                      dateTime={item.createdAt}
                      className="text-right text-[13px] font-semibold text-muted-foreground"
                    >
                      {date} · {time}
                    </time>
                  </div>
                  <div className="text-[15px]">
                    <UserInfo user={item.user} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                    <span className="inline-block rounded-lg bg-surface-accent px-2 py-0.5 font-mono text-xs font-bold text-foreground">
                      {item.method}
                    </span>
                    <span className={cn(monoClass, 'break-all')}>
                      {item.route}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-3 text-[13px] text-muted-foreground">
                    <span>
                      Recurso:{' '}
                      <span className={monoClass}>
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
            <span className="text-sm text-muted-foreground">
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
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  aria-busy={loadingMore}
                  className="h-[52px] w-full gap-2 rounded-2xl border-border bg-card px-6 text-[15px] font-semibold text-card-foreground hover:bg-muted md:h-12 md:w-auto md:rounded-[14px]"
                >
                  {loadingMore ? (
                    <>
                      <Loader2
                        className="size-[18px] animate-spin"
                        aria-hidden="true"
                      />
                      Carregando...
                    </>
                  ) : (
                    'Carregar mais'
                  )}
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
