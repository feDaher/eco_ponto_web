'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { SectionCard } from '@/components/point/SectionCard';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { CollectorApiError, saveWeeklyHours } from '@/services/collector';
import type { CollectionPointWeekday } from '@/types/collectionPointSettings';
import type { CollectorPoint } from '@/types/collector';
import { useCollector } from './collectorContext';

const DAYS: {
  weekday: CollectionPointWeekday;
  label: string;
  opens: string;
  closes: string;
}[] = [
  {
    weekday: 'MONDAY',
    label: 'Segunda-feira',
    opens: '08:00',
    closes: '18:00',
  },
  { weekday: 'TUESDAY', label: 'Terça-feira', opens: '08:00', closes: '18:00' },
  {
    weekday: 'WEDNESDAY',
    label: 'Quarta-feira',
    opens: '08:00',
    closes: '18:00',
  },
  {
    weekday: 'THURSDAY',
    label: 'Quinta-feira',
    opens: '08:00',
    closes: '18:00',
  },
  { weekday: 'FRIDAY', label: 'Sexta-feira', opens: '08:00', closes: '18:00' },
  { weekday: 'SATURDAY', label: 'Sábado', opens: '08:00', closes: '12:00' },
  { weekday: 'SUNDAY', label: 'Domingo', opens: '08:00', closes: '12:00' },
];

type Day = (typeof DAYS)[number] & { open: boolean };

type Feedback = { tone: 'success' | 'error'; text: string };

function toDays(point: CollectorPoint): Day[] {
  return DAYS.map((day) => {
    const hour = point.hours.find((item) => item.weekday === day.weekday);
    return hour
      ? { ...day, opens: hour.openTime, closes: hour.closeTime, open: true }
      : { ...day, open: false };
  });
}

export function OpeningHoursEditor() {
  const { loading, selectedPoint } = useCollector();

  if (loading) return null;

  if (!selectedPoint) {
    return (
      <SectionCard
        id={COLLECTOR_SECTIONS.hours}
        title="Horários de operação"
        icon={Clock}
      >
        <p className="text-sm text-slate-500">
          Cadastre um ponto de coleta para gerenciar os horários.
        </p>
      </SectionCard>
    );
  }

  return <HoursForm key={selectedPoint.id} point={selectedPoint} />;
}

function HoursForm({ point }: { point: CollectorPoint }) {
  const { token, logout } = useAuth();
  const { reload } = useCollector();
  const [days, setDays] = useState(() => toDays(point));
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const hasOpenDay = days.some((day) => day.open);

  function toggleDay(weekday: CollectionPointWeekday) {
    setDays((current) =>
      current.map((day) =>
        day.weekday === weekday ? { ...day, open: !day.open } : day
      )
    );
    setFeedback(null);
  }

  async function save() {
    if (!token) return;
    setSaving(true);
    setFeedback(null);

    try {
      await saveWeeklyHours(
        token,
        point,
        days
          .filter((day) => day.open)
          .map(({ weekday, opens, closes }) => ({
            weekday,
            openTime: opens,
            closeTime: closes,
          }))
      );
      setFeedback({
        tone: 'success',
        text: 'Horários salvos. O app do cidadão já mostra os novos horários.',
      });
    } catch (cause) {
      if (cause instanceof CollectorApiError && cause.status === 401) {
        logout();
        return;
      }
      setFeedback({
        tone: 'error',
        text:
          cause instanceof CollectorApiError
            ? cause.message
            : 'Não foi possível salvar os horários.',
      });
    } finally {
      setSaving(false);
      reload();
    }
  }

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.hours}
      title="Horários de operação"
      icon={Clock}
    >
      <ul className="grid gap-2 text-sm">
        {days.map((day) => {
          const labelId = `hours-${day.weekday}`;

          return (
            <li
              key={day.weekday}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3"
            >
              <div id={labelId}>
                <p className="font-bold text-slate-800">{day.label}</p>
                <p className="text-xs text-slate-500">
                  {day.open ? `${day.opens} às ${day.closes}` : 'Fechado'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={day.open}
                aria-labelledby={labelId}
                disabled={saving}
                onClick={() => toggleDay(day.weekday)}
                className={cn(
                  'relative h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-60',
                  day.open ? 'bg-brand-solid' : 'bg-slate-300'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left]',
                    day.open ? 'left-4.5' : 'left-0.5'
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-3 text-xs text-slate-500">
        Para mudar os horários de abertura e fechamento, use as configurações do
        ponto.
      </p>

      <Button
        type="button"
        size="lg"
        variant="secondary"
        disabled={saving || !hasOpenDay}
        aria-busy={saving}
        onClick={save}
        className="mt-3 w-full"
      >
        {saving ? 'Salvando horários...' : 'Salvar novos horários'}
      </Button>

      {!hasOpenDay && (
        <p className="mt-2 text-xs text-slate-500">
          Deixe pelo menos um dia aberto.
        </p>
      )}

      {feedback && (
        <p
          role={feedback.tone === 'error' ? 'alert' : 'status'}
          className={cn(
            'mt-2 text-sm font-medium',
            feedback.tone === 'error'
              ? 'text-red-700 dark:text-red-300'
              : 'text-brand'
          )}
        >
          {feedback.text}
        </p>
      )}
    </SectionCard>
  );
}
