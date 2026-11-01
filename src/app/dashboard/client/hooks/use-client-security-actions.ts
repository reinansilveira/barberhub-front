import { useState, type FormEvent } from "react";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { apiErrorMessage } from "@/services/api/api-error";
import {
  changeClientPassword,
  disableClientTwoFactor,
  enableClientTwoFactor,
  startClientTwoFactorDisable,
  startClientTwoFactorEnrollment,
} from "@/services/auth";
import { normalizeBrazilianPhone, toVerificationCode } from "@/utils/phone";

type ClientSecurityModal = "password" | "two-factor" | null;

export function useClientSecurityActions(
  phone: string,
  twoFactorEnabled: boolean,
) {
  const [modal, setModal] = useState<ClientSecurityModal>(null);
  const [twoFactorStep, setTwoFactorStep] = useState<"start" | "verify">(
    "start",
  );
  const [challengeId, setChallengeId] = useState("");
  const [code, setCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const verifiedPhone = normalizeBrazilianPhone(phone);

  const reset = () => {
    setTwoFactorStep("start");
    setChallengeId("");
    setCode("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setFeedback("");
  };

  const close = () => {
    setModal(null);
    reset();
  };

  useEscapeKey(close, modal !== null);

  const open = (nextModal: Exclude<ClientSecurityModal, null>) => {
    reset();
    setModal(nextModal);
  };

  const redirectToLogin = () => {
    window.setTimeout(() => window.location.assign("/login"), 900);
  };

  const submitPasswordChange = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!currentPassword) {
      setFeedback("Informe sua senha atual.");
      return;
    }
    if (newPassword.length < 8) {
      setFeedback("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback("As senhas não coincidem.");
      return;
    }

    setSubmitting(true);
    setFeedback("");
    try {
      const response = await changeClientPassword({
        currentPassword,
        newPassword,
      });
      setFeedback(response.message);
      redirectToLogin();
    } catch (error) {
      setFeedback(
        apiErrorMessage(error, "Não foi possível atualizar a senha."),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startTwoFactor = async () => {
    if (verifiedPhone.length < 10) {
      setFeedback("Atualize seu telefone antes de continuar.");
      return;
    }

    setSubmitting(true);
    setFeedback("");
    try {
      const response = twoFactorEnabled
        ? await startClientTwoFactorDisable()
        : await startClientTwoFactorEnrollment();
      setChallengeId(response.challengeId);
      setTwoFactorStep("verify");
      setFeedback(response.message);
    } catch (error) {
      setFeedback(apiErrorMessage(error, "Não foi possível enviar o código."));
    } finally {
      setSubmitting(false);
    }
  };

  const submitTwoFactor = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== 6 || !challengeId) {
      setFeedback("Informe o código de seis dígitos.");
      return;
    }
    if (twoFactorEnabled && !currentPassword) {
      setFeedback("Informe sua senha atual para desativar a proteção.");
      return;
    }

    setSubmitting(true);
    setFeedback("");
    try {
      const response = twoFactorEnabled
        ? await disableClientTwoFactor({
            challengeId,
            code,
            currentPassword,
          })
        : await enableClientTwoFactor({ challengeId, code });
      setFeedback(response.message);
      redirectToLogin();
    } catch (error) {
      setFeedback(apiErrorMessage(error, "Código inválido ou expirado."));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    challengeId,
    close,
    code,
    confirmPassword,
    currentPassword,
    feedback,
    modal,
    newPassword,
    open,
    phone,
    setCode: (value: string) => setCode(toVerificationCode(value)),
    setConfirmPassword,
    setCurrentPassword,
    setNewPassword,
    startTwoFactor,
    submitPasswordChange,
    submitTwoFactor,
    submitting,
    twoFactorEnabled,
    twoFactorStep,
    verifiedPhone,
  };
}
