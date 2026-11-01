import { describe, expect, it } from "vitest";
import {
  addMonths,
  buildCalendarDays,
  dateKey,
  daysInMonthOf,
  formatDayLabel,
  formatMonthLabel,
  monthStart,
  todayInBrazil,
} from "./date-utils";

describe("date-utils", () => {
  it("normaliza uma data para o primeiro dia do mês em UTC", () => {
    expect(dateKey(monthStart("2028-02-29"))).toBe("2028-02-01");
  });

  it("navega corretamente entre anos", () => {
    expect(dateKey(addMonths(monthStart("2026-12-15"), 1))).toBe("2027-01-01");
    expect(dateKey(addMonths(monthStart("2026-01-15"), -1))).toBe("2025-12-01");
  });

  it("monta uma grade completa de seis semanas", () => {
    const days = buildCalendarDays(monthStart("2026-03-01"));

    expect(days).toHaveLength(42);
    expect(days[0]?.getUTCDay()).toBe(0);
    expect(days.at(-1)?.getUTCDay()).toBe(6);
  });

  it("calcula fevereiro de ano bissexto", () => {
    expect(daysInMonthOf(monthStart("2028-02-03"))).toBe(29);
  });

  it("formata rótulos em português e retorna a data atual como ISO", () => {
    const date = new Date("2026-02-01T00:00:00.000Z");

    expect(formatMonthLabel(date)).toBe("Fevereiro de 2026");
    expect(formatDayLabel(date)).toContain("fevereiro");
    expect(todayInBrazil()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
