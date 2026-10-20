'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { HOME_BY_ROLE, ROUTES } from '@/lib/routes';
import type { UserRole } from '@/types/user';

type RequireRoleProps = {
  roles?: UserRole[];
  children: React.ReactNode;
};

export function RequireRole({ roles, children }: RequireRoleProps) {
  const { status, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const allowed =
    status === 'authenticated' &&
    !!user &&
    (!roles || roles.includes(user.role));

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`${ROUTES.login}?next=${encodeURIComponent(pathname)}`);
    } else if (status === 'authenticated' && user && !allowed) {
      router.replace(HOME_BY_ROLE[user.role]);
    }
  }, [status, user, allowed, pathname, router]);

  if (allowed) return children;

  return (
    <div
      role="status"
      className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-slate-500"
    >
      <Loader2 aria-hidden="true" className="size-4 animate-spin" />
      Verificando permissões de acesso...
    </div>
  );
}
