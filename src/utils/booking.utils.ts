import type { BookingFilters } from "../features/booking/booking.types";

export function toBookingQuery(filters: BookingFilters): string {
  const params = new URLSearchParams();

  if (filters.professionalId)
    params.set("professionalId", filters.professionalId);

  if (filters.serviceId) params.set("serviceId", filters.serviceId);

  if (filters.date) params.set("date", filters.date);

  return params.toString();
}

export type BookingSummary = {
  service?: string;
  professional?: string;
  date?: string;
  time?: string;
};

export function buildSuccessPath(summary: BookingSummary): string {
  const params = new URLSearchParams();
  Object.entries(summary).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  const query = params.toString();
  return query ? `/success?${query}` : "/success";
}

export function formatSlot(startsAt: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));
}
