import type { Appointment } from "@/services/appointment";
import { isCompleted } from "../_shared/dashboard.utils";
import type { Payment } from "./owner.types";

export interface RevenueDay {
  date: Date;
  entries: Appointment[];
  revenue: number;
}

export interface RevenueChartModel {
  days: RevenueDay[];
  useBookings: boolean;
  max: number;
  values: number[];
  periods: Record<
    "week" | "month" | "year",
    Array<{ label: string; value: number }>
  >;
}

const buildRevenueDays = (
  appointments: Appointment[],
  now: Date,
): RevenueDay[] => {
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 6 + index);

    const entries = appointments.filter(
      (item) =>
        new Date(item.scheduledAt).toDateString() === date.toDateString(),
    );
    const revenue = entries
      .filter((item) => isCompleted(item.status))
      .reduce((sum, item) => sum + Number(item.price || 0), 0);

    return { date, entries, revenue };
  });
};

export const getRevenueChartModel = (
  appointments: Appointment[],
  now = new Date(),
): RevenueChartModel => {
  const days = buildRevenueDays(appointments, now);
  const useBookings = false;
  const values = days.map((day) => day.revenue);
  const max = Math.max(...values, 1);
  const completed = appointments.filter((item) => isCompleted(item.status));
  const week = days.map((day) => ({
    label: day.date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", ""),
    value: day.revenue,
  }));
  const month = Array.from({ length: 4 }, (_, index) => {
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);
    end.setDate(end.getDate() - (3 - index) * 7);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return {
      label: `${index + 1}ª sem`,
      value: completed
        .filter((item) => {
          const date = new Date(item.scheduledAt);
          return date >= start && date <= end;
        })
        .reduce((sum, item) => sum + Number(item.price || 0), 0),
    };
  });
  const year = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), index, 1);
    return {
      label: date
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", ""),
      value: completed
        .filter((item) => {
          const itemDate = new Date(item.scheduledAt);
          return (
            itemDate.getFullYear() === now.getFullYear() &&
            itemDate.getMonth() === index
          );
        })
        .reduce((sum, item) => sum + Number(item.price || 0), 0),
    };
  });

  return {
    days,
    useBookings,
    values,
    max,
    periods: { week, month, year },
  };
};

export const getPaymentRevenueChartModel = (
  payments: Payment[],
  now = new Date(),
): RevenueChartModel => {
  const paidPayments = payments.filter((payment) => payment.status === "PAID");
  const paymentDate = (payment: Payment) =>
    new Date(payment.paidAt ?? payment.createdAt ?? 0);
  const paymentAmount = (payment: Payment) => Number(payment.finalAmount || 0);
  const totalBetween = (start: Date, end: Date) =>
    paidPayments
      .filter((payment) => {
        const date = paymentDate(payment);
        return date >= start && date <= end;
      })
      .reduce((sum, payment) => sum + paymentAmount(payment), 0);
  const startOfDay = (date: Date) => {
    const value = new Date(date);
    value.setHours(0, 0, 0, 0);
    return value;
  };
  const endOfDay = (date: Date) => {
    const value = new Date(date);
    value.setHours(23, 59, 59, 999);
    return value;
  };
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = startOfDay(now);
    date.setDate(date.getDate() - 6 + index);
    return {
      date,
      entries: [],
      revenue: totalBetween(date, endOfDay(date)),
    };
  });
  const week = days.map((day) => ({
    label: day.date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", ""),
    value: day.revenue,
  }));
  const month = Array.from({ length: 4 }, (_, index) => {
    const end = endOfDay(now);
    end.setDate(end.getDate() - (3 - index) * 7);
    const start = startOfDay(end);
    start.setDate(start.getDate() - 6);
    return { label: `${index + 1}ª sem`, value: totalBetween(start, end) };
  });
  const year = Array.from({ length: 12 }, (_, index) => {
    const start = new Date(now.getFullYear(), index, 1);
    const end = endOfDay(new Date(now.getFullYear(), index + 1, 0));
    return {
      label: start
        .toLocaleDateString("pt-BR", { month: "short" })
        .replace(".", ""),
      value: totalBetween(start, end),
    };
  });
  const values = days.map((day) => day.revenue);

  return {
    days,
    useBookings: false,
    max: Math.max(...values, 1),
    values,
    periods: { week, month, year },
  };
};
