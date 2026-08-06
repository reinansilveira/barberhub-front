import { api } from "./api/axios";

export interface LoginInput {
    email: string;
    password: string
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
}

export interface SessionTokens {
    access_token: string;
    refresh_token: string
}

export async function login(input: LoginInput): Promise<SessionTokens> {
    const { data } = await api.post<SessionTokens>("/auth/login", input);

    return data;
}

export async function register(input: RegisterInput): Promise<SessionTokens> {
    const { data } = await api.post<SessionTokens>("/auth/register", input);

    return data;
}