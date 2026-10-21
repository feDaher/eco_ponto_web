'use client';

import { useState, type SubmitEvent } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { FIELD_CLASS } from '@/components/point/fieldStyles';
import { WEEK_ORDER, WEEKDAY_LABELS } from '@/lib/points';
import type { OpeningHours } from '@/types/api';

export function formatWeekdays(weekdays: OpeningHours['weekdays']) {
  return WEEK_ORDER.filter((day) => weekdays.includes(day))
    .map((day) => WEEKDAY_LABELS[day].split('-')[0])
    .join(', ');
}

type PointHoursFormProps = {
  pointId: string;
  pointName: string;
  schedule: OpeningHours[];
  onSave: (schedule: OpeningHours[]) => void;
  onCancel: () => void;
};

export function PointHoursForm({
  pointId,
  pointName,
  schedule,
  onSave,
  onCancel,
}: PointHoursFormProps) {
  const [hours, setHours] = useState(schedule);
  const [error, setError] = useState<string | null>(null);
  const errorId = `hours-${pointId}-error`;

  function update(index: number, field: 'opens' | 'closes', value: string) {
    setHours((current) =>
      current.map((entry, i) =>
        i === index ? { ...entry, [field]: value } : entry
      )
    );
    setError(null);
  }

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (hours.some((entry) => !entry.opens || !entry.closes)) {
      setError('Preencha os horários de abertura e fechamento.');
      return;
    }

    if (hours.some((entry) => entry.opens >= entry.closes)) {
      setError('O horário de abertura deve ser anterior ao de fechamento.');
      return;
    }

    onSave(hours);
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label={`Editar horários de ${pointName}`}
      className="space-y-3 rounded-2xl bg-surface-alt p-4"
    >
      {hours.map((entry, index) => {
        const days = formatWeekdays(entry.weekdays);

        return (
          <fieldset
            key={days}
            className="grid gap-2 sm:grid-cols-[1fr_auto_auto] sm:items-center"
          >
            <legend className="sr-only">{days}</legend>
            <span
              aria-hidden="true"
              className="text-sm font-medium text-slate-800"
            >
              {days}
            </span>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              Abre
              <input
                type="time"
                value={entry.opens}
                onChange={(event) => update(index, 'opens', event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={FIELD_CLASS}
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-600">
              Fecha
              <input
                type="time"
                value={entry.closes}
                onChange={(event) =>
                  update(index, 'closes', event.target.value)
                }
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className={FIELD_CLASS}
              />
            </label>
          </fieldset>
        );
      })}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          className="cursor-pointer"
          type="button"
          variant="ghost"
          onClick={onCancel}
        >
          <X aria-hidden="true" />
          Cancelar
        </Button>
        <Button className="cursor-pointer" type="submit">
          <Check aria-hidden="true" />
          Salvar e confirmar horários
        </Button>
      </div>
    </form>
  );
}
