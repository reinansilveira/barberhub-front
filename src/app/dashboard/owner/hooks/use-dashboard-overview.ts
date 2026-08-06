import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";

export const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const weekday = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
export const dateText = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" });
export const timeText = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" });

export const isDone = (status: string) => /confirm|complete|done|final/i.test(status);
export const isCancelled = (status: string) => /cancel/i.test(status);

export const statusLabel = (status: string) => {
  if (isCancelled(status)) return "Cancelado";
  if (isDone(status)) return "Concluído";
  return "Agendado";
};

export const CHART_W = 680;
export const CHART_H = 190;
export const CHART_PAD_X = 18;
export const CHART_PAD_TOP = 18;
export const CHART_PAD_BOTTOM = 34;

export interface DayBucket {
  date: Date;
  entries: Appointment[];
  sales: number;
  bookings: number;
}

export interface UpcomingDayBucket {
  date: Date;
  entries: Appointment[];
  bookings: number;
}

export function buildDashboardOverview(appointments: Appointment[], services: Service[]) {
  const now = new Date();

  const days: DayBucket[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - 6 + index);

    const entries = appointments.filter(
      (item) => new Date(item.scheduledAt).toDateString() === date.toDateString(),
    );
    const sold = entries.filter((item) => isDone(item.status));

    return {
      date,
      entries,
      sales: sold.reduce((sum, item) => sum + Number(item.price || 0), 0),
      bookings: entries.length,
    };
  });

  const upcomingDays: UpcomingDayBucket[] = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now);
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);

    const entries = appointments.filter(
      (item) => new Date(item.scheduledAt).toDateString() === date.toDateString(),
    );

    return {
      date,
      entries,
      bookings: entries.filter((item) => !isCancelled(item.status)).length,
    };
  });

  const done = appointments.filter((item) => isDone(item.status));
  const revenue = done.reduce((sum, item) => sum + Number(item.price || 0), 0);

  const upcoming = appointments
    .filter((item) => new Date(item.scheduledAt) >= now && !isCancelled(item.status))
    .sort((a, b) => +new Date(a.scheduledAt) - +new Date(b.scheduledAt));

  const recent = [...appointments]
    .sort((a, b) => +new Date(b.scheduledAt) - +new Date(a.scheduledAt))
    .slice(0, 3);

  const ranking = services
    .map((service) => ({
      ...service,
      count: appointments.filter((item) => item.service.name === service.name).length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const totalsByProfessional = done.reduce<Record<string, number>>((result, item) => {
    result[item.professional.name] = (result[item.professional.name] || 0) + Number(item.price || 0);
    return result;
  }, {});

  const team = Object.entries(totalsByProfessional)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2);

  const confirmedUpcoming = upcoming.filter((item) => isDone(item.status)).length;
  const cancelledTotal = appointments.filter((item) => isCancelled(item.status)).length;

  const maxSales = Math.max(...days.map((d) => d.sales), 1);
  const maxBookings = Math.max(...days.map((d) => d.bookings), 1);
  const innerW = CHART_W - CHART_PAD_X * 2;
  const innerH = CHART_H - CHART_PAD_TOP - CHART_PAD_BOTTOM;

  const xAt = (i: number) =>
    CHART_PAD_X + (days.length === 1 ? innerW / 2 : (innerW * i) / (days.length - 1));

  const ySales = (v: number) => CHART_PAD_TOP + innerH - (v / maxSales) * innerH;
  const yBookings = (v: number) => CHART_PAD_TOP + innerH - (v / maxBookings) * innerH;

  const smoothPath = (values: number[], yFn: (v: number) => number) => {
    const pts = values.map((v, i) => [xAt(i), yFn(v)] as const);
    if (pts.length < 2) return "";
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const [x0, y0] = pts[i];
      const [x1, y1] = pts[i + 1];
      const mx = (x0 + x1) / 2;
      d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }
    return d;
  };

  const salesPath = smoothPath(days.map((d) => d.sales), ySales);
  const bookingsPath = smoothPath(days.map((d) => d.bookings), yBookings);
  const areaPath = `${salesPath} L${xAt(days.length - 1)},${CHART_H - CHART_PAD_BOTTOM} L${xAt(0)},${CHART_H - CHART_PAD_BOTTOM} Z`;

  return {
    days,
    upcomingDays,
    maxUpcomingBookings: Math.max(...upcomingDays.map((d) => d.bookings), 1),
    revenue,
    upcoming,
    recent,
    ranking,
    team,
    confirmedUpcoming,
    cancelledTotal,
    totalAppointments: appointments.length,
    chart: { innerW, innerH, xAt, ySales, yBookings, salesPath, bookingsPath, areaPath },
  };
}