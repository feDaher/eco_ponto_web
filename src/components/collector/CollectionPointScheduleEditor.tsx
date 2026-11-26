import { Plus, Trash2 } from 'lucide-react';
import type { CollectionPointWeekday } from '@/types/CollectionPointSettings';

type ScheduleEntry = {
  weekday: CollectionPointWeekday;
  openTime: string;
  closeTime: string;
};

type CollectionPointScheduleEditorProps = {
  value: ScheduleEntry[];
  onChange: (value: ScheduleEntry[]) => void;
};

const Weekdays: { value: CollectionPointWeekday; label: string }[] = [
  { value: 'MONDAY', label: 'Segunda-feira' },
  { value: 'TUESDAY', label: 'Terça-feira' },
  { value: 'WEDNESDAY', label: 'Quarta-feira' },
  { value: 'THURSDAY', label: 'Quinta-feira' },
  { value: 'FRIDAY', label: 'Sexta-feira' },
  { value: 'SATURDAY', label: 'Sábado' },
  { value: 'SUNDAY', label: 'Domingo' },
];

export function CollectionPointScheduleEditor({
  value,
  onChange,
}: CollectionPointScheduleEditorProps) {
  function ToggleDay(day: CollectionPointWeekday, enabled: boolean) {
    if (enabled) {
      onChange([
        ...value,
        { weekday: day, openTime: '08:00', closeTime: '17:00' },
      ]);
      return;
    }
    onChange(value.filter((entry) => entry.weekday !== day));
  }

  function UpdateTime(
    index: number,
    field: 'openTime' | 'closeTime',
    time: string
  ) {
    onChange(
      value.map((entry, entryIndex) =>
        entryIndex === index ? { ...entry, [field]: time } : entry
      )
    );
  }

  function AddInterval(day: CollectionPointWeekday) {
    onChange([
      ...value,
      { weekday: day, openTime: '13:00', closeTime: '17:00' },
    ]);
  }

  function RemoveInterval(index: number) {
    onChange(value.filter((_, entryIndex) => entryIndex !== index));
  }

  return (
    <div className="space-y-3">
      {Weekdays.map(({ value: day, label }) => {
        const intervals = value
          .map((entry, index) => ({ ...entry, index }))
          .filter((entry) => entry.weekday === day);

        return (
          <fieldset
            key={day}
            className="rounded-xl border border-slate-200 bg-surface p-3"
          >
            <legend className="sr-only">{label}</legend>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={intervals.length > 0}
                  onChange={(event) => ToggleDay(day, event.target.checked)}
                  className="size-4 accent-brand"
                />
                {label}
              </label>
              {intervals.length > 0 && (
                <button
                  type="button"
                  onClick={() => AddInterval(day)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                >
                  <Plus aria-hidden="true" className="size-3.5" />
                  Adicionar intervalo
                </button>
              )}
            </div>

            {intervals.length === 0 ? (
              <p className="ml-6 mt-1 text-xs text-slate-500">Fechado</p>
            ) : (
              <div className="mt-3 space-y-2">
                {intervals.map(
                  ({ index, openTime, closeTime }, intervalNumber) => (
                    <div
                      key={`${day}-${intervalNumber}`}
                      className="ml-6 flex flex-wrap items-end gap-2"
                    >
                      <label className="grid gap-1 text-xs text-slate-600">
                        Início
                        <input
                          type="time"
                          required
                          value={openTime}
                          onChange={(event) =>
                            UpdateTime(index, 'openTime', event.target.value)
                          }
                          className="rounded-lg border border-slate-300 bg-card px-2 py-1.5 text-sm text-slate-800"
                        />
                      </label>
                      <label className="grid gap-1 text-xs text-slate-600">
                        Fim
                        <input
                          type="time"
                          required
                          value={closeTime}
                          onChange={(event) =>
                            UpdateTime(index, 'closeTime', event.target.value)
                          }
                          className="rounded-lg border border-slate-300 bg-card px-2 py-1.5 text-sm text-slate-800"
                        />
                      </label>
                      {intervalNumber > 0 && (
                        <button
                          type="button"
                          aria-label={`Remover intervalo de ${label.toLowerCase()}`}
                          onClick={() => RemoveInterval(index)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 aria-hidden="true" className="size-4" />
                        </button>
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
