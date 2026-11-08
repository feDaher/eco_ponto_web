const TIME_ZONE = 'America/Sao_Paulo';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
  timeZone: TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

export function formatDateTime(iso: string): { date: string; time: string } {
  const date = new Date(iso);
  return { date: dateFormatter.format(date), time: timeFormatter.format(date) };
}

export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-');
  return `${day}/${month}/${year}`;
}
