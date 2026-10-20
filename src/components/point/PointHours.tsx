import { Clock3 } from 'lucide-react';
import {
  WEEKDAY_LABELS,
  WEEK_ORDER,
  getHoursForDay,
  getLocalWeekdayAndTime,
} from '@/lib/points';
import { cn } from '@/lib/utils';
import type { OpeningHours } from '@/types/api';
import { SectionCard } from './SectionCard';

type PointHoursProps = {
  schedule: OpeningHours[];
  closedOnHolidays: boolean;
};

export function PointHours({ schedule, closedOnHolidays }: PointHoursProps) {
  const { weekday: today } = getLocalWeekdayAndTime();

  return (
    <SectionCard
      id="hours"
      title="Horários de funcionamento"
      description="Horário de Brasília."
      icon={Clock3}
    >
      <ul className="space-y-1.5">
        {WEEK_ORDER.map((day) => {
          const hours = getHoursForDay(schedule, day);
          const isToday = day === today;

          return (
            <li
              key={day}
              aria-current={isToday ? 'date' : undefined}
              className={cn(
                'flex items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm',
                isToday
                  ? 'bg-brand-light font-semibold text-brand-dark'
                  : 'bg-surface-alt text-slate-700'
              )}
            >
              <span className="flex items-center gap-2">
                {WEEKDAY_LABELS[day]}
                {isToday && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-[10px] tracking-wide uppercase">
                    Hoje
                  </span>
                )}
              </span>
              <span className={cn(hours.length === 0 && 'text-slate-500')}>
                {hours.length > 0
                  ? hours.map((h) => `${h.opens} às ${h.closes}`).join(', ')
                  : 'Fechado'}
              </span>
            </li>
          );
        })}
      </ul>

      {closedOnHolidays && (
        <p className="mt-3 text-xs text-slate-500">Fechado em feriados.</p>
      )}
    </SectionCard>
  );
}
