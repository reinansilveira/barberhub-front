import type { ClientDashboardAppointment } from "@/services/client";

export const fullDateText = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const isCancelledAppointment = (status: string) =>
  /cancel/i.test(status);

export const isCompletedAppointment = (status: string) =>
  /complete/i.test(status);

export const isOpenAppointment = (status: string) =>
  !isCancelledAppointment(status) && !isCompletedAppointment(status);

export const appointmentStatusLabel = (status: string) => {
  if (isCancelledAppointment(status)) return "Cancelado";
  if (isCompletedAppointment(status)) return "Concluído";
  if (/confirm/i.test(status)) return "Confirmado";
  if (/progress/i.test(status)) return "Em atendimento";
  return "Pendente";
};

export const getAppointmentDateBadge = (scheduledAt: string) => {
  const date = new Date(scheduledAt);
  return {
    month: date
      .toLocaleDateString("pt-BR", { month: "short" })
      .replace(".", ""),
    day: String(date.getDate()).padStart(2, "0"),
  };
};

export const getUpcomingAppointments = (
  appointments: ClientDashboardAppointment[],
) =>
  appointments.filter((appointment) => isOpenAppointment(appointment.status));

export const buildAccountSummary = (
  appointments: ClientDashboardAppointment[],
  now: Date,
) => {
  const completed = appointments.filter((appointment) =>
    isCompletedAppointment(appointment.status),
  );
  const [nextAppointment] = appointments
    .filter(
      (appointment) =>
        isOpenAppointment(appointment.status) &&
        new Date(appointment.scheduledAt) >= now,
    )
    .sort(
      (first, second) =>
        +new Date(first.scheduledAt) - +new Date(second.scheduledAt),
    );

  return {
    completedCount: completed.length,
    history: completed.slice(0, 5),
    nextAppointment,
    totalSpent: completed.reduce(
      (total, appointment) => total + Number(appointment.price || 0),
      0,
    ),
  };
};
