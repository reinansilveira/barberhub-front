import { api } from "./api/axios";
export interface CreateAppointmentInput {
  clientId: string;
  professionalId: string;
  serviceId: string;
  slotId: string;
  notes?: string;
}

export type CreateOwnAppointmentInput = Omit<
  CreateAppointmentInput,
  "clientId"
>;

export interface Appointment {
  id: string;
  scheduledAt: string;
  duration: number;
  price: number;
  status: string;

  client: {
    id?: string;
    name: string;
  };
  professional: {
    name: string;
  };

  service: {
    name: string;
  };
}

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/appointments", input);
  return data;
}

export async function createOwnAppointment(
  input: CreateOwnAppointmentInput,
): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/appointments/me", input);
  return data;
}

export async function findAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/appointments");
  return data;
}

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(`/appointments/${id}/status`, {
    status,
  });
  return data;
}

export type CreatePublicAppointmentInput = {
  name: string;
  phone: string;
  email: string;
  professionalId: string;
  serviceId: string;
  slotId: string;
};

export async function createPublicAppointment(
  input: CreatePublicAppointmentInput,
): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/appointments/public", input);
  return data;
}
