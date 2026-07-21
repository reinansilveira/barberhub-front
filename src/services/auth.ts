import { api } from "./api/axios";
export interface LoginInput {
    email: string;
    password: string
}

export interface SessionTokens {
    access_token: string;
    refresh_token: string
}

export async function login(input: LoginInput): Promise<SessionTokens> {
    const { data } = await api.post<SessionTokens>("/auth/login", input);

    return data;
}
