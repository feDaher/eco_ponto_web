'use client';

import { useEffect, useState } from 'react';
import { KeyRound, LocateFixed, ShieldCheck, Smartphone } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { SettingRow } from './SettingRow';

type GeoState = PermissionState | 'unsupported' | 'checking';

const GEO_STATUS: Record<GeoState, { label: string; tone: string }> = {
  granted: { label: 'Permitida', tone: 'bg-brand-light text-brand-dark' },
  prompt: { label: 'Perguntar ao usar', tone: 'bg-slate-100 text-slate-700' },
  denied: {
    label: 'Bloqueada',
    tone: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300',
  },
  unsupported: {
    label: 'Indisponível',
    tone: 'bg-slate-100 text-slate-700',
  },
  checking: { label: 'Verificando…', tone: 'bg-slate-100 text-slate-700' },
};

const BADGE_CLASS =
  'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap select-none';

function useGeolocationPermission() {
  const [state, setState] = useState<GeoState>('checking');

  useEffect(() => {
    let status: PermissionStatus | null = null;
    let active = true;

    const check = async () => {
      if (!navigator.permissions?.query) {
        if (active) setState('unsupported');
        return;
      }
      try {
        status = await navigator.permissions.query({ name: 'geolocation' });
        if (!active) return;
        setState(status.state);
        status.onchange = () => {
          if (status) setState(status.state);
        };
      } catch {
        if (active) setState('unsupported');
      }
    };

    void check();

    return () => {
      active = false;
      if (status) status.onchange = null;
    };
  }, []);

  return state;
}

type SecuritySectionProps = {
  onDemo: (message: string) => void;
};

export function SecuritySection({ onDemo }: SecuritySectionProps) {
  const geo = GEO_STATUS[useGeolocationPermission()];

  return (
    <SectionCard
      id="security"
      title="Segurança e acesso"
      description="Senha, verificação em duas etapas e permissões do navegador."
      icon={ShieldCheck}
    >
      <ul className="space-y-3">
        <SettingRow
          id="security-password"
          icon={KeyRound}
          title="Senha de acesso"
          description="Use uma senha forte, com letras e números."
          action={
            <button
              type="button"
              onClick={() =>
                onDemo('A troca de senha ainda não está integrada à API.')
              }
              className={cn(
                buttonVariants({ variant: 'outline' }),
                'select-none'
              )}
            >
              Atualizar senha
            </button>
          }
        />
        <SettingRow
          id="security-2fa"
          icon={Smartphone}
          title="Verificação em duas etapas"
          description="Uma camada extra de proteção ao entrar na conta."
          action={
            <span className={cn(BADGE_CLASS, 'bg-slate-100 text-slate-700')}>
              Em breve
            </span>
          }
        />
        <SettingRow
          id="security-geo"
          icon={LocateFixed}
          title="Permissão de localização"
          description="Usada para mostrar os pontos de coleta mais próximos. Altere nas configurações do navegador."
          action={
            <span role="status" className={cn(BADGE_CLASS, geo.tone)}>
              {geo.label}
            </span>
          }
        />
      </ul>
    </SectionCard>
  );
}
