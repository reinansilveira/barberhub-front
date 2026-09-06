import type { Appointment } from "@/services/appointment";
import type { Service } from "@/services/service";
import type { TrendDirection } from "../_shared/dashboard.utils";

export type OwnerView =
  | "dashboard"
  | "agenda"
  | "clientes"
  | "catalogo"
  | "metricas"
  | "configuracoes"
  | "profissionais"
  | "novo-servico";

export type DayBucket = {
  date: Date;
  entries: Appointment[];
  revenue: number;
};

export type Kpi = {
  label: string;
  icon: string;
  accent: string;
  value: string;
  caption: string;
  trendPct: number;
  trendDir: TrendDirection;
  spark: number[];
};

export type OwnerDashboardData = {
  appointments: Appointment[];
  services: Service[];
  payments: Payment[];
  reviews: Review[];
  currentUser: CurrentUser;
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
