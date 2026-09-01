import { CalendarDays, ChartNoAxesCombined, House, Scissors, UserRound } from "lucide-react";
import type { DashboardNavItem } from "../_shared/components/DashboardSidebar";

export const professionalNav: DashboardNavItem[] = [
  { label: "Início", href: "/dashboard?view=inicio", icon: House },
  { label: "Minha agenda", href: "/dashboard?view=agenda", icon: CalendarDays },
  { label: "Ganhos", href: "/dashboard?view=ganhos", icon: ChartNoAxesCombined },
  { label: "Serviços", href: "/dashboard?view=servicos", icon: Scissors },
  { label: "Minha conta", href: "/dashboard?view=conta", icon: UserRound },
];
