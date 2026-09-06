import { useMemo } from "react";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import { isCompleted } from "../../_shared/dashboard.utils";
import type { DashboardOverviewStats } from "../owner.types";
import type { RevenueChartModel } from "./use-revenue-chart";

export type DashboardOverviewProps = {
  appointments: Appointment[];
  services: Service[];
  recent: Appointment[];
  revenue: number;
  completedCount: number;
  dashboardStats: DashboardOverviewStats;
  userName: string;
  onNewAppointment?: () => void;
  revenueChartModel: RevenueChartModel;
};

export const useDashboardOverview = (
  appointments: Appointment[],
  services: Service[]
) =>
  useMemo(() => {
    type DayBucket = {
      date: Date;
      entries: Appointment[];
      sales: number;
      bookings: number;
    };

    type UpcomingDayBucket = {
      date: Date;
      entries: Appointment[];
      bookings: number;
    };

    // Configuração fixa do gráfico (dimensões e janela de dias exibida).
    const CHART = {
      width: 680,
      height: 190,
      paddingX: 18,
      paddingTop: 18,
      paddingBottom: 34,
      daysInWindow: 7,
    } as const;

    // Dados de exemplo usados como fallback quando ainda não há agendamentos reais.
    const fallback = [
      {
        id: "1",
        client: { name: "Diego Gomes" },
        service: "Corte + Barba",
        scheduledAt: "2026-08-18T09:00:00",
        price: 85,
        status: "confirmed",
      },
      {
        id: "2",
        client: { name: "Lucas Pereira" },
        service: "Corte Social",
        scheduledAt: "2026-08-18T10:30:00",
        price: 55,
        status: "confirmed",
      },
      {
        id: "3",
        client: { name: "Gabriel Costa" },
        service: "Corte + Barba",
        scheduledAt: "2026-08-18T11:30:00",
        price: 85,
        status: "pending",
      },
      {
        id: "4",
        client: { name: "Rafael Silva" },
        service: "Barba completa",
        scheduledAt: "2026-08-18T13:00:00",
        price: 45,
        status: "confirmed",
      },
      {
        id: "5",
        client: { name: "Thiago Santos" },
        service: "Corte Social",
        scheduledAt: "2026-08-18T14:30:00",
        price: 55,
        status: "confirmed",
      },
    ];

    // --- Helpers puros ------------------------------------------------------

    const isCancelled = (status: string) => /cancel/i.test(status);

    const statusText = (status: string) =>
      isCompleted(status) || status === "confirmed" ? "Completed" : "Pending";

    const sameDay = (first: Date, second: Date) =>
      first.toDateString() === second.toDateString();

    const startOfDay = (date: Date) => {
      const result = new Date(date);
      result.setHours(0, 0, 0, 0);
      return result;
    };

    const addDays = (date: Date, amount: number) => {
      const result = new Date(date);
      result.setDate(result.getDate() + amount);
      return result;
    };

    const sumPrice = (entries: Appointment[]) =>
      entries.reduce((total, item) => total + Number(item.price || 0), 0);

    const buildDateRange = (now: Date, offsetStart: number, length: number) => {
      const today = startOfDay(now);
      return Array.from({ length }, (_, index) =>
        addDays(today, offsetStart + index)
      );
    };

    // --- Buckets diários (histórico e próximos dias) ------------------------

    const buildDays = (now: Date): DayBucket[] => {
      const dates = buildDateRange(
        now,
        -(CHART.daysInWindow - 1),
        CHART.daysInWindow
      );

      return dates.map((date) => {
        const entries = appointments.filter((item) =>
          sameDay(new Date(item.scheduledAt), date)
        );
        const completedEntries = entries.filter((item) =>
          isCompleted(item.status)
        );

        return {
          date,
          entries,
          sales: sumPrice(completedEntries),
          bookings: entries.length,
        };
      });
    };

    const buildUpcomingDays = (now: Date): UpcomingDayBucket[] => {
      const dates = buildDateRange(now, 0, CHART.daysInWindow);

      return dates.map((date) => {
        const entries = appointments.filter((item) =>
          sameDay(new Date(item.scheduledAt), date)
        );

        return {
          date,
          entries,
          bookings: entries.filter((item) => !isCancelled(item.status)).length,
        };
      });
    };

    // --- Rankings -------------------------------------------------------------

    const buildServiceRanking = () =>
      services
        .map((service) => ({
          ...service,
          count: appointments.filter(
            (item) => item.service.name === service.name
          ).length,
        }))
        .sort((first, second) => second.count - first.count)
        .slice(0, 3);

    const buildTeamRanking = (completedAppointments: Appointment[]) => {
      const totalsByProfessional = completedAppointments.reduce<
        Record<string, number>
      >((totals, item) => {
        const professionalName = item.professional.name;
        totals[professionalName] =
          (totals[professionalName] || 0) + Number(item.price || 0);
        return totals;
      }, {});

      return Object.entries(totalsByProfessional)
        .sort((first, second) => second[1] - first[1])
        .slice(0, 2);
    };

    // --- Geometria do gráfico (SVG) -------------------------------------------

    const buildSmoothPath = (
      values: number[],
      xAt: (index: number) => number,
      yPosition: (value: number) => number
    ) => {
      const points = values.map(
        (value, index) => [xAt(index), yPosition(value)] as const
      );

      if (points.length < 2) return "";

      let path = `M${points[0][0]},${points[0][1]}`;
      for (let index = 0; index < points.length - 1; index += 1) {
        const [x0, y0] = points[index];
        const [x1, y1] = points[index + 1];
        const midpoint = (x0 + x1) / 2;
        path += ` C${midpoint},${y0} ${midpoint},${y1} ${x1},${y1}`;
      }
      return path;
    };

    const buildChartGeometry = (days: DayBucket[]) => {
      const innerW = CHART.width - CHART.paddingX * 2;
      const innerH = CHART.height - CHART.paddingTop - CHART.paddingBottom;

      const maxSales = Math.max(...days.map((day) => day.sales), 1);
      const maxBookings = Math.max(...days.map((day) => day.bookings), 1);

      const xAt = (index: number) =>
        CHART.paddingX +
        (days.length === 1 ? innerW / 2 : (innerW * index) / (days.length - 1));

      const ySales = (value: number) =>
        CHART.paddingTop + innerH - (value / maxSales) * innerH;

      const yBookings = (value: number) =>
        CHART.paddingTop + innerH - (value / maxBookings) * innerH;

      const salesPath = buildSmoothPath(
        days.map((day) => day.sales),
        xAt,
        ySales
      );
      const bookingsPath = buildSmoothPath(
        days.map((day) => day.bookings),
        xAt,
        yBookings
      );
      const baselineY = CHART.height - CHART.paddingBottom;
      const areaPath = `${salesPath} L${xAt(days.length - 1)},${baselineY} L${xAt(0)},${baselineY} Z`;

      return {
        innerW,
        innerH,
        xAt,
        ySales,
        yBookings,
        salesPath,
        bookingsPath,
        areaPath,
      };
    };

    // --- Montagem do resultado -------------------------------------------------

    const now = new Date();

    const days = buildDays(now);
    const upcomingDays = buildUpcomingDays(now);

    const completedAppointments = appointments.filter((item) =>
      isCompleted(item.status)
    );
    const revenue = sumPrice(completedAppointments);

    const upcoming = appointments
      .filter(
        (item) => new Date(item.scheduledAt) >= now && !isCancelled(item.status)
      )
      .sort(
        (first, second) =>
          +new Date(first.scheduledAt) - +new Date(second.scheduledAt)
      );

    const recent = [...appointments]
      .sort(
        (first, second) =>
          +new Date(second.scheduledAt) - +new Date(first.scheduledAt)
      )
      .slice(0, 3);

    const ranking = buildServiceRanking();
    const team = buildTeamRanking(completedAppointments);

    const confirmedUpcoming = upcoming.filter((item) =>
      isCompleted(item.status)
    ).length;
    const cancelledTotal = appointments.filter((item) =>
      isCancelled(item.status)
    ).length;

    return {
      days,
      upcomingDays,
      maxUpcomingBookings: Math.max(
        ...upcomingDays.map((day) => day.bookings),
        1
      ),
      revenue,
      upcoming,
      recent,
      ranking,
      team,
      confirmedUpcoming,
      cancelledTotal,
      totalAppointments: appointments.length,
      fallback,
      statusText,
      chart: buildChartGeometry(days),
    };
  }, [appointments, services]);
