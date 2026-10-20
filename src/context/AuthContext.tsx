'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import {
  clearSession,
  getServerSessionSnapshot,
  getSessionSnapshot,
  saveSession,
  subscribeSession,
} from '@/lib/session';
import { AuthError, loginRequest, registerRequest } from '@/services/auth';
import type { RegisterInput, User } from '@/types/user';

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(
    subscribeSession,
    getSessionSnapshot,
    getServerSessionSnapshot
  );

  useEffect(() => {
    if (!session) return;
    const timeout = window.setTimeout(
      clearSession,
      Math.max(session.expiresAt - Date.now(), 0)
    );
    return () => window.clearTimeout(timeout);
  }, [session]);

  const login = useCallback(async (email: string, password: string) => {
    const next = await loginRequest(email, password);
    saveSession(next);
    return next.user;
  }, []);

  const register = useCallback(
    async (input: RegisterInput) => {
      await registerRequest(input);
      try {
        return await login(input.email, input.password);
      } catch {
        throw new AuthError(
          'Conta criada! Entre com seu e-mail e senha para continuar.'
        );
      }
    },
    [login]
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status:
        session === undefined
          ? 'loading'
          : session
            ? 'authenticated'
            : 'unauthenticated',
      user: session?.user ?? null,
      token: session?.token ?? null,
      login,
      register,
      logout: clearSession,
    }),
    [session, login, register]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  }
  return context;
}
