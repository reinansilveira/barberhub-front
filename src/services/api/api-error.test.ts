import { describe, expect, it, vi } from "vitest";

vi.mock("axios", () => ({
  isAxiosError: (value: unknown) =>
    Boolean((value as { isAxiosError?: boolean })?.isAxiosError),
}));

import { apiErrorMessage } from "./api-error";

describe("apiErrorMessage", () => {
  const fallback = "Não foi possível salvar";

  it("prioriza a mensagem fornecida pela API", () => {
    expect(
      apiErrorMessage(
        {
          isAxiosError: true,
          response: { data: { message: "E-mail inválido" } },
        },
        fallback,
      ),
    ).toBe("E-mail inválido");
  });

  it("combina erros de validação", () => {
    expect(
      apiErrorMessage(
        {
          isAxiosError: true,
          response: {
            data: { message: ["Campo obrigatório", "Formato inválido"] },
          },
        },
        fallback,
      ),
    ).toBe("Campo obrigatório · Formato inválido");
  });

  it("inclui o status HTTP quando a API não devolve mensagem", () => {
    expect(
      apiErrorMessage(
        {
          isAxiosError: true,
          response: { status: 409, data: {} },
        },
        fallback,
      ),
    ).toBe("Não foi possível salvar (HTTP 409)");
  });

  it("lê a mensagem aninhada de exceções com objeto", () => {
    expect(
      apiErrorMessage(
        {
          isAxiosError: true,
          response: { data: { message: { message: "Horário indisponível" } } },
        },
        fallback,
      ),
    ).toBe("Horário indisponível");
  });

  it("explica quando a solicitação não recebeu resposta", () => {
    expect(
      apiErrorMessage({ isAxiosError: true, request: {} }, fallback),
    ).toContain("sem resposta do servidor");
  });

  it("mantém o fallback para um erro Axios sem detalhes", () => {
    expect(apiErrorMessage({ isAxiosError: true }, fallback)).toBe(fallback);
  });

  it("mantém o fallback para erros desconhecidos", () => {
    expect(apiErrorMessage(new Error("falha"), fallback)).toBe(fallback);
  });
});
