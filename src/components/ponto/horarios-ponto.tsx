import { Clock3 } from 'lucide-react';

import type { CollectionPoint } from '@/utils/tipos';

type PointHoursProps = {
  schedules: CollectionPoint['horarios'];
};
// componente que exibe os horários de funcionamento do ponto de coleta
export function PointHours({ schedules }: PointHoursProps) {
  return (
    <section
      aria-labelledby="horarios-heading"
      className="rounded-lg border bg-card p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="horarios-heading" className="text-lg font-semibold">
            Horários de Funcionamento
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Confira os dias e horários de atendimento.
          </p>
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
          <Clock3 aria-hidden="true" className="size-4" />
        </span>
      </div>

      <ul className="mt-5 space-y-2">
        {schedules.map((schedule) => (
          <li
            key={schedule.dia}
            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-md bg-muted/60 px-3 py-3 text-sm"
          >
            <span className="flex items-center gap-2 font-medium">
              <span
                aria-hidden="true"
                className={`size-2 rounded-full ${schedule.aberto ? 'bg-emerald-600' : 'bg-muted-foreground/40'}`}
              />
              {schedule.dia}
            </span>
            <span
              className={
                schedule.aberto ? 'text-foreground' : 'text-muted-foreground'
              }
            >
              {schedule.aberto && schedule.inicio && schedule.fim
                ? `${schedule.inicio} às ${schedule.fim}`
                : (schedule.observacao ?? 'Fechado')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
