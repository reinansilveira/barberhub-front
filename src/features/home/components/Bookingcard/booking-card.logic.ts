import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { createClient } from "@/services/client";
import { api } from "@/services/api/axios";
import { findAvailableSlots, type Slot } from "@/services/slot";
import { findProfessionalServices, type ProfessionalService } from "@/services/service";
import { bookingFormSchema } from "@/features/booking/booking.schemas";
import { useRouter } from "next/navigation";
export interface BookingProfessional {
  id: string;
  name: string;
}

export interface BookingCardValues {
  professionalId: string;
  serviceId: string;
  slotId: string;
  name: string;
  phone: string;
  email: string;
}

export function minimumBookingDate(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function formatSlot(startsAt: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(startsAt));
}

function extractClientIdFromConflict(err: unknown): string | null {
  if (!axios.isAxiosError(err) || err.response?.status !== 409) {
    return null;
  }

  const data = err.response.data;

  // cobre tanto { clientId } quanto { message: { clientId } }
  const clientId = data?.clientId ?? data?.message?.clientId;

  return typeof clientId === "string" ? clientId : null;
}

function extractErrorMessage(reason: unknown): string {
  if (axios.isAxiosError(reason)) {
    const rawMessage = reason.response?.data?.message;

    if (typeof rawMessage === "string") {
      return rawMessage;
    }

    if (typeof rawMessage?.message === "string") {
      return rawMessage.message;
    }
  }

  if (reason instanceof Error) {
    return reason.message;
  }

  return "Não foi possível concluir o agendamento.";
}

async function createPublicBooking(values: BookingCardValues) {
  const parsed = bookingFormSchema.safeParse(values);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  let clientId: string;

  try {
    const client = await createClient({
      name: parsed.data.name,
      phone: parsed.data.phone,
      email: parsed.data.email,
    });

    clientId = client.id;
  } catch (err) {
    const existingClientId = extractClientIdFromConflict(err);

    if (existingClientId) {
      clientId = existingClientId;
    } else {
      throw err;
    }
  }

  const { data } = await api.post("/appointments", {
    clientId,
    professionalId: parsed.data.professionalId,
    serviceId: parsed.data.serviceId,
    slotId: parsed.data.slotId,
  });

  return data;
}

export function useBookingCard() {
  const form = useForm<BookingCardValues>({
    defaultValues: {
      professionalId: "",
      serviceId: "",
      slotId: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  const professionalId = form.watch("professionalId");
  const serviceId = form.watch("serviceId");
  const slotId = form.watch("slotId");
  const router = useRouter();

  const [services, setServices] = useState<ProfessionalService[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedDate, setSelectedDate] = useState(minimumBookingDate);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    form.setValue("serviceId", "");
    form.setValue("slotId", "");
    setServices([]);
    setSlots([]);
    setSelectedDate(minimumBookingDate());
    setShowDatePicker(false);
    setSuccess(false);

    if (!professionalId) return;

    findProfessionalServices(professionalId)
      .then(setServices)
      .catch(() => setError("Não foi possível carregar os serviços."));
  }, [form, professionalId]);

  useEffect(() => {
    form.setValue("slotId", "");
    setSlots([]);
    setSuccess(false);

    if (!professionalId || !serviceId) return;

    setLoadingSlots(true);

    findAvailableSlots(professionalId, selectedDate)
      .then(setSlots)
      .catch(() => setError("Não foi possível carregar os horários."))
      .finally(() => setLoadingSlots(false));
  }, [form, professionalId, serviceId, selectedDate]);

  async function submit(values: BookingCardValues) {
    setError("");
    setSuccess(false);

    try {
      await createPublicBooking(values);

      form.reset();

      router.push("/success");
    } catch (reason) {
      setError(extractErrorMessage(reason));
    }
  }

  return {
    form,
    professionalId,
    serviceId,
    slotId,
    services,
    slots,
    selectedDate,
    showDatePicker,
    loadingSlots,
    error,
    success,
    setSelectedDate,
    setShowDatePicker,
    submit,
  };
}