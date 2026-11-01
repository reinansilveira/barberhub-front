import { api } from "./api/axios";

export interface CreateClientDto {
  name: string;
  phone: string;
  email?: string;
}

export interface ClientResponseDto {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string | null;
  createdAt: string;
  userId?: string;
  active?: boolean;
  twoFactorEnabled?: boolean;
}

export type ClientDashboardAppointment = {
  id: string;
  scheduledAt: string;
  duration: number;
  price: number | string;
  status: string;
  cancelReason?: string | null;
  professional: {
    id: string;
    user: {
      id: string;
      name: string;
      email?: string | null;
      phone?: string | null;
    };
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number | string;
  };
};

export type ClientDashboardData = {
  client: ClientResponseDto;
  appointments: ClientDashboardAppointment[];
};

export type RescheduleClientAppointmentInput = {
  professionalId: string;
  serviceId: string;
  slotId: string;
};

export async function getClientDashboard(): Promise<ClientDashboardData> {
  const { data } = await api.get<ClientDashboardData>("/clients/me/dashboard");
  return data;
}

export async function findClientById(
  id: string,
  active?: boolean,
): Promise<ClientResponseDto> {
  const { data } = await api.get<ClientResponseDto>(`/clients/${id}`, {
    params: active !== undefined ? { active: String(active) } : undefined,
  });

  return data;
}

export async function createClient(
  payload: CreateClientDto,
): Promise<ClientResponseDto> {
  const { data } = await api.post<ClientResponseDto>("/clients", payload);

  return data;
}

export async function updateClient(
  id: string,
  payload: CreateClientDto,
): Promise<ClientResponseDto> {
  const { data } = await api.patch<ClientResponseDto>(
    `/clients/${id}`,
    payload,
  );

  return data;
}

export async function updateClientAvatar(
  id: string,
  avatar: string,
): Promise<ClientResponseDto> {
  const { data } = await api.patch<ClientResponseDto>(`/clients/${id}/avatar`, {
    avatar,
  });

  return data;
}

export async function cancelClientAppointment(
  id: string,
  reason = "Cancelado pelo cliente",
): Promise<ClientDashboardAppointment> {
  const { data } = await api.put<ClientDashboardAppointment>(
    `/appointments/me/${id}/cancel`,
    { reason },
  );
  return data;
}

export async function rescheduleClientAppointment(
  id: string,
  input: RescheduleClientAppointmentInput,
): Promise<ClientDashboardAppointment> {
  const { data } = await api.put<ClientDashboardAppointment>(
    `/appointments/me/${id}/reschedule`,
    input,
  );
  return data;
}

export async function desactivateClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
