import type { Payment } from "@/app/dashboard/owner/owner.types";
import type { Appointment } from "@/services/appointment";
import type {
  ClientDashboardAppointment,
  ClientDashboardData,
} from "@/services/client";
import type { Notification } from "@/services/notification";

export const makeAppointment = (
  overrides: Partial<Appointment> = {},
): Appointment => ({
  id: "appointment-1",
  scheduledAt: "2026-11-02T13:00:00.000Z",
  duration: 30,
  price: 50,
  status: "PENDING",
  client: { id: "client-1", name: "Maria Souza" },
  professional: { name: "Reinan" },
  service: { name: "Corte de cabelo" },
  ...overrides,
});

export const makePayment = (overrides: Partial<Payment> = {}): Payment => ({
  id: "payment-1",
  finalAmount: 50,
  paidAt: "2026-11-01T12:00:00.000Z",
  status: "PAID",
  ...overrides,
});

export const makeClientAppointment = (
  overrides: Partial<ClientDashboardAppointment> = {},
): ClientDashboardAppointment => ({
  id: "client-appointment-1",
  scheduledAt: "2026-11-05T13:00:00.000Z",
  duration: 30,
  price: "50.00",
  status: "PENDING",
  professional: {
    id: "professional-1",
    user: { id: "user-1", name: "Reinan" },
  },
  service: {
    id: "service-1",
    name: "Corte de cabelo",
    duration: 30,
    price: 50,
  },
  ...overrides,
});

export const makeClientDashboard = (
  overrides: Partial<ClientDashboardData> = {},
): ClientDashboardData => ({
  client: {
    id: "client-1",
    name: "Maria Souza",
    phone: "11987654321",
    email: "maria@email.com",
    createdAt: "2026-01-01T00:00:00.000Z",
  },
  appointments: [makeClientAppointment()],
  ...overrides,
});

export const makeNotification = (
  overrides: Partial<Notification> = {},
): Notification => ({
  id: "notification-1",
  recipient: "maria@email.com",
  type: "EMAIL",
  subject: "Agendamento confirmado",
  message: "Seu horário está confirmado.",
  status: "SENT",
  createdAt: "2026-11-01T12:00:00.000Z",
  readAt: null,
  ...overrides,
});
