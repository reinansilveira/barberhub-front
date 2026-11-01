"use client";

import { useState } from "react";
import type { Appointment } from "@/services/appointment";
import type { ProfessionalResponseDto } from "@/services/professional";
import type { Service } from "@/services/service";
import { getRevenueChartModel } from "../revenue-chart.utils";

export const usePerformanceMetrics = ({
  name,
  kind,
  appointments,
}: {
  name: string;
  kind: "barber" | "service";
  appointments: Appointment[];
}) => {
  const [period, setPeriod] = useState<"week" | "month" | "year">("week");
  const [referenceNow] = useState(() => new Date());
  const isBarber = kind === "barber";
  const entityAppointments = appointments.filter((item) =>
    isBarber ? item.professional?.name === name : item.service?.name === name,
  );
  const completed = entityAppointments.filter((item) =>
    /complete/i.test(item.status),
  );
  const totalRevenue = completed.reduce(
    (total, item) => total + Number(item.price || 0),
    0,
  );
  const periodTotals = {
    week: completed
      .filter(
        (item) =>
          referenceNow.getTime() - new Date(item.scheduledAt).getTime() <=
          7 * 86400000,
      )
      .reduce((total, item) => total + Number(item.price || 0), 0),
    month: completed
      .filter((item) => {
        const date = new Date(item.scheduledAt);

        return (
          date.getMonth() === referenceNow.getMonth() &&
          date.getFullYear() === referenceNow.getFullYear()
        );
      })
      .reduce((total, item) => total + Number(item.price || 0), 0),
    year: completed
      .filter(
        (item) =>
          new Date(item.scheduledAt).getFullYear() ===
          referenceNow.getFullYear(),
      )
      .reduce((total, item) => total + Number(item.price || 0), 0),
  } as const;

  return {
    period,
    setPeriod,
    isBarber,
    entityAppointments,
    completed,
    totalRevenue,
    periodTotals,
    chartModel: getRevenueChartModel(entityAppointments),
  };
};

export const usePerformanceTable = ({
  service,
  professionals,
  services,
  appointments,
}: {
  service: boolean;
  professionals: ProfessionalResponseDto[];
  services: Service[];
  appointments: Appointment[];
}) => {
  const [period, setPeriod] = useState<"month" | "week">("month");
  const since = new Date();

  since.setHours(0, 0, 0, 0);
  since.setDate(since.getDate() - (period === "week" ? 6 : 29));

  const filteredAppointments = appointments.filter(
    (item) => new Date(item.scheduledAt) >= since,
  );
  const rows = (service ? services : professionals)
    .map((entity) => {
      const name = service
        ? (entity as Service).name
        : (entity as ProfessionalResponseDto).user.name;
      const entries = filteredAppointments.filter((item) =>
        service
          ? item.service?.name === name
          : item.professional?.name === name,
      );
      const completed = entries.filter((item) => /complete/i.test(item.status));
      const revenue = completed.reduce(
        (total, item) => total + Number(item.price || 0),
        0,
      );

      return {
        id: entity.id,
        name,
        subtitle: service
          ? (entity as Service).category || "Serviço"
          : (entity as ProfessionalResponseDto).specialty || "Profissional",
        appointments: entries.length,
        revenue,
        average: completed.length ? revenue / completed.length : 0,
        completed: completed.length,
        active: entity.active,
      };
    })
    .sort((first, second) => second.revenue - first.revenue);

  return { period, setPeriod, rows };
};
