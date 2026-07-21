import { api } from "./api/axios";

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

export interface CreateProfessionalDto {
  userId: string;
  specialty?: string;
  bio?: string;
  experience?: number;
  commission?: number;
}

export interface ProfessionalResponseDto {
  id: string;
  userId: string;
  specialty?: string;
  bio?: string;
  experience?: number;
  commission?: number;
  active: boolean;
  createdAt: string;
  user: User;
}

export async function findAllProfessionals(
  active?: boolean,
): Promise<ProfessionalResponseDto[]> {
  const { data } = await api.get<ProfessionalResponseDto[]>("/professionals", {
    params: active !== undefined ? { active: String(active) } : undefined,
  });
  
  return data;
}

export async function findProfessionalById(
  id: string,
  active?: boolean,
): Promise<ProfessionalResponseDto> {
  const { data } = await api.get<ProfessionalResponseDto>(
    `/professionals/${id}`,
    {
      params: active !== undefined ? { active: String(active) } : undefined,
    },
  );

  return data;
}

export async function createProfessional(
  payload: CreateProfessionalDto,
): Promise<ProfessionalResponseDto> {
  const { data } = await api.post<ProfessionalResponseDto>(
    "/professionals",
    payload,
  );

  return data;
}

export async function updateProfessional(
  id: string,
  payload: Partial<CreateProfessionalDto>,
): Promise<ProfessionalResponseDto> {
  const { data } = await api.put<ProfessionalResponseDto>(
    `/professionals/${id}`,
    payload,
  );

  return data;
}

export async function deactivateProfessional(
  id: string,
): Promise<ProfessionalResponseDto> {
  const { data } = await api.delete<ProfessionalResponseDto>(
    `/professionals/${id}`,
  );

  return data;
}
