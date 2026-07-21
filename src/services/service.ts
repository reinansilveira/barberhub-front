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
