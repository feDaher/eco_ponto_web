'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  PointCategoryApiError,
  categoryLabels,
  listPendingCategories,
  listWasteCategories,
} from '@/services/pointCategories';
import type {
  PendingCategoryRequest,
  WasteCategoryOption,
} from '@/types/pointCategories';

export function requestKey(request: PendingCategoryRequest) {
  return `${request.pointId}:${request.categoryId}`;
}

export function usePendingCategories() {
  const { token, logout } = useAuth();
  const [requests, setRequests] = useState<PendingCategoryRequest[]>([]);
  const [options, setOptions] = useState<WasteCategoryOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const handleError = useCallback(
    (cause: unknown) => {
      if (cause instanceof PointCategoryApiError && cause.status === 401) {
        logout();
      }
      return cause instanceof PointCategoryApiError
        ? cause.message
        : 'Não foi possível carregar as categorias pendentes.';
    },
    [logout]
  );

  useEffect(() => {
    if (!token) return;
    let active = true;

    Promise.all([
      listPendingCategories(token),
      listWasteCategories().catch(() => []),
    ])
      .then(([pending, categories]) => {
        if (!active) return;
        setRequests(pending);
        setOptions(categories);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (active) setError(handleError(cause));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token, handleError, reloadKey]);

  const reload = useCallback(() => {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }, []);

  const remove = useCallback((request: PendingCategoryRequest) => {
    const key = requestKey(request);
    setRequests((current) =>
      current.filter((item) => requestKey(item) !== key)
    );
  }, []);

  const labelOf = useMemo(() => categoryLabels(options), [options]);

  return {
    token,
    requests,
    labelOf,
    loading,
    error,
    reload,
    remove,
    handleError,
  };
}

export type PendingCategoriesState = ReturnType<typeof usePendingCategories>;
