"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useEscapeKey } from "@/hooks/use-escape-key";
import { createProfessionalAccount } from "@/services/professional";
import { apiErrorMessage } from "@/services/api/api-error";

export type NewBarberModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type NewBarberForm = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

const initialForm: NewBarberForm = {
  name: "",
  email: "",
  phone: "",
  role: "Barbeiro profissional",
};

export const useNewBarberModal = ({ isOpen, onClose }: NewBarberModalProps) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const submissionIdRef = useRef(0);
  const [form, setForm] = useState<NewBarberForm>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [temporaryPassword, setTemporaryPassword] = useState("");

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setSubmitting(false);
    setSuccess(false);
    setTemporaryPassword("");
    setError("");
  }, []);

  const closeModal = useCallback(() => {
    const shouldRefresh = success;

    submissionIdRef.current += 1;
    isOpenRef.current = false;
    resetForm();
    onClose();

    if (shouldRefresh) router.refresh();
  }, [onClose, resetForm, router, success]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useBodyScrollLock(isOpen);
  useEscapeKey(closeModal, isOpen);

  useEffect(() => {
    if (isOpen) dialogRef.current?.focus();
  }, [isOpen]);

  const updateField = (field: keyof NewBarberForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Preencha o nome e o e-mail do barbeiro.");
      return;
    }

    const submissionId = submissionIdRef.current + 1;
    submissionIdRef.current = submissionId;
    setSubmitting(true);

    try {
      const account = await createProfessionalAccount({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        specialty: form.role,
      });

      if (
        !isMountedRef.current ||
        !isOpenRef.current ||
        submissionId !== submissionIdRef.current
      ) {
        return;
      }

      setTemporaryPassword(account.temporaryPassword);
      setSuccess(true);
    } catch (requestError) {
      if (
        isMountedRef.current &&
        isOpenRef.current &&
        submissionId === submissionIdRef.current
      ) {
        setError(
          apiErrorMessage(
            requestError,
            "Não foi possível cadastrar o barbeiro.",
          ),
        );
      }
    } finally {
      if (
        isMountedRef.current &&
        isOpenRef.current &&
        submissionId === submissionIdRef.current
      ) {
        setSubmitting(false);
      }
    }
  };

  return {
    dialogRef,
    form,
    submitting,
    success,
    error,
    temporaryPassword,
    closeModal,
    updateField,
    handleSubmit,
  };
};
