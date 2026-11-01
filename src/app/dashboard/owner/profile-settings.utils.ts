import type { Appointment } from "@/services/appointment";
import { isCompleted } from "../_shared/dashboard.utils";
import type { Payment } from "./owner.types";

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrador",
  OWNER: "Proprietário",
  PROFESSIONAL: "Profissional",
  CLIENT: "Cliente",
};

export const getProfileAvatar = (profile: {
  name: string;
  avatar?: string | null;
}) =>
  profile.avatar ||
  `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=171a20&color=ffffff&size=160`;

export const buildProfileStats = (
  appointments: Appointment[],
  payments: Payment[],
) => ({
  completedAppointments: appointments.filter((appointment) =>
    isCompleted(appointment.status),
  ).length,
  clients: new Set(
    appointments.map(
      (appointment) => appointment.client.id ?? appointment.client.name,
    ),
  ).size,
  receivedRevenue: payments
    .filter((payment) => payment.status === "PAID")
    .reduce((total, payment) => total + Number(payment.finalAmount || 0), 0),
});
