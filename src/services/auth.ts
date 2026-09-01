import { api } from "./api/axios";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string | undefined;
  password: string;
}

export interface SessionTokens {
  access_token: string;
  refresh_token: string;
  mustChangePassword?: boolean;
}

export async function login(input: LoginInput): Promise<SessionTokens> {
  const { data } = await api.post<SessionTokens>("/auth/login", input);

  return data;
}

export async function loginClient(input: LoginInput): Promise<SessionTokens> {
  const { data } = await api.post<SessionTokens>("/auth/client/login", input);

  return data;
}

export async function register(input: RegisterInput): Promise<SessionTokens> {
  const { data } = await api.post<SessionTokens>("/clients/register", input);

  return data;
}