import { publicApi } from "./api/axios";

export type PublicReview = {
  id: string;
  professionalId: string;
  rating: number;
  comment?: string | null;
  active: boolean;
  createdAt: string;
};

export async function findReviews(): Promise<PublicReview[]> {
  const { data } = await publicApi.get<PublicReview[]>("/reviews");
  return data;
}

export type RatingSummary = { average: number; count: number };

export const summarizeRatings = (reviews: PublicReview[]) => {
  const byProfessional = new Map<string, RatingSummary>();
  const active = reviews.filter((review) => review.active);

  for (const review of active) {
    const current = byProfessional.get(review.professionalId) ?? {
      average: 0,
      count: 0,
    };
    const count = current.count + 1;
    byProfessional.set(review.professionalId, {
      count,
      average: (current.average * current.count + review.rating) / count,
    });
  }

  const overall = active.length
    ? active.reduce((total, review) => total + review.rating, 0) / active.length
    : null;

  return { overall, count: active.length, byProfessional };
};
