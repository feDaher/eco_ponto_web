import type { CollectionSchedule } from './tipos';

function parseDate(date: string): Date | null {
  const civilDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);

  if (civilDate) {
    const year = Number(civilDate[1]);
    const month = Number(civilDate[2]);
    const day = Number(civilDate[3]);
    const utcDate = new Date(Date.UTC(year, month - 1, day));

    if (
      utcDate.getUTCFullYear() !== year ||
      utcDate.getUTCMonth() !== month - 1 ||
      utcDate.getUTCDate() !== day
    ) {
      return null;
    }

    return utcDate;
  }

  const fullDate = new Date(date);

  return Number.isNaN(fullDate.getTime()) ? null : fullDate;
}

export function calculateAverage(ratings: number[]): number {
  if (ratings.length === 0) {
    return 0;
  }

  const sum = ratings.reduce((total, rating) => total + rating, 0);

  return sum / ratings.length;
}

export function calculateDaysSince(date: string): number | null {
  const previousDate = parseDate(date);

  if (!previousDate) {
    return null;
  }

  const difference = Date.now() - previousDate.getTime();

  return Math.floor(Math.max(0, difference) / (1000 * 60 * 60 * 24));
}

export function needsVerification(date: string): boolean {
  const days = calculateDaysSince(date);

  return days === null || days >= 60;
}

export function formatDate(date: string): string {
  const parsedDate = parseDate(date);

  if (!parsedDate) {
    return 'Data não informada';
  }

  const civilDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const formattedDate = civilDate
    ? new Date(
        Number(civilDate[1]),
        Number(civilDate[2]) - 1,
        Number(civilDate[3])
      )
    : parsedDate;

  return new Intl.DateTimeFormat('pt-BR').format(formattedDate);
}

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function getMinutes(time: string): number | null {
  const parts = /^(\d{2}):(\d{2})$/.exec(time);

  if (!parts) {
    return null;
  }

  const hours = Number(parts[1]);
  const minutes = Number(parts[2]);

  if (hours > 23 || minutes > 59) {
    return null;
  }

  return hours * 60 + minutes;
}

export function isPointOpen(
  schedules: CollectionSchedule[],
  timeZone = 'America/Sao_Paulo',
  now = new Date()
): boolean {
  let dateParts: Intl.DateTimeFormatPart[];

  try {
    dateParts = new Intl.DateTimeFormat('pt-BR', {
      timeZone,
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).formatToParts(now);
  } catch {
    return false;
  }

  const dayName = normalizeText(
    dateParts.find((part) => part.type === 'weekday')?.value ?? ''
  );
  const dayIndex: Record<string, number> = {
    domingo: 0,
    'segunda-feira': 1,
    'terca-feira': 2,
    'quarta-feira': 3,
    'quinta-feira': 4,
    'sexta-feira': 5,
    sabado: 6,
  };
  const dayNumber = dayIndex[dayName];
  const hour = Number(dateParts.find((part) => part.type === 'hour')?.value);
  const minute = Number(
    dateParts.find((part) => part.type === 'minute')?.value
  );

  if (dayNumber === undefined || !Number.isFinite(hour + minute)) {
    return false;
  }

  const weekdayName = dayName.replace('-feira', '');
  const scheduleForDay = schedules.find((schedule) => {
    const scheduleDay = normalizeText(schedule.dia);

    if (scheduleDay.includes('segunda') && scheduleDay.includes('sexta')) {
      return dayNumber >= 1 && dayNumber <= 5;
    }

    if (scheduleDay.includes('sabado')) {
      return dayNumber === 6;
    }

    if (scheduleDay.includes('domingo')) {
      return dayNumber === 0;
    }

    return scheduleDay.includes(weekdayName);
  });

  if (!scheduleForDay?.aberto) {
    return false;
  }

  if (!scheduleForDay.inicio && !scheduleForDay.fim) {
    return true;
  }

  if (!scheduleForDay.inicio || !scheduleForDay.fim) {
    return false;
  }

  const startMinutes = getMinutes(scheduleForDay.inicio);
  const endMinutes = getMinutes(scheduleForDay.fim);

  if (startMinutes === null || endMinutes === null) {
    return false;
  }

  const currentMinutes = hour * 60 + minute;

  return startMinutes <= endMinutes
    ? currentMinutes >= startMinutes && currentMinutes < endMinutes
    : currentMinutes >= startMinutes || currentMinutes < endMinutes;
}
