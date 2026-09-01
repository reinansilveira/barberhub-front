"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { register as registerUser, type RegisterInput } from "@/services/auth";
import { saveSession } from "./actions";

type RegisterFormValues = RegisterInput & { confirmPassword: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\d{10,15}$/;

export function useRegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
    mode: "onSubmit",
  });

  async function submit({ name, email, phone, password }: RegisterFormValues) {
    try {
      const session = await registerUser({
        name,
        email,
        password,
        phone: phone?.trim() ? phone.trim() : undefined,
      });
      await saveSession(session);
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("root", {
        message: "Não foi possível criar sua conta. Tente novamente.",
      });
    }
  }

  return {
    nameField: register("name", {
      required: "Informe seu nome",
      minLength: { value: 2, message: "Nome muito curto" },
    }),
    emailField: register("email", {
      required: "Informe seu e-mail",
      pattern: { value: EMAIL_PATTERN, message: "Informe um e-mail válido" },
    }),
    phoneField: register("phone", {
      validate: (value) =>
        !value ||
        PHONE_PATTERN.test(value) ||
        "Informe um telefone válido (DDD + número)",
    }),
    passwordField: register("password", {
      required: "Informe sua senha",
      minLength: { value: 6, message: "Mínimo de 6 caracteres" },
    }),
    confirmPasswordField: register("confirmPassword", {
      required: "Confirme sua senha",
      validate: (value) =>
        value === getValues("password") || "As senhas não coincidem",
    }),
    errors,
    isSubmitting,
    showPassword,
    togglePassword: () => setShowPassword((prev) => !prev),
    showConfirmPassword,
    toggleConfirmPassword: () => setShowConfirmPassword((prev) => !prev),
    onSubmit: handleSubmit(submit),
  };
}
