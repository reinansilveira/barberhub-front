import { api } from "./api/axios";

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  phone?: string;
  // TODO: confirme o nome/valores do enum de role no back (ex: "PROFESSIONAL" | "CLIENT" | "ADMIN")
  role?: string;
}

export interface UserResponseDto {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  active: boolean;
  createdAt: string;
}

export async function findAllUsers(active?: boolean): Promise<UserResponseDto[]> {
  const { data } = await api.get<UserResponseDto[]>("/users", {
    params: active !== undefined ? { active: String(active) } : undefined,
  });
  return data;
}

export async function createUser(payload: CreateUserDto): Promise<UserResponseDto> {
  const { data } = await api.post<UserResponseDto>("/users", payload);
  return data;
}

export function generateTempPassword() {
  return Math.random().toString(36).slice(-8) + "A1!";
}