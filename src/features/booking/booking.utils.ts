import type { BookingFilters } from "./booking.types";

export function toBookingQuery(filters: BookingFilters): string {
  const params = new URLSearchParams();

  if (filters.professionalId)
    params.set("professionalId", filters.professionalId);

  if (filters.serviceId) params.set("serviceId", filters.serviceId);

  if (filters.date) params.set("date", filters.date);

  return params.toString();
}

export function formatSlot(startsAt: string): string {
  
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

export function todayInBrazil(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}
