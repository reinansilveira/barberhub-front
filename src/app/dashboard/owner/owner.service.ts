import { serverApi } from "@/services/api/server";
import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type { OwnerDashboardData } from "./owner.types";

export async function getOwnerDashboardData(): Promise<OwnerDashboardData> {
  try {
    const [appointments, services] = await Promise.all([
      serverApi<Appointment[]>({ url: "/appointments" }),
      serverApi<Service[]>({ url: "/services" }),
    ]);

    return { appointments, services };
  } catch {
    // Empty state remains fully usable.
    return { appointments: [], services: [] };
  }
}