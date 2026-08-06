import type { ProfessionalResponseDto } from "@/services/professional";
import type { ProfessionalService } from "@/services/service";
import type { Slot } from "@/services/slot";

export type Professional = ProfessionalResponseDto;

export interface BookingViewData {
    services: ProfessionalService[];
    slots: Slot[];
}

export type BookingServiceItem = BookingViewData["services"][number];
export type BookingSlot = BookingViewData["slots"][number];