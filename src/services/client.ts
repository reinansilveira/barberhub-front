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
  createdAt: string;
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

export async function desactivateClient(id: string): Promise<void> {
  await api.delete(`/clients/${id}`);
}
