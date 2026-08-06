import { createClient } from "@/services/client";
import { serverApi } from "@/services/api/server";
import type { ProfessionalService } from "@/services/service";
import type { Slot } from "@/services/slot";
import type { BookingFormValues, BookingViewData } from "./booking.types";

export async function getBookingViewData(
  professionalId?: string,
  date?: string,
): Promise<BookingViewData> {

  if (!professionalId) return { services: [], slots: [] };

  const services = await serverApi<ProfessionalService[]>({
    url: "/professional-services",
    params: { professionalId, active: true },
  });

  const slots = date
    ? await serverApi<Slot[]>({
      url: "/slots",
      params: { professionalId, date },
    })
    : [];

  return { services, slots };
}

export async function createBooking(values: BookingFormValues) {
  const client = await createClient({
    name: values.name,
    phone: values.phone,
    email: values.email,
  });
  await serverApi({
    method: "POST",
    url: "/appointments",
    data: {
      clientId: client.id,
      professionalId: values.professionalId,
      serviceId: values.serviceId,
      slotId: values.slotId,
      notes: values.notes,
    },
  });
  
}
