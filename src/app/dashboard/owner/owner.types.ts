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
};