import { Users } from 'lucide-react';
import { UserManagement } from '@/components/admin/users/UserManagement';
import { UserStats } from '@/components/admin/users/UserStats';
import { SectionCard } from '@/components/point/SectionCard';
import { getManagedUsers } from '@/services/users';

export default async function AdminUsersPage() {
  const users = await getManagedUsers();

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Governança e acessos
        </p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Gestão de usuários
        </h1>
        <p className="text-sm text-slate-600">
          Consulte as contas de cidadãos, coletores e administradores do polo
          regional Manhuaçu.
        </p>
      </header>

      <UserStats users={users} />

      <SectionCard
        id="users"
        title="Usuários cadastrados"
        description="Filtre por perfil e situação, ordene a lista e exporte o resultado."
        icon={Users}
      >
        <UserManagement users={users} />
      </SectionCard>
    </div>
  );
}
