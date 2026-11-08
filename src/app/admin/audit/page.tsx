import { Suspense } from 'react';
import type { Metadata } from 'next';
import { ClipboardList } from 'lucide-react';
import { AuditFilters } from '@/components/admin/AuditFilters';
import { AuditTable } from '@/components/admin/AuditTable';
import { SectionCard } from '@/components/point/SectionCard';

export const metadata: Metadata = {
  title: 'Trilha de auditoria | EcoPonto Admin',
};
export default function AuditoriaPage() {
  return (
    <div className="flex flex-col gap-5 md:gap-7">
      <header className="space-y-1">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-light px-2.5 py-1 text-xs font-semibold text-brand-dark">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-brand" />
          Histórico de atividades
        </p>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Trilha de auditoria
        </h1>
        <p className="text-sm text-slate-600">
          Consulte os registros de acesso e as ações realizadas pelos usuários
          no sistema.
        </p>
      </header>
      <SectionCard
        id="audit"
        title="Registros de auditoria"
        description="Filtre os registros para encontrar atividades específicas e consultar seus detalhes"
        icon={ClipboardList}
      >
        <Suspense fallback={null}>
          <AuditFilters />
        </Suspense>

        <Suspense fallback={null}>
          <AuditTable />
        </Suspense>
      </SectionCard>
    </div>
  );
}
