'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SectionCard } from '@/components/point/SectionCard';
import { COLLECTOR_SECTIONS } from '@/lib/routes';
import { cn } from '@/lib/utils';
import { collectorSchedule } from '@/data/mockCollector';

export function OpeningHoursEditor() {
  const [schedule, setSchedule] = useState(collectorSchedule);
  const [isSaved, setIsSaved] = useState(false);

  function toggleDay(id: string) {
    setSchedule((days) =>
      days.map((day) => (day.id === id ? { ...day, open: !day.open } : day))
    );
    setIsSaved(false);
  }

  return (
    <SectionCard
      id={COLLECTOR_SECTIONS.hours}
      title="Horários de operação"
      icon={Clock}
    >
      <ul className="grid gap-2 text-sm">
        {schedule.map((day) => {
          const labelId = `hours-${day.id}`;

          return (
            <li
              key={day.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-surface p-3"
            >
              <div id={labelId}>
                <p className="font-bold text-slate-800">{day.label}</p>
                <p className="text-xs text-slate-500">
                  {day.open ? day.hours : 'Fechado'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={day.open}
                aria-labelledby={labelId}
                onClick={() => toggleDay(day.id)}
                className={cn(
                  'relative h-5 w-9 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
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
        onClick={() => setIsSaved(true)}
        className="mt-3 w-full"
      >
        Salvar novos horários
      </Button>

      {isSaved && (
        <p role="status" className="mt-2 text-sm font-medium text-brand">
          Demonstração concluída. Nenhum horário foi salvo.
        </p>
      )}
    </SectionCard>
  );
}
