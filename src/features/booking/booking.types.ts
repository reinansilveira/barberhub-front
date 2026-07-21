import type { ProfessionalService } from "@/services/service";
import type { Slot } from "@/services/slot";

export interface BookingFilters {
  professionalId?: string;
  serviceId?: string;
  date?: string;
}

export interface BookingViewData {
  services: ProfessionalService[];
  slots: Slot[];
}

export interface BookingFormValues {
  professionalId: string;
  serviceId: string;
  slotId: string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
}
