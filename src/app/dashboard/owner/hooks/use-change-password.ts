import { useState, type FormEvent } from "react";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { apiErrorMessage } from "@/services/api/api-error";
import { changeUserPassword } from "@/services/user";

const MIN_PASSWORD_LENGTH = 8;
const EMPTY_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

type PasswordField = keyof typeof EMPTY_FORM;

export function useChangePassword(userId: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    setIsOpen(false);
    setForm(EMPTY_FORM);
    setError("");
  };

  useEscapeKey(close, isOpen);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.currentPassword) {
      setError("Informe sua senha atual.");
      return;
    }
    if (form.newPassword.length < MIN_PASSWORD_LENGTH) {
      setError(
        `A nova senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      );
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await changeUserPassword(userId, {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess("Senha alterada com sucesso.");
      close();
    } catch (reason) {
      setError(apiErrorMessage(reason, "Não foi possível alterar a senha."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    close,
    error,
    form,
    isOpen,
    open: () => {
      setSuccess("");
      setIsOpen(true);
    },
    setField: (field: PasswordField, value: string) =>
      setForm((current) => ({ ...current, [field]: value })),
    submit,
    submitting,
    success,
  };
}
