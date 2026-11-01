import { CalendarDays, House, UserRound } from "lucide-react";
import type { DashboardNavItem } from "../_shared/components/DashboardSidebar";

export const CLIENT_VIEWS = ["inicio", "agendamentos", "conta"] as const;

export type ClientView = (typeof CLIENT_VIEWS)[number];

export const clientNav: DashboardNavItem[] = [
  { label: "Início", href: "/dashboard?view=inicio", icon: House },
  {
    label: "Meus agendamentos",
    href: "/dashboard?view=agendamentos",
    icon: CalendarDays,
  },
  { label: "Minha conta", href: "/dashboard?view=conta", icon: UserRound },
];

export const resolveClientView = (view?: string): ClientView =>
  CLIENT_VIEWS.includes(view as ClientView) ? (view as ClientView) : "inicio";
