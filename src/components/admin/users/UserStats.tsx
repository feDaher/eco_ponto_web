import { Recycle, ShieldCheck, UserRound, UserX, Users } from 'lucide-react';
import { StatCard } from '@/components/ui/StatCard';
import { pluralize } from '@/lib/points';
import type { ManagedUser } from '@/types/user';

type UserStatsProps = {
  users: ManagedUser[];
};

export function UserStats({ users }: UserStatsProps) {
  const count = (predicate: (user: ManagedUser) => boolean) =>
    users.filter(predicate).length;

  const pending = count((user) => user.status === 'pending');
  const blocked = count((user) => user.status === 'blocked');

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Total de usuários" icon={Users}>
        <p className="text-3xl font-bold text-slate-900">
          {users.length}
          <span className="ml-1.5 text-sm font-medium text-slate-500">
            {pluralize(pending, 'pendente', 'pendentes')}
          </span>
        </p>
      </StatCard>
      <StatCard label="Cidadãos" icon={UserRound}>
        <p className="text-3xl font-bold text-slate-900">
          {count((user) => user.role === 'CITIZEN')}
        </p>
      </StatCard>
      <StatCard label="Coletores" icon={Recycle}>
        <p className="text-3xl font-bold text-slate-900">
          {count((user) => user.role === 'COLLECTOR')}
        </p>
      </StatCard>
      <StatCard label="Administradores" icon={ShieldCheck}>
        <p className="text-3xl font-bold text-slate-900">
          {count((user) => user.role === 'ADMIN')}
        </p>
      </StatCard>
      <StatCard label="Bloqueados" icon={UserX}>
        <p className="text-3xl font-bold text-red-700 dark:text-red-300">
          {blocked}
        </p>
      </StatCard>
    </div>
  );
}
