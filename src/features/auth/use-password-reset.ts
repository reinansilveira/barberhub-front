import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  requestClientPasswordReset,
  resetClientPassword,
} from "@/services/auth";
import { toVerificationCode } from "@/utils/phone";

const MIN_PASSWORD_LENGTH = 8;

export function usePasswordReset() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Informe um e-mail válido.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const response = await requestClientPasswordReset(email.trim());
      setMessage(
        response.message ||
          "Se o e-mail estiver cadastrado, enviamos um código de 6 dígitos.",
      );
      setStep("code");
    } catch (reason) {
      setError(apiErrorMessage(reason, "Não foi possível enviar o código."));
    } finally {
      setSubmitting(false);
    }
  };

  const resetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== 6) {
      setError("Informe o código de 6 dígitos.");
      return;
    }
    if (password.length < MIN_PASSWORD_LENGTH) {
      setError(
        `A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      );
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await resetClientPassword({
        email: email.trim(),
        code,
        newPassword: password,
      });
      router.push("/login?senha=redefinida");
    } catch (reason) {
      setError(apiErrorMessage(reason, "Código inválido ou expirado."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    code,
    confirmPassword,
    email,
    error,
    message,
    password,
    requestCode,
    resetPassword,
    setCode: (value: string) => setCode(toVerificationCode(value)),
    setConfirmPassword,
    setEmail,
    setPassword,
    startOver: () => {
      setStep("email");
      setCode("");
      setError("");
    },
    step,
    submitting,
  };
}
