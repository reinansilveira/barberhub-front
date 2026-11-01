"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useEscapeKey } from "@/hooks/use-escape-key";
import type { Appointment } from "@/services/appointment";
import {
  createAppointment,
  createOwnAppointment,
} from "@/services/appointment";
import { createClient, rescheduleClientAppointment } from "@/services/client";
import type { ProfessionalResponseDto } from "@/services/professional";
import { findAllProfessionals } from "@/services/professional";
import type { ProfessionalService, Service } from "@/services/service";
import { findProfessionalServices } from "@/services/service";
import { findAvailableSlots, type Slot } from "@/services/slot";
import { apiErrorMessage } from "@/services/api/api-error";
import { todayInBrazil } from "@/utils/date-utils";

export type NewAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  appointments: Appointment[];
  clientId?: string;
  onCreated?: () => void;
  rescheduleAppointment?: {
    id: string;
    professionalId: string;
    serviceId: string;
  };
};

type ClientOption = { id: string; name: string };
type ClientForm = { name: string; phone: string; email: string };

const emptyClient: ClientForm = { name: "", phone: "", email: "" };

const rescheduleIdentity = (
  rescheduleAppointment: NewAppointmentModalProps["rescheduleAppointment"],
) => {
  if (!rescheduleAppointment) return "new-appointment";

  return [
    rescheduleAppointment.id,
    rescheduleAppointment.professionalId,
    rescheduleAppointment.serviceId,
  ].join(":");
};

