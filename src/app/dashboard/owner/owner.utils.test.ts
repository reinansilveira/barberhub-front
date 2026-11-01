import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { makeAppointment, makePayment } from "@/test/factories";
import { buildDashboardOverviewStats, resolveTitle } from "./owner.utils";

describe("buildDashboardOverviewStats", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-11-01T15:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("calcula os indicadores do dia e a satisfação", () => {
    const stats = buildDashboardOverviewStats(
      [
        makeAppointment({ scheduledAt: "2026-11-01T13:00:00.000Z" }),
        makeAppointment({
          id: "a2",
          status: "COMPLETED",
          scheduledAt: "2026-11-01T14:00:00.000Z",
          client: { id: "client-2", name: "João" },
        }),
        makeAppointment({
          id: "returning",
          scheduledAt: "2026-11-01T16:00:00.000Z",
          client: { id: "client-3", name: "Ana" },
        }),
        makeAppointment({
          id: "first-visit",
          scheduledAt: "2026-10-01T16:00:00.000Z",
          client: { id: "client-3", name: "Ana" },
        }),
        makeAppointment({
          id: "cancelled",
          status: "CANCELLED",
          scheduledAt: "2026-11-01T17:00:00.000Z",
        }),
      ],
      [
        makePayment({ finalAmount: 40 }),
        makePayment({ id: "old", paidAt: "2026-10-01T12:00:00.000Z" }),
      ],
      [
        { id: "r1", rating: 5, active: true },
        { id: "r2", rating: 4, active: true },
        { id: "r3", rating: 1, active: false },
      ],
    );

    expect(stats).toMatchObject({
      todayEarnings: 40,
      todayAppointments: 3,
      completedToday: 1,
      newClientsToday: 2,
      satisfaction: 90,
      reviewCount: 2,
    });
    expect(stats.ratingDistribution.map((item) => item.count)).toEqual([
      0, 0, 0, 1, 1,
    ]);
  });

  it("não inventa satisfação quando não há avaliações", () => {
    expect(buildDashboardOverviewStats([], [], []).satisfaction).toBeNull();
  });
});

describe("resolveTitle", () => {
  it("usa o rótulo do menu para cada visão", () => {
    expect(resolveTitle("dashboard")).toBe("Painel");
    expect(resolveTitle("agenda")).toBe("Agenda");
  });
});
