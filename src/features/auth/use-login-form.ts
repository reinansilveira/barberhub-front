"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { login, type LoginInput } from "@/services/auth";
import { saveSession } from "./actions";

type LoginFormValues = LoginInput & { remember?: boolean };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useLoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    defaultValues: { email: "", password: "", remember: false },
    mode: "onSubmit",
  });

  async function submit({ email, password }: LoginFormValues) {
    try {
      const session = await login({ email, password });
      await saveSession(session);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("root", {
        message: "Não foi possível entrar. Confira suas credenciais.",
      });
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
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
    onSubmit: handleSubmit(submit),
  };
}