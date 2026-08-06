import { isAxiosError } from "axios";

/**
 * NestJS costuma responder erros como { message: string | string[], error, statusCode }.
 * Isso pega a mensagem real (ou a lista de validação do class-validator) em vez
 * de mostrar sempre um texto genérico.
 */
export function apiErrorMessage(err: unknown, fallback: string): string {
    if (isAxiosError(err)) {
        const data = err.response?.data as { message?: string | string[] } | undefined;
        if (data?.message) {
            return Array.isArray(data.message) ? data.message.join(" · ") : data.message;
        }
        if (err.response?.status) {
            return `${fallback} (HTTP ${err.response.status})`;
        }
        if (err.request) {
            return `${fallback} (sem resposta do servidor — confere a URL da API e o CORS)`;
        }
    }
    return fallback;
}