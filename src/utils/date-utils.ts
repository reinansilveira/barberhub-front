export function today() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function monthStart(date: string) {
  const value = new Date(`${date}T12:00:00Z`);
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
}

export function addMonths(date: Date, amount: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1));
}

export function buildCalendarDays(visibleMonth: Date) {
  const gridStart = new Date(visibleMonth);
  gridStart.setUTCDate(visibleMonth.getUTCDate() - visibleMonth.getUTCDay());

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(gridStart);
    day.setUTCDate(gridStart.getUTCDate() + index);
    return day;
  });
}

export function formatMonthLabel(visibleMonth: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(visibleMonth);
}

export function formatDayLabel(day: Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeZone: "UTC" }).format(day);
}

export function daysInMonthOf(visibleMonth: Date) {
  return new Date(
    Date.UTC(visibleMonth.getUTCFullYear(), visibleMonth.getUTCMonth() + 1, 0),
  ).getUTCDate();
}