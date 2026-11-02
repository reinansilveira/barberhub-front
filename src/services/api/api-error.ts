import { isAxiosError } from "axios";

type NestErrorMessage = string | string[] | { message?: string } | undefined;

const readNestMessage = (message: NestErrorMessage) => {
  if (Array.isArray(message)) return message.join(" · ");
  if (typeof message === "string") return message;
  return message?.message;
};

export function apiErrorMessage(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as
      { message?: NestErrorMessage } | undefined;
    const message = readNestMessage(data?.message);
    if (message) return message;
    if (err.response?.status) {
      return `${fallback} (HTTP ${err.response.status})`;
    }
    if (err.request) {
      return `${fallback} (sem resposta do servidor — confere a URL da API e o CORS)`;
    }
  }
  return fallback;
}

export const apiErrorStatus = (err: unknown) =>
  isAxiosError(err) ? err.response?.status : undefined;
