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

export interface TwoFactorChallenge {
  requiresTwoFactor: true;
  challengeId: string;
  expiresInSeconds: number;
  message: string;
}

export type ClientLoginResult = SessionTokens | TwoFactorChallenge;

export const requiresTwoFactor = (
  value: ClientLoginResult,
): value is TwoFactorChallenge => "requiresTwoFactor" in value;

export async function login(input: LoginInput): Promise<SessionTokens> {
  const { data } = await api.post<SessionTokens>("/auth/login", input);

  return data;
}

export async function loginClient(
  input: LoginInput,
): Promise<ClientLoginResult> {
  const { data } = await api.post<ClientLoginResult>(
    "/auth/client/login",
    input,
  );

  return data;
}

export async function verifyClientTwoFactorLogin(input: {
  challengeId: string;
  code: string;
}): Promise<SessionTokens> {
  const { data } = await api.post<SessionTokens>(
    "/auth/client/two-factor/verify-login",
    input,
  );
  return data;
}

export async function changeClientPassword(input: {
  currentPassword: string;
  newPassword: string;
}) {
  const { data } = await api.post<{ message: string }>(
    "/auth/client/password",
    input,
  );
  return data;
}

export async function startClientTwoFactorEnrollment() {
  const { data } = await api.post<{
    challengeId: string;
    expiresInSeconds: number;
    message: string;
  }>("/auth/client/two-factor/challenge");
  return data;
}

export async function enableClientTwoFactor(input: {
  challengeId: string;
  code: string;
}) {
  const { data } = await api.post<{
    message: string;
    twoFactorEnabled: boolean;
  }>("/auth/client/two-factor/enable", input);
  return data;
}

export async function startClientTwoFactorDisable() {
  const { data } = await api.post<{
    challengeId: string;
    expiresInSeconds: number;
    message: string;
  }>("/auth/client/two-factor/disable/challenge");
  return data;
}

export async function disableClientTwoFactor(input: {
  challengeId: string;
  code: string;
  currentPassword: string;
}) {
  const { data } = await api.post<{
    message: string;
    twoFactorEnabled: boolean;
  }>("/auth/client/two-factor/disable", input);
  return data;
}

export async function register(input: RegisterInput): Promise<SessionTokens> {
  const { data } = await api.post<SessionTokens>("/clients/register", input);

  return data;
}

export async function requestClientPasswordReset(email: string) {
  const { data } = await api.post<{ message: string }>(
    "/auth/client/forgot-password",
    { email },
  );
  return data;
}

export async function resetClientPassword(input: {
  email: string;
  code: string;
  newPassword: string;
}) {
  const { data } = await api.post<{ message: string }>(
    "/auth/client/reset-password",
    input,
  );
  return data;
}

export async function startClientPhoneVerification(phone: string) {
  const { data } = await api.post<{ clientId: string; message: string }>(
    "/auth/start",
    { phone },
  );
  return data;
}

export async function verifyClientPhoneCode(phone: string, code: string) {
  const { data } = await api.post<{ phoneVerifiedAt: string }>(
    "/auth/verify-code",
    { phone, code },
  );
  return data;
}
