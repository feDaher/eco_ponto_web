import type { OpeningHours, QuantityUnit, Review, Weekday } from '@/types/api';

export const OUTDATED_AFTER_DAYS = 60;

export const POINT_TIME_ZONE = 'America/Sao_Paulo';

export const WEEK_ORDER: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: 'Domingo',
  1: 'Segunda-feira',
  2: 'Terça-feira',
  3: 'Quarta-feira',
  4: 'Quinta-feira',
  5: 'Sexta-feira',
  6: 'Sábado',
};

const DAY_MS = 24 * 60 * 60 * 1000;

const SHORT_WEEKDAYS: Record<string, Weekday> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function parseDate(date: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  if (!match) return null;

  const [, year, month, day] = match.map(Number);
  const time = Date.UTC(year, month - 1, day);
  const parsed = new Date(time);

  return parsed.getUTCMonth() === month - 1 && parsed.getUTCDate() === day
    ? time
    : null;
}

export function formatDate(date: string) {
  const time = parseDate(date);
  if (time === null) return 'Data não informada';

  return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(time);
}

export function daysSince(date: string, now = Date.now()) {
  const time = parseDate(date);
  if (time === null) return null;

  return Math.max(0, Math.floor((now - time) / DAY_MS));
}

export function isOutdated(updatedAt: string, now = Date.now()) {
  const days = daysSince(updatedAt, now);
  return days === null || days > OUTDATED_AFTER_DAYS;
}

export function getLocalWeekdayAndTime(
  now = new Date(),
  timeZone = POINT_TIME_ZONE
) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '';

  return {
    weekday: SHORT_WEEKDAYS[get('weekday')],
    time: `${get('hour')}:${get('minute')}`,
  };
}

export function getHoursForDay(schedule: OpeningHours[], weekday: Weekday) {
  return schedule.filter((hours) => hours.weekdays.includes(weekday));
}

export function isOpenNow(schedule: OpeningHours[], now = new Date()) {
  const { weekday, time } = getLocalWeekdayAndTime(now);
  if (weekday === undefined) return false;

  return getHoursForDay(schedule, weekday).some(
    (hours) => time >= hours.opens && time < hours.closes
  );
}

export function averageRating(reviews: Review[]) {
  if (reviews.length === 0) return 0;
  return (
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  );
}

export function formatQuantity(value: number, unit: QuantityUnit) {
  const label = unit === 'unidade' && value !== 1 ? 'unidades' : unit;
  return `${new Intl.NumberFormat('pt-BR').format(value)} ${label}`;
}

export function pluralize(count: number, singular: string, plural: string) {
  return `${count} ${count === 1 ? singular : plural}`;
}
