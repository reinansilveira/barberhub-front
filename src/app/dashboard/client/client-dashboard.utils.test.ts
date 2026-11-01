import { describe, expect, it } from "vitest";
import { makeClientAppointment } from "@/test/factories";
import {
  appointmentStatusLabel,
  buildAccountSummary,
  getAppointmentDateBadge,
  getUpcomingAppointments,
  isOpenAppointment,
} from "./client-dashboard.utils";

describe("client dashboard utils", () => {
  it("traduz os status do agendamento", () => {
    expect(appointmentStatusLabel("CANCELLED")).toBe("Cancelado");
    expect(appointmentStatusLabel("COMPLETED")).toBe("Concluído");
    expect(appointmentStatusLabel("CONFIRMED")).toBe("Confirmado");
    expect(appointmentStatusLabel("IN_PROGRESS")).toBe("Em atendimento");
    expect(appointmentStatusLabel("PENDING")).toBe("Pendente");
  });

  it("considera em aberto o que não foi cancelado nem concluído", () => {
    expect(isOpenAppointment("PENDING")).toBe(true);
    expect(isOpenAppointment("CANCELLED")).toBe(false);
    expect(isOpenAppointment("COMPLETED")).toBe(false);
  });

  it("gera o selo de data com mês abreviado e dia com dois dígitos", () => {
    expect(getAppointmentDateBadge("2026-11-05T13:00:00.000Z")).toEqual({
      month: "nov",
      day: "05",
    });
  });

  it("filtra os agendamentos futuros em aberto", () => {
    const upcoming = getUpcomingAppointments([
      makeClientAppointment({ id: "open" }),
      makeClientAppointment({ id: "done", status: "COMPLETED" }),
    ]);

    expect(upcoming.map((item) => item.id)).toEqual(["open"]);
  });

  it("resume histórico, gasto total e próximo horário", () => {
    const summary = buildAccountSummary(
      [
        makeClientAppointment({
          id: "done-1",
          status: "COMPLETED",
          price: "30",
        }),
        makeClientAppointment({ id: "done-2", status: "COMPLETED", price: 20 }),
        makeClientAppointment({
          id: "later",
          scheduledAt: "2026-11-20T13:00:00.000Z",
        }),
        makeClientAppointment({
          id: "next",
          scheduledAt: "2026-11-03T13:00:00.000Z",
        }),
        makeClientAppointment({
          id: "past",
          scheduledAt: "2026-10-01T13:00:00.000Z",
        }),
      ],
      new Date("2026-11-01T12:00:00.000Z"),
    );

    expect(summary.completedCount).toBe(2);
    expect(summary.totalSpent).toBe(50);
    expect(summary.history.map((item) => item.id)).toEqual([
      "done-1",
      "done-2",
    ]);
    expect(summary.nextAppointment?.id).toBe("next");
  });
});
