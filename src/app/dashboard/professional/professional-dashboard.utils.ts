import type { ProfessionalDashboardAppointment } from "./professional.service";

export const longDateText = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "2-digit",
  month: "long",
});

export const professionalStatusLabel = (status: string) => {
  if (/cancel/i.test(status)) return "Cancelado";
  if (/complete/i.test(status)) return "Concluído";
  if (/progress/i.test(status)) return "Em atendimento";
  if (/confirm/i.test(status)) return "Confirmado";
  if (/no_show/i.test(status)) return "Não compareceu";
  return "Pendente";
};

export const isActiveAppointment = (
  appointment: ProfessionalDashboardAppointment,
) => !/cancel|complete|no_show/i.test(appointment.status);
