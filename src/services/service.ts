import { api } from "./api/axios";

export interface Service {
  id: string;
  name: string;
  price: number | string;
  description?: string;
  duration?: number;
  category?: string;
  image?: string;
  active: boolean;
}

export interface CreateServiceDto {
  name: string;
  price: number;
  description?: string;
  duration?: number;
  category?: string;
  image?: string;
}

export interface ProfessionalService {
  professionalId: string;
  serviceId: string;
  customPrice?: number | string;
  customDuration?: number;
  active: boolean;
  service: Service;
}

export async function findServices(): Promise<Service[]> {
  const { data } = await api.get<Service[]>("/services");
  return data;
}

export async function findProfessionalServices(
  professionalId: string,
): Promise<ProfessionalService[]> {
  const { data } = await api.get<ProfessionalService[]>(
    "/professional-services",
    { params: { professionalId } },
  );
  return data;
}

// --- novos ---

export async function createService(payload: CreateServiceDto): Promise<Service> {
  const { data } = await api.post<Service>("/services", payload);
  return data;
}

export async function updateService(
  id: string,
  payload: Partial<CreateServiceDto>,
): Promise<Service> {
  const { data } = await api.put<Service>(`/services/${id}`, payload);
  return data;
}

export async function deactivateService(id: string): Promise<Service> {
  const { data } = await api.delete<Service>(`/services/${id}`);
  return data;
}

export async function linkProfessionalService(payload: {
  professionalId: string;
  serviceId: string;
  customPrice?: number;
  customDuration?: number;
}): Promise<ProfessionalService> {
  const { data } = await api.post<ProfessionalService>(
    "/professional-services",
    payload,
  );
  return data;
}