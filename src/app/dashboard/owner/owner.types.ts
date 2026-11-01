import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";

export type OwnerView =
  | "dashboard"
  | "agenda"
  | "clientes"
  | "catalogo"
  | "metricas"
  | "configuracoes"
  | "profissionais"
  | "novo-servico";

export type OwnerDashboardData = {
  appointments: Appointment[];
  services: Service[];
  payments: Payment[];
  reviews: Review[];
  currentUser: CurrentUser;
  notifications: import("@/services/notification").Notification[];
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string | null;
  avatar: string | null;
  role: string;
};

export type Payment = {
  id: string;
  finalAmount: number | string;
  paidAt: string | null;
  status: string;
  method?: string;
  createdAt?: string;
  appointment?: {
    id: string;
    scheduledAt?: string;
    service?: { name?: string };
    professional?: {
      name?: string;
      user?: { name?: string; avatar?: string | null };
    };
    client?: {
      name?: string;
      user?: { name?: string; avatar?: string | null };
    };
  };
};

export type Review = {
  id: string;
  rating: number;
  active: boolean;
};

export type DashboardOverviewStats = {
  todayEarnings: number;
  todayAppointments: number;
  completedToday: number;
  newClientsToday: number;
  satisfaction: number | null;
  reviewCount: number;
  ratingDistribution: Array<{ rating: string; count: number }>;
};
