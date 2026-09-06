import { api } from "./api/axios";
export interface CreateAppointmentInput {
    clientId: string;
    professionalId: string;
    serviceId: string;
    slotId: string;
    notes?: string
}

export interface Appointment {
    id: string;
    scheduledAt: string;
    duration: number;
    price: number;
    status: string;
    
    client: {
        id?: string;
        name: string
    };
    professional: {
        name: string
    };

    service: {
        name: string
    }
}
export async function createAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    const { data } = await api.post<Appointment>("/appointments", input);
    return data;
}

export async function findAppointments(): Promise<Appointment[]> {
    const { data } = await api.get<Appointment[]>("/appointments");
    return data;
}

export type AppointmentStatus =
    | "PENDING"
    | "CONFIRMED"
    | "IN_PROGRESS"
    | "COMPLETED"
    | "CANCELLED"
    | "NO_SHOW";

export async function updateAppointmentStatus(
    id: string,
    status: AppointmentStatus,
): Promise<Appointment> {
    const { data } = await api.patch<Appointment>(`/appointments/${id}/status`, { status });
    return data;
}
