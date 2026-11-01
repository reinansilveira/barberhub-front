import type { Appointment } from "@/services/appointment";
import { isCompleted } from "../_shared/dashboard.utils";
import type { Payment } from "./owner.types";

export type RevenuePeriod = "week" | "month" | "year";

export const REVENUE_PERIODS: ReadonlyArray<readonly [RevenuePeriod, string]> =
  [
    ["week", "Semana"],
    ["month", "Mês"],
    ["year", "Ano"],
  ];

export const REVENUE_PERIOD_NAMES: Record<RevenuePeriod, string> = {
  week: "semanal",
  month: "mensal",
  year: "anual",
};

const WEEK_IN_MS = 7 * 24 * 60 * 60 * 1000;
const SERVICE_MIX_COLORS = ["#09c9ae", "#ffd45d", "#9333ea", "#7656dc"];

export type TeamMemberPerformance = {
  name: string;
  clients: number;
  revenue: number;
};

export type ServiceMixItem = { name: string; value: number; fill: string };

const isPaymentInPeriod = (paidAt: Date, period: RevenuePeriod, now: Date) => {
  if (period === "year") return paidAt.getFullYear() === now.getFullYear();
  if (period === "month") {
    return (
      paidAt.getFullYear() === now.getFullYear() &&
      paidAt.getMonth() === now.getMonth()
    );
  }
  return now.getTime() - paidAt.getTime() <= WEEK_IN_MS;
};

export const sumPaidPayments = (payments: Payment[]) =>
  payments
    .filter((payment) => payment.status === "PAID")
    .reduce((total, payment) => total + Number(payment.finalAmount || 0), 0);

export const sumPaidPaymentsInPeriod = (
  payments: Payment[],
  period: RevenuePeriod,
  now: Date,
) =>
  sumPaidPayments(
    payments.filter(
      (payment) =>
        payment.paidAt &&
        isPaymentInPeriod(new Date(payment.paidAt), period, now),
    ),
  );

export const buildRevenueTotals = (
  payments: Payment[],
  now: Date,
): Record<RevenuePeriod, number> => ({
  week: sumPaidPaymentsInPeriod(payments, "week", now),
  month: sumPaidPaymentsInPeriod(payments, "month", now),
  year: sumPaidPaymentsInPeriod(payments, "year", now),
});

const isCompletedAppointment = (status: string) => /complete/i.test(status);

export const buildTeamPerformance = (
  appointments: Appointment[],
): TeamMemberPerformance[] => {
  const byProfessional = appointments.reduce((members, appointment) => {
    const name = appointment.professional?.name;
    if (!name) return members;

    const member = members.get(name) ?? {
      name,
      clients: new Set<string>(),
      revenue: 0,
    };
    member.clients.add(appointment.client.id ?? appointment.client.name);
    if (isCompletedAppointment(appointment.status)) {
      member.revenue += Number(appointment.price || 0);
    }
    return members.set(name, member);
  }, new Map<string, { name: string; clients: Set<string>; revenue: number }>());

  return Array.from(byProfessional.values())
    .map((member) => ({ ...member, clients: member.clients.size }))
    .sort((first, second) => second.revenue - first.revenue)
    .slice(0, 3);
};

export const buildServiceMix = (appointments: Appointment[]) => {
  const completed = appointments.filter((appointment) =>
    isCompletedAppointment(appointment.status),
  );
  const counts = completed.reduce((totals, appointment) => {
    const name = appointment.service?.name ?? "Serviço";
    return totals.set(name, (totals.get(name) ?? 0) + 1);
  }, new Map<string, number>());

  const items: ServiceMixItem[] = Array.from(counts.entries()).map(
    ([name, count], index) => ({
      name,
      value: Math.round((count / completed.length) * 100),
      fill: SERVICE_MIX_COLORS[index % SERVICE_MIX_COLORS.length],
    }),
  );

  return { total: completed.length, items };
};

export const getUpcomingAppointments = (
  appointments: Appointment[],
  now: Date,
  limit = 3,
) =>
  appointments
    .filter(
      (appointment) =>
        !/cancel|complete/i.test(appointment.status) &&
        new Date(appointment.scheduledAt) >= now,
    )
    .sort(
      (first, second) =>
        +new Date(first.scheduledAt) - +new Date(second.scheduledAt),
    )
    .slice(0, limit);

const shortDate = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

export const formatTimeUntil = (scheduledAt: string, now: Date) => {
  const difference = new Date(scheduledAt).getTime() - now.getTime();
  const minutes = Math.max(0, Math.round(difference / 60000));
  if (minutes < 60) return `Em ${minutes} min`;
  if (minutes < 1440) return `Em ${Math.round(minutes / 60)} h`;
  return shortDate.format(new Date(scheduledAt));
};

export const getAppointmentStatusText = (status: string) =>
  isCompleted(status) || status === "confirmed" ? "Completed" : "Pending";

export const getServiceName = (appointment: Appointment) => {
  const service = appointment.service as Appointment["service"] | string;
  if (typeof service === "string") return service;
  return service?.name || "Serviço não informado";
};

const hourInBrazil = new Intl.DateTimeFormat("pt-BR", {
  hour: "numeric",
  hourCycle: "h23",
  timeZone: "America/Sao_Paulo",
});

export const getGreeting = (now: Date) => {
  const hour = Number(hourInBrazil.format(now));
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};
