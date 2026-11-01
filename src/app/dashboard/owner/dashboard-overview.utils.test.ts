import { describe, expect, it } from "vitest";
import { makeAppointment, makePayment } from "@/test/factories";
import {
  buildRevenueTotals,
  buildServiceMix,
  buildTeamPerformance,
  formatTimeUntil,
  getAppointmentStatusText,
  getGreeting,
  getServiceName,
  getUpcomingAppointments,
  sumPaidPayments,
} from "./dashboard-overview.utils";

const now = new Date("2026-11-01T15:00:00.000Z");

describe("dashboard overview utils", () => {
  it("soma somente pagamentos pagos", () => {
    expect(
      sumPaidPayments([
        makePayment({ finalAmount: "40.5" }),
        makePayment({ id: "p2", finalAmount: 60 }),
        makePayment({ id: "p3", finalAmount: 999, status: "PENDING" }),
      ]),
    ).toBe(100.5);
  });

  it("separa a receita por semana, mês e ano", () => {
    const payments = [
      makePayment({ id: "today", paidAt: "2026-11-01T10:00:00.000Z" }),
      makePayment({ id: "month", paidAt: "2026-10-20T10:00:00.000Z" }),
      makePayment({ id: "year", paidAt: "2026-03-10T10:00:00.000Z" }),
      makePayment({ id: "last-year", paidAt: "2025-12-31T10:00:00.000Z" }),
      makePayment({ id: "unpaid", paidAt: null }),
    ];

    expect(buildRevenueTotals(payments, now)).toEqual({
      week: 50,
      month: 50,
      year: 150,
    });
  });

  it("ranqueia a equipe pela receita concluída e conta clientes únicos", () => {
    const team = buildTeamPerformance([
      makeAppointment({ status: "COMPLETED", price: 80 }),
      makeAppointment({ id: "a2", status: "COMPLETED", price: 40 }),
      makeAppointment({
        id: "a3",
        status: "PENDING",
        client: { id: "client-2", name: "João" },
      }),
      makeAppointment({
        id: "a4",
        status: "COMPLETED",
        price: 200,
        professional: { name: "Ana" },
      }),
    ]);

    expect(team).toEqual([
      { name: "Ana", clients: 1, revenue: 200 },
      { name: "Reinan", clients: 2, revenue: 120 },
    ]);
  });

  it("calcula o mix de serviços em porcentagem", () => {
    const mix = buildServiceMix([
      makeAppointment({ status: "COMPLETED" }),
      makeAppointment({ id: "a2", status: "COMPLETED" }),
      makeAppointment({
        id: "a3",
        status: "COMPLETED",
        service: { name: "Barba" },
      }),
      makeAppointment({ id: "a4", status: "CANCELLED" }),
    ]);

    expect(mix.total).toBe(3);
    expect(mix.items.map(({ name, value }) => [name, value])).toEqual([
      ["Corte de cabelo", 67],
      ["Barba", 33],
    ]);
  });

  it("lista os próximos agendamentos em ordem, sem cancelados ou concluídos", () => {
    const upcoming = getUpcomingAppointments(
      [
        makeAppointment({ id: "later", scheduledAt: "2026-11-03T10:00:00Z" }),
        makeAppointment({ id: "sooner", scheduledAt: "2026-11-02T10:00:00Z" }),
        makeAppointment({ id: "past", scheduledAt: "2026-10-01T10:00:00Z" }),
        makeAppointment({
          id: "cancelled",
          scheduledAt: "2026-11-02T11:00:00Z",
          status: "CANCELLED",
        }),
      ],
      now,
    );

    expect(upcoming.map((item) => item.id)).toEqual(["sooner", "later"]);
  });

  it("descreve quanto falta para o atendimento", () => {
    expect(formatTimeUntil("2026-11-01T15:20:00.000Z", now)).toBe("Em 20 min");
    expect(formatTimeUntil("2026-11-01T18:00:00.000Z", now)).toBe("Em 3 h");
    expect(formatTimeUntil("2026-11-10T15:00:00.000Z", now)).toBe("10 de nov.");
    expect(formatTimeUntil("2026-11-01T14:00:00.000Z", now)).toBe("Em 0 min");
  });

  it("traduz o status para o selo da tabela", () => {
    expect(getAppointmentStatusText("COMPLETED")).toBe("Completed");
    expect(getAppointmentStatusText("confirmed")).toBe("Completed");
    expect(getAppointmentStatusText("PENDING")).toBe("Pending");
  });

  it("aceita o serviço como texto ou objeto", () => {
    expect(getServiceName(makeAppointment())).toBe("Corte de cabelo");
    expect(
      getServiceName(
        makeAppointment({ service: "Barba" as unknown as { name: string } }),
      ),
    ).toBe("Barba");
    expect(getServiceName(makeAppointment({ service: { name: "" } }))).toBe(
      "Serviço não informado",
    );
  });

  it("cumprimenta conforme o horário de Brasília", () => {
    expect(getGreeting(new Date("2026-11-01T11:00:00.000Z"))).toBe("Bom dia");
    expect(getGreeting(new Date("2026-11-01T17:00:00.000Z"))).toBe("Boa tarde");
    expect(getGreeting(new Date("2026-11-01T23:00:00.000Z"))).toBe("Boa noite");
  });
});
