"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  login,
  loginClient,
  requiresTwoFactor,
  verifyClientTwoFactorLogin,
  type LoginInput,
  type SessionTokens,
  type TwoFactorChallenge,
} from "@/services/auth";
import { apiErrorStatus } from "@/services/api/api-error";
import { saveSession } from "./actions";

type LoginFormValues = LoginInput & { remember?: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginErrorMessage = (error: unknown) =>
  apiErrorStatus(error) === 429
    ? "Muitas tentativas de login. Aguarde alguns minutos e tente de novo."
    : "Não foi possível entrar. Confira suas credenciais.";

export function useLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorChallenge, setTwoFactorChallenge] =
    useState<TwoFactorChallenge | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isVerifyingTwoFactor, setIsVerifyingTwoFactor] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: false },
    mode: "onSubmit",
  });

  async function finishLogin(session: SessionTokens) {
    await saveSession(session);
    router.replace("/dashboard");
    router.refresh();
  }

  async function submit({ email, password }: LoginFormValues) {
    try {
      let session: SessionTokens;

      try {
        const clientLogin = await loginClient({ email, password });

        if (requiresTwoFactor(clientLogin)) {
          setTwoFactorChallenge(clientLogin);
          setTwoFactorCode("");
          return;
        }

        session = clientLogin;
      } catch (error) {
        if (apiErrorStatus(error) !== 401) throw error;
        session = await login({ email, password });
      }

      await finishLogin(session);
    } catch (error) {
      setError("root", { message: loginErrorMessage(error) });
    }
  }

  async function submitTwoFactor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!twoFactorChallenge || twoFactorCode.length !== 6) {
      setError("root", { message: "Informe o código de seis dígitos." });
      return;
    }

    setIsVerifyingTwoFactor(true);
    try {
      const session = await verifyClientTwoFactorLogin({
        challengeId: twoFactorChallenge.challengeId,
        code: twoFactorCode,
      });
      await finishLogin(session);
    } catch {
      setError("root", {
        message: "Código inválido ou expirado. Solicite um novo login.",
      });
    } finally {
      setIsVerifyingTwoFactor(false);
    }
  }

  return {
    emailField: register("email", {
      required: "Informe seu e-mail",
      pattern: { value: EMAIL_PATTERN, message: "Informe um e-mail válido" },
    }),
    passwordField: register("password", {
      required: "Informe sua senha",
      minLength: { value: 6, message: "Mínimo de 6 caracteres" },
    }),
    rememberField: register("remember"),
    errors,
    isSubmitting,
    isVerifyingTwoFactor,
    showPassword,
    twoFactorChallenge,
    twoFactorCode,
    onTwoFactorSubmit: submitTwoFactor,
    setTwoFactorCode: (value: string) =>
      setTwoFactorCode(value.replace(/\D/g, "").slice(0, 6)),
    cancelTwoFactor: () => {
      setTwoFactorChallenge(null);
      setTwoFactorCode("");
    },
    togglePassword: () => setShowPassword((prev) => !prev),
    onSubmit: handleSubmit(submit),
  };
}
