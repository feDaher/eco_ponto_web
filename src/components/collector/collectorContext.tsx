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
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { CollectorApiError, getCollectorPoints } from '@/services/collector';
import type { CollectorPoint } from '@/types/collector';

type CollectorContextValue = {
  loading: boolean;
  error: string | null;
  points: CollectorPoint[];
  selectedPoint: CollectorPoint | null;
  selectPoint: (pointId: string) => void;
  reload: () => void;
};

const CollectorContext = createContext<CollectorContextValue | null>(null);

export function CollectorProvider({ children }: { children: ReactNode }) {
  const { token, logout } = useAuth();
  const pathname = usePathname();
  const [points, setPoints] = useState<CollectorPoint[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!token) return;
    let active = true;

    getCollectorPoints(token)
      .then((data) => {
        if (!active) return;
        setPoints(data);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        if (cause instanceof CollectorApiError && cause.status === 401) {
          logout();
          return;
        }
        setError(
          cause instanceof CollectorApiError
            ? cause.message
            : 'Não foi possível carregar seus pontos de coleta.'
        );
      });

    return () => {
      active = false;
    };
  }, [token, logout, reloadKey, pathname]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  const value = useMemo<CollectorContextValue>(() => {
    const list = points ?? [];
    return {
      loading: points === null && error === null,
      error,
      points: list,
      selectedPoint:
        list.find((point) => point.id === selectedId) ?? list[0] ?? null,
      selectPoint: setSelectedId,
      reload,
    };
  }, [points, error, selectedId, reload]);

  return (
    <CollectorContext.Provider value={value}>
      {children}
    </CollectorContext.Provider>
  );
}

export function useCollector() {
  const context = useContext(CollectorContext);
  if (!context) {
    throw new Error('useCollector precisa estar dentro de <CollectorProvider>');
  }
  return context;
}
