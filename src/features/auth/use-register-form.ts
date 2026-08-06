"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { register as registerUser, type RegisterInput } from "@/services/auth";
import { saveSession } from "./actions";

type RegisterFormValues = RegisterInput & { confirmPassword: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
        defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
        mode: "onSubmit",
    });

    async function submit({ name, email, password }: RegisterFormValues) {
        try {
            const session = await registerUser({ name, email, password });
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