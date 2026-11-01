import { serverApi } from "@/services/api/server";

export type ProfessionalDashboardAppointment = {
  id: string;
  scheduledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  status: string;
  duration: number;
  price: number;
  estimatedEarning: number;
  client: {
    id: string;
    name: string;
    avatar: string | null;
  };
  service: {
    id: string;
    name: string;
    duration: number;
    price: number;
    category: string | null;
    image: string | null;
  };
};

export type ProfessionalDashboardService = {
  active: boolean;
  customPrice: number | null;
  customDuration: number | null;
  effectivePrice: number;
  effectiveDuration: number;
  service: {
    id: string;
    name: string;
    description: string | null;
    duration: number;
    price: number;
    category: string | null;
    image: string | null;
  };
};

export type ProfessionalDashboardData = {
  profile: {
    id: string;
    name: string;
    avatar: string | null;
    specialty: string | null;
    bio: string | null;
    experience: number | null;
    commissionRate: number;
    rating: number;
    totalReviews: number;
  };
  appointments: ProfessionalDashboardAppointment[];
  services: ProfessionalDashboardService[];
  earnings: {
    currency: "BRL";
    commissionRate: number;
    completedAppointments: number;
    grossRevenue: number;
    estimatedEarnings: number;
    averageTicket: number;
  };
};

export function getProfessionalDashboardData() {
  return serverApi<ProfessionalDashboardData>({
    url: "/professionals/me/dashboard",
  });
}
