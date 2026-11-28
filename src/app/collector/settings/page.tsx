import type { Metadata } from 'next';
import { CollectionPointSettings } from '@/components/collector/CollectionPointSettings';
import { RequireRole } from '@/components/auth/RequireRole';

export const metadata: Metadata = {
  title: 'Pontos e cooperativa | EcoPonto Digital',
  description:
    'Cadastre e atualize os pontos de coleta, horários e materiais aceitos pela cooperativa.',
  robots: { index: false },
};

export default function CollectorSettingsPage() {
  return (
    <RequireRole roles={['COLLECTOR']}>
      <div className="space-y-6">
        <header className="space-y-1">
          <p className="text-xs font-bold tracking-wider text-brand uppercase">
            Área da cooperativa
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Configurações do ponto e cooperativa
          </h1>
          <p className="max-w-3xl text-sm text-slate-600">
            Gerencie os endereços, contatos, materiais aceitos e horários dos
            pontos de coleta.
          </p>
        </header>
        <CollectionPointSettings />
      </div>
    </RequireRole>
  );
}
