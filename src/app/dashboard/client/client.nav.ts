import { CalendarDays, Heart, House, Landmark, Scissors, Star, UserRound } from "lucide-react";
import type { DashboardNavItem } from "../_shared/components/DashboardSidebar";

export const clientNav: DashboardNavItem[] = [
  { label: "Início", href: "/dashboard?view=inicio", icon: House },
  { label: "Meus agendamentos", href: "/dashboard?view=agendamentos", icon: CalendarDays },
  { label: "Barbearias", href: "/dashboard?view=barbearias", icon: Scissors },
  { label: "Favoritos", href: "/dashboard?view=favoritos", icon: Heart },
  { label: "Carteira", href: "/dashboard?view=carteira", icon: Landmark },
  { label: "Avaliações", href: "/dashboard?view=avaliacoes", icon: Star },
  { label: "Minha conta", href: "/dashboard?view=conta", icon: UserRound },
];
