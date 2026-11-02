import { act, renderHook } from "@testing-library/react";
import { AxiosError, AxiosHeaders } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { login, loginClient } from "@/services/auth";
import { saveSession } from "./actions";
import { useLoginForm } from "./use-login-form";

const router = { replace: vi.fn(), refresh: vi.fn() };

vi.mock("next/navigation", () => ({ useRouter: () => router }));
vi.mock("./actions", () => ({ saveSession: vi.fn() }));
vi.mock("@/services/auth", () => ({
  login: vi.fn(),
  loginClient: vi.fn(),
  requiresTwoFactor: (value: object) => "requiresTwoFactor" in value,
  verifyClientTwoFactorLogin: vi.fn(),
}));

const httpError = (status: number) =>
  new AxiosError("erro", String(status), undefined, undefined, {
    status,
    data: {},
    statusText: "",
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

const tokens = { accessToken: "a", refreshToken: "r" };

const submit = async () => {
  const { result } = renderHook(() => useLoginForm());
  await act(async () => {
    await result.current.emailField.onChange({
      target: { name: "email", value: "pessoa@email.com" },
      type: "change",
    });
    await result.current.passwordField.onChange({
      target: { name: "password", value: "segredo123" },
      type: "change",
    });
    await result.current.onSubmit();
  });
  return result;
};

describe("useLoginForm", () => {
  beforeEach(() => vi.clearAllMocks());

  it("entra como cliente sem tentar o login da equipe", async () => {
    vi.mocked(loginClient).mockResolvedValue(tokens as never);
    await submit();
    expect(login).not.toHaveBeenCalled();
    expect(saveSession).toHaveBeenCalledWith(tokens);
    expect(router.replace).toHaveBeenCalledWith("/dashboard");
  });

  it("usa o login da equipe quando a conta não é de cliente", async () => {
    vi.mocked(loginClient).mockRejectedValue(httpError(401));
    vi.mocked(login).mockResolvedValue(tokens as never);
    await submit();
    expect(login).toHaveBeenCalled();
    expect(saveSession).toHaveBeenCalledWith(tokens);
  });

  it("não troca de tipo de login quando há excesso de tentativas", async () => {
    vi.mocked(loginClient).mockRejectedValue(httpError(429));
    const result = await submit();
    expect(login).not.toHaveBeenCalled();
    expect(result.current.errors.root?.message).toMatch(/Muitas tentativas/);
  });
});
