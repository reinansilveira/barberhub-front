import { api } from "./api/axios";
export interface Slot {
  id: string;
  startsAt: string;
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
