'use client';

import { useState } from 'react';
import { addDays, format, isBefore, parseISO, subDays } from 'date-fns';
import { ptBR } from 'react-day-picker/locale';
import type { DateRange, Matcher } from 'react-day-picker';
import { CalendarDays } from 'lucide-react';
import { Calendar } from '@/components/ui/Calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover';
import { MAX_PERIOD_DAYS, formatDateBR } from '@/lib/audit';
import { cn } from '@/lib/utils';
import { AUDIT_FIELD_CLASS } from './auditStyles';

type AuditPeriodPickerProps = {
  id: string;
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
};

function toDate(value: string) {
  return value ? parseISO(value) : undefined;
}

function toValue(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

function periodText(from: string, to: string) {
  if (from && to) return `${formatDateBR(from)} – ${formatDateBR(to)}`;
  if (from) return `A partir de ${formatDateBR(from)}`;
  if (to) return `Até ${formatDateBR(to)}`;
  return '';
}

export function AuditPeriodPicker({
  id,
  from,
  to,
  onChange,
}: AuditPeriodPickerProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>();
  const [today] = useState(() => new Date());

  const choosingEnd = Boolean(draft?.from && !draft.to);
  const disabled: Matcher[] = [{ after: today }];
  if (draft?.from && choosingEnd) {
    disabled.push(
      { after: addDays(draft.from, MAX_PERIOD_DAYS - 1) },
      { before: subDays(draft.from, MAX_PERIOD_DAYS - 1) }
    );
  }

  function handleOpenChange(next: boolean) {
    if (next) setDraft({ from: toDate(from), to: toDate(to) });
    setOpen(next);
  }

  function handleDayClick(day: Date, modifiers: { disabled?: boolean }) {
    if (modifiers.disabled) return;

    if (!draft?.from || draft.to) {
      setDraft({ from: day, to: undefined });
      return;
    }

    const [start, end] = isBefore(day, draft.from)
      ? [day, draft.from]
      : [draft.from, day];
    setDraft({ from: start, to: end });
    setOpen(false);
    onChange(toValue(start), toValue(end));
  }

  const label = periodText(from, to);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger
        id={id}
        className={cn(
          AUDIT_FIELD_CLASS,
          'flex w-full cursor-pointer items-center gap-2 text-left select-none',
          !label && 'text-slate-400'
        )}
      >
        <CalendarDays
          aria-hidden="true"
          className="size-4 shrink-0 text-slate-500"
        />
        <span className="truncate">{label || 'Selecione o período'}</span>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          mode="range"
          locale={ptBR}
          selected={draft}
          onDayClick={handleDayClick}
          defaultMonth={draft?.from ?? today}
          disabled={disabled}
          numberOfMonths={1}
        />
        <p
          aria-live="polite"
          className="border-t border-slate-100 px-3 py-2 text-xs text-slate-500"
        >
          {choosingEnd
            ? `Agora escolha a data final (até ${MAX_PERIOD_DAYS} dias).`
            : 'Escolha a data inicial do período.'}
        </p>
      </PopoverContent>
    </Popover>
  );
}
