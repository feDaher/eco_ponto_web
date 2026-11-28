'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { isOpenNow } from '@/lib/points';
import { ROUTES } from '@/lib/routes';
import {
  CollectorApiError,
  formatCollectorShortName,
  formatMaterialLabel,
  getCollectorOverview,
} from '@/services/collector';
import type { CollectorOverviewData, CollectorPoint } from '@/types/collector';

type CollectorContextValue = {
  isBootstrapping: boolean;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  points: CollectorPoint[];
  selectedPoint: CollectorPoint | null;
  selectedPointId: string | null;
  setSelectedPointId: (pointId: string) => void;
  isOpen: boolean;
  authorizedCategories: string[];
  displayName: string;
  shortName: string;
  unitLabel: string | null;
  userCity: string | null;
};

function pickValidText(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    if (typeof value !== 'string') continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    const lower = trimmed.toLowerCase();
    if (lower === 'undefined' || lower === 'null') continue;
    return trimmed;
  }
  return null;
}

const CollectorContext = createContext<CollectorContextValue | null>(null);

export function CollectorProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { status, token, user: sessionUser, logout } = useAuth();

  const [data, setData] = useState<CollectorOverviewData | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const overview = await getCollectorOverview(token);
      setData(overview);
      setSelectedPointId((current) =>
        current && overview.points.some((point) => point.id === current)
          ? current
          : (overview.points[0]?.id ?? null)
      );
    } catch (err) {
      if (err instanceof CollectorApiError && err.status === 401) {
        logout();
        router.replace(ROUTES.login);
        return;
      }

      setError(
        err instanceof Error
          ? err.message
          : 'Não foi possível carregar os dados do painel.'
      );
    } finally {
      setLoading(false);
    }
  }, [token, logout, router]);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !token) {
      router.replace(ROUTES.login);
      return;
    }

    let active = true;

    queueMicrotask(() => {
      if (active) {
        void loadData();
      }
    });

    return () => {
      active = false;
    };
  }, [status, token, router, loadData]);

  const activeUser = data?.user ?? sessionUser;
  const points = useMemo(() => data?.points ?? [], [data?.points]);

  const selectedPoint = useMemo(
    () =>
      points.find((point) => point.id === selectedPointId) ?? points[0] ?? null,
    [points, selectedPointId]
  );

  const isOpen = useMemo(
    () => (selectedPoint ? isOpenNow(selectedPoint.schedule) : false),
    [selectedPoint]
  );

  const authorizedCategories = useMemo(
    () => (selectedPoint?.materials ?? []).map(formatMaterialLabel),
    [selectedPoint]
  );

  const displayName =
    pickValidText(
      data?.user.name,
      sessionUser?.name,
      selectedPoint?.name,
      selectedPoint?.collectorName,
      activeUser?.email ? activeUser.email.split('@')[0] : null
    ) ?? 'Painel do Coletor';

  const shortName = formatCollectorShortName(displayName);

  const locationParts = [
    pickValidText(selectedPoint?.neighborhood),
    pickValidText(selectedPoint?.city),
  ].filter((part): part is string => Boolean(part));

  const unitLabel =
    pickValidText(selectedPoint?.unit) ??
    (locationParts.length > 0 ? locationParts.join(' • ') : null) ??
    pickValidText(data?.user.city, sessionUser?.city);

  const userCity = pickValidText(
    data?.user.city,
    sessionUser?.city,
    selectedPoint?.city
  );

  const isBootstrapping = status === 'loading' || (loading && !data && !error);

  const value = useMemo<CollectorContextValue>(
    () => ({
      isBootstrapping,
      loading,
      error,
      reload: loadData,
      points,
      selectedPoint,
      selectedPointId,
      setSelectedPointId,
      isOpen,
      authorizedCategories,
      displayName,
      shortName,
      unitLabel,
      userCity,
    }),
    [
      isBootstrapping,
      loading,
      error,
      loadData,
      points,
      selectedPoint,
      selectedPointId,
      isOpen,
      authorizedCategories,
      displayName,
      shortName,
      unitLabel,
      userCity,
    ]
  );

  return (
    <CollectorContext.Provider value={value}>
      {children}
    </CollectorContext.Provider>
  );
}

export function useCollector() {
  const context = useContext(CollectorContext);
  if (!context) {
    throw new Error('useCollector deve ser usado dentro de CollectorProvider.');
  }
  return context;
}
