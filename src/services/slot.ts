import { api } from "./api/axios";

export interface Slot {
  id: string;
  startsAt: string;
}

export interface SlotBatchResult {
  created: Slot[];
  skipped: { startsAt: string; reason: string }[];
}

export async function findAvailableSlots(
  professionalId: string,
  date: string,
): Promise<Slot[]> {
  const { data } = await api.get<Slot[]>("/slots", {
    params: { professionalId, date },
  });
  return data;
}

// --- novos ---

export async function createSlots(
  professionalId: string,
  isoTimes: string[],
): Promise<Slot | SlotBatchResult> {
  const payload =
    isoTimes.length === 1
      ? { professionalId, startsAt: isoTimes[0] }
      : { professionalId, slots: isoTimes };
  const { data } = await api.post<Slot | SlotBatchResult>("/slots", payload);
  return data;
}

export function isSlotBatch(result: Slot | SlotBatchResult): result is SlotBatchResult {
  return "created" in result;
}

export async function deleteSlot(id: string): Promise<void> {
  await api.delete(`/slots/${id}`);
}