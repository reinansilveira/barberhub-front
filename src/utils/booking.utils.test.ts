import { describe, expect, it } from "vitest";
import { formatSlot, toBookingQuery } from "./booking.utils";

describe("booking utils", () => {
  it("formata o horário no fuso de São Paulo", () => {
    expect(formatSlot("2026-11-02T13:30:00.000Z")).toBe("10:30");
  });

  it("monta a query só com os filtros preenchidos", () => {
    expect(toBookingQuery({ professionalId: "p1", date: "2026-11-02" })).toBe(
      "professionalId=p1&date=2026-11-02",
    );
    expect(toBookingQuery({})).toBe("");
  });
});
