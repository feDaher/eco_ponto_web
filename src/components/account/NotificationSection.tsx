'use client';

import { Controller, type UseFormReturn } from 'react-hook-form';
import { BarChart3, Bell, Navigation } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { Switch } from '@/components/ui/Switch';
import type { AccountValues } from '@/lib/account';
import { SettingRow } from './SettingRow';

const PREFERENCES = [
  {
    name: 'collectionAlerts',
    icon: Navigation,
    title: 'Alertas de coleta',
    description:
      'Avisos sobre novos pontos de coleta e mutirões de descarte perto de você.',
  },
  {
    name: 'monthlyReports',
    icon: BarChart3,
    title: 'Relatório mensal de impacto',
    description:
      'Resumo por e-mail com o que você reciclou e o impacto ambiental do mês.',
  },
] as const;

type NotificationSectionProps = {
  form: UseFormReturn<AccountValues>;
};

export function NotificationSection({ form }: NotificationSectionProps) {
  return (
    <SectionCard
      id="notifications"
      title="Preferências de notificação"
      description="Escolha quais avisos e comunicações deseja receber."
      icon={Bell}
    >
      <ul className="space-y-3">
        {PREFERENCES.map((preference) => (
          <SettingRow
            key={preference.name}
            id={`pref-${preference.name}`}
            icon={preference.icon}
            title={preference.title}
            description={preference.description}
            action={
              <Controller
                control={form.control}
                name={preference.name}
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    onBlur={field.onBlur}
                    aria-labelledby={`pref-${preference.name}-title`}
                    aria-describedby={`pref-${preference.name}-description`}
                  />
                )}
              />
            }
          />
        ))}
      </ul>
    </SectionCard>
  );
}
