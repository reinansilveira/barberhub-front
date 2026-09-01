import type { Appointment } from "@/services/appointment";
import { isCompleted, trend } from "../_shared/dashboard.utils";
import { currency } from "../_shared/dashboard.utils";
import { ownerNav } from "./owner.nav";
import type { DayBucket, Kpi, OwnerView } from "./owner.types";

export function buildLast14Days(appointments: Appointment[]): DayBucket[] {
  const now = new Date();

  return Array.from({ length: 14 }, (_, i) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 13 + i);

    const entries = appointments.filter(
      (item) => new Date(item.scheduledAt).toDateString() === date.toDateString(),
    );

    return {
      date,
      entries,
      revenue: entries
        .filter((item) => isCompleted(item.status))
        .reduce((sum, item) => sum + Number(item.price || 0), 0),
    };
  });
}

function sumBucket(list: DayBucket[], fn: (bucket: DayBucket) => number) {
  return list.reduce((total, bucket) => total + fn(bucket), 0);
}

export function buildKpis(appointments: Appointment[]): Kpi[] {
  const days = buildLast14Days(appointments);
  const lastWeek = days.slice(7);
  const prevWeek = days.slice(0, 7);

  const completedItems = appointments.filter((item) => isCompleted(item.status));
  const revenue = completedItems.reduce((total, item) => total + Number(item.price || 0), 0);
  const clients = Array.from(new Set(appointments.map((item) => item.client.name)));

  const revenueTrend = trend(
    sumBucket(lastWeek, (d) => d.revenue),
    sumBucket(prevWeek, (d) => d.revenue),
  );

  const completionLast = sumBucket(lastWeek, (d) => d.entries.filter((e) => isCompleted(e.status)).length);
  const bookedLast = sumBucket(lastWeek, (d) => d.entries.length) || 1;
  const completionPrev = sumBucket(prevWeek, (d) => d.entries.filter((e) => isCompleted(e.status)).length);
  const bookedPrev = sumBucket(prevWeek, (d) => d.entries.length) || 1;

  const completionTrend = trend(
    Math.round((completionLast / bookedLast) * 100),
    Math.round((completionPrev / bookedPrev) * 100),
  );

  const newClientsLast = new Set(lastWeek.flatMap((d) => d.entries.map((e) => e.client.name))).size;
  const newClientsPrev = new Set(prevWeek.flatMap((d) => d.entries.map((e) => e.client.name))).size;
  const clientsTrend = trend(newClientsLast, newClientsPrev);

  const maxDayRevenue = Math.max(...days.map((d) => d.revenue), 1);
  const maxDayBookings = Math.max(...days.map((d) => d.entries.length), 1);

  return [
    {
      label: "FATURAMENTO CONCLUÍDO",
      icon: "$",
      accent: "#6348cb",
      value: currency.format(revenue),
      caption: "Somente atendimentos concluídos",
      trendPct: revenueTrend.pct,
      trendDir: revenueTrend.direction,
      spark: days.map((d) => d.revenue / maxDayRevenue),
    },
    {
      label: "TAXA DE CONCLUSÃO",
      icon: "✓",
      accent: "#18b6a3",
      value: `${appointments.length ? Math.round((completedItems.length / appointments.length) * 100) : 0}%`,
      caption: `${completedItems.length} atendimentos concluídos`,
      trendPct: completionTrend.pct,
      trendDir: completionTrend.direction,
      spark: days.map((d) => d.entries.filter((e) => isCompleted(e.status)).length / maxDayBookings),
    },
    {
      label: "CLIENTES",
      icon: "♟",
      accent: "#e0ad28",
      value: `${clients.length}`,
      caption: "Clientes cadastrados",
      trendPct: clientsTrend.pct,
      trendDir: clientsTrend.direction,
      spark: days.map(
        (d) =>
          new Set(d.entries.map((e) => e.client.name)).size /
          Math.max(...days.map((x) => new Set(x.entries.map((e) => e.client.name)).size), 1),
      ),
    },
  ];
}

export function resolveTitle(view: OwnerView) {
  return ownerNav.find((item) => item[1].includes(`view=${view}`))?.[0] ?? "Dashboard";
}
