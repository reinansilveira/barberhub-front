import { useState } from "react";
import type { BookingSlot } from "../professional-profile.types";

export function useSlotSelection(slots: BookingSlot[]) {
  const [selectedSlotId, setSelectedSlotId] = useState("");

  return {
    selectedSlotId,
    selectedSlot: slots.find((slot) => slot.id === selectedSlotId),
    selectSlot: setSelectedSlotId,
  };
}
