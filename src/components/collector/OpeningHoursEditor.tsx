'use client';

import { useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import { useCollector } from '@/components/collector/collectorContext';
import { SectionCard } from '@/components/point/SectionCard';
import { Button } from '@/components/ui/Button';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import { cn } from '@/lib/utils';
import {
  CollectorApiError,
  updateCollectorPointSchedule,
} from '@/services/collector';
import type { OpeningHours, Weekday } from '@/types/api';

type DayScheduleItem = {
  weekday: Weekday;
  label: string;
  opens: string;
  closes: string;
  open: boolean;
};

const WEEKDAY_LABELS: Array<{
  weekday: Weekday;
  label: string;
  defaultOpens: string;
  defaultCloses: string;
}> = [
  {
    weekday: 1,
    label: 'Segunda-feira',
    defaultOpens: '08:00',
    defaultCloses: '18:00',
  },
  {
    weekday: 2,
    label: 'Terça-feira',
    defaultOpens: '08:00',
    defaultCloses: '18:00',
  },
  {
    weekday: 3,
    label: 'Quarta-feira',
    defaultOpens: '08:00',
    defaultCloses: '18:00',
  },
  {
    weekday: 4,
    label: 'Quinta-feira',
    defaultOpens: '08:00',
    defaultCloses: '18:00',
  },
  {
    weekday: 5,
    label: 'Sexta-feira',
    defaultOpens: '08:00',
    defaultCloses: '18:00',
  },
  {
    weekday: 6,
    label: 'Sábado',
    defaultOpens: '08:00',
    defaultCloses: '12:00',
  },
  {
    weekday: 0,
    label: 'Domingo',
    defaultOpens: '08:00',
    defaultCloses: '12:00',
  },
];

function buildDaysFromSchedule(
  schedule: OpeningHours[] | undefined
): DayScheduleItem[] {
  const entries = schedule ?? [];

  return WEEKDAY_LABELS.map(
    ({ weekday, label, defaultOpens, defaultCloses }) => {
      const matched = entries.find((item) => item.weekdays.includes(weekday));

      if (!matched) {
        return {
          weekday,
          label,
          opens: defaultOpens,
          closes: defaultCloses,
          open: false,
        };
      }

      return {
        weekday,
        label,
        opens: matched.opens || defaultOpens,
        closes: matched.closes || defaultCloses,
        open: true,
      };
    }
  );
}

function toOpeningHoursPayload(days: DayScheduleItem[]): OpeningHours[] {
  return days
    .filter((day) => day.open)
    .map((day) => ({
      weekdays: [day.weekday],
      opens: day.opens,
      closes: day.closes,
    }));
}

type ScheduleEditorInnerProps = {
  pointId: string;
  initialDays: DayScheduleItem[];
  onSaved?: () => Promise<void> | void;
};

function ScheduleEditorInner({
  pointId,
  initialDays,
  onSaved,
}: ScheduleEditorInnerProps) {
  const [days, setDays] = useState<DayScheduleItem[]>(initialDays);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleDay(weekday: Weekday) {
    setDays((current) =>
      current.map((day) =>
        day.weekday === weekday ? { ...day, open: !day.open } : day
      )
    );
    setStatusMessage(null);
    setErrorMessage(null);
  }

  async function handleSave() {
    const token =
      typeof window !== 'undefined'
        ? (window.localStorage.getItem('token') ??
          window.localStorage.getItem('accessToken') ??
          '')
        : '';

    if (!token) {
      setErrorMessage('Sessão não encontrada. Faça login novamente.');
      return;
    }

    setSaving(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await updateCollectorPointSchedule(
        token,
        pointId,
        toOpeningHoursPayload(days)
      );
      await onSaved?.();
      setStatusMessage('Horários de operação atualizados com sucesso.');
    } catch (error) {
      setErrorMessage(
        error instanceof CollectorApiError
          ? error.message
          : 'Não foi possível salvar os horários de operação.'
      );
    } finally {
      setSaving(false);
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
                  day.open ? 'bg-brand' : 'bg-slate-300'
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
        Alterações de horário são publicadas no app do cidadão assim que salvas.
      </p>

      <Button
        type="button"
        size="lg"
        variant="secondary"
        disabled={saving}
        onClick={handleSave}
        className="mt-3 w-full"
      >
        {saving ? 'Salvando horários...' : 'Salvar novos horários'}
      </Button>

      {errorMessage && (
        <p role="alert" className="mt-2 text-sm font-medium text-red-700">
          {errorMessage}
        </p>
      )}

      {statusMessage && (
        <p role="status" className="mt-2 text-sm font-medium text-brand">
          {statusMessage}
        </p>
      )}
    </SectionCard>
  );
}

export function OpeningHoursEditor() {
  const { selectedPoint, reload } = useCollector();

  const pointKey = selectedPoint
    ? `${selectedPoint.id}:${JSON.stringify(selectedPoint.schedule)}`
    : 'no-point';

  const initialDays = useMemo(
    () => buildDaysFromSchedule(selectedPoint?.schedule),
    [pointKey]
  );

  if (!selectedPoint) {
    return (
      <SectionCard
        id={COLLECTOR_SECTIONS.hours}
        title="Horários de operação"
        icon={Clock}
      >
        <p className="text-sm text-slate-500">
          Selecione ou cadastre um ponto de coleta para gerenciar os horários.
        </p>
      </SectionCard>
    );
  }

  return (
    <ScheduleEditorInner
      key={pointKey}
      pointId={selectedPoint.id}
      initialDays={initialDays}
      onSaved={reload}
    />
  );
}