export const useNewAppointmentModal = ({
  isOpen,
  onClose,
  services,
  appointments,
  clientId: currentClientId,
  onCreated,
  rescheduleAppointment,
}: NewAppointmentModalProps) => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDivElement>(null);
  const isMountedRef = useRef(false);
  const isOpenRef = useRef(isOpen);
  const submissionIdRef = useRef(0);
  const completedSubmissionRef = useRef(false);
  const successTimeoutRef = useRef<number | undefined>(undefined);
  const syncedRescheduleIdentityRef = useRef<string | null>(null);

  const [professionals, setProfessionals] = useState<ProfessionalResponseDto[]>(
    [],
  );
  const [professionalServices, setProfessionalServices] = useState<
    ProfessionalService[]
  >([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [professionalId, setProfessionalId] = useState(
    rescheduleAppointment?.professionalId ?? "",
  );
  const [serviceId, setServiceId] = useState(
    rescheduleAppointment?.serviceId ?? "",
  );
  const [date, setDate] = useState(todayInBrazil());
  const [slotId, setSlotId] = useState("");
  const [clientId, setClientId] = useState("");
  const [client, setClient] = useState<ClientForm>(emptyClient);
  const [loadingProfessionals, setLoadingProfessionals] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const isRescheduling = Boolean(rescheduleAppointment);
  const appointmentIdentity = useMemo(
    () => rescheduleIdentity(rescheduleAppointment),
    [rescheduleAppointment],
  );

  const clearSuccessTimeout = useCallback(() => {
    if (successTimeoutRef.current !== undefined) {
      window.clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = undefined;
    }
  }, []);

  const resetForm = useCallback(() => {
    submissionIdRef.current += 1;
    completedSubmissionRef.current = false;
    clearSuccessTimeout();
    setProfessionalServices([]);
    setSlots([]);
    setProfessionalId(rescheduleAppointment?.professionalId ?? "");
    setServiceId(rescheduleAppointment?.serviceId ?? "");
    setDate(todayInBrazil());
    setSlotId("");
    setClientId("");
    setClient(emptyClient);
    setError("");
    setSuccess(false);
    setLoadingProfessionals(false);
    setLoadingSlots(false);
    setSubmitting(false);
  }, [
    clearSuccessTimeout,
    rescheduleAppointment?.professionalId,
    rescheduleAppointment?.serviceId,
  ]);

  const notifyCreated = useCallback(() => {
    onCreated?.();
    router.refresh();
  }, [onCreated, router]);

  const closeModal = useCallback(() => {
    const hadCompletedSubmission = completedSubmissionRef.current;

    isOpenRef.current = false;
    resetForm();
    onClose();

    if (hadCompletedSubmission) notifyCreated();
  }, [notifyCreated, onClose, resetForm]);

  const clients = useMemo<ClientOption[]>(() => {
    const unique = new Map<string, ClientOption>();

    appointments.forEach((appointment) => {
      if (appointment.client.id) {
        unique.set(appointment.client.id, {
          id: appointment.client.id,
          name: appointment.client.name,
        });
      }
    });

    return [...unique.values()].sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR"),
    );
  }, [appointments]);

  const availableServices = professionalId
    ? professionalServices.map((item) => item.service)
    : services.filter((service) => service.active);
  const normalizedPhone = client.phone.replace(/\D/g, "");
  const isNewClientValid = Boolean(
    client.name.trim() &&
    client.email.trim() &&
    /^\d{10,11}$/.test(normalizedPhone),
  );
  const canSubmit = Boolean(
    professionalId &&
    serviceId &&
    slotId &&
    (currentClientId || clientId || isNewClientValid),
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      clearSuccessTimeout();
    };
  }, [clearSuccessTimeout]);

  useEffect(() => {
    isOpenRef.current = isOpen;
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      syncedRescheduleIdentityRef.current = null;
      return;
    }

    if (syncedRescheduleIdentityRef.current === appointmentIdentity) return;

    syncedRescheduleIdentityRef.current = appointmentIdentity;
    resetForm();
  }, [appointmentIdentity, isOpen, resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    dialogRef.current?.focus();
    void Promise.resolve().then(() => {
      if (active && isOpenRef.current) setLoadingProfessionals(true);
    });

    findAllProfessionals(true)
      .then((items) => {
        if (active && isOpenRef.current) setProfessionals(items);
      })
      .catch(() => {
        if (active && isOpenRef.current) {
          setError(
            "Não foi possível carregar os profissionais. Tente novamente.",
          );
        }
      })
      .finally(() => {
        if (active && isOpenRef.current) setLoadingProfessionals(false);
      });

    return () => {
      active = false;
    };
  }, [isOpen]);

  useBodyScrollLock(isOpen);
  useEscapeKey(closeModal, isOpen);

  useEffect(() => {
    if (!isOpen || !professionalId) return;

    let active = true;

    findProfessionalServices(professionalId)
      .then((items) => {
        if (active && isOpenRef.current) {
          setProfessionalServices(
            items.filter((item) => item.active && item.service.active),
          );
        }
      })
      .catch(() => {
        if (active && isOpenRef.current) {
          setError("Não foi possível carregar os serviços deste profissional.");
        }
      });

    return () => {
      active = false;
    };
  }, [isOpen, professionalId]);

  useEffect(() => {
    if (!isOpen || !professionalId || !date) return;

    let active = true;

    void Promise.resolve().then(() => {
      if (active && isOpenRef.current) setLoadingSlots(true);
    });

    findAvailableSlots(professionalId, date)
      .then((availableSlots) => {
        if (active && isOpenRef.current) setSlots(availableSlots);
      })
      .catch(() => {
        if (active && isOpenRef.current) {
          setError("Não foi possível carregar os horários disponíveis.");
        }
      })
      .finally(() => {
        if (active && isOpenRef.current) setLoadingSlots(false);
      });

    return () => {
      active = false;
    };
  }, [date, isOpen, professionalId]);

  const selectProfessional = (id: string) => {
    setProfessionalId(id);
    setProfessionalServices([]);
    setServiceId("");
    setSlots([]);
    setSlotId("");
    setLoadingSlots(Boolean(id));
    setError("");
  };

  const selectDate = (value: string) => {
    setDate(value);
    setSlots([]);
    setSlotId("");
    setLoadingSlots(Boolean(professionalId && value));
    setError("");
  };

  const finishSuccessfulSubmission = useCallback(() => {
    if (!completedSubmissionRef.current) return;

    isOpenRef.current = false;
    resetForm();
    onClose();
    notifyCreated();
  }, [notifyCreated, onClose, resetForm]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!professionalId || !serviceId || !slotId) {
      setError("Selecione o profissional, serviço e horário para continuar.");
      return;
    }

    if (!currentClientId && !clientId && !isNewClientValid) {
      setError(
        "Informe nome, e-mail e telefone válido com DDD (10 ou 11 dígitos).",
      );
      return;
    }

    const submissionId = submissionIdRef.current + 1;
    submissionIdRef.current = submissionId;
    setSubmitting(true);

    try {
      if (rescheduleAppointment) {
        await rescheduleClientAppointment(rescheduleAppointment.id, {
          professionalId,
          serviceId,
          slotId,
        });
      } else {
        if (currentClientId) {
          await createOwnAppointment({ professionalId, serviceId, slotId });
        } else {
          const finalClientId =
            clientId ||
            (
              await createClient({
                name: client.name.trim(),
                phone: normalizedPhone,
                email: client.email.trim(),
              })
            ).id;

          await createAppointment({
            clientId: finalClientId,
            professionalId,
            serviceId,
            slotId,
          });
        }
      }

      if (
        !isMountedRef.current ||
        !isOpenRef.current ||
        submissionId !== submissionIdRef.current
      ) {
        return;
      }

      completedSubmissionRef.current = true;
      setSuccess(true);
      successTimeoutRef.current = window.setTimeout(
        finishSuccessfulSubmission,
        900,
      );
    } catch (requestError) {
      if (
        isMountedRef.current &&
        isOpenRef.current &&
        submissionId === submissionIdRef.current
      ) {
        setError(
          apiErrorMessage(
            requestError,
            "Não foi possível criar o agendamento.",
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
    professionals,
    availableServices,
    slots,
    professionalId,
    serviceId,
    date,
    slotId,
    clientId,
    client,
    clients,
    loadingProfessionals,
    loadingSlots,
    submitting,
    error,
    success,
    isRescheduling,
    canSubmit,
    closeModal,
    selectProfessional,
    selectDate,
    setServiceId,
    setSlotId,
    setClientId,
    setClient,
    handleSubmit,
  };
};
