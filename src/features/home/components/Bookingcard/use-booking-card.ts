import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useRouter } from "next/navigation";
import { bookingFormSchema } from "@/features/booking/booking.schemas";
import { apiErrorMessage } from "@/services/api/api-error";
import { createPublicAppointment } from "@/services/appointment";
import {
  findProfessionalServices,
  type ProfessionalService,
} from "@/services/service";
import { findAvailableSlots, type Slot } from "@/services/slot";
import { buildSuccessPath, formatSlot } from "@/utils/booking.utils";
import { todayInBrazil } from "@/utils/date-utils";

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

type Loaded<T> = { key: string; items: T[] };

const EMPTY_VALUES: BookingCardValues = {
  professionalId: "",
  serviceId: "",
  slotId: "",
  name: "",
  phone: "",
  email: "",
};

const dateLabel = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  timeZone: "UTC",
});

export function useBookingCard(professionals: BookingProfessional[] = []) {
  const router = useRouter();
  const form = useForm<BookingCardValues>({ defaultValues: EMPTY_VALUES });
  const professionalId =
    useWatch({ control: form.control, name: "professionalId" }) ?? "";
  const serviceId =
    useWatch({ control: form.control, name: "serviceId" }) ?? "";
  const slotId = useWatch({ control: form.control, name: "slotId" }) ?? "";

  const [selectedDate, setSelectedDate] = useState(todayInBrazil);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState("");
  const [loadedServices, setLoadedServices] = useState<
    Loaded<ProfessionalService>
  >({ key: "", items: [] });
  const [loadedSlots, setLoadedSlots] = useState<Loaded<Slot>>({
    key: "",
    items: [],
  });

  const slotsKey =
    professionalId && serviceId
      ? `${professionalId}|${serviceId}|${selectedDate}`
      : "";

  useEffect(() => {
    if (!professionalId) return;
    let active = true;

    findProfessionalServices(professionalId)
      .then((items) => {
        if (active) setLoadedServices({ key: professionalId, items });
      })
      .catch(() => {
        if (active) setError("Não foi possível carregar os serviços.");
      });

    return () => {
      active = false;
    };
  }, [professionalId]);

  useEffect(() => {
    if (!slotsKey) return;
    let active = true;

    findAvailableSlots(professionalId, selectedDate)
      .then((items) => {
        if (active) setLoadedSlots({ key: slotsKey, items });
      })
      .catch(() => {
        if (!active) return;
        setLoadedSlots({ key: slotsKey, items: [] });
        setError("Não foi possível carregar os horários.");
      });

    return () => {
      active = false;
    };
  }, [professionalId, selectedDate, slotsKey]);

  const changeProfessional = () => {
    form.setValue("serviceId", "");
    form.setValue("slotId", "");
    setSelectedDate(todayInBrazil());
    setShowDatePicker(false);
  };

  const changeService = () => form.setValue("slotId", "");

  const changeDate = (date: string) => {
    setSelectedDate(date);
    form.setValue("slotId", "");
  };

  const submit = async (values: BookingCardValues) => {
    setError("");

    const parsed = bookingFormSchema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    try {
      await createPublicAppointment({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        professionalId: parsed.data.professionalId,
        serviceId: parsed.data.serviceId,
        slotId: parsed.data.slotId,
      });
      const service = loadedServices.items.find(
        (item) => item.serviceId === values.serviceId,
      );
      const slot = loadedSlots.items.find((item) => item.id === values.slotId);
      form.reset();
      router.push(
        buildSuccessPath({
          service: service?.service.name,
          professional: professionals.find(
            (item) => item.id === values.professionalId,
          )?.name,
          date: dateLabel.format(new Date(`${selectedDate}T00:00:00Z`)),
          time: slot ? formatSlot(slot.startsAt) : undefined,
        }),
      );
    } catch (reason) {
      setError(
        apiErrorMessage(reason, "Não foi possível concluir o agendamento."),
      );
    }
  };

  return {
    changeDate,
    error,
    form,
    loadingSlots: Boolean(slotsKey) && loadedSlots.key !== slotsKey,
    professionalId,
    registerProfessional: () =>
      form.register("professionalId", {
        required: true,
        onChange: changeProfessional,
      }),
    registerService: () =>
      form.register("serviceId", { required: true, onChange: changeService }),
    selectedDate,
    serviceId,
    services: loadedServices.key === professionalId ? loadedServices.items : [],
    showDatePicker,
    showDateOptions: () => setShowDatePicker(true),
    slotId,
    slots: loadedSlots.key === slotsKey ? loadedSlots.items : [],
    submit,
  };
}
