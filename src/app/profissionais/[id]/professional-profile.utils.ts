import { currency } from "@/utils/format";
import type { PublicReview } from "@/services/review";
import type { BookingServiceItem } from "./professional-profile.types";

const shortDateText = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

export function formatPrice(value: number | string | undefined) {
  return currency.format(Number(value ?? 0));
}

export function formatDateLabel(date: string) {
  return shortDateText.format(new Date(`${date}T00:00:00`));
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

export function extractPortfolioImages(
  services: BookingServiceItem[],
  limit = 6,
) {
  return services
    .map((item) => item.service.image)
    .filter((image): image is string => Boolean(image))
    .slice(0, limit);
}

export function buildReviewSummary(reviews: PublicReview[]) {
  const active = reviews.filter((review) => review.active);
  const count = active.length;
  const average = count
    ? active.reduce((total, review) => total + review.rating, 0) / count
    : 0;

  return {
    average,
    count,
    breakdown: [5, 4, 3, 2, 1].map((stars) => {
      const total = active.filter((review) => review.rating === stars).length;
      return {
        stars,
        count: total,
        percentage: count ? Math.round((total / count) * 100) : 0,
      };
    }),
    withComment: active.filter((review) => review.comment?.trim()).slice(0, 6),
  };
}
