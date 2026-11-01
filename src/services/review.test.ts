import { describe, expect, it } from "vitest";
import { summarizeRatings, type PublicReview } from "./review";

const review = (overrides: Partial<PublicReview>): PublicReview => ({
  id: "r",
  professionalId: "p1",
  rating: 5,
  active: true,
  createdAt: "2026-10-01T12:00:00.000Z",
  ...overrides,
});

describe("summarizeRatings", () => {
  it("calcula médias gerais e por profissional ignorando inativas", () => {
    const summary = summarizeRatings([
      review({ rating: 5 }),
      review({ rating: 3 }),
      review({ professionalId: "p2", rating: 4 }),
      review({ rating: 1, active: false }),
    ]);

    expect(summary.overall).toBe(4);
    expect(summary.count).toBe(3);
    expect(summary.byProfessional.get("p1")).toEqual({ average: 4, count: 2 });
  });

  it("retorna média nula sem avaliações", () => {
    expect(summarizeRatings([]).overall).toBeNull();
  });
});
