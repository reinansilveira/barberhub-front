import type { BookingServiceItem } from "./professional-profile.types";

export function formatPrice(value: number | string | undefined) {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(amount);
}

export function buildAvatarUrl(avatar: string | undefined, name: string) {
  return (
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1f1f1f&color=d4a72c&size=400`
  );
}

export function formatDuration(duration: number | string | undefined) {
  const minutes = Number(duration ?? 0);

  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (hours > 0 && remainder > 0) {
    return `${hours} h ${remainder} min`;
  }

  if (hours > 0) {
    return `${hours} h`;
  }

  return `${remainder} min`;
}

export function extractPortfolioImages(services: BookingServiceItem[], limit = 6) {
  return services
    .map((item) => item.service.image)
    .filter((image): image is string => Boolean(image))
    .slice(0, limit);
}